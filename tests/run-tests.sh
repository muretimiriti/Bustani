#!/usr/bin/env bash
set +e  # Don't exit on errors – we handle them per-test

# ─────────────────────────────────────────────────────────────────────────────
# Bustani – Comprehensive Test Suite
# Covers: Code Quality, SAST, DAST, Stress Testing, Dependency Audit,
#         Security Headers, API Fuzzing
# ─────────────────────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

PASS=0
FAIL=0
WARN=0
RESULTS_DIR="$(dirname "$0")/results"
mkdir -p "$RESULTS_DIR"

# Defaults – override with env vars
API_BASE="${API_BASE:-http://localhost:8000}"
FRONTEND_BASE="${FRONTEND_BASE:-http://localhost:5173}"
STRESS_CONCURRENCY="${STRESS_CONCURRENCY:-50}"
STRESS_REQUESTS="${STRESS_REQUESTS:-500}"

# Read admin password from .env.local (same as api.php does)
ADMIN_PW=""
if [[ -f ".env.local" ]]; then
    ADMIN_PW=$(grep '^ADMIN_PASSWORD=' .env.local 2>/dev/null | cut -d'=' -f2- | tr -d '[:space:]')
fi
ADMIN_PW="${ADMIN_PW:-${ADMIN_PASSWORD:-}}"

log_pass()  { ((PASS++)); echo -e "  ${GREEN}✔ PASS${NC}  $1"; }
log_fail()  { ((FAIL++)); echo -e "  ${RED}✘ FAIL${NC}  $1"; }
log_warn()  { ((WARN++)); echo -e "  ${YELLOW}⚠ WARN${NC}  $1"; }
log_info()  { echo -e "  ${CYAN}ℹ INFO${NC}  $1"; }
section()   { echo -e "\n${BOLD}━━━ $1 ━━━${NC}"; }

# ─────────────────────────────────────────────────────────────────────────────
# 1. CODE QUALITY
# ─────────────────────────────────────────────────────────────────────────────
section "1. CODE QUALITY"

# 1a. TypeScript compilation
echo -e "\n${CYAN}[1a] TypeScript type-check${NC}"
if npx tsc --noEmit 2>"$RESULTS_DIR/tsc.log"; then
    log_pass "TypeScript compiles with no errors"
else
    log_fail "TypeScript errors found (see tests/results/tsc.log)"
fi

# 1b. ESLint
echo -e "\n${CYAN}[1b] ESLint${NC}"
ESLINT_OUTPUT=$(npx eslint src/ --max-warnings 0 2>&1)
ESLINT_EXIT=$?
if [[ $ESLINT_EXIT -eq 0 ]]; then
    log_pass "ESLint: no errors or warnings"
else
    echo "$ESLINT_OUTPUT" > "$RESULTS_DIR/eslint.log"
    ESLINT_ERRORS=$(echo "$ESLINT_OUTPUT" | grep -c " error " || true)
    if [[ "$ESLINT_ERRORS" -gt 0 ]]; then
        log_fail "ESLint errors found (see tests/results/eslint.log)"
    else
        log_warn "ESLint warnings found (see tests/results/eslint.log)"
    fi
fi

# 1c. Check for console.log / debugger left in source
echo -e "\n${CYAN}[1c] Debug statements${NC}"
DEBUG_HITS=$(grep -rn --include='*.tsx' --include='*.ts' \
    -E '(console\.(log|debug|warn)|debugger)' src/ 2>/dev/null | grep -v node_modules || true)
if [[ -z "$DEBUG_HITS" ]]; then
    log_pass "No stray console.log / debugger in src/"
else
    COUNT=$(echo "$DEBUG_HITS" | wc -l)
    echo "$DEBUG_HITS" > "$RESULTS_DIR/debug-statements.log"
    log_warn "$COUNT debug statement(s) found (see tests/results/debug-statements.log)"
fi

# 1d. Check for TODO/FIXME/HACK
echo -e "\n${CYAN}[1d] TODO / FIXME / HACK comments${NC}"
TODO_HITS=$(grep -rn --include='*.tsx' --include='*.ts' --include='*.php' \
    -Ei '(TODO|FIXME|HACK|XXX):?' src/ api.php 2>/dev/null || true)
if [[ -z "$TODO_HITS" ]]; then
    log_pass "No TODO/FIXME/HACK comments"
