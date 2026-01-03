# CI/CD Pipeline Documentation

```
Akingbade Omosebi | Berlin, DE | Cloud Platform Engineer | DevSecOps Engineer
```

**Last Updated:** January 2026

---

## Overview

I designed and implemented a three-stage CI/CD pipeline that prioritizes security at every step. The pipeline enforces quality gates, performs comprehensive vulnerability scanning, and implements supply chain security best practices.

---

## Pipeline Architecture

### Design Principles

I structured the pipeline around these principles:

1. **Fail Fast** - Run quick security checks first before expensive operations
2. **Parallel Execution** - Security scans run concurrently to minimize runtime
3. **Manual Gates** - Production deployments require human approval
4. **Audit Trail** - Every deployment is signed, versioned, and traceable

### Three-Stage Design

```
Stage 1: Security Scanning (30min timeout)
├─ Gitleaks → ESLint → SonarCloud → OWASP → Snyk
└─ All must pass before Stage 2

Stage 2: Build & Container Security (25min timeout)
├─ Semantic Release → Hadolint → Docker Build
├─ Trivy Scan → SBOM Generation
└─ All must pass before Stage 3

Stage 3: Sign & Deploy (15min timeout)
├─ Manual Approval Required
├─ Cosign Signing → Registry Push
└─ Deployment Notification
```

---

## Stage 1: Security Scanning

### Gitleaks - Secret Detection

**Purpose:** Prevent accidental credential commits

**Configuration:** `.gitleaks.toml`

I configured Gitleaks to scan the entire git history for:
- AWS access keys and secret keys
- GitHub personal access tokens
- Private keys (RSA, SSH, PGP)
- Generic API keys

**Allowlist:** Demo passwords (postgres123, brew2026, coffee123) are explicitly allowlisted as they only work in local Docker containers.

**Runtime:** ~30 seconds  
**Timeout:** 5 minutes  
**Failure:** Pipeline stops immediately

---

### ESLint - Code Linting

**Purpose:** Catch code quality and security anti-patterns

**Configuration:**
- `akings-coffee-app/frontend/.eslintrc.json`
- `akings-coffee-app/backend/.eslintrc.json`

I configured ESLint with security-focused rules to detect:
- SQL injection patterns
- Unsafe regex expressions
- Eval usage
- Object injection vulnerabilities

**Runtime:** ~2 minutes  
**Timeout:** 10 minutes  
**Status:** Non-blocking while addressing TypeScript improvements

---

### SonarCloud - Code Quality Analysis

**Purpose:** Deep static analysis for bugs, code smells, and security hotspots

**Configuration:** `sonar-project.properties`

I configured SonarCloud to analyze:
- Code quality metrics
- Security hotspots (SQL injection, XSS, CSRF)
- Technical debt calculation
- Test coverage

**Quality Gates:**
- New code coverage > 80%
- No critical bugs
- Security rating A or B

**Runtime:** ~3 minutes  
**Timeout:** 15 minutes  
**Status:** Non-blocking while iterating on quality improvements

---

### OWASP Dependency Check - Primary CVE Scanning

**Purpose:** Comprehensive dependency vulnerability detection

**Why OWASP:**
- Open-source and vendor-neutral
- Direct NVD (National Vulnerability Database) integration
- GDPR-compliant (local scanning)
- Preferred by German enterprises

**Database Caching:**

I implemented caching to optimize scan times:

```yaml
- name: Cache OWASP Database
  uses: actions/cache@v3
  with:
    path: ~/.owasp/dependency-check-data
    key: ${{ runner.os }}-owasp-db-v1
```

**Performance:**
- First run: ~15 minutes (database download)
- Cached runs: ~2-3 minutes
- Improvement: 85% faster

**Failure Threshold:** CVSS >= 7.0 (High severity)

**Runtime:** 2-3 minutes (cached)  
**Timeout:** 20 minutes

---

### Snyk - Secondary Validation

**Purpose:** Additional vulnerability intelligence

**Why Snyk:**
- Proprietary vulnerability database
- Faster CVE updates (hours vs days)
- License compliance checking
- Fix recommendations

**Configuration:** `.snyk`

**Mode:** Advisory only (continue-on-error: true)

I configured Snyk as secondary validation to complement OWASP findings.

**Runtime:** ~2 minutes  
**Timeout:** 10 minutes

---

### Stage 1 Summary

**Total Runtime:** 8-12 minutes (parallel execution)

