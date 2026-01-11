# BrewSecOps: System Architecture Documentation

**Author:** Akingbade Omosebi  
**Location:** Berlin, Germany  
**Project Type:** Cloud Platform Engineering Portfolio  
**Deployment Date:** January 2026

---

## Executive Overview

I designed and deployed BrewSecOps as a production-grade demonstration of enterprise DevSecOps practices on AWS. The architecture implements a security-first, multi-tier containerized application with automated CI/CD pipelines, comprehensive security scanning, and infrastructure-as-code principles. This document details the complete system architecture, component interactions, and security boundaries.

---

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                          INTERNET TRAFFIC                                    │
│                                 │                                            │
│                                 ▼                                            │
│                    ┌─────────────────────────┐                              │
│                    │      AWS Route53         │                              │
│                    │  DNS: dev.brewsecops.    │                              │
│                    │       online             │                              │
│                    └────────────┬─────────────┘                              │
│                                 │                                            │
│                                 ▼                                            │
│                    ┌─────────────────────────┐                              │
│                    │       AWS WAF            │                              │
│                    │  Rate Limit: 2000/5min  │                              │
│                    │  SQL Injection Block     │                              │
│                    │  XSS Protection          │                              │
│                    │  Known Bad Inputs Block  │                              │
│                    └────────────┬─────────────┘                              │
│                                 │                                            │
│                                 ▼                                            │
│        ┌────────────────────────────────────────────────────┐               │
│        │     Application Load Balancer (ALB)                │               │
│        │     SSL/TLS: ACM Certificate                       │               │
│        │     Health Checks: / and /api/health               │               │
│        │     Path Routing: /api/* → Backend                 │               │
│        └──────────┬──────────────────────┬──────────────────┘               │
│                   │                      │                                   │
│         ┌─────────▼────────┐   ┌────────▼─────────┐                         │
│         │  Target Group 1  │   │  Target Group 2  │                         │
│         │  Frontend: 80    │   │  Backend: 3001   │                         │
│         └─────────┬────────┘   └────────┬─────────┘                         │
│                   │                      │                                   │
│    ┌──────────────┼──────────────────────┼────────────────────┐             │
│    │              │    VPC 10.0.0.0/16   │                    │             │
│    │  ┌───────────▼─────────┐  ┌─────────▼────────────┐      │             │
│    │  │  Public Subnet 1    │  │  Public Subnet 2      │      │             │
│    │  │  10.0.1.0/24        │  │  10.0.2.0/24          │      │             │
│    │  │  AZ: eu-central-1a  │  │  AZ: eu-central-1b    │      │             │
│    │  │  ┌─────────────┐    │  │  ┌─────────────┐     │      │             │
│    │  │  │ NAT Gateway │    │  │  │ NAT Gateway │     │      │             │
│    │  │  │ (Fixed IP)  │    │  │  │ (Fixed IP)  │     │      │             │
│    │  │  └─────────────┘    │  │  └─────────────┘     │      │             │
│    │  └─────────┬───────────┘  └───────────┬──────────┘      │             │
│    │            │                           │                 │             │
│    │  ┌─────────▼─────────┐      ┌─────────▼──────────┐      │             │
│    │  │ Private Subnet 1  │      │ Private Subnet 2    │      │             │
│    │  │ 10.0.10.0/24      │      │ 10.0.11.0/24        │      │             │
│    │  │ AZ: eu-central-1a │      │ AZ: eu-central-1b   │      │             │
│    │  │                   │      │                     │      │             │
│    │  │ ┌───────────────┐ │      │ ┌───────────────┐  │      │             │
│    │  │ │ ECS Frontend  │ │      │ │ ECS Frontend  │  │      │             │
│    │  │ │ Task (Fargate)│ │      │ │ Task (Fargate)│  │      │             │
│    │  │ │ React + Nginx │ │      │ │ React + Nginx │  │      │             │
│    │  │ │ Port: 80      │ │      │ │ Port: 80      │  │      │             │
│    │  │ │ CPU: 256      │ │      │ │ CPU: 256      │  │      │             │
│    │  │ │ Memory: 512MB │ │      │ │ Memory: 512MB │  │      │             │
│    │  │ └───────────────┘ │      │ └───────────────┘  │      │             │
│    │  │                   │      │                     │      │             │
│    │  │ ┌───────────────┐ │      │ ┌───────────────┐  │      │             │
│    │  │ │ ECS Backend   │ │      │ │ ECS Backend   │  │      │             │
│    │  │ │ Task (Fargate)│ │      │ │ Task (Fargate)│  │      │             │
│    │  │ │ Node.js API   │ │      │ │ Node.js API   │  │      │             │
│    │  │ │ Port: 3001    │ │      │ │ Port: 3001    │  │      │             │
│    │  │ │ CPU: 512      │ │      │ │ CPU: 512      │  │      │             │
│    │  │ │ Memory: 1024MB│ │      │ │ Memory: 1024MB│  │      │             │
│    │  │ └───────┬───────┘ │      │ └───────┬───────┘  │      │             │
│    │  │         │         │      │         │          │      │             │
│    │  └─────────┼─────────┘      └─────────┼──────────┘      │             │
│    │            │                           │                 │             │
│    │            └───────────┬───────────────┘                 │             │
│    │                        │                                 │             │
│    │              ┌─────────▼─────────┐                       │             │
│    │              │ Database Subnet 1 │                       │             │
│    │              │ 10.0.20.0/24      │                       │             │
│    │              │ AZ: eu-central-1a │                       │             │
│    │              │                   │                       │             │
│    │              │ ┌───────────────┐ │                       │             │
│    │              │ │ RDS PostgreSQL│ │                       │             │
│    │              │ │ Multi-AZ      │ │◄──────────────────────┼─────────┐   │
│    │              │ │ Primary       │ │                       │         │   │
│    │              │ │ db.t3.micro   │ │                       │         │   │
│    │              │ │ Port: 5432    │ │                       │         │   │
│    │              │ │ Storage: 20GB │ │                       │         │   │
│    │              │ └───────────────┘ │                       │         │   │
│    │              └───────────────────┘                       │         │   │
│    │                                                          │         │   │
│    │              ┌───────────────────┐                       │         │   │
│    │              │ Database Subnet 2 │                       │         │   │
│    │              │ 10.0.21.0/24      │                       │         │   │
│    │              │ AZ: eu-central-1b │                       │         │   │
│    │              │                   │                       │         │   │
│    │              │ ┌───────────────┐ │                       │         │   │
│    │              │ │ RDS PostgreSQL│ │                       │         │   │
│    │              │ │ Multi-AZ      │ │───────────────────────┼─────────┘   │
│    │              │ │ Standby       │ │  Synchronous                        │
│    │              │ │ (Replica)     │ │  Replication                        │
│    │              │ └───────────────┘ │                                     │
│    │              └───────────────────┘                                     │
│    │                                                                        │
│    └────────────────────────────────────────────────────────────────────────┘
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    Supporting Services                                │   │
│  │                                                                       │   │
│  │  • CloudWatch Logs: /ecs/brewsecops-frontend-dev                    │   │
│  │                     /ecs/brewsecops-backend-dev                      │   │
│  │                     /aws/waf/brewsecops-dev                          │   │
│  │                                                                       │   │
│  │  • CloudWatch Metrics: Container Insights (CPU, Memory, Network)     │   │
│  │                                                                       │   │
│  │  • ECR Repositories: brewsecops-frontend-dev                         │   │
│  │                      brewsecops-backend-dev                          │   │
│  │                                                                       │   │
│  │  • Secrets Manager: Database credentials                             │   │
│  │                                                                       │   │
│  │  • IAM Roles: ECS Task Execution Role                               │   │
│  │               ECS Task Role                                          │   │
│  │               GitHub Actions OIDC Role                               │   │
│  │                                                                       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## CI/CD Pipeline Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                          GITHUB REPOSITORY                                  │
│                                                                             │
│  Developer Push to Main Branch                                             │
│             │                                                               │
│             ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                     GITHUB ACTIONS WORKFLOW                           │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│             │                                                               │
└─────────────┼───────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 1: Security Scanning (10-15 minutes)                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Gitleaks   │  │    ESLint    │  │  SonarCloud  │  │     OWASP    │    │
│  │   Secrets    │  │  Code Quality│  │  Static      │  │  Dependency  │    │
│  │   Detection  │  │  + Security  │  │  Analysis    │  │  Check (CVE) │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                 │                 │                 │             │
│         └─────────────────┼─────────────────┼─────────────────┘             │
│                           │                 │                               │
│                           ▼                 ▼                               │
│                    ┌──────────────┐  ┌──────────────┐                       │
│                    │     Snyk     │  │   Trivy      │                       │
│                    │ Vulnerability│  │  Container   │                       │
│                    │   Scanning   │  │   Scanner    │                       │
│                    └──────┬───────┘  └──────┬───────┘                       │
│                           │                 │                               │
│                           └────────┬────────┘                               │
│                                    │                                        │
│                           All Scans Complete                                │
│                                    │                                        │
└────────────────────────────────────┼─────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 2: Build & Container Security (8-12 minutes)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Semantic Versioning                                                  │  │
│  │  Analyzes commit history → Determines version (v2.1.0)                │  │
│  └─────────────────────────────┬─────────────────────────────────────────┘  │
│                                │                                            │
│                                ▼                                            │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Docker Multi-Stage Build                                             │  │
│  │  Frontend: node:18 → nginx:alpine (50MB)                              │  │
│  │  Backend:  node:20 → node:20-alpine (180MB)                           │  │
│  └─────────────────────────────┬─────────────────────────────────────────┘  │
│                                │                                            │
│                                ▼                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                      │
│  │  Hadolint    │  │    Trivy     │  │     Syft     │                      │
│  │  Dockerfile  │  │  Container   │  │    SBOM      │                      │
│  │  Linting     │  │  CVE Scan    │  │  Generation  │                      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                      │
│         │                 │                 │                               │
│         └─────────────────┼─────────────────┘                               │
│                           │                                                 │
│                  Images Ready for Signing                                   │
│                           │                                                 │
└───────────────────────────┼─────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 3: Sign & Deploy (5-8 minutes)                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Cosign Keyless Image Signing                                         │  │
│  │  Uses OIDC identity from GitHub Actions                               │  │
│  │  No stored private keys                                               │  │
│  └─────────────────────────────┬─────────────────────────────────────────┘  │
│                                │                                            │
│                                ▼                                            │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Dual Registry Push                                                   │  │
│  │                                                                        │  │
│  │  ┌──────────────────────┐        ┌──────────────────────┐             │  │
│  │  │  AWS ECR             │        │  GitHub Container    │             │  │
│  │  │  (Production)        │        │  Registry (GHCR)     │             │  │
│  │  │  194722436853.dkr... │        │  (Portfolio/Public)  │             │  │
│  │  └──────────────────────┘        └──────────────────────┘             │  │
│  │                                                                        │  │
│  └─────────────────────────────┬─────────────────────────────────────────┘  │
│                                │                                            │
│                                ▼                                            │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  SBOM Attestation Attachment                                          │  │
│  │  Attach SPDX-format SBOM to signed images                             │  │
│  └─────────────────────────────┬─────────────────────────────────────────┘  │
│                                │                                            │
│                                ▼                                            │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ECS Service Update                                                   │  │
│  │  Force new deployment with latest images                              │  │
│  │  Health checks validate before routing traffic                        │  │
│  └─────────────────────────────┬─────────────────────────────────────────┘  │
│                                │                                            │
└────────────────────────────────┼─────────────────────────────────────────────┘
                                 │
                                 ▼
                        Deployment Complete
```

---

## Security Architecture

### Defense in Depth

```
┌────────────────────────────────────────────────────────────────────────┐
│  Layer 1: Perimeter Security                                           │
├────────────────────────────────────────────────────────────────────────┤
│  • AWS WAF with rate limiting (2000 requests/5 minutes per IP)        │
│  • SQL injection protection (AWS Managed Rules)                        │
│  • XSS protection (AWS Managed Rules)                                  │
│  • Known bad inputs blocking                                           │
│  • All requests logged to CloudWatch                                   │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│  Layer 2: Network Security                                             │
├────────────────────────────────────────────────────────────────────────┤
│  • VPC with private subnets for application tier                       │
│  • Isolated database subnets (no internet access)                      │
│  • Security groups with least privilege:                               │
│    - ALB: Accepts 80/443 from internet                                │
│    - ECS: Accepts 80/3001 only from ALB                               │
│    - RDS: Accepts 5432 only from ECS                                  │
│  • NAT Gateways for controlled outbound access                         │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│  Layer 3: Transport Security                                           │
├────────────────────────────────────────────────────────────────────────┤
│  • TLS 1.3 enforcement on ALB                                          │
│  • ACM-managed certificates with automatic renewal                     │
│  • HTTP to HTTPS redirect (planned enhancement)                        │
│  • Certificate validation via DNS (Route53)                            │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│  Layer 4: Application Security                                         │
├────────────────────────────────────────────────────────────────────────┤
│  • IAM roles with least privilege                                      │
│  • No hardcoded credentials in code                                    │
│  • AWS Secrets Manager for database passwords                          │
│  • Environment-specific configuration                                   │
│  • Container isolation via ECS Fargate                                 │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│  Layer 5: Supply Chain Security                                        │
├────────────────────────────────────────────────────────────────────────┤
│  • 6 security scanners in CI/CD pipeline                               │
│  • Cosign keyless image signing (OIDC)                                │
│  • SBOM generation (SPDX format)                                       │
│  • ECR image scanning on push                                          │
│  • Dependency vulnerability tracking                                    │
│  • Gitleaks prevents secret commits                                    │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│  Layer 6: Monitoring & Detection                                       │
├────────────────────────────────────────────────────────────────────────┤
│  • CloudWatch Logs (7-day retention)                                   │
│  • Container Insights for ECS metrics                                  │
│  • WAF logs for security analysis                                      │
│  • ALB access logs (planned)                                           │
│  • GitHub Security tab integration                                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Infrastructure-as-Code Structure

### Terraform Module Organization

```
infra/terraform/
│
├── bootstrap/
│   ├── main.tf                    # S3 bucket for state
│   ├── variables.tf               # Bootstrap configuration
│   └── outputs.tf                 # State bucket details
│
├── modules/
│   ├── vpc/
│   │   ├── main.tf               # VPC, subnets, NAT, IGW
│   │   ├── variables.tf          # Network CIDR blocks
│   │   └── outputs.tf            # VPC ID, subnet IDs
│   │
│   ├── security-groups/
│   │   ├── main.tf               # ALB, ECS, RDS security groups
│   │   ├── variables.tf          # Port configurations
│   │   └── outputs.tf            # Security group IDs
│   │
│   ├── ecr/
│   │   ├── main.tf               # ECR repositories
│   │   ├── variables.tf          # Repository names
│   │   └── outputs.tf            # Repository URLs
│   │
│   ├── rds/
│   │   ├── main.tf               # PostgreSQL Multi-AZ
│   │   ├── variables.tf          # DB configuration
│   │   └── outputs.tf            # DB endpoint
│   │
│   ├── ecs-cluster/
│   │   ├── main.tf               # ECS cluster, capacity providers
│   │   ├── variables.tf          # Cluster settings
│   │   └── outputs.tf            # Cluster ARN
│   │
│   ├── ecs-service/
│   │   ├── main.tf               # Task definitions, services
│   │   ├── variables.tf          # Container specs
│   │   └── outputs.tf            # Service ARNs
│   │
│   ├── alb/
│   │   ├── main.tf               # ALB, listeners, target groups
│   │   ├── variables.tf          # Health check config
│   │   └── outputs.tf            # ALB DNS, target group ARNs
│   │
│   ├── route53/
│   │   ├── main.tf               # DNS records
│   │   ├── variables.tf          # Domain configuration
│   │   └── outputs.tf            # DNS endpoints
│   │
│   ├── ACM/
│   │   ├── main.tf               # TLS certificates
│   │   ├── variables.tf          # Certificate domains
│   │   └── outputs.tf            # Certificate ARNs
│   │
│   ├── WAF/
│   │   ├── main.tf               # WAF rules, ACL
│   │   ├── variables.tf          # Rate limits, rules
│   │   └── outputs.tf            # WAF ACL ID
│   │
│   └── oidc/
│       ├── main.tf               # GitHub OIDC provider
│       ├── variables.tf          # Trust policy configuration
│       └── outputs.tf            # OIDC role ARN
│
└── environments/
    └── dev/
        ├── main.tf               # Calls all 11 modules
        ├── backend.tf            # S3 state configuration
        ├── variables.tf          # Environment variables
        ├── terraform.tfvars      # Actual values (not in Git)
        └── outputs.tf            # Environment outputs
```

### Module Dependency Graph

```
                    ┌─────────┐
                    │ Bootstrap│
                    └────┬────┘
                         │
                         ▼
              ┌──────────────────┐
              │   Environment     │
              │   Configuration   │
              └──────────┬────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    ┌────────┐     ┌─────────┐     ┌────────┐
    │  VPC   │     │   ECR   │     │  ACM   │
    └───┬────┘     └─────────┘     └───┬────┘
        │                               │
        ├───────────┬───────────────────┘
        │           │
        ▼           ▼
    ┌────────┐  ┌─────────┐
    │Security│  │ Route53 │
    │ Groups │  └─────────┘
    └───┬────┘
        │
        ├───────────┬───────────┬─────────────┐
        │           │           │             │
        ▼           ▼           ▼             ▼
    ┌────────┐  ┌─────────┐  ┌────────┐  ┌──────────┐
    │  RDS   │  │   ALB   │  │  ECS   │  │  OIDC    │
    └────────┘  └────┬────┘  │ Cluster│  └──────────┘
                     │        └───┬────┘
                     │            │
                     └──────┬─────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ ECS Services │
                     └──────────────┘
                            │
                            ▼
                       ┌─────────┐
                       │   WAF   │
                       └─────────┘
```

---

## Data Flow Architecture

### Request Flow (User → Application)

```
1. User Request
   │
   ▼
2. DNS Resolution (Route53)
   dev.brewsecops.online → ALB DNS
   │
   ▼
3. WAF Inspection
   • Rate limiting check
   • SQL injection pattern detection
   • XSS pattern detection
   • Known bad inputs check
   │
   ├─ BLOCK → 403 Response + CloudWatch Log
   │
   └─ ALLOW
      │
      ▼
4. ALB Processing
   • TLS termination
   • Health check validation
   • Path-based routing
   │
   ├─ Path: / → Frontend Target Group (Port 80)
   │
   └─ Path: /api/* → Backend Target Group (Port 3001)
      │
      ▼
5. ECS Task Execution
   • Container receives request
   • Application processing
   • Database query (if needed)
   │
   ▼
6. Database Operation (if applicable)
   • Connection via private network
   • PostgreSQL query execution
   • Multi-AZ synchronous replication
   │
   ▼
7. Response Path
   ECS → ALB → WAF → User
   │
   └─ CloudWatch Logs at each layer
```

### Deployment Flow (Code → Production)

```
1. Developer commits to main branch
   │
   ▼
2. GitHub Actions triggers
   │
   ├─ Workflow: deploy.yml (Infrastructure)
   │  └─ Terraform apply
   │
   └─ Workflow: pipeline.yml (Application)
      │
      ▼
3. Security Scanning (Parallel execution)
   ├─ Gitleaks → Secret detection
   ├─ ESLint → Code quality
   ├─ SonarCloud → Static analysis
   ├─ OWASP → Dependency CVE scan
   └─ Snyk → Additional vulnerability check
   │
   └─ All pass → Continue
   │
   ▼
4. Build Phase
   ├─ Semantic versioning
   ├─ Docker multi-stage build
   ├─ Hadolint (Dockerfile linting)
   ├─ Trivy (Container scanning)
   └─ Syft (SBOM generation)
   │
   ▼
5. Sign & Push
   ├─ Cosign keyless signing (OIDC)
   ├─ Push to AWS ECR (production)
   ├─ Push to GHCR (portfolio)
   └─ Attach SBOM to images
   │
   ▼
6. Deployment
   ├─ AWS credentials via OIDC
   ├─ ECS service update (force new deployment)
   └─ Health checks validate new tasks
   │
   ▼
7. Traffic Routing
   ├─ ALB routes to new tasks
   ├─ Old tasks drain connections
   └─ Old tasks terminate after grace period
   │
   ▼
8. Monitoring
   ├─ CloudWatch Logs ingestion
   ├─ Container Insights metrics
   └─ GitHub Security tab updates
```

---

## High Availability & Disaster Recovery

### Multi-AZ Architecture

I designed the infrastructure with multi-AZ deployment across two availability zones (eu-central-1a and eu-central-1b) to ensure fault tolerance:

**Network Layer:**
- Public subnets in both AZs host NAT Gateways
- Private subnets in both AZs host ECS tasks
- Database subnets in both AZs enable RDS Multi-AZ

**Compute Layer:**
- ECS tasks distributed across availability zones
- Auto-scaling maintains minimum task count
- Circuit breaker prevents cascading failures

**Database Layer:**
- RDS Multi-AZ with synchronous replication
- Automatic failover (typically 60-120 seconds)
- Standby replica in different AZ

### Failure Scenarios & Recovery

| Failure Scenario | Detection Time | Recovery Action | RTO |
|-----------------|----------------|-----------------|-----|
| Single ECS task failure | 30 seconds (health check) | ECS launches replacement | 2 minutes |
| Availability zone failure | Immediate | Traffic routes to healthy AZ | < 1 minute |
| RDS primary failure | 30-60 seconds | Automatic failover to standby | 1-2 minutes |
| Application bug deployment | 60 seconds (health check) | Circuit breaker rollback | 2-3 minutes |
| NAT Gateway failure | Immediate | Traffic routes to other AZ NAT | < 1 minute |

### Backup Strategy

**Database Backups:**
- Automated daily backups (7-day retention)
- Backup window: Sunday 04:00-05:00 UTC
- Point-in-time recovery enabled
- Backups stored across multiple AZs

**Infrastructure State:**
- Terraform state versioned in S3
- DynamoDB state locking prevents corruption
- State file encryption enabled

**Container Images:**
- Stored in ECR with lifecycle policies
- Last 10 images retained
- Signed with Cosign for integrity verification
- SBOM attached for supply chain tracking

---

## Monitoring & Observability

### CloudWatch Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                    CloudWatch Logs                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  /ecs/brewsecops-frontend-dev                                   │
│  • Container stdout/stderr                                       │
│  • Nginx access logs                                             │
│  • Application errors                                            │
│  • Retention: 7 days                                             │
│                                                                  │
│  /ecs/brewsecops-backend-dev                                    │
│  • API request logs                                              │
│  • Database connection logs                                      │
│  • Application errors                                            │
│  • Retention: 7 days                                             │
│                                                                  │
│  /aws/waf/brewsecops-dev                                        │
│  • Blocked requests                                              │
│  • Allowed requests                                              │
│  • Rule match details                                            │
│  • Retention: 30 days                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  Container Insights Metrics                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ECS Cluster Metrics:                                            │
│  • CPU utilization (cluster-wide)                                │
│  • Memory utilization (cluster-wide)                             │
│  • Task count (running, pending, stopped)                        │
│  • Network throughput                                            │
│                                                                  │
│  ECS Service Metrics:                                            │
│  • Service CPU utilization                                       │
│  • Service memory utilization                                    │
│  • Task restart count                                            │
│  • Deployment status                                             │
│                                                                  │
│  Task-Level Metrics:                                             │
│  • Individual task CPU                                           │
│  • Individual task memory                                        │
│  • Task network I/O                                              │
│  • Task storage I/O                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Cost Architecture

### Monthly Cost Breakdown (Production Configuration)

```
┌─────────────────────────────────────────────────────────────────┐
│  Service                │  Monthly Cost (EUR)  │  Percentage    │
├─────────────────────────┼─────────────────────┼────────────────┤
│  ECS Fargate (4 tasks)  │     €76             │     36.5%      │
│  NAT Gateway (2 AZs)    │     €70             │     33.7%      │
│  RDS Multi-AZ           │     €33             │     15.9%      │
│  Application Load Bal.  │     €18             │      8.7%      │
│  WAF                    │      €9             │      4.3%      │
│  CloudWatch Logs        │      €2             │      1.0%      │
│  ────────────────────────────────────────────────────────────  │
│  Total Monthly          │    €208             │     100%       │
└─────────────────────────────────────────────────────────────────┘

Notes:
- Production-grade configuration with Multi-AZ redundancy
- 24/7 operation for portfolio demonstration
- Costs based on eu-central-1 (Frankfurt) pricing
```

### Cost Optimization Opportunities

**Immediate Savings (Development Environment):**
- Single NAT Gateway: €35/month savings (reduces availability)
- RDS Single-AZ: €16/month savings (reduces availability)
- Fargate Spot: €30/month savings (increases interruption risk)

**Total Optimized Cost:** ~€127/month (39% reduction)

**Trade-offs:** Optimizations sacrifice high availability and are suitable only for development environments, not production demonstrations.

---

## Security Compliance & Best Practices

### IAM Least Privilege Implementation

**GitHub Actions OIDC Role:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::194722436853:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:AkingbadeOmosebi/brewsecops:*"
        }
      }
    }
  ]
}
```

**ECS Task Execution Role:**
- ECR image pull permissions
- CloudWatch Logs write permissions
- Secrets Manager read permissions (database credentials)

**ECS Task Role:**
- No permissions (application uses database connection only)
- Future: Add S3 read permissions for user uploads

### Network Security Model

**Principle: Zero Trust Network Access**

```
Internet ─┬─► ALB only (public subnets)
          │
          └─X─► ECS tasks (private subnets) - NO DIRECT ACCESS
                  │
                  └─► RDS (database subnets) - NO INTERNET ACCESS
```

All traffic flows through controlled entry points with security group validation.

---

## Technology Stack Summary

### Infrastructure Layer
- **Cloud Provider:** AWS (eu-central-1)
- **Infrastructure-as-Code:** Terraform 1.5+
- **Container Orchestration:** ECS Fargate (serverless)
- **Load Balancing:** Application Load Balancer
- **Database:** RDS PostgreSQL 15 (Multi-AZ)
- **DNS:** Route53
- **CDN/WAF:** AWS WAF
- **Certificates:** AWS Certificate Manager
- **Container Registry:** AWS ECR + GitHub Container Registry

### Application Layer
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js 20, Express.js
- **Database Client:** node-postgres (pg)
- **Web Server:** Nginx (frontend), Node.js (backend)

### CI/CD Layer
- **Pipeline:** GitHub Actions
- **Authentication:** OIDC (keyless)
- **Secret Scanning:** Gitleaks
- **Code Quality:** ESLint, SonarCloud
- **Dependency Scanning:** OWASP Dependency Check, Snyk
- **Container Scanning:** Trivy
- **Dockerfile Linting:** Hadolint
- **Image Signing:** Cosign (keyless OIDC)
- **SBOM Generation:** Syft (SPDX format)
- **Semantic Versioning:** semantic-release

### Monitoring Layer
- **Logs:** CloudWatch Logs
- **Metrics:** CloudWatch Metrics, Container Insights
- **Alerting:** CloudWatch Alarms (planned)
- **Security:** GitHub Security tab (SARIF integration)

---

## Deployment Statistics

| Metric | Value |
|--------|-------|
| AWS Resources Deployed | 76 |
| Terraform Modules | 11 |
| Infrastructure Code | 2,767 lines |
| Application Code | 7,401 lines |
| CI/CD Configuration | 450+ lines |
| Security Scanners | 6 |
| Documented Challenges | 14+ |
| Availability Zones | 2 |
| Subnets | 6 (2 public, 2 private, 2 database) |
| Security Groups | 3 (ALB, ECS, RDS) |
| Container Images | 2 (frontend, backend) |
| Docker Registries | 2 (ECR, GHCR) |

---

## Conclusion

I architected BrewSecOps to demonstrate enterprise-grade cloud platform engineering capabilities. The system implements defense-in-depth security, multi-AZ high availability, automated CI/CD with comprehensive security scanning, and infrastructure-as-code principles. Every component was deliberately chosen to showcase production-ready practices valued in the German tech market.

The architecture balances security, availability, and cost-effectiveness while maintaining complete transparency through documentation and open-source code. This project serves as a technical portfolio piece demonstrating my ability to design, deploy, and operate complex cloud infrastructure with DevSecOps maturity.

---

**Document Version:** 1.0  
**Last Updated:** January 9, 2026  
**Author:** Akingbade Omosebi  
**Contact:** Berlin, Germany | Cloud Platform Engineer