else
    COUNT=$(echo "$TODO_HITS" | wc -l)
    echo "$TODO_HITS" > "$RESULTS_DIR/todo-comments.log"
    log_warn "$COUNT TODO/FIXME/HACK comment(s) found"
fi

# ─────────────────────────────────────────────────────────────────────────────
# 2. DEPENDENCY AUDIT
# ─────────────────────────────────────────────────────────────────────────────
section "2. DEPENDENCY AUDIT"

echo -e "\n${CYAN}[2a] npm audit${NC}"
if npm audit --omit=dev 2>"$RESULTS_DIR/npm-audit.log" | tee -a "$RESULTS_DIR/npm-audit.log"; then
    log_pass "npm audit: no known vulnerabilities in production deps"
else
    VULN_COUNT=$(npm audit --json 2>/dev/null | grep -c '"severity"' || echo "?")
    log_fail "npm audit found vulnerabilities ($VULN_COUNT issues, see tests/results/npm-audit.log)"
fi

# 2b. Outdated packages
echo -e "\n${CYAN}[2b] Outdated packages${NC}"
OUTDATED=$(npm outdated --json 2>/dev/null || true)
if [[ "$OUTDATED" == "{}" || -z "$OUTDATED" ]]; then
    log_pass "All packages up to date"
else
    COUNT=$(echo "$OUTDATED" | grep -c '"current"' || echo "?")
    echo "$OUTDATED" > "$RESULTS_DIR/outdated-packages.json"
    log_warn "$COUNT outdated package(s) (see tests/results/outdated-packages.json)"
fi

# ─────────────────────────────────────────────────────────────────────────────
# 3. SAST – STATIC APPLICATION SECURITY TESTING
# ─────────────────────────────────────────────────────────────────────────────
section "3. SAST – STATIC APPLICATION SECURITY TESTING"

# 3a. Hardcoded secrets / passwords
echo -e "\n${CYAN}[3a] Hardcoded secrets scan${NC}"
SECRET_HITS=$(grep -rn --include='*.php' --include='*.ts' --include='*.tsx' --include='*.js' \
    --include='*.env' --include='*.json' \
    -Ei "(password\s*=\s*['\"].{3,}['\"]|api_key\s*=|secret\s*=\s*['\"]|token\s*=\s*['\"].{8,}['\"]|BEGIN (RSA |OPENSSH )?PRIVATE KEY)" \
    . 2>/dev/null | grep -v node_modules | grep -v 'package-lock' | grep -v '.log' | grep -v 'tests/' | grep -v '.next/' | grep -v 'import\.meta\.env' | grep -v 'getenv(' || true)
if [[ -z "$SECRET_HITS" ]]; then
    log_pass "No hardcoded secrets detected"
else
    COUNT=$(echo "$SECRET_HITS" | wc -l)
    echo "$SECRET_HITS" > "$RESULTS_DIR/hardcoded-secrets.log"
    log_fail "$COUNT potential hardcoded secret(s) found (see tests/results/hardcoded-secrets.log)"
fi

# 3b. SQL injection patterns in PHP
echo -e "\n${CYAN}[3b] SQL injection patterns${NC}"
SQLI_HITS=$(grep -rn --include='*.php' \
    -Ei '(\$_(GET|POST|REQUEST|COOKIE)\[.*\].*query|\$_(GET|POST|REQUEST)\[.*\].*exec|mysql_query.*\$_)' \
    . 2>/dev/null | grep -v node_modules || true)
if [[ -z "$SQLI_HITS" ]]; then
    log_pass "No obvious SQL injection patterns in PHP"
else
    echo "$SQLI_HITS" > "$RESULTS_DIR/sqli-patterns.log"
    log_fail "Potential SQL injection patterns found"
fi

# 3c. XSS patterns – dangerouslySetInnerHTML
echo -e "\n${CYAN}[3c] XSS patterns (dangerouslySetInnerHTML)${NC}"
XSS_HITS=$(grep -rn --include='*.tsx' --include='*.jsx' \
    'dangerouslySetInnerHTML' src/ 2>/dev/null || true)
if [[ -z "$XSS_HITS" ]]; then
    log_pass "No dangerouslySetInnerHTML usage"
else
    COUNT=$(echo "$XSS_HITS" | wc -l)
    echo "$XSS_HITS" > "$RESULTS_DIR/xss-patterns.log"
    log_fail "$COUNT dangerouslySetInnerHTML usage(s) – review for XSS"
fi