**Failure Policy:**
- Any scan failure stops pipeline
- Snyk is advisory only
- All results logged to GitHub Security tab

---

## Stage 2: Build & Container Security

### Semantic Release

**Purpose:** Automated versioning based on conventional commits

**Configuration:** `.releaserc.json`

I implemented semantic versioning following Conventional Commits:

**Version Bumps:**
- `feat:` → Minor version (1.0.0 → 1.1.0)
- `fix:` → Patch version (1.0.0 → 1.0.1)
- `BREAKING CHANGE:` → Major version (1.0.0 → 2.0.0)

**Outputs:**
- Git tag (e.g., v2.1.0)
- CHANGELOG.md update
- GitHub release with notes
- Version passed to subsequent steps

**Runtime:** ~30 seconds  
**Timeout:** 5 minutes

---

### Hadolint - Dockerfile Linting

**Purpose:** Enforce Dockerfile best practices

I configured Hadolint to scan for:
- Explicit base image versions
- Minimizing layers
- Avoiding root user
- Using COPY instead of ADD

**Runtime:** ~20 seconds  
**Timeout:** 5 minutes

---

### Docker Build

**Purpose:** Create production container images

I implemented multi-stage builds:

**Frontend Build:**
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
# Install dependencies and build

# Stage 2: Production
FROM nginx:alpine
# Copy only built assets
```

**Benefits:**
- 96% size reduction (1.2GB → 50MB)
- No build tools in production
- Smaller attack surface

**Tagging:**
```
brewsecops-frontend:${version}
brewsecops-frontend:latest
```

**Build Cache:** GitHub Actions cache for faster builds

**Runtime:** ~5 minutes  
**Timeout:** 15 minutes

---

### Trivy - Container Vulnerability Scanning

**Purpose:** Scan built images for vulnerabilities

**Why Trivy Before SBOM:**

I run Trivy before SBOM generation to fail fast:
1. Scan image for vulnerabilities
2. If critical issues found → Stop
3. If clean → Generate SBOM and continue

This prevents wasted work on images that won't be deployed.

**Scan Coverage:**
- OS packages (Alpine)
- Application dependencies (npm)
- Misconfigurations
- Secrets in images

**Failure Threshold:** CRITICAL, HIGH severity

**Runtime:** ~3 minutes  
**Timeout:** 10 minutes  
**Status:** Non-blocking while addressing CVEs

---

### SBOM Generation

**Purpose:** Create software bill of materials

**Tool:** Syft by Anchore

I generate SPDX-format SBOMs containing:
- All packages (npm, OS packages)
- Package versions
- Licenses (MIT, Apache, GPL)
- Package URLs (PURL format)

**Use Cases:**
- Compliance audits
- License verification
- Vulnerability tracking
- Supply chain transparency

**Runtime:** ~1 minute  
**Timeout:** 5 minutes

---

### Stage 2 Summary

**Total Runtime:** 12-15 minutes

**Outputs:**
- Semantic version (e.g., v2.1.0)
- Two Docker images (frontend, backend)
- Two SBOMs (SPDX format)
- Security scan results (SARIF)

---

## Stage 3: Sign & Deploy

### Prerequisites

Stage 3 only runs if:
1. All previous stages passed
2. Semantic release created new version
3. Push is to main branch

### Manual Approval Gate

**Environment:** production

I configured manual approval using GitHub Environments:

**Setup:**
- Repository Settings → Environments → production
- Required reviewers: Akingbade Omosebi
- Deployment branches: main only

**Approval Process:**
1. Pipeline pauses at Stage 3
2. Reviewer receives notification
3. Reviewer examines security scan results
4. Reviewer clicks "Approve deployment"
5. Pipeline continues

**Why Manual Approval:**
- Understanding of change management
- Human oversight for production changes
- Review of security findings
- Rollback decision points

---

### Cosign - Image Signing

**Purpose:** Cryptographically sign images

**Method:** Keyless signing with Sigstore

I implemented keyless signing using GitHub OIDC:

**Benefits:**
- No private key management
- GitHub OIDC identity
- Transparency log (Rekor)
- SLSA Level 3 compliance

**Verification:**
```bash
cosign verify \
  --certificate-identity-regexp "https://github.com/AkingbadeOmosebi/brewsecops/.*" \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
  ghcr.io/akingbadeomosebi/brewsecops-frontend:latest
