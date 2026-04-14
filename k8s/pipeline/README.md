# Bustani CI/CD Pipeline - Reference Guide

## Deploy Tekton Pipelines

```bash
# Install Tekton Pipelines
kubectl apply -f https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml

# Install Tekton Dashboard (optional, for UI)
kubectl apply -f https://storage.googleapis.com/tekton-releases/dashboard/latest/release.yaml

# Install Tasks
kubectl apply -f k8s/tasks/

# Setup RBAC and Secrets
kubectl apply -f k8s/pipeline/rbac.yml
```

## Configure Secrets

### 1. Registry Credentials
```bash
# Create docker config for registry
kubectl create secret docker-registry registry-credentials \
  --docker-server=docker.io \
  --docker-username=YOUR_USERNAME \
  --docker-password=YOUR_PASSWORD \
  --docker-email=your@email.com \
  -n default
```

### 2. Kubeconfig Secret
```bash
# Create kubeconfig secret for deployment
kubectl create secret generic kubeconfig \
  --from-file=kubeconfig=$HOME/.kube/config \
  -n default
```

## Run the Pipeline

### Option 1: Deploy the predefined PipelineRun
```bash
kubectl apply -f k8s/pipeline/pipelinerun.yml
```

### Option 2: Create a manual PipelineRun
```bash
tkn pipeline start bustani-ci-cd-pipeline \
  --param git-repository=https://github.com/mureti/Bustani \
  --param git-revision=main \
  --param image-name=bustani/bustani \
  --param image-tag=latest \
  --workspace name=shared-workspace,volumeClaimTemplateFile=- <<EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: shared-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
EOF
```

## Monitor Pipeline Execution

```bash
# View all PipelineRuns
kubectl get pipelinerun -n default

# Watch specific PipelineRun
kubectl get pipelinerun bustani-pipeline-run-001 -n default -w

# View logs for a PipelineRun
tkn pipelinerun logs bustani-pipeline-run-001 -n default -f

# View Task logs
tkn pipelinerun logs bustani-pipeline-run-001 -n default -t clone-repo
```

## Debug

```bash
# Describe PipelineRun
kubectl describe pipelinerun bustani-pipeline-run-001 -n default

# View Pod logs
kubectl logs -n default -l tekton.dev/pipelineRun=bustani-pipeline-run-001 -f

# View Task status
tkn pipelinerun describe bustani-pipeline-run-001 -n default
```

## Pipeline Stages

1. **clone-repo** → Clone git repository
2. **build-app** → Install deps, lint, build Node.js app
3. **run-tests** → Execute npm tests (unit tests)
4. **build-image** → Build and push Docker image with Kaniko
5. **scan-image** → Security scan with Trivy
6. **deploy-to-k8s** → Apply manifests to cluster

## Customize Parameters

Edit `pipelinerun.yml` to override defaults:

```yaml
params:
- name: git-repository
  value: YOUR_REPO_URL
- name: git-revision
  value: YOUR_BRANCH
- name: image-name
  value: YOUR_REGISTRY/IMAGE
- name: image-tag
  value: v1.0.0
```
