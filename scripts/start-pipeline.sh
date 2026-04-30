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
INGRESS_LOCAL_PORT="${INGRESS_LOCAL_PORT:-8081}"
INGRESS_PF_PID=""
APP_LOCAL_PORT="${APP_LOCAL_PORT:-3000}"
APP_PF_PID=""
WEBHOOK_LOCAL_PORT="${WEBHOOK_LOCAL_PORT:-8085}"
WEBHOOK_SECRET="${GITHUB_WEBHOOK_SECRET:-}"
WEBHOOK_PUBLIC_URL="${WEBHOOK_PUBLIC_URL:-}"
GITHUB_WEBHOOK_TOKEN="${GITHUB_WEBHOOK_TOKEN:-${GITHUB_TOKEN:-${GIT_TOKEN:-}}}"

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

find_available_port() {
    local preferred_port="$1"
    local port_label="$2"
    local max_checks=30
    local candidate_port="$preferred_port"
    local checks=0

    while [ $checks -lt $max_checks ]; do
        if ! lsof -ti:"$candidate_port" &> /dev/null; then
            if [ "$candidate_port" != "$preferred_port" ]; then
                log_warning "$port_label port $preferred_port is in use. Using $candidate_port instead."
            fi
            echo "$candidate_port"
            return 0
        fi
        candidate_port=$((candidate_port + 1))
        checks=$((checks + 1))
    done

    return 1
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

install_tekton_triggers() {
        log_info "Checking if Tekton Triggers is installed..."

        kubectl get namespace tekton-pipelines >/dev/null 2>&1 || kubectl create namespace tekton-pipelines

        if kubectl get deployment tekton-triggers-controller -n tekton-pipelines >/dev/null 2>&1; then
                log_success "Tekton Triggers already installed"
        else
                log_info "Installing Tekton Triggers..."
                kubectl apply -f https://storage.googleapis.com/tekton-releases/triggers/latest/release.yaml
                kubectl apply -f https://storage.googleapis.com/tekton-releases/triggers/latest/interceptors.yaml
                kubectl wait --for=condition=available deployment/tekton-triggers-controller -n tekton-pipelines --timeout=300s
                log_success "Tekton Triggers installed successfully"
        fi
}

setup_github_webhook_trigger() {
        log_info "Configuring GitHub push/pull_request webhook trigger..."

        if [[ -z "$WEBHOOK_SECRET" ]]; then
                if command -v openssl >/dev/null 2>&1; then
                        WEBHOOK_SECRET="$(openssl rand -hex 16)"
                else
                        WEBHOOK_SECRET="$(date +%s | sha256sum | awk '{print $1}' | cut -c1-32)"
                fi
                log_warning "GITHUB_WEBHOOK_SECRET not set; generated a random secret for this setup"
        fi

        kubectl create secret generic github-webhook-secret \
                --from-literal=secretToken="$WEBHOOK_SECRET" \
                -n "$NAMESPACE" \
                --dry-run=client -o yaml | kubectl apply -f - >/dev/null

        cat <<EOF | kubectl apply -n "$NAMESPACE" -f -
apiVersion: triggers.tekton.dev/v1beta1
kind: TriggerTemplate
metadata:
    name: bustani-github-trigger-template
spec:
    params:
        - name: git-repository
            description: Repository URL
        - name: git-revision
            description: Branch ref
        - name: git-username
            description: Repo owner/user
        - name: image-name
            description: Image name
        - name: image-tag
            description: Image tag
        - name: namespace
            description: Kubernetes namespace
        - name: argocd-app-name
            description: ArgoCD app name
    resourcetemplates:
        - apiVersion: tekton.dev/v1beta1
            kind: PipelineRun
            metadata:
                generateName: bustani-webhook-run-
                namespace: $NAMESPACE
            spec:
                pipelineRef:
                    name: $PIPELINE_NAME
                serviceAccountName: tekton-sa
                timeout: 30m
                params:
                    - name: git-repository
                        value: \$(tt.params.git-repository)
                    - name: git-revision
                        value: \$(tt.params.git-revision)
                    - name: git-username
                        value: \$(tt.params.git-username)
                    - name: image-name
                        value: \$(tt.params.image-name)
                    - name: image-tag
                        value: \$(tt.params.image-tag)
                    - name: trivy-severity
                        value: CRITICAL,HIGH
                    - name: namespace
                        value: \$(tt.params.namespace)
                    - name: argocd-app-name
                        value: \$(tt.params.argocd-app-name)
                workspaces:
                    - name: shared-workspace
                        volumeClaimTemplate:
                            spec:
                                accessModes: ["ReadWriteOnce"]
                                resources:
                                    requests:
                                        storage: 1Gi
                                storageClassName: standard
---
apiVersion: triggers.tekton.dev/v1beta1
kind: TriggerBinding
metadata:
    name: bustani-github-trigger-binding
spec:
    params:
        - name: git-repository
            value: \$(extensions.repo_url)
        - name: git-revision
            value: \$(extensions.git_revision)
        - name: git-username
            value: \$(extensions.git_username)
        - name: image-name
            value: $IMAGE_NAME
        - name: image-tag
            value: $IMAGE_TAG
        - name: namespace
            value: $NAMESPACE
        - name: argocd-app-name
            value: $ARGOCD_APP_NAME
---
apiVersion: triggers.tekton.dev/v1beta1
kind: EventListener
metadata:
    name: bustani-github-listener
spec:
    serviceAccountName: tekton-sa
    triggers:
        - name: bustani-on-push-or-pr
            interceptors:
                - ref:
                        name: github
                    params:
                        - name: secretRef
                            value:
                                secretName: github-webhook-secret
                                secretKey: secretToken
                        - name: eventTypes
                            value: ["push", "pull_request"]
                - ref:
                        name: cel
                    params:
                        - name: filter
                            value: "header.match('X-GitHub-Event', 'push') || (header.match('X-GitHub-Event', 'pull_request') && (body.action == 'opened' || body.action == 'synchronize' || body.action == 'reopened'))"
                        - name: overlays
                            value:
                                - key: git_revision
                                    expression: "header.match('X-GitHub-Event', 'push') ? body.ref.split('/')[2] : body.pull_request.head.ref"
                                - key: git_username
                                    expression: "body.repository.owner.login"
                                - key: repo_url
                                    expression: "body.repository.clone_url"
            bindings:
                - ref: bustani-github-trigger-binding
            template:
                ref: bustani-github-trigger-template
EOF

        local listener_service="el-bustani-github-listener"
        log_success "GitHub webhook trigger configured"
        echo -e "${GREEN}Webhook listener service:${NC} $listener_service.$NAMESPACE.svc"
        echo -e "${BLUE}Port-forward for local testing:${NC} kubectl port-forward -n $NAMESPACE svc/$listener_service ${WEBHOOK_LOCAL_PORT}:8080"
        echo -e "${BLUE}GitHub webhook endpoint path:${NC} /"
        echo -e "${BLUE}Webhook secret token:${NC} $WEBHOOK_SECRET"
        echo -e "${YELLOW}Note:${NC} For GitHub to reach your listener from the internet, expose this endpoint with an ingress/public URL or a tunnel (for example ngrok/cloudflared)."
}

setup_github_repository_webhook() {
    log_info "Configuring GitHub repository webhook..."

    if [[ ! "$GIT_REPO" =~ github\.com ]]; then
        log_warning "Repository is not on GitHub; skipping automatic webhook creation"
        return
    fi

    if [[ -z "$WEBHOOK_PUBLIC_URL" ]]; then
        log_warning "WEBHOOK_PUBLIC_URL is not set; skipping GitHub webhook creation"
        log_info "Set WEBHOOK_PUBLIC_URL to your public EventListener URL and rerun with --webhook-trigger"
        return
    fi

    if [[ -z "$GITHUB_WEBHOOK_TOKEN" ]]; then
        log_warning "No GitHub API token found (GITHUB_WEBHOOK_TOKEN/GITHUB_TOKEN/GIT_TOKEN); skipping webhook creation"
        return
    fi

    local owner=""
    local repo=""

    if [[ "$GIT_REPO" =~ ^https://github.com/([^/]+)/([^/.]+)(\.git)?$ ]]; then
        owner="${BASH_REMATCH[1]}"
        repo="${BASH_REMATCH[2]}"
    elif [[ "$GIT_REPO" =~ ^git@github.com:([^/]+)/([^/.]+)(\.git)?$ ]]; then
        owner="${BASH_REMATCH[1]}"
        repo="${BASH_REMATCH[2]}"
    fi

    if [[ -z "$owner" || -z "$repo" ]]; then
        log_warning "Could not parse GitHub owner/repo from $GIT_REPO"
        return
    fi

    local normalized_url
    normalized_url="${WEBHOOK_PUBLIC_URL%/}"

    local payload
    payload="$(webhook_url="$normalized_url" webhook_secret="$WEBHOOK_SECRET" python3 - <<'PY'
import json, os
print(json.dumps({
    "name": "web",
    "active": True,
    "events": ["push", "pull_request"],
    "config": {
        "url": os.environ["webhook_url"],
        "content_type": "json",
        "secret": os.environ.get("webhook_secret", ""),
        "insecure_ssl": "0"
    }
}))
PY
)"

    local hooks_json
    hooks_json="$(curl -sS \
        -H "Accept: application/vnd.github+json" \
        -H "Authorization: Bearer $GITHUB_WEBHOOK_TOKEN" \
        "https://api.github.com/repos/$owner/$repo/hooks")"

    local existing_hook_id
    existing_hook_id="$(echo "$hooks_json" | webhook_url="$normalized_url" python3 - <<'PY'
import json, os, sys
target = os.environ["webhook_url"].rstrip("/")
try:
    hooks = json.load(sys.stdin)
except Exception:
    print("")
    raise SystemExit(0)
if isinstance(hooks, list):
    for hook in hooks:
        cfg = (hook or {}).get("config") or {}
        url = (cfg.get("url") or "").rstrip("/")
        if url == target:
            print(hook.get("id", ""))
            break
PY
)"

    local response_file
    response_file="/tmp/github-webhook-response.json"
    local http_code

    if [[ -n "$existing_hook_id" ]]; then
        http_code="$(curl -sS -o "$response_file" -w "%{http_code}" -X PATCH \
            -H "Accept: application/vnd.github+json" \
            -H "Authorization: Bearer $GITHUB_WEBHOOK_TOKEN" \
            "https://api.github.com/repos/$owner/$repo/hooks/$existing_hook_id" \
            -d "$payload")"
    else
        http_code="$(curl -sS -o "$response_file" -w "%{http_code}" -X POST \
            -H "Accept: application/vnd.github+json" \
            -H "Authorization: Bearer $GITHUB_WEBHOOK_TOKEN" \
            "https://api.github.com/repos/$owner/$repo/hooks" \
            -d "$payload")"
    fi

    if [[ "$http_code" =~ ^2 ]]; then
        log_success "GitHub webhook is configured for push and pull_request events"
        echo -e "${GREEN}Webhook URL:${NC} $normalized_url"
    else
        log_warning "GitHub webhook creation/update failed (HTTP $http_code). Response:"
        cat "$response_file"
    fi
}