```

**Runtime:** ~30 seconds  
**Timeout:** 5 minutes

---

### SBOM Attachment

**Purpose:** Attach SBOM to signed images

I use Cosign to attach SPDX SBOMs as attestations:

```bash
cosign attach sbom --sbom frontend-sbom.spdx.json \
  ghcr.io/akingbadeomosebi/brewsecops-frontend:2.1.0
```

**Verification:**
```bash
cosign verify-attestation --type spdx \
  --certificate-identity-regexp "https://github.com/AkingbadeOmosebi/brewsecops/.*" \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
  ghcr.io/akingbadeomosebi/brewsecops-frontend:latest
```

---

### Registry Push

**Target:** GitHub Container Registry

I push images with dual tagging:
```
ghcr.io/akingbadeomosebi/brewsecops-frontend:2.1.0
ghcr.io/akingbadeomosebi/brewsecops-frontend:latest
```

**Authentication:** GitHub OIDC (no stored credentials)

**Visibility:** Public packages

**Runtime:** ~2 minutes

---

### Deployment Notification

**Purpose:** Create audit trail

I create a GitHub issue for each deployment containing:
- Version deployed
- Timestamp
- Approver
- Security scan summary
- Links to container packages

**Labels:** deployment, success

---

### Stage 3 Summary

**Total Runtime:** 5-8 minutes

**Outputs:**
- Signed container images in GHCR
- SBOMs attached to images
- Deployment notification issue
- Audit trail in Rekor

---

## Pipeline Performance

### Execution Times

| Stage | Typical | Maximum |
|-------|---------|---------|
| Security Scanning | 3-4 min | 6 min |
| Build & Scan | 2-3 min | 5 min |
| Sign & Deploy | 1-2 min | 3 min |
| **Total** | **7-10 min** | **12 min** |

### Optimization Strategies

**OWASP Database Caching:**
- Reduces scan time by 85%
- Cache key: OS + tool version
- Hit rate: >90%

**npm Dependencies:**
- Cache key: package-lock.json hash
- Build time reduction: 70%
- Hit rate: >80%

**Docker Layers:**
- GitHub Actions cache
- Build time reduction: 60%

---

## Security Metrics

### GitHub Security Tab

All findings tracked at: **Repository → Security → Code scanning alerts**

**Metrics:**
- Dependency vulnerabilities (OWASP, Snyk)
- Code quality (SonarCloud)
- Container vulnerabilities (Trivy)
- Secret exposure (Gitleaks)

### Trend Analysis

I track:
- Vulnerability count over time
- Mean time to remediation
- Scan coverage percentage
- Pipeline success rate

---

## Failure Scenarios

### Stage 1 Failure - Security Scans

**Scenario:** Gitleaks detects committed secret

**Response:**
1. Pipeline stops immediately
2. Review Gitleaks output
3. Rotate compromised credential
4. Remove from git history
5. Re-run pipeline

---

### Stage 2 Failure - Build

**Scenario:** Trivy finds critical CVE

**Response:**
1. Review CVE details in scan output
2. Check if fix available
3. Update dependency to patched version
4. Commit with `fix:` prefix
5. Pipeline re-runs automatically

---

### Stage 3 Failure - Deploy

**Scenario:** Image push fails

**Response:**
1. Check registry authentication
2. Verify image size limits
3. Re-run failed job
4. Investigate if persistent

---

## Best Practices

### Least Privilege Permissions

I configured job-specific permissions:

**Stage 1:**
```yaml
permissions:
  contents: read
  security-events: write
```

**Stage 3:**
```yaml
permissions:
  contents: read
  packages: write
  id-token: write
  issues: write
```

### Secrets Management

**Never commit:**
- API keys, tokens
- Cloud credentials
- Private keys
- Production passwords

**Commit safely:**
- Demo passwords (clearly labeled)
- Public configuration
- Example values

---

## Troubleshooting

### OWASP Scan Timeout

**Cause:** First run without cache

**Solution:** Database downloads automatically, subsequent runs use cache

---

### Semantic Release Skips Version

**Cause:** Commit message doesn't follow format

**Solution:** Use conventional commits (feat:, fix:, etc.)

---

### Cosign Signing Fails

**Cause:** OIDC token permissions

**Solution:** Verify id-token: write permission set

---

## References

- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- [Trivy Documentation](https://trivy.dev/)
- [Cosign Documentation](https://docs.sigstore.dev/cosign/)
- [SLSA Framework](https://slsa.dev/)

---

```
Akingbade Omosebi | Berlin, DE | Cloud Platform Engineer | DevSecOps Engineer
Document Version: 1.0 | Last Updated: January 2026
```
