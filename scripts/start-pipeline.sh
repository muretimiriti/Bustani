#!/bin/bash

# Bustani CI/CD Pipeline Startup Script
# This script installs and starts the Tekton CI/CD pipeline for Bustani

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="${NAMESPACE:-default}"
PIPELINE_NAME="bustani-ci-cd-pipeline"
PIPELINERUN_NAME="bustani-pipeline-run-$(date +%s)"
GIT_REPO="${GIT_REPO:-}"
GIT_BRANCH="${GIT_BRANCH:-}"
GIT_USERNAME="${GIT_USERNAME:-}"
IMAGE_NAME="${IMAGE_NAME:-}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
DASHBOARD_LOCAL_PORT="${DASHBOARD_LOCAL_PORT:-9097}"
DASHBOARD_PF_PID=""
ARGOCD_LOCAL_PORT="${ARGOCD_LOCAL_PORT:-8080}"
ARGOCD_PF_PID=""
ARGOCD_APP_NAME="${ARGOCD_APP_NAME:-bustani-app}"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed. Please install kubectl first."
        exit 1
    fi
    
    if ! command -v tkn &> /dev/null; then
        log_warning "tkn CLI is not installed. Install from: https://tekton.dev/docs/cli/"
    fi
    
    log_success "Dependencies check passed"
}

