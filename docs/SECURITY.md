# Security Strategy

```
Akingbade Omosebi | Berlin, DE | Cloud Platform Engineer | DevSecOps Engineer
```

**Last Updated:** January 2026

---

## Overview

I implemented a defense-in-depth security strategy with multiple layers of protection. Security is integrated at every stage of the development lifecycle, not added as an afterthought.

---

## Security Philosophy

My approach prioritizes:

1. **Fail Fast** - Detect issues early in the pipeline
2. **Multiple Validators** - Use different tools to catch different vulnerabilities
3. **Supply Chain Security** - Sign and verify all artifacts
4. **Transparency** - Generate SBOMs for all dependencies
5. **Least Privilege** - Grant only required permissions

---

## Security Layers

### Layer 1: Code Security

**Tools:**
- ESLint with security-focused rules
- SonarCloud for deep static analysis

**What I Detect:**
- SQL injection patterns
- XSS vulnerabilities
- Unsafe regex
- Code quality issues
- Security hotspots

**Configuration:**
- `akings-coffee-app/frontend/.eslintrc.json`
- `akings-coffee-app/backend/.eslintrc.json`
- `sonar-project.properties`

---

### Layer 2: Secret Detection

**Tool:** Gitleaks

**What I Detect:**
- AWS credentials
- GitHub tokens
- API keys
- Private keys
- Database passwords

**Configuration:** `.gitleaks.toml`

**Allowlist Strategy:**

I explicitly allowlist demo passwords:
- postgres123 (Docker Compose demo)
- brew2026 (sample customer)
- coffee123 (sample customer)

These are safe because they only work in local development.

---

### Layer 3: Dependency Security

I use dual dependency scanning for comprehensive coverage.

#### Primary: OWASP Dependency Check

**Why OWASP:**
- Open-source and vendor-neutral
- NVD (National Vulnerability Database) integration
- GDPR-compliant (local scanning)
- Preferred by German enterprises
- Government-backed vulnerability data

**Configuration:** `dependency-check-suppressions.xml`

**Performance:**
- Database caching reduces scan time by 85%
- First run: ~15 minutes
- Cached runs: ~2-3 minutes

**Threshold:** CVSS >= 7.0 (High severity)

---

#### Secondary: Snyk

**Why Snyk:**
- Proprietary vulnerability database
- Faster CVE updates (hours vs days)
- Better developer UX
- License compliance checking
- Fix recommendations

**Configuration:** `.snyk`

**Mode:** Advisory (continue-on-error: true)

**Why Both:**

Different scanners have different strengths:

| Aspect | OWASP | Snyk |
|--------|-------|------|
| Data Source | NVD (government) | Proprietary + NVD |
| Update Speed | Daily | Hourly |
| Coverage | Broad (all CVEs) | Deep (curated) |
| Privacy | Local scan | Cloud-based |
| License Check | No | Yes |

Using both provides validation across independent sources.

---

### Layer 4: Container Security

**Tool:** Trivy

**What I Scan:**
- OS package vulnerabilities
- Application dependencies
- Misconfigurations
- Secrets in images
- License compliance

**Threshold:** CRITICAL, HIGH severity

**Why Trivy Before SBOM:**

I run Trivy before generating SBOMs to fail fast. If critical vulnerabilities exist, I don't waste time documenting a flawed image.

---

### Layer 5: Supply Chain Security

#### Image Signing (Cosign)

**Purpose:** Prove image authenticity and prevent tampering

**Method:** Keyless signing with Sigstore

I use GitHub OIDC for signing:

**Benefits:**
- No private key management
- GitHub identity verification
- Transparency log (Rekor)
- SLSA Level 3 compliance

**Verification:**
```bash
cosign verify \
  --certificate-identity-regexp "https://github.com/AkingbadeOmosebi/brewsecops/.*" \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
  ghcr.io/akingbadeomosebi/brewsecops-frontend:latest
```

---

#### Software Bill of Materials (SBOM)

**Purpose:** Transparency into all software components

**Tool:** Syft (by Anchore)

**Format:** SPDX JSON

**Contents:**
- All packages (npm, OS packages)
- Package versions
- Licenses (MIT, Apache, GPL, etc.)
- Package URLs (PURL format)
- File locations

**Example:**
```json
{
  "name": "express",
  "version": "4.18.2",
  "type": "npm",
  "purl": "pkg:npm/express@4.18.2",
  "licenses": ["MIT"]
}
```

**Attachment:**

I attach SBOMs to signed images using Cosign:
```bash
cosign attach sbom --sbom frontend-sbom.spdx.json \
  ghcr.io/akingbadeomosebi/brewsecops-frontend:2.1.0
```

**Use Cases:**
- Compliance audits
- License verification
- Vulnerability tracking
- Supply chain transparency

---

## Security Pipeline Flow