install_argocd() {
    log_info "Checking if Argo CD is installed..."

    kubectl get namespace argocd >/dev/null 2>&1 || kubectl create namespace argocd

    if kubectl get deployment argocd-server -n argocd >/dev/null 2>&1; then
        log_success "Argo CD already installed"
    else
        log_info "Installing Argo CD..."
        kubectl apply --server-side --force-conflicts -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
        kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=300s
        log_success "Argo CD installed successfully"
    fi
}

ensure_argocd_application() {
        log_info "Ensuring Argo CD application exists..."

        cat <<EOF | kubectl apply -f -
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
    name: $ARGOCD_APP_NAME
    namespace: argocd
spec:
    project: default
    source:
        repoURL: $GIT_REPO
        targetRevision: $GIT_BRANCH
        path: k8s/argocd
        kustomize:
            images:
            - bustani=$IMAGE_NAME:$IMAGE_TAG
    destination:
        server: https://kubernetes.default.svc
        namespace: $NAMESPACE
    syncPolicy:
        automated:
            prune: true
            selfHeal: true
EOF

        kubectl annotate application "$ARGOCD_APP_NAME" -n argocd argocd.argoproj.io/refresh=hard --overwrite >/dev/null 2>&1 || true
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

    # Wait for tekton-dashboard service to exist
    if ! kubectl get svc tekton-dashboard -n tekton-pipelines &>/dev/null; then
        log_warning "Tekton Dashboard service not found — skipping dashboard port-forward"
        return
    fi

    # Kill any stale process on the preferred port before port scanning
    if lsof -ti:$DASHBOARD_LOCAL_PORT &>/dev/null; then
        log_warning "Port $DASHBOARD_LOCAL_PORT busy — releasing..."
        kill "$(lsof -ti:$DASHBOARD_LOCAL_PORT)" 2>/dev/null || true
        sleep 1
    fi

    local selected_port
    selected_port="$(find_available_port "$DASHBOARD_LOCAL_PORT" "Tekton Dashboard")" || {
        log_warning "Could not find an available local port for Tekton Dashboard port-forward"
        return
    }
    DASHBOARD_LOCAL_PORT="$selected_port"

    nohup kubectl port-forward \
        -n tekton-pipelines \
        svc/tekton-dashboard \
        ${DASHBOARD_LOCAL_PORT}:9097 \
        > /tmp/tekton-dashboard-pf.log 2>&1 &

    DASHBOARD_PF_PID=$!
    sleep 2

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
    else
        log_warning "Dashboard port-forward failed. Check: /tmp/tekton-dashboard-pf.log"
    fi
}