resolve_git_context() {
    # Auto-detect repo URL and branch from local git checkout when not explicitly provided.
    if [[ -z "$GIT_REPO" ]]; then
        GIT_REPO="$(git config --get remote.origin.url 2>/dev/null || true)"
    fi

    if [[ -z "$GIT_BRANCH" ]]; then
        GIT_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
    fi

    if [[ -z "$GIT_REPO" ]]; then
        log_error "Could not determine git repository URL. Set GIT_REPO or use --repository."
        exit 1
    fi

    if [[ -z "$GIT_BRANCH" || "$GIT_BRANCH" == "HEAD" ]]; then
        log_error "Could not determine git branch. Set GIT_BRANCH or use --branch."
        exit 1
    fi

    if [[ -z "$GIT_USERNAME" ]]; then
        if [[ "$GIT_REPO" =~ ^https://github.com/([^/]+)/ ]]; then
            GIT_USERNAME="${BASH_REMATCH[1]}"
        elif [[ "$GIT_REPO" =~ ^git@github.com:([^/]+)/ ]]; then
            GIT_USERNAME="${BASH_REMATCH[1]}"
        elif [[ "$GIT_REPO" =~ ^https://github.com/([^/]+)/([^/]+)\.git$ ]]; then
            GIT_USERNAME="${BASH_REMATCH[1]}"
        fi
    fi

    if [[ -z "$GIT_USERNAME" ]]; then
        log_error "Could not determine git username/owner from repo URL: $GIT_REPO"
        exit 1
    fi

    log_info "Using repository: $GIT_REPO"
    log_info "Using branch: $GIT_BRANCH"
    log_info "Resolved git username: $GIT_USERNAME"
}

resolve_image_context() {
    if [[ -z "$IMAGE_NAME" ]]; then
        local docker_user
        docker_user="$(python3 - <<'PY'
import base64, json, os
cfg = os.path.expanduser('~/.docker/config.json')
try:
    with open(cfg, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for _, val in data.get('auths', {}).items():
        auth = val.get('auth')
        if auth:
            user = base64.b64decode(auth).decode(errors='ignore').split(':', 1)[0].strip()
            if user:
                print(user)
                break
except Exception:
    pass
PY
)"

        local repo_name
        repo_name="$(basename "$GIT_REPO")"
        repo_name="${repo_name%.git}"
        repo_name="$(echo "$repo_name" | tr '[:upper:]' '[:lower:]')"

        if [[ -n "$docker_user" && -n "$repo_name" ]]; then
            IMAGE_NAME="$docker_user/$repo_name"
        fi
    fi

    if [[ -z "$IMAGE_NAME" ]]; then
        log_error "Could not determine image name automatically. Set IMAGE_NAME or use --image."
        exit 1
    fi

    log_info "Using image: $IMAGE_NAME:$IMAGE_TAG"
}

configure_git_credentials() {
    # Optional private GitHub repo auth for clone task.
    # This is only enabled when GIT_TOKEN is provided.
    if [[ "$GIT_REPO" == https://github.com/* ]]; then
        if [[ -n "$GIT_TOKEN" ]]; then
            if [[ -z "$GIT_USERNAME" ]]; then
                log_error "GIT_TOKEN was provided but GIT_USERNAME is empty"
                exit 1
            fi
            log_info "Configuring GitHub credentials for Tekton..."

            kubectl delete secret github-credentials -n "$NAMESPACE" --ignore-not-found >/dev/null 2>&1 || true
            kubectl create secret generic github-credentials \
                --from-literal=username="$GIT_USERNAME" \
                --from-literal=password="$GIT_TOKEN" \
                --type=kubernetes.io/basic-auth \
                -n "$NAMESPACE"

            kubectl annotate secret github-credentials \
                tekton.dev/git-0=https://github.com \
                -n "$NAMESPACE" --overwrite

            kubectl patch serviceaccount tekton-sa -n "$NAMESPACE" --type=merge \
                -p '{"secrets":[{"name":"github-credentials"}]}' >/dev/null

            log_success "GitHub credentials configured for private repository access"
        else
            log_info "No GIT_TOKEN provided; running in public repository mode"
        fi
    fi
}

install_tekton() {
    log_info "Checking if Tekton Pipelines is installed..."
    
    if kubectl get namespace tekton-pipelines &> /dev/null; then
        log_success "Tekton Pipelines already installed"
    else
        log_info "Installing Tekton Pipelines..."
        kubectl apply -f https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml
        
        log_info "Waiting for Tekton Pipelines to be ready..."
        kubectl wait --for=condition=ready pod \
            -l app=tekton-pipelines-controller \
            -n tekton-pipelines \
            --timeout=300s
        
        log_success "Tekton Pipelines installed successfully"
    fi
    
    # Install Tekton Dashboard if not already present
    if ! kubectl get deployment tekton-dashboard -n tekton-pipelines &> /dev/null; then
        log_info "Installing Tekton Dashboard..."
        kubectl apply -f https://storage.googleapis.com/tekton-releases/dashboard/latest/release.yaml
        
        log_info "Waiting for Tekton Dashboard to be ready..."
        kubectl wait --for=condition=ready pod \
            -l app=tekton-dashboard \
            -n tekton-pipelines \
            --timeout=180s
        
        log_success "Tekton Dashboard installed successfully"
    else
        log_success "Tekton Dashboard already installed"
    fi
}

install_argocd() {
    log_info "Checking if Argo CD is installed..."

    kubectl get namespace argocd >/dev/null 2>&1 || kubectl create namespace argocd

    if kubectl get deployment argocd-server -n argocd >/dev/null 2>&1; then
        log_success "Argo CD already installed"
    else
        log_info "Installing Argo CD..."
        kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
        kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=300s
        log_success "Argo CD installed successfully"
    fi
}

install_ingress_controller() {
    log_info "Checking if ingress-nginx controller is installed..."

    kubectl get namespace ingress-nginx >/dev/null 2>&1 || kubectl create namespace ingress-nginx

    if kubectl get deployment ingress-nginx-controller -n ingress-nginx >/dev/null 2>&1; then
        log_success "ingress-nginx controller already installed"
    else
        log_info "Installing ingress-nginx controller..."
        kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
        kubectl wait --for=condition=available deployment/ingress-nginx-controller -n ingress-nginx --timeout=300s
        log_success "ingress-nginx controller installed successfully"
    fi
}

apply_rbac() {
    log_info "Applying RBAC and ServiceAccount..."
    
    # Create docker registry secret for imagePullSecrets
    if ! kubectl get secret docker-registry -n $NAMESPACE &> /dev/null; then
        log_info "Creating docker registry secret..."
        if [ -f "$HOME/.docker/config.json" ]; then
            kubectl create secret docker-registry docker-registry \
              --from-file=.dockerconfigjson=$HOME/.docker/config.json \
              -n $NAMESPACE
            log_success "Docker registry secret created"
        else
            log_warning "Docker config not found at $HOME/.docker/config.json"
            log_info "Please run 'docker login' first or create the secret manually"
        fi
    else
        log_info "Docker registry secret already exists"
    fi
    
    # Create registry-credentials secret for Kaniko build task
    if ! kubectl get secret registry-credentials -n $NAMESPACE &> /dev/null; then
        log_info "Creating registry credentials secret for Kaniko..."
        if [ -f "$HOME/.docker/config.json" ]; then
            kubectl create secret generic registry-credentials \
              --from-file=config.json=$HOME/.docker/config.json \
              -n $NAMESPACE
            log_success "Registry credentials secret created"
        else
            log_warning "Docker config not found at $HOME/.docker/config.json"
        fi
    else
        log_info "Registry credentials secret already exists"
    fi
    
    kubectl apply -f k8s/pipeline/rbac.yml
    log_success "RBAC applied successfully"
}

apply_tasks() {
    log_info "Applying Tekton Tasks..."
    kubectl apply -f k8s/tasks/
    log_success "Tasks applied successfully"
}

apply_pipeline() {
    log_info "Applying Pipeline definition..."
    kubectl apply -f k8s/pipeline/pipeline.yml
    log_success "Pipeline applied successfully"
}

create_pipelinerun() {
    log_info "Creating PipelineRun: $PIPELINERUN_NAME"

        cat > /tmp/pipelinerun-temp.json <<EOF
{
    "apiVersion": "tekton.dev/v1beta1",
    "kind": "PipelineRun",
    "metadata": {
        "name": "$PIPELINERUN_NAME",
        "namespace": "$NAMESPACE"
    },
    "spec": {
        "pipelineRef": {
            "name": "$PIPELINE_NAME"
        },
        "serviceAccountName": "tekton-sa",
        "timeout": "30m",
        "params": [
            {"name": "git-repository", "value": "$GIT_REPO"},
            {"name": "git-revision", "value": "$GIT_BRANCH"},
            {"name": "git-username", "value": "$GIT_USERNAME"},
            {"name": "image-name", "value": "$IMAGE_NAME"},
            {"name": "image-tag", "value": "$IMAGE_TAG"},
            {"name": "trivy-severity", "value": "CRITICAL,HIGH"},
            {"name": "argocd-app-name", "value": "$ARGOCD_APP_NAME"},
            {"name": "namespace", "value": "$NAMESPACE"}
        ],
        "workspaces": [
            {
                "name": "shared-workspace",
                "volumeClaimTemplate": {
                    "spec": {
                        "accessModes": ["ReadWriteOnce"],
                        "resources": {
                            "requests": {
                                "storage": "1Gi"
                            }
                        },
                        "storageClassName": "standard"
                    }
                }
            }
        ]
    }
}
EOF

        kubectl apply -f /tmp/pipelinerun-temp.json
        rm /tmp/pipelinerun-temp.json
    
    log_success "PipelineRun created: $PIPELINERUN_NAME"
}

start_dashboard_portforward() {
    log_info "Setting up Tekton Dashboard port-forward..."
    
    # Kill any existing port-forward on that port
    if lsof -ti:$DASHBOARD_LOCAL_PORT &> /dev/null; then
        log_warning "Port $DASHBOARD_LOCAL_PORT already in use. Stopping existing process..."
        kill "$(lsof -ti:$DASHBOARD_LOCAL_PORT)" 2>/dev/null || true
        sleep 1
    fi
    
    # Start port-forward in background
    kubectl port-forward \
        -n tekton-pipelines \
        svc/tekton-dashboard \
        ${DASHBOARD_LOCAL_PORT}:9097 \
        &> /tmp/tekton-dashboard-pf.log &
    
    DASHBOARD_PF_PID=$!
    sleep 2
    
    # Verify port-forward started successfully
    if kill -0 $DASHBOARD_PF_PID 2>/dev/null; then
        echo ""
        echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║         Tekton Dashboard is ready!                       ║${NC}"
        echo -e "${GREEN}║                                                          ║${NC}"
        echo -e "${GREEN}║  Open in browser: http://localhost:${DASHBOARD_LOCAL_PORT}              ║${NC}"
        echo -e "${GREEN}║                                                          ║${NC}"
        echo -e "${GREEN}║  Port-forward PID: $DASHBOARD_PF_PID                               ║${NC}"
        echo -e "${GREEN}║  To stop:  kill $DASHBOARD_PF_PID                                 ║${NC}"
        echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
        echo ""
        
        # Register cleanup on script exit
        trap 'log_info "Stopping Tekton Dashboard port-forward (PID: $DASHBOARD_PF_PID)..."; kill $DASHBOARD_PF_PID 2>/dev/null || true' EXIT
    else
        log_warning "Port-forward may have failed. Check logs: /tmp/tekton-dashboard-pf.log"
    fi
}

start_argocd_portforward() {
    log_info "Setting up Argo CD port-forward..."

    if lsof -ti:$ARGOCD_LOCAL_PORT &> /dev/null; then
        log_warning "Port $ARGOCD_LOCAL_PORT already in use. Stopping existing process..."
        kill "$(lsof -ti:$ARGOCD_LOCAL_PORT)" 2>/dev/null || true
        sleep 1
    fi

    kubectl port-forward -n argocd svc/argocd-server ${ARGOCD_LOCAL_PORT}:443 &> /tmp/argocd-pf.log &
    ARGOCD_PF_PID=$!
    sleep 2

    if kill -0 $ARGOCD_PF_PID 2>/dev/null; then
        echo ""
        echo -e "${GREEN}Argo CD UI:${NC} https://localhost:${ARGOCD_LOCAL_PORT}"
        echo -e "${GREEN}Argo CD Port-forward PID:${NC} $ARGOCD_PF_PID"
        echo -e "${BLUE}Get Argo CD admin password:${NC}"
        echo "  kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d; echo"
        echo ""
    else
        log_warning "Argo CD port-forward may have failed. Check logs: /tmp/argocd-pf.log"
    fi
}

monitor_pipeline() {
    log_info "Monitoring pipeline execution..."
    log_info "Run the following commands to monitor:"
    echo ""
    echo -e "${BLUE}Watch pipeline status:${NC}"
    echo "  kubectl get pipelinerun $PIPELINERUN_NAME -n $NAMESPACE -w"
    echo ""
    echo -e "${BLUE}View logs:${NC}"
    echo "  tkn pipelinerun logs $PIPELINERUN_NAME -n $NAMESPACE -f"
    echo ""
    echo -e "${BLUE}Describe pipeline run:${NC}"
    echo "  tkn pipelinerun describe $PIPELINERUN_NAME -n $NAMESPACE"
    echo ""
    echo -e "${BLUE}Ingress host mapping (after deploy):${NC}"
    echo "  echo '127.0.0.1 bustani.local' | sudo tee -a /etc/hosts"
    echo ""
}

show_usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Options:
    -h, --help              Show this help message
    -n, --namespace NS      Kubernetes namespace (default: default)
    -r, --repository URL    Git repository URL (default: from git remote.origin.url)
    -b, --branch BRANCH     Git branch (default: current checked-out branch)
    -i, --image IMAGE       Container image name (default: auto from docker username and repo)
    -t, --tag TAG           Container image tag (default: latest)
    --skip-install          Skip Tekton installation (assume already installed)
    --monitor               Start monitoring after pipeline creation
    --dashboard             Start Tekton Dashboard port-forward (default: enabled)
    --no-dashboard          Skip Tekton Dashboard port-forward
    --dashboard-port PORT   Local port for Dashboard (default: 9097)
    --argocd                Start Argo CD port-forward (default: enabled)
    --no-argocd             Skip Argo CD port-forward
    --argocd-port PORT      Local port for Argo CD UI (default: 8080)

Example:
    $0 -b develop -t v1.0.0 --monitor
    $0 --dashboard-port 8080 --monitor

Private repo auth (optional, via env vars):
    export GIT_USERNAME=your-github-username
    export GIT_TOKEN=your-github-pat
    $0 --skip-install

EOF
}

# Main execution
main() {
    local skip_install=false
    local monitor=false
    local dashboard=true
    local argocd=true
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -n|--namespace)
                NAMESPACE="$2"
                shift 2
                ;;
            -r|--repository)
                GIT_REPO="$2"
                shift 2
                ;;
            -b|--branch)
                GIT_BRANCH="$2"
                shift 2
                ;;
            -i|--image)
                IMAGE_NAME="$2"
                shift 2
                ;;
            -t|--tag)
                IMAGE_TAG="$2"
                shift 2
                ;;
            --skip-install)
                skip_install=true
                shift
                ;;
            --monitor)
                monitor=true
                shift
                ;;
            --dashboard)
                dashboard=true
                shift
                ;;
            --no-dashboard)
                dashboard=false
                shift
                ;;
            --dashboard-port)
                DASHBOARD_LOCAL_PORT="$2"
                shift 2
                ;;
            --argocd)
                argocd=true
                shift
                ;;
            --no-argocd)
                argocd=false
                shift
                ;;
            --argocd-port)
                ARGOCD_LOCAL_PORT="$2"
                shift 2
                ;;
            *)
                log_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    log_info "Starting Bustani CI/CD Pipeline..."
    echo ""
    
    check_dependencies
    resolve_git_context
    resolve_image_context
    configure_git_credentials
    
    if [ "$skip_install" != true ]; then
        install_tekton
        install_argocd
        install_ingress_controller
    fi
    
    apply_rbac
    apply_tasks
    apply_pipeline
    create_pipelinerun
    
    echo ""
    log_success "Pipeline started successfully!"
    echo ""
    
    monitor_pipeline
    
    if [ "$dashboard" = true ]; then
        start_dashboard_portforward
    fi

    if [ "$argocd" = true ]; then
        start_argocd_portforward
    fi
    
    if [ "$monitor" = true ]; then
        echo "Starting log monitoring... (Press Ctrl+C to stop)"
        echo ""
        tkn pipelinerun logs $PIPELINERUN_NAME -n $NAMESPACE -f
    else
        if [ "$dashboard" = true ] && [ -n "$DASHBOARD_PF_PID" ]; then
            log_info "Dashboard port-forward running in background (PID: $DASHBOARD_PF_PID)"
            log_info "Press Ctrl+C to stop port-forward and exit, or run with --monitor to tail logs"
            wait $DASHBOARD_PF_PID
        fi
    fi
}

# Run main function
main "$@"