```
Code Commit
    ↓
Gitleaks (secrets)          → BLOCK if found
    ↓
ESLint (code quality)       → WARN
    ↓
SonarCloud (analysis)       → WARN
    ↓
OWASP (dependencies)        → BLOCK on CVSS >= 7
    ↓
Snyk (validation)           → WARN only
    ↓
Docker Build
    ↓
Trivy (containers)          → BLOCK on CRITICAL/HIGH
    ↓
SBOM Generation             → Document dependencies
    ↓
Cosign Signing              → Cryptographic proof
    ↓
Registry Push               → Signed + SBOM attached
```

---

## Dual Scanner Strategy

### Why Two Dependency Scanners?

I implemented both OWASP and Snyk for defense in depth:

**Coverage Comparison:**
- OWASP might catch CVE-2024-12345
- Snyk might catch CVE-2024-67890
- Together: Comprehensive protection

**Decision Matrix:**

OWASP (Primary):
- Fails pipeline on CVSS >= 7.0
- NVD-backed data
- Local scanning (GDPR)

Snyk (Secondary):
- Advisory only (doesn't block)
- Faster updates
- License compliance

**German Enterprise Alignment:**

German companies prefer:
- Open-source tools (OWASP)
- Data sovereignty (local scanning)
- Government-backed data (NVD)

This dual approach demonstrates understanding of German market requirements.

---

## Container Optimization

I use multi-stage Docker builds for security and performance:

**Frontend:**
```dockerfile
# Stage 1: Build (1.2GB)
FROM node:20-alpine AS builder
# Build application

# Stage 2: Production (50MB)
FROM nginx:alpine
# Copy only built assets
```

**Benefits:**
- 96% size reduction
- No build tools in production
- No source code in production
- Smaller attack surface

**Backend:**
```dockerfile
# Production stage runs as non-root user
USER nodejs
```

**Security Features:**
- Non-root execution
- Minimal attack surface
- Only runtime dependencies
- Explicit port exposure

---

## Security Monitoring

### GitHub Security Tab

All findings tracked at: **Repository → Security → Code scanning alerts**

**Sources:**
- Trivy (container vulnerabilities)
- OWASP Dependency Check
- Snyk
- SonarCloud

### Metrics Tracked

- Vulnerability count by severity
- Mean time to remediation
- Scan coverage percentage
- License compliance status

---

## Compliance Considerations

### GDPR Compliance

**Data Protection:**
- OWASP scans run locally (no data leaves pipeline)
- Snyk data processing disclosed
- No PII in commits (Gitleaks enforced)

### Open Source Preference

**Tools Used:**
- OWASP Dependency Check (open-source)
- Trivy (open-source)
- Gitleaks (open-source)
- Cosign (Sigstore, open-source)

### Government Standards

**Alignment:**
- NVD vulnerability database (NIST)
- SBOM compliance (NIST guidelines)
- SLSA Level 3 (supply chain security)

---

## Incident Response

If vulnerability is found:

1. **Detection** - Automated alert from scanner
2. **Triage** - Check OWASP + Trivy reports
3. **Assessment** - CVSS score + exploitability
4. **Remediation** - Update dependency or patch
5. **Verification** - Re-run scans
6. **Release** - Semantic release with fix: commit
7. **Deploy** - Manual approval with review

---

## Least Privilege Implementation

### Pipeline Permissions

I configure minimal permissions per job:

**Security Scanning:**
```yaml
permissions:
  contents: read
  security-events: write
```

**Deployment:**
```yaml
permissions:
  contents: read
  packages: write
  id-token: write
  issues: write
```

### Container Permissions

**Backend runs as non-root:**
```dockerfile
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs
```

---

## Future Enhancements

### Planned Security Improvements

1. **Remove continue-on-error flags**
   - Make all scans blocking
   - Achieve 100% green pipeline

2. **Automated CVE remediation**
   - Dependabot auto-fix PRs
   - Automated testing
   - Auto-merge safe updates

3. **Runtime security**
   - AWS WAF rules
   - Runtime application self-protection (RASP)
   - Container runtime scanning

4. **Advanced monitoring**
   - CloudWatch security metrics
   - Anomaly detection
   - Automated alerting

---

## Security Best Practices

### Never Commit

- API keys, tokens
- Cloud credentials
- Private keys
- Production passwords
- Customer data

### Always

- Use environment variables
- Implement input validation
- Use parameterized queries
- Run as non-root user
- Sign all artifacts
- Generate SBOMs

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [NIST SBOM](https://www.nist.gov/itl/executive-order-improving-nations-cybersecurity/software-security-supply-chains)
- [SLSA Framework](https://slsa.dev/)
- [Sigstore Documentation](https://docs.sigstore.dev/)

---

```
Akingbade Omosebi | Berlin, DE | Cloud Platform Engineer | DevSecOps Engineer
Document Version: 1.0 | Last Updated: January 2026
```