start_argocd_portforward() {
    log_info "Setting up Argo CD port-forward..."

    # Wait for argocd-server service to exist
    if ! kubectl get svc argocd-server -n argocd &>/dev/null; then
        log_warning "Argo CD server service not found — skipping ArgoCD port-forward"
        return
    fi

    # Kill any stale process on the preferred port before port scanning
    if lsof -ti:$ARGOCD_LOCAL_PORT &>/dev/null; then
        log_warning "Port $ARGOCD_LOCAL_PORT busy — releasing..."
        kill "$(lsof -ti:$ARGOCD_LOCAL_PORT)" 2>/dev/null || true
        sleep 1
    fi

    local selected_port
    selected_port="$(find_available_port "$ARGOCD_LOCAL_PORT" "Argo CD")" || {
        log_warning "Could not find an available local port for Argo CD port-forward"
        return
    }
    ARGOCD_LOCAL_PORT="$selected_port"

    nohup kubectl port-forward -n argocd svc/argocd-server ${ARGOCD_LOCAL_PORT}:443 > /tmp/argocd-pf.log 2>&1 &
    ARGOCD_PF_PID=$!
    sleep 2

    if kill -0 $ARGOCD_PF_PID 2>/dev/null; then
        echo ""
        echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║         Argo CD Dashboard is ready!                      ║${NC}"
        echo -e "${GREEN}║                                                          ║${NC}"
        echo -e "${GREEN}║  Open in browser: https://localhost:${ARGOCD_LOCAL_PORT}             ║${NC}"
        echo -e "${GREEN}║                                                          ║${NC}"
        echo -e "${GREEN}║  Port-forward PID: $ARGOCD_PF_PID                               ║${NC}"
        echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${BLUE}Get Argo CD admin password:${NC}"
        echo "  kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d; echo"
        echo ""
    else
        log_warning "Argo CD port-forward failed. Check: /tmp/argocd-pf.log"
    fi
}

