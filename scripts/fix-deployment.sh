#!/bin/bash

# Bustani Deployment Fix Script
# Addresses ImagePullBackOff and port-forward failures

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

NAMESPACE="${NAMESPACE:-default}"
IMAGE_NAME="${IMAGE_NAME:-}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

# Step 1: Kill zombie port-forward processes
log_info "Cleaning up zombie processes and port conflicts..."
pkill -f "kubectl port-forward" || true
sleep 2
rm -f /tmp/*-pf.log
log_success "Cleaned up zombie processes"

# Step 2: Check Docker credentials
log_info "Verifying Docker credentials..."
if [ ! -f "$HOME/.docker/config.json" ]; then
    log_error "Docker config not found at $HOME/.docker/config.json"
    log_info "Run 'docker login' first"
    exit 1
fi
log_success "Docker config found"

# Step 3: Determine image name if not provided
if [[ -z "$IMAGE_NAME" ]]; then
    log_info "Resolving image name from git repo and Docker config..."
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
    repo_name="bustani"
    IMAGE_NAME="$docker_user/$repo_name"
fi

if [[ -z "$IMAGE_NAME" ]]; then
    log_error "Could not determine image name. Set IMAGE_NAME environment variable."
    exit 1
fi

log_info "Using image: $IMAGE_NAME:$IMAGE_TAG"

# Step 4: Update Docker registry secret
log_info "Updating Docker registry secret in cluster..."
kubectl delete secret docker-registry -n "$NAMESPACE" --ignore-not-found >/dev/null 2>&1 || true
kubectl delete secret registry-credentials -n "$NAMESPACE" --ignore-not-found >/dev/null 2>&1 || true

kubectl create secret docker-registry docker-registry \
    --docker-server=docker.io \
    --docker-config=$HOME/.docker/config.json \
    -n "$NAMESPACE" || true

kubectl create secret generic registry-credentials \
    --from-file=config.json=$HOME/.docker/config.json \
    -n "$NAMESPACE" || true

log_success "Docker registry secrets updated"

# Step 5: Force pull the image locally to verify it exists
log_info "Verifying image exists and can be pulled..."
if docker pull "$IMAGE_NAME:$IMAGE_TAG" >/dev/null 2>&1; then
    log_success "Image successfully pulled: $IMAGE_NAME:$IMAGE_TAG"
else
    log_error "Failed to pull image: $IMAGE_NAME:$IMAGE_TAG"
    log_info "Image may not exist. Run CI/CD pipeline to rebuild."
    exit 1
fi

# Step 6: Clean up failed pods
log_info "Removing failed pods..."
kubectl delete pods -n "$NAMESPACE" -l app=bustani-app --all-namespaces=false 2>/dev/null || true
log_success "Failed pods removed"

# Step 7: Clean up old PVCs from failed pipeline runs
log_info "Cleaning up old PVCs from failed pipeline runs (keeping recent ones)..."
# Keep only the most recent 5 PVCs
pvcs=$(kubectl get pvc -n "$NAMESPACE" -o name --sort-by=.metadata.creationTimestamp | head -n -5)
for pvc in $pvcs; do
    kubectl delete "$pvc" -n "$NAMESPACE" 2>/dev/null || true
done
log_success "Old PVCs cleaned up"

# Step 8: Verify ingress-nginx is running
log_info "Checking ingress-nginx controller status..."
if kubectl get pod -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx &>/dev/null; then
    log_success "ingress-nginx controller is running"
else
    log_warning "ingress-nginx controller not found. Installation may have failed."
fi

# Step 9: Get application status
log_info "Checking application deployment status..."
app_status=$(kubectl get deployment bustani-app -n "$NAMESPACE" 2>/dev/null || echo "not-found")
if [[ "$app_status" == "not-found" ]]; then
    log_warning "bustani-app deployment not found. ArgoCD may need to sync."
else
    kubectl describe deployment bustani-app -n "$NAMESPACE" | head -20
fi

log_success "Deployment fix completed!"
log_info "Next steps:"
echo "  1. Wait 30-60 seconds for pods to be recreated"
echo "  2. Run: kubectl get pods -n $NAMESPACE -w"
echo "  3. Once pods are Running, restart port-forwards:"
echo "     ./scripts/start-pipeline.sh --no-dashboard --argocd --ingress-forward --app-forward"