# 3d. Insecure eval / Function constructor
echo -e "\n${CYAN}[3d] Dangerous eval / Function usage${NC}"
EVAL_HITS=$(grep -rn --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' \
    -E '(^|[^a-zA-Z])(eval\s*\(|new\s+Function\s*\()' src/ 2>/dev/null || true)
if [[ -z "$EVAL_HITS" ]]; then
    log_pass "No eval() or new Function() usage"
else
    echo "$EVAL_HITS" > "$RESULTS_DIR/eval-usage.log"
    log_fail "Dangerous eval/Function usage found"
fi

# 3e. File upload security (PHP)
echo -e "\n${CYAN}[3e] File upload validation${NC}"
if grep -q 'mime_content_type' api.php 2>/dev/null; then
    log_pass "File uploads check MIME type"
else
    log_fail "File uploads missing MIME type validation"
fi

if grep -q 'UPLOAD_ERR_OK' api.php 2>/dev/null; then
    log_pass "File uploads check error codes"
else
    log_warn "File uploads may not check error codes"
fi

# 3f. CORS configuration
echo -e "\n${CYAN}[3f] CORS policy${NC}"
CORS_ORIGIN=$(grep -n 'Access-Control-Allow-Origin' api.php 2>/dev/null || true)
if echo "$CORS_ORIGIN" | grep -q '\*'; then
    log_warn "CORS allows all origins (*) – restrict in production"
else
    log_pass "CORS origin is restricted"
fi

# 3g. PHP error exposure
echo -e "\n${CYAN}[3g] PHP error/stack exposure${NC}"
ERR_HITS=$(grep -rn --include='*.php' \
    -Ei '(display_errors.*on|error_reporting.*E_ALL|var_dump|print_r.*\$_)' \
    . 2>/dev/null | grep -v node_modules | grep -v tests/ || true)
if [[ -z "$ERR_HITS" ]]; then
    log_pass "No PHP debug error exposure"
else
    echo "$ERR_HITS" > "$RESULTS_DIR/php-error-exposure.log"
    log_warn "PHP error exposure found (see tests/results/php-error-exposure.log)"
fi

# 3h. Path traversal in file operations
echo -e "\n${CYAN}[3h] Path traversal risk${NC}"
PATH_TRAV=$(grep -rn --include='*.php' \
    -Ei "(basename|realpath)" api.php 2>/dev/null || true)
if grep -q 'basename' api.php 2>/dev/null; then
    log_pass "Uses basename() – some path traversal protection"
else
    log_warn "No basename() usage – check for path traversal risks in file ops"
fi

# ─────────────────────────────────────────────────────────────────────────────
# 4. DAST – DYNAMIC APPLICATION SECURITY TESTING
#    Requires api.php running on $API_BASE
# ─────────────────────────────────────────────────────────────────────────────
section "4. DAST – DYNAMIC APPLICATION SECURITY TESTING"

API_UP=false
if curl -sf "$API_BASE/api.php" -o /dev/null 2>/dev/null; then
    API_UP=true
    log_info "API reachable at $API_BASE/api.php"
else
    log_warn "API not reachable at $API_BASE/api.php – skipping live DAST tests"
    log_info "Start with: php -S localhost:8000 router.php then re-run, or set API_BASE"
fi

if $API_UP; then
    # 4a. Unauthorized access (no password)
    echo -e "\n${CYAN}[4a] Auth – POST without password${NC}"
    HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' \
        -X POST "$API_BASE/api.php" \
        -H 'Content-Type: application/json' \
        -d '{"type":"events","item":{"title":"hack"}}' 2>/dev/null)
    if [[ "$HTTP_CODE" == "401" ]]; then
        log_pass "POST without password returns 401"
    else
        log_fail "POST without password returned $HTTP_CODE (expected 401)"
    fi

    # 4b. Wrong password
    echo -e "\n${CYAN}[4b] Auth – POST with wrong password${NC}"
    HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' \
        -X POST "$API_BASE/api.php" \
        -H 'Content-Type: application/json' \
        -d '{"type":"events","password":"wrong","item":{"title":"hack"}}' 2>/dev/null)
    if [[ "$HTTP_CODE" == "401" ]]; then
        log_pass "Wrong password returns 401"
    else
        log_fail "Wrong password returned $HTTP_CODE (expected 401)"
    fi

    # 4c. Invalid type
    echo -e "\n${CYAN}[4c] Input validation – invalid type${NC}"
    HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' \
        -X POST "$API_BASE/api.php" \
        -H 'Content-Type: application/json' \
        -d "{\"type\":\"malicious\",\"password\":\"$ADMIN_PW\",\"item\":{\"title\":\"test\"}}" 2>/dev/null)
    if [[ "$HTTP_CODE" == "400" ]]; then
        log_pass "Invalid type returns 400"
    else
        log_fail "Invalid type returned $HTTP_CODE (expected 400)"
    fi

    # 4d. DELETE without password
    echo -e "\n${CYAN}[4d] Auth – DELETE without password${NC}"
    HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' \
        -X DELETE "$API_BASE/api.php" \
        -H 'Content-Type: application/json' \
        -d '{"type":"events","id":"nonexistent"}' 2>/dev/null)
    if [[ "$HTTP_CODE" == "401" ]]; then
        log_pass "DELETE without password returns 401"
    else
        log_fail "DELETE without password returned $HTTP_CODE (expected 401)"
    fi

    # 4e. Method not allowed
    echo -e "\n${CYAN}[4e] Unsupported HTTP method${NC}"
    HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' \
        -X PUT "$API_BASE/api.php" \
        -H 'Content-Type: application/json' \
        -d '{}' 2>/dev/null)
    if [[ "$HTTP_CODE" == "405" ]]; then
        log_pass "PUT returns 405 Method Not Allowed"
    else
        log_fail "PUT returned $HTTP_CODE (expected 405)"
    fi

    # 4f. XSS in input
    echo -e "\n${CYAN}[4f] XSS payload in title${NC}"
    RESPONSE=$(curl -sf -X POST "$API_BASE/api.php" \
        -H 'Content-Type: application/json' \
        -d "{\"type\":\"events\",\"password\":\"$ADMIN_PW\",\"item\":{\"title\":\"<script>alert(1)</script>\",\"date\":\"2026-01-01\"}}" 2>/dev/null || echo "")
    if echo "$RESPONSE" | grep -q '<script>'; then
        log_warn "API reflects <script> tags – ensure frontend sanitizes output"
        # Clean up the test item
        ITEM_ID=$(echo "$RESPONSE" | grep -oP '"id"\s*:\s*"\K[^"]+' || true)
        if [[ -n "$ITEM_ID" ]]; then
            curl -sf -X DELETE "$API_BASE/api.php" \
                -H 'Content-Type: application/json' \
                -d "{\"type\":\"events\",\"password\":\"$ADMIN_PW\",\"id\":\"$ITEM_ID\"}" >/dev/null 2>&1 || true
        fi
    else
        log_pass "XSS payload not reflected or API rejected it"
    fi

    # 4g. Large payload
    echo -e "\n${CYAN}[4g] Large payload handling${NC}"
    LARGE_TITLE=$(python3 -c "print('A' * 100000)" 2>/dev/null || printf 'A%.0s' {1..10000})
    HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' \
        -X POST "$API_BASE/api.php" \
        -H 'Content-Type: application/json' \
        --max-time 10 \
        -d "{\"type\":\"events\",\"password\":\"$ADMIN_PW\",\"item\":{\"title\":\"$LARGE_TITLE\",\"date\":\"2026-01-01\"}}" 2>/dev/null)
    if [[ "$HTTP_CODE" == "413" || "$HTTP_CODE" == "400" ]]; then
        log_pass "Large payload rejected ($HTTP_CODE)"
    elif [[ "$HTTP_CODE" == "200" ]]; then
        log_warn "Large payload (100KB title) was accepted – consider size limits"
        # Clean up
        CLEANUP=$(curl -sf "$API_BASE/api.php" 2>/dev/null || echo '{"events":[]}')
        ITEM_ID=$(echo "$CLEANUP" | grep -oP '"id"\s*:\s*"\K[^"]+' | head -1 || true)
        if [[ -n "$ITEM_ID" ]]; then
            curl -sf -X DELETE "$API_BASE/api.php" \
                -H 'Content-Type: application/json' \
                -d "{\"type\":\"events\",\"password\":\"$ADMIN_PW\",\"id\":\"$ITEM_ID\"}" >/dev/null 2>&1 || true
        fi
    else
        log_info "Large payload returned $HTTP_CODE"
    fi

    # 4h. Security headers
    echo -e "\n${CYAN}[4h] Security headers${NC}"
    HEADERS=$(curl -sI "$API_BASE/api.php" 2>/dev/null || echo "")

    if echo "$HEADERS" | grep -qi 'X-Content-Type-Options'; then
        log_pass "X-Content-Type-Options header present"
    else
        log_warn "Missing X-Content-Type-Options: nosniff header"
    fi

    if echo "$HEADERS" | grep -qi 'X-Frame-Options'; then
        log_pass "X-Frame-Options header present"
    else
        log_warn "Missing X-Frame-Options header"
    fi

    if echo "$HEADERS" | grep -qi 'X-XSS-Protection'; then
        log_pass "X-XSS-Protection header present"
    else
        log_warn "Missing X-XSS-Protection header (modern browsers use CSP instead)"
    fi

    if echo "$HEADERS" | grep -qi 'Content-Security-Policy'; then
        log_pass "Content-Security-Policy header present"
    else
        log_warn "Missing Content-Security-Policy header"
    fi

    if echo "$HEADERS" | grep -qi 'Strict-Transport-Security'; then
        log_pass "HSTS header present"
    else
        log_warn "Missing Strict-Transport-Security header (needed for HTTPS)"
    fi

    # 4i. Directory listing / info disclosure
    echo -e "\n${CYAN}[4i] Directory listing / info disclosure${NC}"
    HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' "$API_BASE/uploads/" 2>/dev/null)
    if [[ "$HTTP_CODE" == "403" || "$HTTP_CODE" == "404" ]]; then
        log_pass "uploads/ directory listing disabled ($HTTP_CODE)"
    else
        log_warn "uploads/ returns $HTTP_CODE – may expose directory listing"
    fi

    HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' "$API_BASE/data.json" 2>/dev/null)
    if [[ "$HTTP_CODE" == "403" || "$HTTP_CODE" == "404" ]]; then
        log_pass "data.json not directly accessible ($HTTP_CODE)"
    else
        log_fail "data.json directly accessible ($HTTP_CODE) – restrict access in production"
    fi
fi

# ─────────────────────────────────────────────────────────────────────────────
# 5. STRESS TESTING
#    Requires: ab (Apache Bench) or curl
# ─────────────────────────────────────────────────────────────────────────────
section "5. STRESS TESTING"

if $API_UP; then
    if command -v ab &>/dev/null; then
        echo -e "\n${CYAN}[5a] GET endpoint – $STRESS_REQUESTS requests, $STRESS_CONCURRENCY concurrent${NC}"
        ab -n "$STRESS_REQUESTS" -c "$STRESS_CONCURRENCY" -q \
            "$API_BASE/api.php" > "$RESULTS_DIR/stress-get.log" 2>&1 || true

        # Parse results
        RPS=$(grep 'Requests per second' "$RESULTS_DIR/stress-get.log" | awk '{print $4}')
        FAILED=$(grep 'Failed requests' "$RESULTS_DIR/stress-get.log" | awk '{print $3}')
        P95=$(grep '95%' "$RESULTS_DIR/stress-get.log" | awk '{print $2}')

        if [[ -n "$RPS" ]]; then
            log_info "GET: $RPS req/sec | Failed: ${FAILED:-0} | P95: ${P95:-?}ms"
        fi

        if [[ "${FAILED:-0}" == "0" ]]; then
            log_pass "All $STRESS_REQUESTS GET requests succeeded"
        else
            log_fail "$FAILED out of $STRESS_REQUESTS GET requests failed"
        fi

        if [[ -n "$P95" && "$P95" -lt 1000 ]] 2>/dev/null; then
            log_pass "P95 response time under 1s (${P95}ms)"
        elif [[ -n "$P95" ]]; then
            log_warn "P95 response time is ${P95}ms (over 1s)"
        fi

        echo -e "\n${CYAN}[5b] POST endpoint – $STRESS_REQUESTS auth-fail requests${NC}"
        TMPFILE=$(mktemp)
        echo '{"type":"events","password":"wrong","item":{"title":"stress"}}' > "$TMPFILE"
        ab -n "$STRESS_REQUESTS" -c "$STRESS_CONCURRENCY" -q \
            -p "$TMPFILE" -T 'application/json' \
            "$API_BASE/api.php" > "$RESULTS_DIR/stress-post.log" 2>&1 || true
        rm -f "$TMPFILE"

        RPS=$(grep 'Requests per second' "$RESULTS_DIR/stress-post.log" | awk '{print $4}')
        FAILED=$(grep 'Failed requests' "$RESULTS_DIR/stress-post.log" | awk '{print $3}')
        log_info "POST (auth-fail): $RPS req/sec | Failed: ${FAILED:-0}"

    else
        log_info "Apache Bench (ab) not installed – using curl fallback"

        echo -e "\n${CYAN}[5a] Concurrent GET stress test (curl)${NC}"
        START=$(date +%s%N)
        FAIL_COUNT=0
        for i in $(seq 1 50); do
            curl -sf -o /dev/null "$API_BASE/api.php" 2>/dev/null &
        done
        wait
        END=$(date +%s%N)
        ELAPSED=$(( (END - START) / 1000000 ))
        log_info "50 concurrent GETs completed in ${ELAPSED}ms"

        if [[ $ELAPSED -lt 5000 ]]; then
            log_pass "50 concurrent requests under 5s (${ELAPSED}ms)"
        else
            log_warn "50 concurrent requests took ${ELAPSED}ms – may indicate performance issues"
        fi
    fi
else
    log_warn "API not running – skipping stress tests"
fi

# ─────────────────────────────────────────────────────────────────────────────
# 6. FRONTEND CHECKS
# ─────────────────────────────────────────────────────────────────────────────
section "6. FRONTEND CHECKS"

FRONTEND_UP=false
if curl -sf "$FRONTEND_BASE" -o /dev/null 2>/dev/null; then
    FRONTEND_UP=true
    log_info "Frontend reachable at $FRONTEND_BASE"
else
    log_warn "Frontend not reachable at $FRONTEND_BASE – skipping live frontend tests"
fi

if $FRONTEND_UP; then
    # 6a. Frontend security headers
    echo -e "\n${CYAN}[6a] Frontend security headers${NC}"
    FE_HEADERS=$(curl -sI "$FRONTEND_BASE" 2>/dev/null || echo "")

    if echo "$FE_HEADERS" | grep -qi 'X-Content-Type-Options'; then
        log_pass "Frontend: X-Content-Type-Options present"
    else
        log_warn "Frontend: Missing X-Content-Type-Options"
    fi

    # 6b. Check for source maps in production build
    echo -e "\n${CYAN}[6b] Source maps exposure${NC}"
    MAP_HITS=$(curl -sf "$FRONTEND_BASE" 2>/dev/null | grep -o '\.js\.map' || true)
    if [[ -z "$MAP_HITS" ]]; then
        log_pass "No source map references found in HTML"
    else
        log_warn "Source map references found – disable in production"
    fi
fi

# 6c. Build test
echo -e "\n${CYAN}[6c] Production build${NC}"
if npm run build 2>"$RESULTS_DIR/build.log" >/dev/null; then
    log_pass "Production build succeeds"

    # Check bundle size
    if [[ -d "dist" ]]; then
        BUNDLE_SIZE=$(du -sh dist/ 2>/dev/null | awk '{print $1}')
        log_info "Bundle size: $BUNDLE_SIZE"

        JS_SIZE=$(find dist/ -name '*.js' -exec du -cb {} + 2>/dev/null | tail -1 | awk '{print $1}')
        JS_KB=$((${JS_SIZE:-0} / 1024))
        if [[ $JS_KB -lt 500 ]]; then
            log_pass "JS bundle under 500KB (${JS_KB}KB)"
        elif [[ $JS_KB -lt 1000 ]]; then
            log_warn "JS bundle is ${JS_KB}KB – consider code splitting"
        else
            log_fail "JS bundle is ${JS_KB}KB – too large, needs optimization"
        fi
    fi
else
    log_fail "Production build failed (see tests/results/build.log)"
fi

# ─────────────────────────────────────────────────────────────────────────────
# 7. API FUZZING
# ─────────────────────────────────────────────────────────────────────────────
section "7. API FUZZING"

if $API_UP; then
    echo -e "\n${CYAN}[7a] Malformed JSON${NC}"
    HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' \
        -X POST "$API_BASE/api.php" \
        -H 'Content-Type: application/json' \
        -d '{invalid json' 2>/dev/null)
    if [[ "$HTTP_CODE" != "500" ]]; then
        log_pass "Malformed JSON handled gracefully ($HTTP_CODE)"
    else
        log_fail "Malformed JSON caused 500 error"
    fi

    echo -e "\n${CYAN}[7b] Empty body${NC}"
    HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' \
        -X POST "$API_BASE/api.php" \
        -H 'Content-Type: application/json' \
        -d '' 2>/dev/null)
    if [[ "$HTTP_CODE" != "500" ]]; then
        log_pass "Empty body handled gracefully ($HTTP_CODE)"
    else
        log_fail "Empty body caused 500 error"
    fi

    echo -e "\n${CYAN}[7c] Null values${NC}"
    HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' \
        -X POST "$API_BASE/api.php" \
        -H 'Content-Type: application/json' \
        -d '{"type":null,"password":null,"item":null}' 2>/dev/null)
    if [[ "$HTTP_CODE" != "500" ]]; then
        log_pass "Null values handled gracefully ($HTTP_CODE)"
    else
        log_fail "Null values caused 500 error"
    fi

    echo -e "\n${CYAN}[7d] Path traversal in image filename${NC}"
    HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' \
        "$API_BASE/uploads/../../etc/passwd" 2>/dev/null)
    if [[ "$HTTP_CODE" == "403" || "$HTTP_CODE" == "404" || "$HTTP_CODE" == "400" ]]; then
        log_pass "Path traversal in URL blocked ($HTTP_CODE)"
    else
        log_warn "Path traversal attempt returned $HTTP_CODE – verify server config"
    fi

    echo -e "\n${CYAN}[7e] SQL injection in delete ID${NC}"
    HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' \
        -X DELETE "$API_BASE/api.php" \
        -H 'Content-Type: application/json' \
        -d "{\"type\":\"events\",\"password\":\"$ADMIN_PW\",\"id\":\"1 OR 1=1; DROP TABLE--\"}" 2>/dev/null)
    if [[ "$HTTP_CODE" != "500" ]]; then
        log_pass "SQLi-style ID handled safely ($HTTP_CODE)"
    else
        log_fail "SQLi-style ID caused 500 error"
    fi
else
    log_warn "API not running – skipping fuzzing tests"
fi

# ─────────────────────────────────────────────────────────────────────────────
# 8. FILE PERMISSION & CONFIGURATION CHECKS
# ─────────────────────────────────────────────────────────────────────────────
section "8. FILE & CONFIG CHECKS"

echo -e "\n${CYAN}[8a] Sensitive file permissions${NC}"
if [[ -f "data.json" ]]; then
    PERMS=$(stat -c '%a' data.json 2>/dev/null || stat -f '%Lp' data.json 2>/dev/null || echo "???")
    if [[ "$PERMS" == "600" || "$PERMS" == "640" || "$PERMS" == "644" ]]; then
        log_pass "data.json permissions: $PERMS"
    else
        log_warn "data.json permissions are $PERMS – consider restricting to 640"
    fi
fi

echo -e "\n${CYAN}[8b] .env / sensitive files in repo${NC}"
SENSITIVE_FILES=""
for f in .env .env.local .env.production .htpasswd id_rsa id_ed25519; do
    if git ls-files --error-unmatch "$f" &>/dev/null; then
        SENSITIVE_FILES="$SENSITIVE_FILES $f"
    fi
done
if [[ -z "$SENSITIVE_FILES" ]]; then
    log_pass "No sensitive config files (.env, keys) in project root"
else
    log_fail "Sensitive files found in repo:$SENSITIVE_FILES"
fi

echo -e "\n${CYAN}[8c] .gitignore coverage${NC}"
if [[ -f ".gitignore" ]]; then
    MISSING=""
    for pattern in data.json uploads/ .env node_modules; do
        if ! grep -q "$pattern" .gitignore 2>/dev/null; then
            MISSING="$MISSING $pattern"
        fi
    done
    if [[ -z "$MISSING" ]]; then
        log_pass ".gitignore covers data.json, uploads/, .env, node_modules"
    else
        log_warn ".gitignore may be missing:$MISSING"
    fi
else
    log_warn "No .gitignore file found"
fi

# ─────────────────────────────────────────────────────────────────────────────
# SUMMARY
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}  TEST SUMMARY${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  ${GREEN}Passed:   $PASS${NC}"
echo -e "  ${YELLOW}Warnings: $WARN${NC}"
echo -e "  ${RED}Failed:   $FAIL${NC}"
TOTAL=$((PASS + WARN + FAIL))
echo -e "  Total:    $TOTAL"
echo -e ""
echo -e "  Results saved to: tests/results/"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [[ $FAIL -gt 0 ]]; then
    exit 1
else
    exit 0
fi