start_ingress_portforward() {
    log_info "Setting up ingress-nginx controller port-forward..."

    kubectl wait --for=condition=available deployment/ingress-nginx-controller -n ingress-nginx --timeout=300s >/dev/null 2>&1 || true

    local selected_port
    selected_port="$(find_available_port "$INGRESS_LOCAL_PORT" "Ingress")" || {
        log_warning "Could not find an available local port for ingress port-forward"
        return
    }
    INGRESS_LOCAL_PORT="$selected_port"

    local attempts=0
    while [ $attempts -lt 12 ]; do
        nohup kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller ${INGRESS_LOCAL_PORT}:80 > /tmp/ingress-nginx-pf.log 2>&1 &
        INGRESS_PF_PID=$!
        sleep 3

        if kill -0 $INGRESS_PF_PID 2>/dev/null; then
            echo -e "${GREEN}Ingress Controller:${NC} http://localhost:${INGRESS_LOCAL_PORT}"
            echo -e "${GREEN}Ingress PF PID:${NC} $INGRESS_PF_PID"
            echo -e "${BLUE}Host mapping:${NC} echo '127.0.0.1 bustani.local' | sudo tee -a /etc/hosts"
            return
        fi

        if grep -q "unable to listen on any of the requested ports" /tmp/ingress-nginx-pf.log 2>/dev/null; then
            selected_port="$(find_available_port "$((INGRESS_LOCAL_PORT + 1))" "Ingress")" || break
            INGRESS_LOCAL_PORT="$selected_port"
            log_warning "Retrying ingress port-forward on local port $INGRESS_LOCAL_PORT"
        fi

        attempts=$((attempts + 1))
        sleep 2
    done

    log_warning "Ingress port-forward may have failed after retries. Check logs: /tmp/ingress-nginx-pf.log"
    INGRESS_PF_PID=""
}

