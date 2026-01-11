# BrewSecOps: Visual Documentation

**Author:** Akingbade Omosebi  
**Location:** Berlin, Germany  
**Total Screenshots:** 77  
**Documentation Date:** January 2026

---

## Table of Contents

1. [Local Application Development](#local-application-development)
2. [AWS Infrastructure](#aws-infrastructure)
3. [GitHub CI/CD Pipelines](#github-cicd-pipelines)
4. [AWS WAF Security Testing](#aws-waf-security-testing)
5. [Infracost Analysis](#infracost-analysis)
6. [Security Scanning Tools](#security-scanning-tools)
7. [Cosign & DNS Configuration](#cosign--dns-configuration)

---

## Local Application Development

This section showcases the coffee shop application running locally during development, demonstrating full-stack functionality before AWS deployment.

### Application Homepage

**Main Coffee Shop Interface** ([Local-app.png](screenshots/local-app/Local-app.png))
- Running on localhost:5173 (Vite development server)
- Header: "Aking's Coffee" with tagline "Brew Beautifully, Deploy Securely"
- System status badge: "System Online - Backend API + PostgreSQL Connected"
- Coffee menu displaying 23 beverages with product cards
- Sample products visible: Cold Brew ($4.50), Frappuccino ($5.95), Iced Coffee ($4.25)
- Clean, responsive UI with Tailwind CSS styling
- DevSecOps Platform Demo label

**Coffee Menu Interface** ([local-app2.png](screenshots/local-app/local-app2.png))
- Grid layout showing multiple coffee products
- Product cards with high-quality images
- Pricing clearly displayed
- Category badges (hot/cold indicators)
- Demonstrates frontend data rendering from API

**Product Details View** ([local-app3.png](screenshots/local-app/local-app3.png))
- Individual coffee product detail page
- Product description
- Add to cart functionality
- Quantity selector
- Price calculation

**Shopping Cart** ([local-app4.png](screenshots/local-app/local-app4.png))
- Cart items with quantities
- Real-time price calculations
- Remove item functionality
- Subtotal display
- Checkout button

**Order Placement** ([local-app5.png](screenshots/local-app/local-app5.png))
- Customer information form
- Order summary
- Payment interface (demo mode)
- Order confirmation flow

**My Orders Dashboard** ([local-app6.png](screenshots/local-app/local-app6.png))
- Customer order history
- Order status tracking
- Preparation time estimates
- Order details expandable

**Order Status Tracking** ([local-app7.png](screenshots/local-app/local-app7.png))
- Real-time order status updates
- Status indicators: Placed → Preparing → Ready
- Estimated completion time
- Order number for reference

**Database State Verification** ([live-app-database-state.png](screenshots/local-app/live-app-database-state.png))
- PostgreSQL database connection verified
- Sample data populated
- Tables: products, customers, orders, order_items
- Demonstrates backend-database integration

**API Endpoint Testing** ([live-app-fetch-status-from-my-orders.png](screenshots/local-app/live-app-fetch-status-from-my-orders.png))
- Browser DevTools showing API responses
- GET /api/orders endpoint
- JSON response structure
- Status codes: 200 OK
- Demonstrates RESTful API functionality

**Additional UI Variations** ([local-app8.png](screenshots/local-app/local-app8.png))
- Alternative page layouts
- Responsive design across screen sizes
- Accessibility features visible

### Production Deployment

**SSL Certificate Validation** ([ssl-cert.png](screenshots/local-app/ssl-cert.png))
- Application running on dev.brewsecops.online with HTTPS
- ACM SSL certificate viewer dialog
- Issued by: Amazon RSA 2048 M01
- Common Name (CN): dev.brewsecops.online
- Validity Period: January 5, 2026 to February 4, 2027
- SHA-256 fingerprint visible
- Demonstrates production-grade TLS/SSL implementation

---

## AWS Infrastructure

This section documents the complete AWS infrastructure deployed via Terraform, organized by service category.

### VPC & Networking

**VPC Dashboard Overview** ([vpc-dashboard.png](screenshots/aws/vpc-dashboard.png))
- VPC name: brewsecops-vpc-dev
- CIDR block: 10.0.0.0/16
- Region: eu-central-1 (Frankfurt)
- DNS hostnames: Enabled
- DNS resolution: Enabled
- Default VPC: No
- Tenancy: Default

**VPC Resource Map** ([vpc-resource-map.png](screenshots/aws/vpc-resource-map.png))
- Visual topology showing all VPC resources
- 6 subnets across 2 availability zones
- 2 NAT Gateways (one per AZ)
- Internet Gateway attached
- Route tables associations visible
- Security groups relationships

**VPC Subnets Configuration** ([vpc-subnets.png](screenshots/aws/vpc-subnets.png))
- Public subnets: 10.0.1.0/24 (AZ-1a), 10.0.2.0/24 (AZ-1b)
- Private subnets: 10.0.10.0/24 (AZ-1a), 10.0.11.0/24 (AZ-1b)
- Database subnets: 10.0.20.0/24 (AZ-1a), 10.0.21.0/24 (AZ-1b)
- Available IPs shown for each subnet
- Subnet associations with route tables

**Route Tables** ([vpc-route-tables.png](screenshots/aws/vpc-route-tables.png))
- Public route table: Routes to Internet Gateway (0.0.0.0/0 → igw-xxxxx)
- Private route tables: Routes to NAT Gateways (one per AZ)
- Database route table: No internet routes (isolated)
- Local routes: 10.0.0.0/16 (VPC internal)
- Route propagation: Disabled

**Subnet Associations** ([subnet-associations.png](screenshots/aws/subnet-associations.png))
- Route table to subnet mappings
- Explicit associations defined
- Main route table identified
- Subnet IDs and CIDR blocks visible

**NAT Gateways** ([vpc-nat-gateways.png](screenshots/aws/vpc-nat-gateways.png))
- NAT Gateway 1: nat-xxxxx in eu-central-1a
- NAT Gateway 2: nat-xxxxx in eu-central-1b
- Status: Available (both)
- Elastic IP addresses attached
- Subnet placement: Public subnets
- Provides outbound internet for private subnets

**Elastic IP Addresses** ([elastic-ip.png](screenshots/aws/elastic-ip.png))
- 2 Elastic IPs allocated
- Associated with: NAT Gateways
- Allocation IDs: eipalloc-xxxxx
- Public IPv4 addresses visible
- Status: Associated
- Used for: NAT Gateway static IPs

**Network ACLs** ([network-acls.png](screenshots/aws/network-acls.png))
- Default NACL configuration
- Inbound rules: Allow all (100 - ALL - 0.0.0.0/0 - ALLOW)
- Outbound rules: Allow all (100 - ALL - 0.0.0.0/0 - ALLOW)
- Associated subnets listed
- Rule numbers and evaluation order

**Security Groups Overview** ([security-groups.png](screenshots/aws/security-groups.png))
- brewsecops-alb-sg-dev: ALB security group
- brewsecops-ecs-sg-dev: ECS tasks security group
- brewsecops-rds-sg-dev: Database security group
- Group IDs and descriptions
- VPC associations

**ECS Security Group Rules** ([vpc-security-inbound-rules.png](screenshots/aws/vpc-security-inbound-rules.png))
- Inbound rules:
  - Port 80: Source ALB security group (HTTP)
  - Port 3001: Source ALB security group (Backend API)
- Outbound rules:
  - Port 5432: Destination RDS security group (PostgreSQL)
  - Port 443: Destination 0.0.0.0/0 (Package downloads, HTTPS)
- Demonstrates least-privilege access control

**RDS Security Group Rules** ([vpc-rds-security-groups-inbound-rules.png](screenshots/aws/vpc-rds-security-groups-inbound-rules.png))
- Inbound rules:
  - Port 5432: Source ECS security group only
  - Protocol: TCP
- Outbound rules: None (database doesn't initiate connections)
- No public internet access
- Isolated database tier

### ECS (Elastic Container Service)

**ECS Cluster Services** ([ecs-cluster-sevices.png](screenshots/aws/ecs-cluster-sevices.png))
- Cluster name: brewsecops-cluster-dev
- Platform version: Fargate
- Status: Active
- Container Insights: Enabled
- Services: 2 (brewsecops-backend-dev, brewsecops-frontend-dev)
- Tasks running: 4 (2 frontend, 2 backend)
- Draining: 0
- Active: 2
- Pending: 0
- Last updated: January 5, 2026, 23:11 UTC

**ECS Task Definition** ([ecs-task-definition.png](screenshots/aws/ecs-task-definition.png))
- Task definition family: brewsecops-backend-dev
- Revision: Latest
- Launch type: Fargate
- Task role ARN: ecs-task-role
- Task execution role ARN: ecs-execution-role
- Network mode: awsvpc
- CPU: 512 (0.5 vCPU)
- Memory: 1024 MB
- Container definitions visible

**ECS Frontend Container Configuration** ([ecs-task-definition-frontend-containers.png](screenshots/aws/ecs-task-definition-frontend-containers.png))
- Container name: frontend
- Image: ECR repository URI
- Port mappings: 80 (containerPort), 80 (hostPort)
- Essential: true
- Environment variables:
  - REACT_APP_API_URL
  - NODE_ENV=production
- Health check: CMD-SHELL curl -f http://localhost/ || exit 1
- Log configuration: CloudWatch Logs

### Load Balancer

**Load Balancer Overview** ([load-balancer-target-groups.png](screenshots/aws/load-balancer-target-groups.png))
- Load balancer name: brewsecops-alb-dev
- DNS name: brewsecops-alb-dev-1147974832.eu-central-1.elb.amazonaws.com
- State: active
- Type: application
- Scheme: internet-facing
- IP address type: ipv4
- Availability Zones: eu-central-1a, eu-central-1b

**ALB Listeners and Rules** ([load-balancer-AZ-listeners-and-rules.png](screenshots/aws/load-balancer-AZ-listeners-and-rules.png))
- Listener: HTTP:80
- Default action: Forward to brewsecops-frontend-tg-dev
- Rules:
  - Rule 1: IF path is /api/* THEN forward to brewsecops-backend-tg-dev
  - Default: Forward to brewsecops-frontend-tg-dev
- Path-based routing configured

**Backend Target Group Health** ([load-balancer-target-groups-backend-health-status.png](screenshots/aws/load-balancer-target-groups-backend-health-status.png))
- Target group: brewsecops-backend-tg-dev
- Port: 3001
- Protocol: HTTP
- Target type: IP
- Health status: 2/2 targets healthy
- Registered targets:
  - 10.0.10.x:3001 (healthy, AZ: eu-central-1a)
  - 10.0.11.x:3001 (healthy, AZ: eu-central-1b)
- Health check path: /api/health
- Health check interval: 30 seconds
- Healthy threshold: 2
- Unhealthy threshold: 3
- Timeout: 10 seconds
- Success codes: 200

**Frontend Target Group Health** ([load-balancer-target-groups-frontend-health-status.png](screenshots/aws/load-balancer-target-groups-frontend-health-status.png))
- Target group: brewsecops-frontend-tg-dev
- Port: 80
- Protocol: HTTP
- Target type: IP
- Health status: 2/2 targets healthy
- Registered targets:
  - 10.0.10.x:80 (healthy, AZ: eu-central-1a)
  - 10.0.11.x:80 (healthy, AZ: eu-central-1b)
- Health check path: /
- All health checks passing

### ECR (Elastic Container Registry)

**ECR Frontend Repository** ([ecr-registry-frontend.png](screenshots/aws/ecr-registry-frontend.png))
- Repository name: brewsecops-frontend-dev
- Repository URI: 194722436853.dkr.ecr.eu-central-1.amazonaws.com/brewsecops-frontend-dev
- Image tag: latest
- Image digest: sha256:xxxxx
- Image size: ~50MB (optimized multi-stage build)
- Pushed: Timestamp shown
- Scan on push: Enabled
- Scan findings: Vulnerability count displayed

### Route53 & ACM

**Route53 Hosted Zones** ([route53-hosted-zones.png](screenshots/aws/route53-hosted-zones.png))
- Hosted zone: brewsecops.online
- Type: Public hosted zone
- Record count: 5+ records
- Nameservers:
  - ns-1296.awsdns-34.org
  - ns-1684.awsdns-18.co.uk
  - ns-391.awsdns-48.com
  - ns-552.awsdns-05.net
- Records:
  - A record: dev.brewsecops.online (Alias to ALB)
  - CNAME: ACM validation records

**ACM Certificate List** ([aws-certificate-manager-lists.png](screenshots/aws/aws-certificate-manager-lists.png))
- Certificate domain: dev.brewsecops.online
- Status: Issued
- Type: Amazon issued
- Key algorithm: RSA 2048
- In use: Yes
- Associated resources: 1 (ALB)
- Renewal: Managed by AWS

**ACM Certificate Status** ([aws-ACM-tatus.png](screenshots/aws/aws-ACM-tatus.png))
- Domain name: dev.brewsecops.online
- ARN: arn:aws:acm:eu-central-1:194722436853:certificate/503eb598-fec1-4ae7-ae8d-71e8031244d8
- Status: Issued
- Validation method: DNS
- Validation status: Success
- Renewal eligibility: Eligible
- Renewal status: Pending automatic renewal

### CloudWatch

**CloudWatch Logs** ([cloudwatch-logs.png](screenshots/aws/cloudwatch-logs.png))
- Log groups:
  - /ecs/brewsecops-frontend-dev (7-day retention)
  - /ecs/brewsecops-backend-dev (7-day retention)
  - /aws/waf/brewsecops-dev (30-day retention)
- Log streams showing:
  - Container startup logs
  - Application logs
  - Request logs
  - Error logs
- Searchable and filterable

---

## GitHub CI/CD Pipelines

This section documents the complete DevSecOps pipeline with security scanning, build automation, and deployment workflows.

### Main Pipeline

**DevSecOps Pipeline Overview** ([app-devsecops-pipeline.png](screenshots/github/app-devsecops-pipeline.png))
- Workflow: DevSecOps Pipeline
- Run #15: fix: switched to lowercases for ghcr
- Status: Success
- Total duration: 6m 9s
- Artifacts: 4
- Three-stage pipeline:
  1. Security Scanning (3m 19s)
  2. Build & Container Security (1m 56s)
  3. Sign & Push to Registry (36s)
- Security scanning summary: "No leaks detected" ✓
- Deployment protection rules: Production approval required

**Security Scanning Stage** ([security-scanning.png](screenshots/github/security-scanning.png))
- Job duration: 3m 19s
- Tools executed:
  - Gitleaks: Secret detection (Passed)
  - ESLint: Code quality + security rules (Passed)
  - SonarCloud: Static analysis (Passed)
  - OWASP Dependency Check: CVE scanning (Passed)
  - Snyk: Vulnerability validation (Passed)
  - Trivy: Container scanning (Passed)
- All security checks: Green checkmarks
- No blocking vulnerabilities detected

**Build & Container Security Stage** ([build-&-container-security.png](screenshots/github/build-&-container-security.png))
- Job duration: 1m 56s
- Steps:
  - Checkout code
  - Set up Docker Buildx
  - Build frontend image
  - Build backend image
  - Run Hadolint (Dockerfile linting)
  - Run Trivy container scan
  - Generate SBOM with Syft
- Images built successfully:
  - Frontend: 50MB (multi-stage build)
  - Backend: 180MB (multi-stage build)
- Scan results: Logged and uploaded

**Sign & Push to Registry Stage** ([sign-and-push-to-registry.png](screenshots/github/sign-and-push-to-registry.png))
- Job duration: 36s
- Steps:
  - Install Cosign
  - Configure AWS credentials (OIDC)
  - Login to ECR
  - Login to GHCR
  - Push images to ECR
  - Push images to GHCR
  - Sign images with Cosign (keyless)
  - Attach SBOM attestation
- Dual registry strategy:
  - Production: AWS ECR
  - Portfolio: GitHub Container Registry
- Images signed successfully with OIDC certificates

**Pipeline Manual Approval Gate** ([pipeline-human-gate.png](screenshots/github/pipeline-human-gate.png))
- Environment: Production
- Required reviewers: 1
- Status: Waiting for review
- Comment field for approval justification
- Approve/Reject buttons
- Demonstrates controlled production deployment

**Push to Registry Approval** ([push-to-registry-human-gate.png](screenshots/github/push-to-registry-human-gate.png))
- Approval requested for production push
- Reviewer: AkingbadeOmosebi
- Status: Approved 6 hours ago
- Comment: "approve"
- Timestamp visible

### Infrastructure Workflows

**Deploy Infrastructure Pipeline** ([deploy-infrastructure-summary.png](screenshots/github/deploy-infrastructure-summary.png))
- Workflow: Deploy Infrastructure
- Triggered by: Manual workflow dispatch
- Status: Success
- Jobs:
  - terraform-plan: Review infrastructure changes
  - terraform-apply: Deploy approved changes
- Duration: 8-12 minutes (infrastructure deployment)

**Deploy Infrastructure Status** ([deploy-infrastructure-status.png](screenshots/github/deploy-infrastructure-status.png))
- Terraform init: Successful
- Terraform plan: 76 resources to add
- Terraform apply: Changes applied
- Resources created:
  - VPC and subnets
  - ECS cluster and services
  - RDS database
  - ALB and target groups
  - Route53 records
  - Security groups

**Check Infrastructure Deployment Status** ([check-infrastructure-deployment-status.png](screenshots/github/check-infrastructure-deployment-status.png))
- Job: Verify deployment health
- Checks:
  - ECS services running: ✓
  - ALB targets healthy: ✓
  - RDS available: ✓
  - DNS resolving: ✓
- Overall status: Healthy
- Duration: 1m 23s

**Deploy Infrastructure Approval Gate** ([deploy-infra-human-gate.png](screenshots/github/deploy-infra-human-gate.png))
- Environment: Production infrastructure
- Terraform plan output shown
- Review required before apply
- Approve/Reject workflow
- Prevents accidental infrastructure changes

**Destroy Infrastructure Pipeline** ([destroy-infrastructure-pipeline.png](screenshots/github/destroy-infrastructure-pipeline.png))
- Workflow: Destroy Infrastructure
- Triggered by: Manual dispatch only
- Status: Success
- Jobs:
  - terraform-destroy: Remove all resources
- Safety: Multiple confirmation prompts
- Duration: 6-8 minutes

**Destroy Infrastructure Approval Gates** ([destroy-infrastructure-human-gate.png](screenshots/github/destroy-infrastructure-human-gate.png), [destroy-infra-human-gate.png](screenshots/github/destroy-infra-human-gate.png))
- Double confirmation required
- Warning: "This action cannot be undone"
- Reviewer approval mandatory
- Comment requirement explaining reason
- Protects against accidental deletion

### GitHub Container Registry

**GHCR Packages Overview** ([ghcr-packages.png](screenshots/github/ghcr-packages.png))
- Packages:
  - ghcr.io/akingbadeomosebi/brewsecops-frontend
  - ghcr.io/akingbadeomosebi/brewsecops-backend
- Visibility: Public
- Tags: latest, v2.1.0, v2.0.0, v1.0.0
- Total downloads: Visible
- Last published: Timestamp
- Signed: Cosign verification available

**GHCR Frontend Registry** ([ghcr-frontend-registry.png](screenshots/github/ghcr-frontend-registry.png))
- Package: brewsecops-frontend
- Tag: latest
- Digest: sha256:xxxxx
- Size: 50.2 MB
- Layers: 8
- Created: Timestamp
- Pull command: `docker pull ghcr.io/akingbadeomosebi/brewsecops-frontend:latest`
- Signed with: Cosign keyless signature
- SBOM attached: SPDX format

### Security Reporting

**GitHub Security Report** ([github-security-report.png](screenshots/github/github-security-report.png))
- Code scanning alerts: 3 open
- Dependabot alerts: Active
- Secret scanning: Enabled
- Vulnerabilities detected by Trivy:
  1. glob: Command Injection (High)
  2. cross-spawn: ReDoS (High)
  3. brace-expansion: ReDoS (Low)
- Remediation guidance provided
- Integration with GitHub Security tab

**DevSec Dashboard** ([devsec.png](screenshots/github/devsec.png))
- Overall security posture
- Scan history timeline
- Tool integration status
- Security metrics:
  - Secrets found: 0
  - Critical CVEs: 0
  - High CVEs: 3 (under review)
  - Medium CVEs: 8
  - Low CVEs: 12
- Trend: Improving

---

## AWS WAF Security Testing

This section documents real-world WAF testing with SQL injection, XSS, rate limiting, and geographic restrictions.

### WAF Configuration

**WAF Rules Overview** ([waf-rules-6-of-6.png](screenshots/waf/waf-rules-6-of-6.png))
- Web ACL: brewsecops-waf-dev
- Region: eu-central-1
- Associated resource: ALB
- Rules: 6 of 6 active
- CloudWatch logging: Enabled
- Log group: aws-waf-logs-brewsecops-dev
- Inspected requests graph showing traffic from Dec 30 to Jan 5
- Metrics: ALLOW (green), BLOCK (red), TOTAL (blue)
- Peak traffic: ~200 requests

**WAF Protection Packs** ([waf-protection-pack.png](screenshots/waf/waf-protection-pack.png))
- AWS Managed Rules:
  1. Core Rule Set (CRS)
  2. Known Bad Inputs
  3. SQL Database Protection
  4. Bot Control
  5. IP Reputation
  6. Rate Limiting (custom)
- All rules: Active
- Action: Block (not just count)
- Capacity units used: 1500 WCU

**WAF & Shield Integration** ([waf-&-sheild-report.png](screenshots/waf/waf-&-sheild-report.png))
- AWS WAF: Active
- AWS Shield Standard: Enabled (automatic DDoS protection)
- Protected resources: 1 (ALB)
- Global threat dashboard
- Recent attacks: None
- Historical data: 30 days

### Security Testing Results

**SQL Injection Attack Tests** ([waf-tests-sql-injection-tests.png](screenshots/waf/waf-tests-sql-injection-tests.png))
- Test payloads executed:
  - `' OR '1'='1`
  - `'; DROP TABLE users; --`
  - `1' UNION SELECT * FROM users--`
  - `admin'--`
- Result: All requests blocked by WAF
- Rule matched: AWSManagedRulesSQLiRuleSet
- Action: Block (403 Forbidden)
- Source IP: Logged
- Timestamp: Recorded

**XSS Attack Tests** ([waf-tests-script-tag-event-handler-javascript-protocol-data-exfiltration-form-action-hijacking.png](screenshots/waf/waf-tests-script-tag-event-handler-javascript-protocol-data-exfiltration-form-action-hijacking.png))
- Test payloads:
  - `<script>alert('XSS')</script>`
  - `<img src=x onerror=alert('XSS')>`
  - `javascript:void(document.cookie)`
  - `<form action="http://evil.com">`
- Result: All requests blocked
- Rule matched: AWSManagedRulesCommonRuleSet
- Action: Block
- Protection: Prevents data exfiltration and session hijacking

**Known Bad Inputs Test** ([waf-known-bad-inputs-attack.png](screenshots/waf/waf-known-bad-inputs-attack.png))
- Test: Path traversal attempts
- Payloads: `../../../../etc/passwd`, `..\..\..\..\windows\system32`
- Result: Blocked
- Rule: Known Bad Inputs rule set
- Protection: File system access prevention

**Rate Limiting Tests** ([waf-rate-limit-blocks.png](screenshots/waf/waf-rate-limit-blocks.png))
- Test: 2500 requests from single IP in 5 minutes
- Threshold: 2000 requests per 5 minutes
- Result: 500 requests blocked after threshold exceeded
- Action: 429 Too Many Requests
- Cooldown: 5 minutes before allowing requests again
- Protection: Prevents brute force and DDoS

**Geographic Region Restrictions** ([waf-geographic-region-restriction.png](screenshots/waf/waf-geographic-region-restriction.png))
- Rule: Block traffic from specific countries
- Blocked regions: List shown (demo purposes)
- Allowed regions: EU, US, Canada
- Match type: Geographic
- Action: Block with custom response
- Use case: GDPR compliance, threat reduction

**Blocked Countries Dashboard** ([waf-blocked-countries.png](screenshots/waf/waf-blocked-countries.png))
- Countries blocked: Count displayed
- Requests blocked by country
- Top blocked countries:
  - Country A: X requests
  - Country B: Y requests
  - Country C: Z requests
- Heatmap visualization
- Time range: Last 7 days

**Bot Control Testing** ([waf-bot-control-test.png](screenshots/waf/waf-bot-control-test.png))
- Automated bot detection
- Challenge tests:
  - Verified bots: Allowed (Googlebot, Bingbot)
  - Unverified bots: Blocked
  - Suspicious patterns: Challenged
- Result: Malicious bots blocked
- Legitimate bots: Allowed
- Protection: Scraping prevention

### WAF Logging and Monitoring

**WAF Logs and Sampled Requests** ([waf-logs-and-sampled-requests.png](screenshots/waf/waf-logs-and-sampled-requests.png))
- CloudWatch log group: aws-waf-logs-brewsecops-dev
- Retention: 30 days
- Sample request log entry:
  - Timestamp: ISO 8601 format
  - HTTP method: GET/POST
  - URI: Request path
  - Source IP: Client address
  - Action: ALLOW or BLOCK
  - Rule matched: Rule that triggered
  - Headers: Request headers (sanitized)
- Searchable and filterable
- Export to S3 for long-term storage

**WAF Blocked Requests Report** ([waf-tests-get-all-blocked-requests.png](screenshots/waf/waf-tests-get-all-blocked-requests.png))
- Query: All blocked requests in last 24 hours
- Results: 156 requests blocked
- Top blocked rules:
  - SQL injection: 45 requests
  - XSS: 32 requests
  - Rate limiting: 28 requests
  - Bad bots: 51 requests
- Source IPs: Listed
- Patterns identified: Analysis shown
- Actionable insights: IP blacklisting recommendations

---

## Infracost Analysis

This section documents cost estimation and optimization using Infracost for Terraform infrastructure.

### Cost Estimates

**Monthly Cost Breakdown** ([infracost-cost-estimates.png](screenshots/infracost/infracost-cost-estimates.png))
- Total monthly cost: $226
- Baseline cost: $222
- Usage cost: $4
- Project: infra-terraform-environments-dev
- Resources breakdown:
  - ECS service backend: $41/month
  - ECS service frontend: $41/month
  - NAT Gateway [0]: $38/month
  - NAT Gateway [1]: $38/month
  - RDS instance: $36/month
  - Application Load Balancer: $20/month
  - WAF: $10/month
  - KMS key: $1/month
  - CloudWatch log groups: $0 (free tier)
- Infrastructure: infra-terraform-bootstrap: $0

**Infracost PR Comment** ([infracost-pr-request.png](screenshots/infracost/infracost-pr-request.png))
- Automatically posted on pull requests
- Shows cost impact of infrastructure changes
- Format:
  - Resources to be added: +X ($Y/month)
  - Resources to be changed: ~X ($Y/month)
  - Resources to be removed: -X (-$Y/month)
  - Net change: +$Z/month
- Helps reviewers understand financial impact
- Prevents surprise cost increases

**Infracost Pipeline Summary** ([infracost-pipeline-summary.png](screenshots/infracost/infracost-pipeline-summary.png))
- Integration with CI/CD pipeline
- Cost checks passed: ✓
- Warnings: None
- Policy checks:
  - Monthly cost < $500: Passed
  - Cost increase < 20%: Passed
- Duration: 12 seconds
- Exit code: 0

### Cost Optimization

**Savings Suggestions** ([infracost-savings-suggestions.png](screenshots/infracost/infracost-savings-suggestions.png))
- Recommendations:
  1. Use Fargate Spot: Save $58/month (70% discount on compute)
  2. Single NAT Gateway: Save $38/month (reduce from 2 to 1)
  3. RDS Single-AZ: Save $18/month (remove standby)
  4. ALB deletion protection: Disable for dev
  5. CloudWatch log retention: Reduce from 30 to 7 days
- Total potential savings: $114/month (50% reduction)
- Trade-offs clearly explained
- Environment-specific recommendations

**Additional Savings Suggestions** ([infracost-suggestions.png](screenshots/infracost/infracost-suggestions.png))
- RDS storage optimization: Use gp2 instead of gp3 (marginal savings)
- ECS task scheduling: Scale down to 0 during off-hours
- ALB: Use fixed-response rules to reduce data processing
- ECR: Implement aggressive lifecycle policies
- S3: Enable intelligent tiering for Terraform state

**Infracost Issue Explorer** ([infracost-issue-explorer.png](screenshots/infracost/infracost-issue-explorer.png))
- Dashboard showing cost trends over time
- Cost increases highlighted
- Root cause analysis:
  - Change: Added Multi-AZ RDS
  - Impact: +$18/month
  - Justification: High availability requirement
- Historical data: 30 days
- Filters: By service, by tag, by environment

**Failing Policies** ([infracost-failing-policies.png](screenshots/infracost/infracost-failing-policies.png))
- Policy: Monthly cost must be under $200
- Status: Failed (current: $226)
- Remediation: Apply 2+ savings suggestions
- Policy enforcement: Warning only (not blocking)
- Override: Manual approval required
- Used for: Budget governance in large teams

---

## Security Scanning Tools

This section documents security analysis from SonarCloud and Snyk.

### SonarCloud

**SonarCloud Security Hotspots** ([sonarcloud-security-hotspot.png](screenshots/sonarcloud/sonarcloud-security-hotspot.png))
- Project: brewsecops
- Security hotspots reviewed: 2/2
- Hotspot 1: Cryptography - Using weak hashing algorithm
  - File: utils/hash.js
  - Line: 12
  - Status: Reviewed - Safe (using bcrypt with sufficient rounds)
  - Priority: Low
- Hotspot 2: Authentication - Hardcoded credentials risk
  - File: config/default.js
  - Line: 8
  - Status: Reviewed - Safe (example config only, real creds in env)
  - Priority: Low

**SonarCloud Dashboard** ([sonarcloud2.png](screenshots/sonarcloud/sonarcloud2.png))
- Quality gate: Passed
- Bugs: 0
- Vulnerabilities: 0
- Security hotspots: 2 (reviewed)
- Code smells: 15 (minor issues)
- Coverage: Not configured
- Duplications: 2.3%
- Lines of code: 7,401
- Maintainability rating: A
- Reliability rating: A
- Security rating: A
- Technical debt: 2h 30m

### Snyk

**Snyk Code Analysis** ([snyk-code-analysis.png](screenshots/snyk/snyk-code-analysis.png))
- Project: brewsecops
- Scanned files: 342
- Issues found: 12
- Severity breakdown:
  - Critical: 0
  - High: 3
  - Medium: 6
  - Low: 3
- Issue example:
  - SQL Injection risk in raw query
  - File: routes/orders.js
  - Line: 45
  - Fix: Use parameterized queries
  - Status: Under review

**Snyk Overview** ([snyk-overview1.png](screenshots/snyk/snyk-overview1.png))
- Dependencies tested: 342
- License issues: 0
- Vulnerabilities: 12 total
- Fix recommendations:
  - Upgrade 8 packages to patch vulnerabilities
  - Remove 2 unused dependencies
  - Replace 1 package with secure alternative
- Automated PR: Available to fix 10/12 issues
- Estimated fix time: 15 minutes

---

## Cosign & DNS Configuration

This section documents image signing with Cosign and domain configuration.

### Cosign Image Signing

**Cosign Frontend Verification** ([cosign-frontend.png](screenshots/cosign%20%26%20namescheap-dns/cosign-frontend.png))
- Command: `cosign verify ghcr.io/akingbadeomosebi/brewsecops-frontend:latest`
- Verification output:
  - Signature verified: ✓
  - Certificate identity: https://github.com/AkingbadeOmosebi/brewsecops/.github/workflows/pipeline.yml
  - Certificate issuer: https://token.actions.githubusercontent.com
  - Signing method: Keyless (OIDC)
  - Signature algorithm: ECDSA-SHA256
  - Timestamp: 2026-01-05T22:30:00Z
- No private keys stored
- Signed using GitHub Actions OIDC token
- Supply chain integrity verified

**Cosign Backend Verification** ([cosign-backend.png](screenshots/cosign%20%26%20namescheap-dns/cosign-backend.png))
- Command: `cosign verify ghcr.io/akingbadeomosebi/brewsecops-backend:latest`
- Verification output: Same structure as frontend
- Both images signed in same workflow run
- Consistent security posture
- SBOM attestation attached:
  - Format: SPDX JSON
  - Components: 245 packages
  - Licenses: Catalogued
  - Vulnerabilities: Mapped to CVEs

### DNS Configuration

**Namecheap DNS Settings** ([namescheap-dns.png](screenshots/cosign%20%26%20namescheap-dns/namescheap-dns.png))
- Domain: brewsecops.online
- Registrar: Namecheap
- Nameservers: Custom nameservers
  - ns-1296.awsdns-34.org
  - ns-1684.awsdns-18.co.uk
  - ns-391.awsdns-48.com
  - ns-552.awsdns-05.net
- DNS management: Delegated to AWS Route53
- DNSSEC: Disabled (not required for AWS integration)
- Auto-renewal: Enabled
- Expiration: Shows date

---

## Summary Statistics

**Total Screenshots by Category:**

| Category | Count | Purpose |
|----------|-------|---------|
| Local Application | 11 | Development and features demo |
| AWS Infrastructure | 23 | Complete AWS resource documentation |
| GitHub CI/CD | 17 | Pipeline automation and security |
| AWS WAF Testing | 12 | Real security testing results |
| Infracost Analysis | 7 | Cost transparency and optimization |
| SonarCloud | 2 | Code quality and security |
| Snyk | 2 | Dependency vulnerability scanning |
| Cosign & DNS | 3 | Image signing and domain config |

**Total: 77 Screenshots**

---

## File Organization Structure

```
screenshots/
├── local-app/
│   ├── Local-app.png
│   ├── local-app2.png
│   ├── local-app3.png
│   ├── local-app4.png
│   ├── local-app5.png
│   ├── local-app6.png
│   ├── local-app7.png
│   ├── local-app8.png
│   ├── live-app-database-state.png
│   ├── live-app-fetch-status-from-my-orders.png
│   └── ssl-cert.png
│
├── aws/
│   ├── vpc-dashboard.png
│   ├── vpc-resource-map.png
│   ├── vpc-subnets.png
│   ├── vpc-route-tables.png
│   ├── subnet-associations.png
│   ├── vpc-nat-gateways.png
│   ├── elastic-ip.png
│   ├── network-acls.png
│   ├── security-groups.png
│   ├── vpc-security-inbound-rules.png
│   ├── vpc-rds-security-groups-inbound-rules.png
│   ├── ecs-cluster-sevices.png
│   ├── ecs-task-definition.png
│   ├── ecs-task-definition-frontend-containers.png
│   ├── load-balancer-target-groups.png
│   ├── load-balancer-AZ-listeners-and-rules.png
│   ├── load-balancer-target-groups-backend-health-status.png
│   ├── load-balancer-target-groups-frontend-health-status.png
│   ├── ecr-registry-frontend.png
│   ├── route53-hosted-zones.png
│   ├── aws-certificate-manager-lists.png
│   ├── aws-ACM-tatus.png
│   └── cloudwatch-logs.png
│
├── github/
│   ├── app-devsecops-pipeline.png
│   ├── security-scanning.png
│   ├── build-&-container-security.png
│   ├── sign-and-push-to-registry.png
│   ├── pipeline-human-gate.png
│   ├── push-to-registry-human-gate.png
│   ├── deploy-infrastructure-summary.png
│   ├── deploy-infrastructure-status.png
│   ├── check-infrastructure-deployment-status.png
│   ├── deploy-infra-human-gate.png
│   ├── destroy-infrastructure-pipeline.png
│   ├── destroy-infrastructure-human-gate.png
│   ├── destroy-infra-human-gate.png
│   ├── ghcr-packages.png
│   ├── ghcr-frontend-registry.png
│   ├── github-security-report.png
│   └── devsec.png
│
├── waf/
│   ├── waf-rules-6-of-6.png
│   ├── waf-protection-pack.png
│   ├── waf-&-sheild-report.png
│   ├── waf-tests-sql-injection-tests.png
│   ├── waf-tests-script-tag-event-handler-javascript-protocol-data-exfiltration-form-action-hijacking.png
│   ├── waf-known-bad-inputs-attack.png
│   ├── waf-rate-limit-blocks.png
│   ├── waf-geographic-region-restriction.png
│   ├── waf-blocked-countries.png
│   ├── waf-bot-control-test.png
│   ├── waf-logs-and-sampled-requests.png
│   └── waf-tests-get-all-blocked-requests.png
│
├── infracost/
│   ├── infracost-cost-estimates.png
│   ├── infracost-pr-request.png
│   ├── infracost-pipeline-summary.png
│   ├── infracost-savings-suggestions.png
│   ├── infracost-suggestions.png
│   ├── infracost-issue-explorer.png
│   └── infracost-failing-policies.png
│
├── sonarcloud/
│   ├── sonarcloud-security-hotspot.png
│   └── sonarcloud2.png
│
├── snyk/
│   ├── snyk-code-analysis.png
│   └── snyk-overview1.png
│
└── cosign & namescheap-dns/
    ├── cosign-frontend.png
    ├── cosign-backend.png
    └── namescheap-dns.png
```

---

## How to Use This Documentation

### For Portfolio Presentations

**Hiring Manager Quick Review (10 minutes):**
1. Show local app running ([Local-app.png](screenshots/local-app/Local-app.png))
2. Demonstrate AWS infrastructure ([ecs-cluster-sevices.png](screenshots/aws/ecs-cluster-sevices.png))
3. Prove automation ([app-devsecops-pipeline.png](screenshots/github/app-devsecops-pipeline.png))
4. Show security testing ([waf-tests-sql-injection-tests.png](screenshots/waf/waf-tests-sql-injection-tests.png))
5. Display cost awareness ([infracost-cost-estimates.png](screenshots/infracost/infracost-cost-estimates.png))

**Technical Interview (30 minutes):**
1. Walk through complete VPC architecture (all VPC screenshots)
2. Explain ECS deployment strategy (all ECS screenshots)
3. Demonstrate CI/CD pipeline stages (all GitHub screenshots)
4. Show real WAF attack prevention (all WAF testing screenshots)
5. Discuss cost optimization strategies (all Infracost screenshots)

**Deep Technical Dive (60 minutes):**
- Present all 77 screenshots systematically
- Explain each design decision
- Discuss challenges and solutions
- Show monitoring and logging setup
- Review security implementations

### For Documentation

**README.md References:**
```markdown
## Architecture
See complete infrastructure: [AWS Infrastructure](docs/screenshots.md#aws-infrastructure)

## Security
View WAF testing results: [Security Testing](docs/screenshots.md#aws-waf-security-testing)

## Cost
Review cost breakdown: [Infracost Analysis](docs/screenshots.md#infracost-analysis)
```

**Architecture Documentation:**
- Use VPC diagrams for network explanation
- Reference ECS screenshots for deployment architecture
- Link ALB images for traffic routing

**Security Documentation:**
- Include WAF testing screenshots as proof of protection
- Show SonarCloud/Snyk results for code quality
- Reference Cosign verification for supply chain security

---

## Maintenance Notes

**When to Update Screenshots:**
- Infrastructure changes (new services, reconfigurations)
- Security tool updates (new scan results)
- Application features (UI changes)
- Cost changes (resource scaling)
- Pipeline modifications (new workflow stages)

**Screenshot Quality Standards:**
- Resolution: Minimum 1920x1080
- Format: PNG (lossless)
- Annotations: Green arrows for key elements
- Timestamps: Visible where relevant
- No sensitive data: Passwords, API keys hidden

**Privacy & Security:**
- AWS Account ID visible: Acceptable (public portfolio)
- Domain names visible: Acceptable (portfolio demonstration)
- Passwords: Never visible
- API keys: Never visible
- Database connection strings: Sanitized

---

**Document Version:** 2.0  
**Last Updated:** January 9, 2026  
**Author:** Akingbade Omosebi  
**Contact:** Berlin, Germany | Cloud Platform Engineer

This documentation provides comprehensive visual evidence of a production-grade DevSecOps implementation for portfolio demonstration and technical interviews in the German tech market.