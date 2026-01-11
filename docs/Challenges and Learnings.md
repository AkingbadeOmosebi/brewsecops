# BrewSecOps: Enterprise DevSecOps on AWS

[![Deploy Infrastructure](https://github.com/AkingbadeOmosebi/brewsecops/actions/workflows/deploy.yml/badge.svg)](https://github.com/AkingbadeOmosebi/brewsecops/actions/workflows/deploy.yml)
[![CI/CD Pipeline](https://github.com/AkingbadeOmosebi/brewsecops/actions/workflows/pipeline.yml/badge.svg)](https://github.com/AkingbadeOmosebi/brewsecops/actions/workflows/pipeline.yml)
[![Security Scanning](https://img.shields.io/badge/security-6%20scanners-success)](https://github.com/AkingbadeOmosebi/brewsecops/security)
[![Infrastructure as Code](https://img.shields.io/badge/IaC-Terraform-623CE4)](https://www.terraform.io/)
[![AWS Resources](https://img.shields.io/badge/AWS%20Resources-76-orange)](https://aws.amazon.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> **A production-grade DevSecOps platform demonstrating enterprise AWS infrastructure deployment, security-first CI/CD pipelines, and systematic problem-solving for senior engineering roles in the German tech market.**

---

## About This Project

I am Akingbade Omosebi, a Cloud Platform Engineer based in Berlin, Germany. I built BrewSecOps as a comprehensive portfolio project to demonstrate the technical depth, security practices, and operational maturity required for Senior DevOps and Platform Engineering roles in German enterprises.

This is not a tutorial or a toy application. Every component is production-grade. Every decision is documented. Every failure is analyzed and resolved. The infrastructure runs live on AWS, the CI/CD pipeline executes real security scans, and the architecture implements defense-in-depth security that German companies demand.

### Why Coffee?

Coffee represents precision. The difference between a good cup and a bad cup often comes down to details: water temperature, grind size, extraction time. I apply the same precision to infrastructure: proper CIDR blocks, least-privilege security groups, systematic monitoring. This project combines my daily ritual with my professional expertise.

---

## Quick Start

**View Live Architecture:** [ARCHITECTURE.md](docs/ARCHITECTURE.md)  
**Read Implementation Details:** [CHALLENGES-AND-LEARNINGS.md](docs/CHALLENGES-AND-LEARNINGS.md)  
**See Visual Evidence:** [screenshots/](docs/screenshots/) (85 images)  
**Repository:** https://github.com/AkingbadeOmosebi/brewsecops

---

## What I Built

### Infrastructure (76 AWS Resources)

I deployed a complete multi-tier application infrastructure using Terraform with 11 custom modules:

**Network Layer:**
- VPC spanning 2 availability zones (eu-central-1a, eu-central-1b)
- 6 subnets: 2 public (ALB, NAT), 2 private (ECS), 2 database (RDS)
- 2 NAT Gateways for high availability
- Internet Gateway with proper routing

**Compute Layer:**
- ECS Fargate cluster with Container Insights enabled
- 4 tasks running continuously (2 frontend, 2 backend)
- Auto-scaling configuration (CPU 70%, Memory 80%)
- Task definitions with environment variable management

**Database Layer:**
- RDS PostgreSQL 15 Multi-AZ (automatic failover)
- db.t3.micro with 20GB encrypted storage
- 7-day automated backups
- Isolated in private database subnets

**Load Balancing & DNS:**
- Application Load Balancer with health checks
- Path-based routing: `/api/*` to backend, `/` to frontend
- Route53 DNS: dev.brewsecops.online
- ACM SSL certificate with DNS validation

**Security:**
- AWS WAF with 4 managed rule sets (rate limiting, SQL injection, XSS, bad inputs)
- 3 security groups implementing least privilege
- CloudWatch logging with 30-day WAF log retention
- IAM roles following principle of least privilege

**Container Registry:**
- AWS ECR with image scanning enabled
- Lifecycle policy: retain last 10 images
- GitHub Container Registry for portfolio visibility

### Application (7,401 Lines of Code)

I developed a complete 3-tier coffee shop application:

**Frontend (React 18 + TypeScript):**
- 23 coffee products with images
- Shopping cart with real-time updates
- Customer authentication and session management
- Order tracking with preparation time estimates
- Responsive design with Tailwind CSS
- Built with Vite for performance

**Backend (Node.js 20 + Express):**
- RESTful API with proper error handling
- PostgreSQL integration with connection pooling
- Session management with timeout (3 minutes)
- Health check endpoint for ALB
- Environment-based configuration

**Database (PostgreSQL 15):**
- Normalized schema with proper relationships
- UUID primary keys for security
- Sample data: products, categories, customers
- Proper indexes for performance

### CI/CD Pipeline (6 Security Scanners)

I implemented a three-stage DevSecOps pipeline that runs on every commit:

**Stage 1: Security Scanning (10-15 minutes)**
1. **Gitleaks** - Prevents hardcoded secrets from reaching production
2. **ESLint** - Enforces code quality and security rules
3. **SonarCloud** - Deep static analysis for bugs and vulnerabilities
4. **OWASP Dependency Check** - Primary CVE scanning with suppression management
5. **Snyk** - Secondary vulnerability validation
6. **Trivy** - Container image scanning

**Stage 2: Build & Container Security (8-12 minutes)**
1. **Semantic Release** - Automated versioning from conventional commits
2. **Docker Multi-Stage Build** - Optimized images (frontend: 50MB, backend: 180MB)
3. **Hadolint** - Dockerfile best practices enforcement
4. **Syft** - SBOM generation in SPDX format

**Stage 3: Sign & Deploy (5-8 minutes)**
1. **Cosign** - Keyless image signing using OIDC (no stored private keys)
2. **Dual Registry Push** - AWS ECR (production) + GHCR (portfolio)
3. **SBOM Attestation** - Attach supply chain metadata to images
4. **ECS Deployment** - Force new deployment with health validation

**Total Pipeline Duration:** 25-35 minutes with parallel execution

**Key Feature:** OIDC authentication eliminates stored AWS credentials in GitHub.

---

## System Architecture

```
Internet
   │
   ▼
Route53 DNS (dev.brewsecops.online)
   │
   ▼
AWS WAF (Rate Limit, SQL Injection, XSS Protection)
   │
   ▼
Application Load Balancer
   │
   ├─────────────────┬─────────────────┐
   ▼                 ▼                 ▼
ECS Frontend      ECS Backend      ECS Backend
(2 tasks)         (Task 1)         (Task 2)
React + Nginx     Node.js API      Node.js API
Port 80           Port 3001        Port 3001
   │                 │                 │
   └─────────────────┴─────────────────┘
                     │
                     ▼
          RDS PostgreSQL Multi-AZ
          (Primary + Standby Replica)
          Port 5432
```

**For detailed architecture diagrams, see [ARCHITECTURE.md](docs/ARCHITECTURE.md)**

---

## Technical Highlights

### Infrastructure-as-Code

I structured Terraform into 11 reusable modules with clear separation of concerns:

```
infra/terraform/
├── bootstrap/          # S3 state bucket, DynamoDB locks
├── modules/
│   ├── vpc/           # Multi-AZ network foundation
│   ├── security-groups/  # Least-privilege access control
│   ├── ecr/           # Container registry
│   ├── rds/           # PostgreSQL Multi-AZ
│   ├── ecs-cluster/   # Fargate orchestration
│   ├── ecs-service/   # Task definitions, auto-scaling
│   ├── alb/           # Load balancing, health checks
│   ├── route53/       # DNS management
│   ├── ACM/           # TLS certificates
│   ├── WAF/           # Web application firewall
│   └── oidc/          # GitHub Actions authentication
└── environments/
    └── dev/           # Development configuration
```

**State Management:**
- Remote state in S3 with versioning
- DynamoDB locking prevents concurrent modifications
- Encrypted state files (AES-256)

### Security Implementation

I implemented defense-in-depth security across six layers:

**Layer 1: Perimeter (WAF)**
- Rate limiting: 2000 requests per 5 minutes per IP
- AWS Managed Rules: SQL injection, XSS, known bad inputs
- All requests logged to CloudWatch

**Layer 2: Network (Security Groups)**
- ALB accepts 80/443 from internet
- ECS accepts 80/3001 only from ALB
- RDS accepts 5432 only from ECS

**Layer 3: Transport (TLS)**
- TLS 1.3 enforcement on ALB
- ACM-managed certificates with automatic renewal
- DNS validation via Route53

**Layer 4: Application (IAM)**
- OIDC authentication (no stored credentials)
- Least-privilege IAM roles
- AWS Secrets Manager for database passwords

**Layer 5: Supply Chain**
- 6 security scanners in CI/CD
- Cosign keyless image signing
- SBOM generation and attestation
- ECR image scanning on push

**Layer 6: Monitoring**
- CloudWatch Logs (7-day retention)
- Container Insights for metrics
- WAF logs (30-day retention)
- GitHub Security tab integration

### High Availability Design

I architected for fault tolerance across two availability zones:

**Component Distribution:**
- NAT Gateways: 1 per AZ (2 total)
- ECS tasks: Distributed across both AZs
- RDS: Primary in AZ-1, standby in AZ-2

**Failure Recovery:**
- Single ECS task failure: 2 minutes RTO
- Availability zone failure: < 1 minute RTO
- RDS primary failure: 1-2 minutes RTO (automatic failover)
- Application bug deployment: 2-3 minutes (circuit breaker rollback)

---

## Project Statistics

| Metric | Value | Context |
|--------|-------|---------|
| **AWS Resources** | 76 | Complete production infrastructure |
| **Terraform Modules** | 11 | Reusable, tested, documented |
| **Infrastructure Code** | 2,767 lines | All in version control |
| **Application Code** | 7,401 lines | Frontend, backend, database |
| **CI/CD Config** | 450+ lines | Three automated workflows |
| **Security Scanners** | 6 | Every commit, every build |
| **Documented Challenges** | 14+ | With root cause analysis |
| **Screenshots** | 85 | Infrastructure, pipelines, security |
| **Development Time** | 4 weeks | ~60 hours total |
| **Meaningful Commits** | 25+ | Clear commit history |

---

## Cost Transparency

I track actual AWS costs with Infracost integration. This is production-grade infrastructure running 24/7 for portfolio demonstration.

**Monthly Cost Breakdown (EUR):**

| Service | Monthly Cost | Percentage | Purpose |
|---------|--------------|------------|---------|
| ECS Fargate (4 tasks) | €76 | 36.5% | Application hosting |
| NAT Gateway (2 AZs) | €70 | 33.7% | High availability |
| RDS Multi-AZ | €33 | 15.9% | Database redundancy |
| Application Load Balancer | €18 | 8.7% | Traffic distribution |
| AWS WAF | €9 | 4.3% | Security protection |
| CloudWatch Logs | €2 | 1.0% | Monitoring |
| **Total** | **€208** | **100%** | Production configuration |

**Cost Optimization Options:**
- Single NAT Gateway: €35/month savings (reduces availability)
- RDS Single-AZ: €16/month savings (removes failover)
- Fargate Spot: €30/month savings (increases interruption risk)
- **Optimized Total:** €127/month (39% reduction)

**Decision:** I chose production configuration over cost optimization to demonstrate high-availability architecture for German enterprise roles where reliability is prioritized over cost.

---

## What This Demonstrates

### For Senior DevOps/Platform Engineer Roles

**Cloud Architecture at Scale:**
- Multi-AZ deployment for fault tolerance
- Auto-scaling based on CPU and memory metrics
- Load balancing with health checks
- DNS management with SSL/TLS
- Managed services (RDS, ECS, ALB)

**DevSecOps Maturity:**
- 6 security scanners in automated pipeline
- Keyless image signing with OIDC
- SBOM generation for supply chain security
- WAF with rate limiting and attack prevention
- No hardcoded credentials anywhere

**Infrastructure-as-Code Excellence:**
- 11 modular Terraform components
- Remote state with locking
- Environment isolation
- Reusable, tested modules
- Complete documentation

**Problem-Solving Capability:**
- 14+ documented challenges with solutions
- Root cause analysis for each issue
- Systematic debugging approach
- Learning from failures
- Prevention strategies

**Production Readiness:**
- Multi-AZ high availability
- Automated backups (7-day retention)
- Monitoring and logging
- Security group isolation
- Disaster recovery planning

**Professional Practices:**
- Comprehensive documentation
- Clear commit history
- Code review readiness
- Knowledge transfer capability
- Portfolio presentation

---

## Technology Stack

### Infrastructure
| Category | Technology | Purpose |
|----------|-----------|---------|
| Cloud Provider | AWS | Enterprise-grade infrastructure |
| Regions | eu-central-1 (Frankfurt) | GDPR compliance, low latency |
| Container Orchestration | ECS Fargate | Serverless, scalable compute |
| Load Balancing | Application Load Balancer | Layer 7 routing, health checks |
| Database | RDS PostgreSQL 15 Multi-AZ | Managed, highly available |
| DNS | Route53 | Global DNS with health checks |
| WAF | AWS WAF | DDoS protection, attack prevention |
| Certificates | AWS Certificate Manager | Free SSL/TLS with auto-renewal |
| Registry | ECR + GHCR | Dual-registry strategy |
| IaC | Terraform 1.5+ | Infrastructure-as-code |

### Application
| Component | Technology | Reason |
|-----------|-----------|--------|
| Frontend | React 18 + TypeScript | Type safety, modern practices |
| Build Tool | Vite | Fast development experience |
| Styling | Tailwind CSS | Utility-first, responsive |
| Backend | Node.js 20 + Express | JavaScript ecosystem, async I/O |
| Database Client | node-postgres (pg) | Native PostgreSQL driver |
| Container Runtime | Docker | Industry standard |
| Base Images | node:18, node:20, nginx:alpine | Official, minimal |

### CI/CD & Security
| Tool | Purpose | Stage |
|------|---------|-------|
| GitHub Actions | CI/CD orchestration | All stages |
| Gitleaks | Secret detection | Security scan |
| ESLint | Code quality + security | Security scan |
| SonarCloud | Static analysis | Security scan |
| OWASP Dependency Check | CVE scanning | Security scan |
| Snyk | Vulnerability validation | Security scan |
| Trivy | Container scanning | Security scan |
| Hadolint | Dockerfile linting | Build |
| Cosign | Keyless image signing | Deploy |
| Syft | SBOM generation | Build |
| semantic-release | Automated versioning | Build |

---

## Repository Structure

```
brewsecops/
├── README.md                           # This file
├── docs/
│   ├── ARCHITECTURE.md                 # Complete architecture documentation
│   ├── CHALLENGES-AND-LEARNINGS.md     # Problem-solving case studies
│   └── screenshots/                    # 85 screenshots
│       ├── infrastructure/
│       ├── pipelines/
│       ├── security/
│       └── application/
│
├── .github/workflows/
│   ├── deploy.yml                      # Infrastructure deployment
│   ├── pipeline.yml                    # Application CI/CD
│   └── destroy.yml                     # Infrastructure teardown
│
├── akings-coffee-app/
│   ├── frontend/                       # React + TypeScript
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── backend/                        # Node.js + Express
│   │   ├── routes/
│   │   ├── config/
│   │   ├── Dockerfile
│   │   └── server.js
│   ├── database/
│   │   ├── schema.sql
│   │   └── seed.sql
│   └── docker-compose.yml              # Local development
│
├── infra/terraform/
│   ├── bootstrap/
│   │   ├── main.tf                     # S3 state bucket
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── modules/                        # 11 reusable modules
│   │   ├── vpc/
│   │   ├── security-groups/
│   │   ├── ecr/
│   │   ├── rds/
│   │   ├── ecs-cluster/
│   │   ├── ecs-service/
│   │   ├── alb/
│   │   ├── route53/
│   │   ├── ACM/
│   │   ├── WAF/
│   │   └── oidc/
│   └── environments/
│       └── dev/
│           ├── main.tf                 # Development configuration
│           ├── backend.tf              # State management
│           ├── variables.tf
│           └── outputs.tf
│
├── .gitleaks.toml                      # Secret scanning config
├── sonar-project.properties            # SonarCloud config
├── dependency-check-suppressions.xml   # OWASP suppressions
└── package.json                        # Semantic release config
```

---

## Key Learning Outcomes

Through building BrewSecOps, I gained deep hands-on experience with:

### Infrastructure Engineering
- Designing multi-AZ architectures for high availability
- Implementing least-privilege security with security groups
- Managing Terraform state at scale with S3 and DynamoDB
- Debugging infrastructure issues using AWS CLI and CloudWatch
- Cost optimization analysis for production workloads

### DevSecOps Practices
- Integrating 6 security scanners into CI/CD pipelines
- Implementing keyless image signing with Cosign and OIDC
- Generating and attaching SBOMs to container images
- Managing false positives with suppression files
- Balancing security with development velocity

### Container Orchestration
- ECS Fargate task definition optimization
- Health check configuration for zero-downtime deployments
- Auto-scaling policies based on CPU and memory
- Container resource allocation (CPU units, memory limits)
- Environment variable management for secrets

### Problem-Solving Methodology
- Systematic root cause analysis for infrastructure failures
- Reading ECS task events and CloudWatch logs
- Using AWS CLI for debugging (not just console)
- Documenting failures and solutions for future prevention
- Memory profiling for container OOM issues

---

## Challenges Overcome

I documented every significant challenge encountered during this project. Here are highlights:

**Infrastructure Issues:**
- Memory exhaustion (OOM) in ECS tasks due to insufficient resource allocation
- Port misalignment between ALB, security groups, and application code
- RDS connectivity failures from missing egress rules in ECS security group
- Terraform state lock contention from interrupted deployments
- ACM certificate validation delays due to DNS propagation

**CI/CD Issues:**
- Gitleaks false positives requiring careful suppression configuration
- OIDC authentication setup for GitHub Actions to AWS
- Semantic versioning integration with conventional commits
- Managing multiple registries (ECR + GHCR) with different auth methods
- Pipeline optimization to reduce total execution time

**Application Issues:**
- Health check failures causing ECS circuit breaker activation
- Database connection pooling configuration for Node.js
- CORS configuration for frontend-backend communication
- Session timeout implementation for security
- Image optimization for faster page loads

**For detailed analysis and solutions, see [CHALLENGES-AND-LEARNINGS.md](docs/CHALLENGES-AND-LEARNINGS.md)**

---

## Future Enhancements

While this project demonstrates complete production-grade infrastructure, I identified several enhancements for future implementation:

### Multi-Environment Expansion
- Deploy staging environment with separate state
- Deploy production environment with stricter policies
- Implement environment promotion workflow (dev → staging → prod)
- Add manual approval gates for production deployments

### Blue/Green Deployment
- Integrate AWS CodeDeploy for ECS Blue/Green deployments
- Implement traffic shifting (10% → 50% → 100%)
- Add automated rollback on health check failures
- Configure deployment alarms and circuit breakers

### Enhanced Monitoring
- Create CloudWatch dashboards for infrastructure metrics
- Implement custom CloudWatch alarms for application errors
- Add SNS notifications for critical failures
- Integrate ALB access logs to S3 for analysis
- Set up X-Ray tracing for request flow visualization

### Security Hardening
- Implement HTTP to HTTPS redirect on ALB
- Move database password to AWS Secrets Manager (fully automated retrieval)
- Add AWS GuardDuty for threat detection
- Implement AWS Config for compliance monitoring
- Add VPC Flow Logs for network analysis

### Cost Optimization
- Implement Fargate Spot for development environment
- Use single NAT Gateway for development (reduce €35/month)
- Automate infrastructure shutdown during non-business hours
- Add cost anomaly detection with AWS Cost Anomaly Detection

### CI/CD Improvements
- Add infrastructure pipeline for automated Terraform deployments
- Implement policy-as-code with Terraform Sentinel
- Add container image vulnerability gates (fail on critical CVEs)
- Implement automated database migrations with Flyway

**Priority:** These enhancements are planned but not required for the current portfolio demonstration. The existing infrastructure already showcases enterprise-level capabilities.

---

## How to Use This Repository

### For Hiring Managers

**Evaluate Technical Depth:**
1. Review [ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design understanding
2. Examine [CHALLENGES-AND-LEARNINGS.md](docs/CHALLENGES-AND-LEARNINGS.md) for problem-solving ability
3. Browse [screenshots/](docs/screenshots/) for visual evidence of working infrastructure
4. Check `.github/workflows/` for CI/CD pipeline implementation
5. Review `infra/terraform/` for infrastructure-as-code quality

**Verify Claims:**
- All GitHub Actions workflows are public
- All screenshots include timestamps
- All infrastructure code is in repository
- All commits show progression and learning

**Key Indicators:**
- Comprehensive documentation (10,000+ words)
- Professional commit messages
- Systematic problem-solving
- Security-first thinking
- Cost awareness

### For Technical Reviewers

**Infrastructure Review:**
```bash
# Clone repository
git clone https://github.com/AkingbadeOmosebi/brewsecops.git
cd brewsecops

# Review Terraform modules
cd infra/terraform/modules
ls -la

# Check pipeline configuration
cat .github/workflows/pipeline.yml

# Examine application code
cd akings-coffee-app
```

**Pipeline Review:**
- Check GitHub Actions tab for pipeline runs
- Review GitHub Security tab for scan results
- Verify image signatures with Cosign (instructions in ARCHITECTURE.md)

**Security Review:**
- No hardcoded credentials in code (verified by Gitleaks)
- IAM roles follow least privilege
- Security groups implement proper isolation
- All dependencies scanned for CVEs

### For Learners

**Study the Structure:**
- Start with [ARCHITECTURE.md](docs/ARCHITECTURE.md) to understand the design
- Read [CHALLENGES-AND-LEARNINGS.md](docs/CHALLENGES-AND-LEARNINGS.md) to learn from mistakes
- Examine Terraform modules for reusable patterns
- Study CI/CD pipeline for DevSecOps practices

**Adapt for Your Use:**
- Terraform modules are reusable (change variables)
- CI/CD workflows are templates (modify for your tools)
- Documentation structure can be copied (fill with your content)

**Warning:** This repository contains production configuration. If deploying yourself:
- Change all account IDs
- Use different domain names
- Generate new secrets
- Modify region if needed

---

## Contact & Professional Information

**Name:** Akingbade Omosebi  
**Location:** Berlin, Germany  
**Status:** Actively seeking Senior DevOps / Platform Engineer roles  
**Authorized to Work:** European Union  

**Technical Focus:**
- Cloud Platform Engineering (AWS, Azure, GCP)
- DevSecOps Pipeline Architecture
- Infrastructure-as-Code (Terraform, Ansible)
- Container Orchestration (ECS, Kubernetes)
- Security Automation

**Target Roles:**
- Senior DevOps Engineer
- Platform Engineer
- Cloud Infrastructure Engineer
- Site Reliability Engineer (SRE)
- DevSecOps Engineer

**Salary Expectations:** €75,000 - €110,000 (Berlin market, based on experience level)

**GitHub:** https://github.com/AkingbadeOmosebi  
**Repository:** https://github.com/AkingbadeOmosebi/brewsecops  
**Project Completed:** January 2026

---

## License

MIT License - See [LICENSE](LICENSE) file for details.

This project is open source for educational purposes and portfolio demonstration. Feel free to use the Terraform modules and CI/CD patterns in your own projects.

---

## Acknowledgments

I built this project independently as a portfolio demonstration. However, I benefited from:

- AWS documentation for best practices
- Terraform registry for module patterns
- GitHub Actions community for CI/CD examples
- Open-source security tools (Gitleaks, Trivy, Cosign, OWASP)
- Coffee for the daily motivation

---

## Final Note

This README is intentionally detailed to demonstrate documentation standards I bring to engineering teams. I believe comprehensive documentation is not optional for production systems operating in regulated environments like German financial services and healthcare sectors.

Every decision in this project was deliberate. Every component has a purpose. Every failure was an opportunity to learn. This is how I approach engineering: with precision, security, and systematic thinking.

If this project demonstrates the technical depth and professional maturity your team needs, I would welcome the opportunity to discuss how I can contribute to your infrastructure and platform engineering goals.

---

**Last Updated:** January 9, 2026  
**Project Status:** Active (running on AWS)  
**Documentation Version:** 1.0