start_app_portforward() {
    log_info "Setting up app service port-forward..."

    ensure_argocd_application

    local svc_attempts=0
    while [ $svc_attempts -lt 20 ]; do
        if kubectl get svc -n "$NAMESPACE" bustani-app >/dev/null 2>&1; then
            break
        fi
        svc_attempts=$((svc_attempts + 1))
        sleep 6
    done

    if ! kubectl get svc -n "$NAMESPACE" bustani-app >/dev/null 2>&1; then
        log_warning "App service bustani-app is not available yet; skipping app port-forward for now"
        APP_PF_PID=""
        return
    fi

    local selected_port
    selected_port="$(find_available_port "$APP_LOCAL_PORT" "App")" || {
        log_warning "Could not find an available local port for app port-forward"
        APP_PF_PID=""
        return
    }
    APP_LOCAL_PORT="$selected_port"

    local attempts=0
    while [ $attempts -lt 8 ]; do
        nohup kubectl port-forward -n "$NAMESPACE" svc/bustani-app ${APP_LOCAL_PORT}:80 > /tmp/bustani-app-pf.log 2>&1 &
        APP_PF_PID=$!
        sleep 2

        if kill -0 $APP_PF_PID 2>/dev/null; then
            echo -e "${GREEN}Bustani App:${NC} http://localhost:${APP_LOCAL_PORT}"
            echo -e "${GREEN}App PF PID:${NC} $APP_PF_PID"
            return
        fi

        if grep -q "unable to listen on any of the requested ports" /tmp/bustani-app-pf.log 2>/dev/null; then
            selected_port="$(find_available_port "$((APP_LOCAL_PORT + 1))" "App")" || break
            APP_LOCAL_PORT="$selected_port"
            log_warning "Retrying app port-forward on local port $APP_LOCAL_PORT"
        fi

        attempts=$((attempts + 1))
        sleep 2
    done

    log_warning "App port-forward may have failed. Service may not be deployed yet. Check logs: /tmp/bustani-app-pf.log"
    APP_PF_PID=""
}

show_access_points() {
    echo ""
    echo -e "${GREEN}╔═════════════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                   ACCESS POINTS & PORT FORWARDING SUMMARY                      ║${NC}"
    echo -e "${GREEN}╚═════════════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    if [[ -n "$DASHBOARD_PF_PID" ]] && kill -0 $DASHBOARD_PF_PID 2>/dev/null; then
        echo -e "${GREEN}✓${NC} ${BLUE}Tekton Dashboard:${NC}"
        echo "  URL: http://localhost:${DASHBOARD_LOCAL_PORT}"
        echo "  PID: $DASHBOARD_PF_PID"
        echo ""
    fi
    
    if [[ -n "$ARGOCD_PF_PID" ]] && kill -0 $ARGOCD_PF_PID 2>/dev/null; then
        echo -e "${GREEN}✓${NC} ${BLUE}Argo CD Dashboard:${NC}"
        echo "  URL: https://localhost:${ARGOCD_LOCAL_PORT}"
        echo "  PID: $ARGOCD_PF_PID"
        echo "  Login: admin / \$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d)"
        echo ""
    fi
    
    if [[ -n "$INGRESS_PF_PID" ]] && kill -0 $INGRESS_PF_PID 2>/dev/null; then
        echo -e "${GREEN}✓${NC} ${BLUE}Ingress Controller:${NC}"
        echo "  URL: http://localhost:${INGRESS_LOCAL_PORT}"
        echo "  PID: $INGRESS_PF_PID"
        echo "  Host mapping: echo '127.0.0.1 bustani.local' | sudo tee -a /etc/hosts"
        echo ""
    fi
    
    if [[ -n "$APP_PF_PID" ]] && kill -0 $APP_PF_PID 2>/dev/null; then
        echo -e "${GREEN}✓${NC} ${BLUE}Bustani Application:${NC}"
        echo "  URL: http://localhost:${APP_LOCAL_PORT}"
        echo "  PID: $APP_PF_PID"
        echo ""
    fi
    
    echo -e "${YELLOW}To kill any port-forward, run:${NC}"
    echo "  kill <PID>"
    echo ""
    echo -e "${YELLOW}To check port-forward logs:${NC}"
    echo "  tail -f /tmp/*-pf.log"
    echo ""
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
    echo -e "${BLUE}Webhook-triggered PipelineRuns:${NC}"
    echo "  kubectl get pipelinerun -n $NAMESPACE --sort-by=.metadata.creationTimestamp"
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
    --ingress-forward       Start ingress-nginx port-forward (default: enabled)
    --no-ingress-forward    Skip ingress-nginx port-forward
    --ingress-port PORT     Local port for ingress-nginx controller (default: 8081)
    --app-forward           Start bustani app service port-forward (default: enabled)
    --no-app-forward        Skip bustani app service port-forward
    --app-port PORT         Local port for bustani app service (default: 3000)
    --webhook-trigger       Configure GitHub webhook trigger for push/pull_request (default: enabled)
    --no-webhook-trigger    Skip webhook trigger setup
    --webhook-port PORT     Local port for webhook listener port-forward (default: 8085)
    --webhook-url URL       Public URL GitHub should call for webhook delivery (optional)

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
    local ingress_forward=true
    local app_forward=true
    local webhook_trigger=true
    
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
            --ingress-forward)
                ingress_forward=true
                shift
                ;;
            --no-ingress-forward)
                ingress_forward=false
                shift
                ;;
            --ingress-port)
                INGRESS_LOCAL_PORT="$2"
                shift 2
                ;;
            --app-forward)
                app_forward=true
                shift
                ;;
            --no-app-forward)
                app_forward=false
                shift
                ;;
            --app-port)
                APP_LOCAL_PORT="$2"
                shift 2
                ;;
            --webhook-trigger)
                webhook_trigger=true
                shift
                ;;
            --no-webhook-trigger)
                webhook_trigger=false
                shift
                ;;
            --webhook-port)
                WEBHOOK_LOCAL_PORT="$2"
                shift 2
                ;;
            --webhook-url)
                WEBHOOK_PUBLIC_URL="$2"
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
        install_tekton_triggers
        install_argocd
        install_ingress_controller
    fi
    
    apply_rbac
    apply_tasks
    apply_pipeline
    create_pipelinerun

    if [ "$webhook_trigger" = true ]; then
        setup_github_webhook_trigger
        setup_github_repository_webhook
    fi
    
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

    if [ "$ingress_forward" = true ]; then
        start_ingress_portforward
    fi

    if [ "$app_forward" = true ]; then
        start_app_portforward
    fi
    
    # Show all access points
    show_access_points
    
    if [ "$monitor" = true ]; then
        echo "Starting log monitoring... (Press Ctrl+C to stop)"
        echo ""
        tkn pipelinerun logs $PIPELINERUN_NAME -n $NAMESPACE -f
    else
        log_info "Port-forwards are running in background (logs in /tmp/*-pf.log)."
    fi
}

# Run main function
main "$@"
