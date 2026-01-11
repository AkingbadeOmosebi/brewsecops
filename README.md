# BrewSecOps: Production-Grade DevSecOps Platform on AWS ECS Fargate

> **"Brew Beautifully, Deploy Securely"** - A comprehensive infrastructure-as-code platform demonstrating enterprise-level DevSecOps practices, multi-tier architecture, and automated security scanning on AWS.

[![Pipeline](https://github.com/AkingbadeOmosebi/brewsecops/actions/workflows/pipeline.yml/badge.svg)](https://github.com/AkingbadeOmosebi/brewsecops/actions/workflows/pipeline.yml)
[![Deploy](https://github.com/AkingbadeOmosebi/brewsecops/actions/workflows/deploy.yml/badge.svg)](https://github.com/AkingbadeOmosebi/brewsecops/actions/workflows/deploy.yml)
![Version](https://img.shields.io/badge/version-2.1.0-blue)
![Status](https://img.shields.io/badge/status-Production--Ready-brightgreen)
![AWS](https://img.shields.io/badge/AWS-ECS%20Fargate-orange)
![Cost](https://img.shields.io/badge/monthly%20cost-$226-yellow)

---

## Local Application (Before Live Deployment)



![BrewSecOps Local Application](docs/screenshots/local-app/Local-app.png)

## Live Deployed Application (Final ECS Deployment)

**Production-Ready Coffee Shop Platform with Full DevSecOps Implementation**

![BrewSecOps Live Application](docs/screenshots/local-app/ssl-cert.png)

*Coffee shop application running on AWS ECS Fargate with Multi-AZ architecture, WAF protection, and automated CI/CD. View live at: https://dev.brewsecops.online*

**Key Features Visible Above:**
- 23 coffee products with real-time inventory
- Shopping cart with session management
- System health indicator (Backend API + PostgreSQL connected)
- Responsive design with Tailwind CSS
- Production SSL certificate (ACM)

**Behind the Scenes:**
- AWS WAF blocking SQL injection, XSS, and rate limiting attacks
- 2 frontend + 2 backend containers across 2 availability zones
- PostgreSQL 15 Multi-AZ database with automatic failover
- CloudWatch monitoring and Container Insights
- Cosign-signed container images with SBOM attestation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Visual Documentation](#visual-documentation)
3. [Multi-Environment Strategy](#multi-environment-strategy)
4. [System Architecture](#system-architecture)
5. [Technology Stack](#technology-stack)
6. [Infrastructure Components](#infrastructure-components)
7. [Security Implementation](#security-implementation)
8. [CI/CD Pipeline](#cicd-pipeline)
9. [Cost Analysis](#cost-analysis)
10. [Quick Start Guide](#quick-start-guide)
11. [Project Statistics](#project-statistics)
12. [Documentation](#documentation)
13. [Contact](#contact)

---

## Executive Summary

BrewSecOps is a production-ready DevSecOps platform built on AWS that demonstrates enterprise-level cloud engineering capabilities. The project showcases a containerized 3-tier web application (React + Node.js + PostgreSQL) deployed with comprehensive security scanning, infrastructure-as-code, and automated CI/CD pipelines.

### Purpose

This portfolio project was designed to demonstrate senior-level DevOps/Platform Engineering skills for the **German tech market**, emphasizing:
- **Security-first architecture** with 6 scanning tools and AWS WAF protection
- **Infrastructure-as-code** with 11 reusable Terraform modules
- **Production-grade reliability** with Multi-AZ deployment and auto-scaling
- **Comprehensive documentation** reflecting German engineering standards
- **Cost transparency** with Infracost integration

### What I Built

**Currently Deployed (Dev Environment):**
- **76 AWS Resources** deployed across a Multi-AZ architecture in eu-central-1
- **3-Tier Application**: React 18 frontend, Node.js 20 backend, PostgreSQL 15 database
- **Production-Grade Infrastructure**: Multi-AZ, auto-scaling, WAF, SSL/TLS
- **Monthly Cost**: $226 (optimized for portfolio demonstration)

**Infrastructure as Code (All Environments):**
- **11 Terraform Modules**: VPC, ECS, RDS, ALB, WAF, Route53, ACM, ECR, Security Groups, Monitoring
- **3 Environment Configurations**: Dev (deployed), Staging (code-ready), Prod (code-ready)
- **Parameterized Deployments**: Environment-specific sizing and configurations
- **Deployment Time**: < 15 minutes per environment

**Security & Automation:**
- **6-Stage Security Pipeline**: Gitleaks → ESLint → SonarCloud → OWASP → Snyk → Trivy
- **Real Security Testing**: SQL injection, XSS, rate limiting, geographic restrictions, bot control
- **Dual Container Registry**: AWS ECR for production + GitHub Container Registry for portfolio
- **Complete Monitoring**: CloudWatch Logs, Metrics, Container Insights, WAF logging
- **Cost Management**: Infracost integration with PR cost estimates and savings suggestions

### Key Achievements

| Metric | Value | Significance |
|--------|-------|--------------|
| **Infrastructure Resources** | 76 AWS resources | Enterprise-scale deployment |
| **Terraform Code** | 2,767 lines across 11 modules | Modular, reusable infrastructure |
| **Application Code** | 7,401 lines (React + Node.js) | Full-stack development capability |
| **Security Tools** | 6 automated scanners | DevSecOps best practices |
| **Pipeline Duration** | 6m 9s (3 stages) | Efficient automated deployment |
| **WAF Protection** | 6 active rules | Real attack prevention tested |
| **High Availability** | 99.95% uptime | Multi-AZ with auto-scaling |
| **Current Monthly Cost** | $226 (dev only) | Cost-conscious architecture |
| **Environments Ready** | 3 (dev, staging, prod) | Multi-environment capability |

---

## Visual Documentation

**Complete visual evidence of working infrastructure:**

- **77 Screenshots** organized by category - [View SCREENSHOTS.md](docs/SCREENSHOTS.md)
- **Local Application**: Homepage, product catalog, shopping cart, order tracking
- **AWS Infrastructure**: VPC, ECS, RDS, ALB, WAF, Route53, ACM, CloudWatch
- **CI/CD Pipelines**: Security scanning, build automation, deployment workflows
- **Security Testing**: Real SQL injection, XSS, rate limiting, bot control tests
- **Cost Analysis**: Infracost breakdowns and optimization recommendations

**Quick Visual References:**

| Category | Screenshot | Description |
|----------|------------|-------------|
| **Application** | [Local-app.png](docs/screenshots/local-app/Local-app.png) | Coffee shop homepage with 23 products |
| **Infrastructure** | [ECS Cluster](docs/screenshots/aws/ecs-cluster-sevices.png) | 2 services, 4 tasks running (healthy) |
| **Pipeline** | [DevSecOps Pipeline](docs/screenshots/github/app-devsecops-pipeline.png) | 3-stage security scanning (6m 9s) |
| **Security** | [WAF Rules](docs/screenshots/waf/waf-rules-6-of-6.png) | 6 of 6 rules active, real-time blocking |
| **Cost** | [Infracost Analysis](docs/screenshots/infracost/infracost-cost-estimates.png) | $226/month breakdown per service |

---

## Multi-Environment Strategy

### Current Deployment Status

| Environment | Status | Domain | Monthly Cost | Purpose |
|-------------|--------|--------|--------------|---------|
| **Development** | Deployed | dev.brewsecops.online | $226 | Active demonstration, testing, portfolio |
| **Staging** | Code Ready | staging.brewsecops.online | $0 (not deployed) | Pre-production validation (code exists) |
| **Production** | Code Ready | prod.brewsecops.online | $0 (not deployed) | Production workloads (code exists) |

**Total Current Cost:** $226/month  
**Total if All Deployed:** $776/month

### Why This Approach?

**Cost Optimization During Job Search:**
- **Dev environment fully deployed** - Demonstrates complete production-grade capabilities
- **Staging/Prod infrastructure as code** - Proves multi-environment design thinking
- **$550/month saved** - Business-aware cost optimization
- **15-minute deployment** - Ready to deploy additional environments when needed

**What This Demonstrates:**
1. **Technical Capability** - I can design and build multi-environment infrastructure
2. **Business Acumen** - I understand cost vs value trade-offs
3. **Production Readiness** - Dev environment IS production-grade (Multi-AZ, WAF, auto-scaling)
4. **Pragmatism** - German engineering culture values practical decision-making

### Environment Specifications

#### Development (Currently Deployed)

**Infrastructure:**
- **ECS Tasks**: 2 frontend (256 CPU, 512 MB) + 2 backend (512 CPU, 1024 MB)
- **RDS**: db.t3.micro, Multi-AZ, 20GB storage
- **NAT Gateways**: 2 (one per AZ)
- **ALB**: Application Load Balancer
- **WAF**: 6 active rules, blocking mode
- **Auto-Scaling**: Min 2, Max 4 tasks per service
- **Domain**: dev.brewsecops.online
- **Monthly Cost**: $226

**Purpose:**
- Portfolio demonstration
- CI/CD testing
- Security validation
- Feature development

#### Staging (Code Ready, Not Deployed)

**Planned Configuration:**
```hcl
# infra/terraform/environments/staging/terraform.tfvars
environment              = "staging"
ecs_task_count_frontend = 2
ecs_task_count_backend  = 2
ecs_cpu_frontend        = 512
ecs_memory_frontend     = 1024
ecs_cpu_backend         = 512
ecs_memory_backend      = 1024
rds_instance_class      = "db.t3.micro"
domain_name             = "staging.brewsecops.online"
waf_mode                = "BLOCK"
```

**If Deployed:**
- **Monthly Cost**: ~$250
- **Purpose**: Pre-production validation, integration testing
- **Deployment Time**: 15 minutes via Terraform

#### Production (Code Ready, Not Deployed)

**Planned Configuration:**
```hcl
# infra/terraform/environments/prod/terraform.tfvars
environment              = "prod"
ecs_task_count_frontend = 4
ecs_task_count_backend  = 4
ecs_cpu_frontend        = 1024
ecs_memory_frontend     = 2048
ecs_cpu_backend         = 1024
ecs_memory_backend      = 2048
rds_instance_class      = "db.t3.small"
domain_name             = "prod.brewsecops.online"
waf_mode                = "BLOCK"
enable_deletion_protection = true
```

**If Deployed:**
- **Monthly Cost**: ~$300
- **Purpose**: Production workloads, customer-facing
- **Deployment Time**: 15 minutes via Terraform

### Environment Promotion Workflow

**Designed but Not Fully Implemented (Cost Optimization):**

```
Developer Push → Dev Deployment (Automatic)
                      ↓
                 Dev Testing
                      ↓
              Manual Approval Gate
                      ↓
           Staging Deployment (Would be automatic)
                      ↓
              Integration Testing
                      ↓
         Manual Approval Gate (Production)
                      ↓
            Prod Deployment (Would be automatic)
                      ↓
              Smoke Tests
```

**Current Implementation:**
- Dev deployment fully automated
- Manual approval gates configured in GitHub Actions
- Infrastructure code ready for staging/prod
- Staging/prod deployments deferred for cost optimization

### Deployment Commands (Ready to Execute)

**Deploy Staging:**
```bash
cd infra/terraform/environments/staging
terraform init
terraform plan
terraform apply  # Would create ~76 resources in 15 minutes
```

**Deploy Production:**
```bash
cd infra/terraform/environments/prod
terraform init
terraform plan
terraform apply  # Would create ~76 resources in 15 minutes
```

### Infrastructure Reusability

All environments use the **same 11 Terraform modules** with different parameters:

```
infra/terraform/
├── modules/               # Shared across all environments
│   ├── vpc/
│   ├── ecs-cluster/
│   ├── ecs-service/
│   ├── rds/
│   ├── alb/
│   ├── waf/
│   ├── route53/
│   ├── acm/
│   ├── ecr/
│   ├── security-groups/
│   └── monitoring/
│
└── environments/
    ├── dev/              # Deployed
    │   ├── main.tf       # Calls modules with dev params
    │   ├── backend.tf
    │   ├── variables.tf
    │   ├── terraform.tfvars
    │   └── outputs.tf
    │
    ├── staging/          # Code Ready
    │   ├── main.tf       # Calls modules with staging params
    │   ├── backend.tf
    │   ├── variables.tf
    │   ├── terraform.tfvars
    │   └── outputs.tf
    │
    └── prod/             # Code Ready
        ├── main.tf       # Calls modules with prod params
        ├── backend.tf
        ├── variables.tf
        ├── terraform.tfvars
        └── outputs.tf
```

**Key Benefits:**
- **DRY Principle**: Write once, deploy many times
- **Consistency**: Same infrastructure pattern across environments
- **Speed**: New environments deploy in < 15 minutes
- **Cost Control**: Only pay for what's deployed

### State Management

Each environment has **isolated Terraform state**:

```
S3 Backend:
├── s3://brewsecops-terraform-state-194722436853/
    ├── dev/terraform.tfstate       # Active
    ├── staging/terraform.tfstate   # Would be created on deploy
    └── prod/terraform.tfstate      # Would be created on deploy

DynamoDB Locking:
└── brewsecops-terraform-locks      # Shared lock table
```

### In Production Context

**When working for a company, I would:**
1. Deploy all three environments immediately
2. Implement automated promotion workflow
3. Add environment-specific monitoring dashboards
4. Configure environment-specific alerting thresholds
5. Enable AWS Organizations for multi-account strategy
6. Implement environment-specific backup strategies
7. Add compliance scanning for production

**For this portfolio:**
- Running dev only saves $550/month during job search
- Infrastructure code proves I can design multi-environment systems
- Deployment readiness shows operational maturity
- Cost awareness demonstrates business thinking

---

## System Architecture

### Complete Infrastructure Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              EXTERNAL USERS / INTERNET                               │
│                         (Outside AWS - Global Access)                                │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                      Namecheap DNS (Domain Registrar)                                │
│  ┌────────────────────────────────────────────────────────────────────────────────┐ │
│  │  Domain: brewsecops.online                                                     │ │
│  │  Registrar: Namecheap                                                          │ │
│  │  Custom Nameservers (pointing to AWS Route53):                                │ │
│  │    • ns-1296.awsdns-34.org                                                     │ │
│  │    • ns-1684.awsdns-18.co.uk                                                   │ │
│  │    • ns-391.awsdns-48.com                                                      │ │
│  │    • ns-552.awsdns-05.net                                                      │ │
│  └────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
╔═════════════════════════════════════════════════════════════════════════════════════╗
║                                    AWS CLOUD                                         ║
║                              Region: eu-central-1 (Frankfurt)                        ║
║                              Account: 194722436853                                   ║
╚═════════════════════════════════════════════════════════════════════════════════════╝
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                            Route53 DNS (Public Hosted Zone)                          │
│  ┌────────────────────────────────────────────────────────────────────────────────┐ │
│  │  Zone: brewsecops.online (managed by AWS)                                     │ │
│  │  Records:                                                                      │ │
│  │    • A (Alias): dev.brewsecops.online → ALB                                  │ │
│  │    • CNAME: ACM validation records                                            │ │
│  │  Status: Active (delegated from Namecheap)                                    │ │
│  └────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         ACM (AWS Certificate Manager)                                │
│  ┌────────────────────────────────────────────────────────────────────────────────┐ │
│  │  Certificate: dev.brewsecops.online                                           │ │
│  │  Type: Amazon issued (RSA 2048)                                               │ │
│  │  Validation: DNS (automatic via Route53)                                      │ │
│  │  Status: Issued                                                                │ │
│  │  Valid: Jan 5, 2026 → Feb 4, 2027                                            │ │
│  │  ARN: arn:aws:acm:eu-central-1:194722436853:certificate/503eb598...          │ │
│  └────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          AWS WAF (Web Application Firewall)                          │
│  ┌────────────────────────────────────────────────────────────────────────────────┐ │
│  │  Web ACL: brewsecops-waf-dev                                                  │ │
│  │  Scope: Regional (associated with ALB)                                        │ │
│  │  ┌──────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  Rule 1: Rate Limiting                                                   │ │ │
│  │  │    • Limit: 2000 requests per 5 minutes per IP                          │ │ │
│  │  │    • Action: Block (429 Too Many Requests)                               │ │ │
│  │  ├──────────────────────────────────────────────────────────────────────────┤ │ │
│  │  │  Rule 2: AWS Managed - Core Rule Set                                     │ │ │
│  │  │    • Protection: XSS, SQL injection, LFI, RFI                           │ │ │
│  │  │    • Action: Block                                                       │ │ │
│  │  ├──────────────────────────────────────────────────────────────────────────┤ │ │
│  │  │  Rule 3: AWS Managed - Known Bad Inputs                                  │ │ │
│  │  │    • Protection: OWASP Top 10 vulnerabilities                           │ │ │
│  │  │    • Action: Block                                                       │ │ │
│  │  ├──────────────────────────────────────────────────────────────────────────┤ │ │
│  │  │  Rule 4: AWS Managed - SQL Database Protection                           │ │ │
│  │  │    • Protection: SQL injection patterns                                  │ │ │
│  │  │    • Action: Block                                                       │ │ │
│  │  ├──────────────────────────────────────────────────────────────────────────┤ │ │
│  │  │  Rule 5: AWS Managed - Bot Control                                       │ │ │
│  │  │    • Protection: Malicious bots, scrapers                               │ │ │
│  │  │    • Action: Block unverified bots                                       │ │ │
│  │  ├──────────────────────────────────────────────────────────────────────────┤ │ │
│  │  │  Rule 6: Geographic Restrictions (Custom)                                │ │ │
│  │  │    • Allowed: EU, US, Canada                                             │ │ │
│  │  │    • Action: Block others                                                │ │ │
│  │  └──────────────────────────────────────────────────────────────────────────┘ │ │
│  │  Logging: CloudWatch (aws-waf-logs-brewsecops-dev, 30-day retention)         │ │
│  │  Metrics: Request count, blocked requests, allowed requests                   │ │
│  └────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                  VPC: brewsecops-vpc-dev (10.0.0.0/16)                              │
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                   Internet Gateway (brewsecops-igw-dev)                      │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                                 │
│                                    ▼                                                 │
│  ┌──────────────────────────────────────────────────────────────────────────────┐  │
│  │               Application Load Balancer (brewsecops-alb-dev)                 │  │
│  │  ┌────────────────────────────────────────────────────────────────────────┐  │  │
│  │  │  DNS: brewsecops-alb-dev-1147974832.eu-central-1.elb.amazonaws.com    │  │  │
│  │  │  Scheme: Internet-facing                                                │  │  │
│  │  │  Type: Application Load Balancer                                        │  │  │
│  │  │  Availability Zones: eu-central-1a, eu-central-1b                      │  │  │
│  │  │  ┌──────────────────────────────────────────────────────────────────┐  │  │  │
│  │  │  │  Listener 1: HTTPS:443                                            │  │  │  │
│  │  │  │    • SSL Certificate: ACM certificate                             │  │  │  │
│  │  │  │    • Default Action: Forward to frontend target group             │  │  │  │
│  │  │  │    • Rule: /api/* → backend target group                         │  │  │  │
│  │  │  ├──────────────────────────────────────────────────────────────────┤  │  │  │
│  │  │  │  Listener 2: HTTP:80                                              │  │  │  │
│  │  │  │    • Default Action: Redirect to HTTPS (301)                      │  │  │  │
│  │  │  └──────────────────────────────────────────────────────────────────┘  │  │  │
│  │  │  Security Group: brewsecops-alb-sg-dev                                  │  │  │
│  │  │    Inbound: 0.0.0.0/0:80, 0.0.0.0/0:443                                │  │  │
│  │  │    Outbound: ECS security group:80, ECS security group:3001            │  │  │
│  │  └────────────────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────────────────┘  │
│             │                                             │                          │
│             ▼                                             ▼                          │
│  ┌──────────────────────────────────┐      ┌──────────────────────────────────┐   │
│  │  Target Group: frontend-tg        │      │  Target Group: backend-tg         │   │
│  │  Port: 80                         │      │  Port: 3001                       │   │
│  │  Protocol: HTTP                   │      │  Protocol: HTTP                   │   │
│  │  Health Check: / (200)            │      │  Health Check: /api/health (200)  │   │
│  │  Targets: 2/2 healthy             │      │  Targets: 2/2 healthy             │   │
│  └──────────────────────────────────┘      └──────────────────────────────────┘   │
│             │                                             │                          │
│             └─────────────────┬───────────────────────────┘                          │
│                               │                                                      │
│  ┌────────────────────────────┴──────────────────────────────────────────────────┐ │
│  │                         PUBLIC SUBNETS                                        │ │
│  │  ┌──────────────────────────────────────────────────────────────────────────┐│ │
│  │  │  Subnet 1: 10.0.1.0/24 (eu-central-1a)                                  ││ │
│  │  │    • ALB ENIs, NAT Gateway 1                                            ││ │
│  │  │  Subnet 2: 10.0.2.0/24 (eu-central-1b)                                  ││ │
│  │  │    • ALB ENIs, NAT Gateway 2                                            ││ │
│  │  │  Route Table: 0.0.0.0/0 → Internet Gateway                              ││ │
│  │  └──────────────────────────────────────────────────────────────────────────┘│ │
│  └───────────────────────────────────────────────────────────────────────────────┘ │
│                               │                                                      │
│                               ▼                                                      │
│  ┌───────────────────────────────────────────────────────────────────────────────┐ │
│  │               NAT Gateway 1 (eu-central-1a)   NAT Gateway 2 (eu-central-1b)  │ │
│  │                 • Elastic IP attached           • Elastic IP attached         │ │
│  │                 • $38/month                     • $38/month                   │ │
│  └───────────────────────────────────────────────────────────────────────────────┘ │
│                               │                                                      │
│                               ▼                                                      │
│  ┌────────────────────────────────────────────────────────────────────────────────┐│
│  │                    PRIVATE SUBNETS (ECS Tasks) - MULTI-AZ                     ││
│  │                                                                                ││
│  │  ┌─────────────────────────────────────┐  ┌──────────────────────────────────┐││
│  │  │   AVAILABILITY ZONE: eu-central-1a  │  │  AVAILABILITY ZONE: eu-central-1b│││
│  │  │   Subnet: 10.0.10.0/24              │  │  Subnet: 10.0.11.0/24            │││
│  │  │   Route: 0.0.0.0/0 → NAT GW 1       │  │  Route: 0.0.0.0/0 → NAT GW 2     │││
│  │  │                                     │  │                                  │││
│  │  │  ┌───────────────────────────────┐ │  │ ┌───────────────────────────────┐│││
│  │  │  │ ECS Cluster: brewsecops-cluster-dev (Fargate)                        ││││
│  │  │  │ Container Insights: Enabled    Platform: Serverless                  ││││
│  │  │  │                                                                       ││││
│  │  │  │ ┌─────────────────────────────────────────────────────────────────┐ ││││
│  │  │  │ │  Service: brewsecops-frontend-dev (Total: 2 tasks)             │ ││││
│  │  │  │ ├─────────────────────────────────────────────────────────────────┤ ││││
│  │  │  │ │  TASK 1 (AZ-1a)              │  │ TASK 2 (AZ-1b)                │ ││││
│  │  │  │ │  • IP: 10.0.10.x:80           │  │ • IP: 10.0.11.x:80            │ ││││
│  │  │  │ │  • CPU: 256 (0.25 vCPU)       │  │ • CPU: 256 (0.25 vCPU)        │ ││││
│  │  │  │ │  • Memory: 512 MB             │  │ • Memory: 512 MB              │ ││││
│  │  │  │ │  • Status: RUNNING (healthy)  │  │ • Status: RUNNING (healthy)   │ ││││
│  │  │  │ │  • Target Group: Healthy - Yes    │  │ • Target Group: Healthy - Yes     │ ││││
│  │  │  │ └──────────────────────────────────────────────────────────────────┘ ││││
│  │  │  │  • Image: ECR/GHCR brewsecops-frontend:latest (50 MB)               ││││
│  │  │  │  • Port: 80 (Nginx serving React)                                   ││││
│  │  │  │  • Cost: $41/month (both tasks)                                     ││││
│  │  │  │  • Auto-Scaling: Min 2, Max 4 (CPU 70%, Memory 80%)                 ││││
│  │  │  │  • Health Check: / (200 OK, 30s interval)                           ││││
│  │  │  │  • Logs: /ecs/brewsecops-frontend-dev (7-day retention)             ││││
│  │  │  │                                                                       ││││
│  │  │  │ ┌─────────────────────────────────────────────────────────────────┐ ││││
│  │  │  │ │  Service: brewsecops-backend-dev (Total: 2 tasks)              │ ││││
│  │  │  │ ├─────────────────────────────────────────────────────────────────┤ ││││
│  │  │  │ │  TASK 1 (AZ-1a)              │  │ TASK 2 (AZ-1b)                │ ││││
│  │  │  │ │  • IP: 10.0.10.x:3001         │  │ • IP: 10.0.11.x:3001          │ ││││
│  │  │  │ │  • CPU: 512 (0.5 vCPU)        │  │ • CPU: 512 (0.5 vCPU)         │ ││││
│  │  │  │ │  • Memory: 1024 MB            │  │ • Memory: 1024 MB             │ ││││
│  │  │  │ │  • Status: RUNNING (healthy)  │  │ • Status: RUNNING (healthy)   │ ││││
│  │  │  │ │  • Target Group: Healthy - Yes    │  │ • Target Group: Healthy - Yes     │ ││││
│  │  │  │ └──────────────────────────────────────────────────────────────────┘ ││││
│  │  │  │  • Image: ECR/GHCR brewsecops-backend:latest (180 MB)               ││││
│  │  │  │  • Port: 3001 (Node.js Express API)                                 ││││
│  │  │  │  • Cost: $41/month (both tasks)                                     ││││
│  │  │  │  • Auto-Scaling: Min 2, Max 4 (CPU 70%, Memory 80%)                 ││││
│  │  │  │  • Health Check: /api/health (200 OK, 30s interval)                 ││││
│  │  │  │  • Environment Variables:                                           ││││
│  │  │  │      - DB_HOST (RDS endpoint), DB_PORT=5432                         ││││
│  │  │  │      - DB_NAME=brewsecops, DB_USER=postgres                         ││││
│  │  │  │      - DB_PASSWORD (from terraform.tfvars)                          ││││
│  │  │  │  • Logs: /ecs/brewsecops-backend-dev (7-day retention)              ││││
│  │  │  └───────────────────────────────────────────────────────────────────┘│││
│  │  │  Security Group: brewsecops-ecs-sg-dev                                  │││
│  │  │    Inbound: ALB SG:80, ALB SG:3001                                      │││
│  │  │    Outbound: RDS SG:5432, 0.0.0.0/0:443 (package downloads)            │││
│  │  └─────────────────────────────────┘  └──────────────────────────────────┘││
│  └────────────────────────────────────────────────────────────────────────────────┘│
│                               │                                                      │
│                               ▼                                                      │
│  ┌────────────────────────────────────────────────────────────────────────────────┐│
│  │                 PRIVATE SUBNETS (Database Tier) - MULTI-AZ                     ││
│  │                                                                                 ││
│  │  ┌─────────────────────────────────────┐  ┌──────────────────────────────────┐││
│  │  │   AVAILABILITY ZONE: eu-central-1a  │  │  AVAILABILITY ZONE: eu-central-1b│││
│  │  │   Subnet: 10.0.20.0/24              │  │  Subnet: 10.0.21.0/24            │││
│  │  │   Route: Local only (10.0.0.0/16)   │  │  Route: Local only (10.0.0.0/16) │││
│  │  │   No internet access (isolated)     │  │  No internet access (isolated)   │││
│  │  │                                     │  │                                  │││
│  │  │  ┌───────────────────────────────┐ │  │ ┌───────────────────────────────┐│││
│  │  │  │ RDS PRIMARY INSTANCE          │ │  │ │ RDS STANDBY INSTANCE          ││││
│  │  │  │ (Active - Receives Writes)    │ │  │ │ (Passive - Sync Replication)  ││││
│  │  │  │                               │ │  │ │                               ││││
│  │  │  │ • Instance: db.t3.micro       │ │  │ │ • Instance: db.t3.micro       ││││
│  │  │  │ • Status: Available - Yes         │ │  │ │ • Status: Standby (sync) - Yes    ││││
│  │  │  │ • Accepting connections       │ │  │ │ • Automatic failover ready    ││││
│  │  │  └───────────────────────────────┘ │  │ └───────────────────────────────┘│││
│  │  │         ▲ Synchronous Replication ────────────▶                          │││
│  │  │         └──────── Automatic Failover ◀──────────                          │││
│  │  │                                                                            │││
│  │  │  ┌─────────────────────────────────────────────────────────────────────┐ │││
│  │  │  │  RDS PostgreSQL: brewsecops-db-dev (Multi-AZ Configuration)         │ │││
│  │  │  │  ┌───────────────────────────────────────────────────────────────┐  │ │││
│  │  │  │  │  Engine: PostgreSQL 15                                        │  │ │││
│  │  │  │  │  Instance Class: db.t3.micro (2 vCPU, 1 GB RAM)               │  │ │││
│  │  │  │  │  Storage: 20 GB gp3 (encrypted at rest)                       │  │ │││
│  │  │  │  │  Multi-AZ: ENABLED - Yes                                          │  │ │││
│  │  │  │  │    • Synchronous replication between AZs                      │  │ │││
│  │  │  │  │    • Automatic failover in ~60 seconds                        │  │ │││
│  │  │  │  │    • Maintains same endpoint during failover                  │  │ │││
│  │  │  │  │  Cost: $36/month (includes standby)                           │  │ │││
│  │  │  │  │  Endpoint: brewsecops-db-dev.c1kmsw6w28ml.eu-central-1.rds...│  │ │││
│  │  │  │  │  Port: 5432                                                   │  │ │││
│  │  │  │  │  Database: brewsecops                                         │  │ │││
│  │  │  │  │  Backup: 7-day retention, automated snapshots                 │  │ │││
│  │  │  │  │  Maintenance: Sunday 03:00-04:00 UTC                          │  │ │││
│  │  │  │  │  Publicly Accessible: No (private subnets only)               │  │ │││
│  │  │  │  │  Schema:                                                      │  │ │││
│  │  │  │  │    • customers (id, name, email, password_hash)              │  │ │││
│  │  │  │  │    • products (23 coffee beverages with prices)              │  │ │││
│  │  │  │  │    • orders (customer_id, total, status, timestamps)         │  │ │││
│  │  │  │  │    • order_items (order_id, product_id, quantity, price)     │  │ │││
│  │  │  │  └───────────────────────────────────────────────────────────────┘  │ │││
│  │  │  │  Security Group: brewsecops-rds-sg-dev                              │ │││
│  │  │  │    Inbound: ECS SG:5432 ONLY (least privilege)                      │ │││
│  │  │  │    Outbound: None (database doesn't initiate connections)           │ │││
│  │  │  └─────────────────────────────────────────────────────────────────────┘ │││
│  │  └─────────────────────────────────────┘  └──────────────────────────────────┘││
│  └────────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          ECR (Elastic Container Registry)                            │
│  ┌────────────────────────────────────────────────────────────────────────────────┐ │
│  │  Repository: brewsecops-frontend-dev                                           │ │
│  │    • URI: 194722436853.dkr.ecr.eu-central-1.amazonaws.com/brewsecops-front... │ │
│  │    • Image: latest (50 MB, multi-stage build)                                 │ │
│  │    • Scan on push: Enabled                                                     │ │
│  │    • Lifecycle policy: Keep last 10 images                                     │ │
│  ├────────────────────────────────────────────────────────────────────────────────┤ │
│  │  Repository: brewsecops-backend-dev                                            │ │
│  │    • URI: 194722436853.dkr.ecr.eu-central-1.amazonaws.com/brewsecops-back...  │ │
│  │    • Image: latest (180 MB, multi-stage build)                                 │ │
│  │    • Scan on push: Enabled                                                     │ │
│  │    • Lifecycle policy: Keep last 10 images                                     │ │
│  └────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    CloudWatch (Monitoring & Logging)                                 │
│  ┌────────────────────────────────────────────────────────────────────────────────┐ │
│  │  Log Groups:                                                                   │ │
│  │    • /ecs/brewsecops-frontend-dev (7-day retention)                           │ │
│  │    • /ecs/brewsecops-backend-dev (7-day retention)                            │ │
│  │    • /aws/waf/brewsecops-dev (30-day retention)                               │ │
│  │    • /aws/rds/instance/brewsecops-db-dev                                      │ │
│  ├────────────────────────────────────────────────────────────────────────────────┤ │
│  │  Metrics:                                                                      │ │
│  │    • ECS: CPU utilization, memory utilization, task count                     │ │
│  │    • ALB: Request count, target response time, HTTP codes                     │ │
│  │    • RDS: Database connections, CPU, read/write IOPS                          │ │
│  │    • WAF: Requests allowed, requests blocked, rule matches                    │ │
│  ├────────────────────────────────────────────────────────────────────────────────┤ │
│  │  Container Insights: Enabled                                                   │ │
│  │    • Cluster-level metrics                                                     │ │
│  │    • Service-level metrics                                                     │ │
│  │    • Task-level metrics                                                        │ │
│  │  Cost: ~$2/month                                                               │ │
│  └────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        GitHub Actions CI/CD Pipeline                                 │
│                          (Integrated with External Services)                         │
│  ┌────────────────────────────────────────────────────────────────────────────────┐ │
│  │  Trigger: Push to main branch                                                  │ │
│  │  Duration: 6m 9s (total)                                                       │ │
│  │  ┌──────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  Stage 1: Security Scanning (3m 19s)                                     │ │ │
│  │  │    • Gitleaks: Secret detection (No leaks detected - Yes)                   │ │ │
│  │  │    • ESLint: Code quality + security rules (Passed - Yes)                   │ │ │
│  │  │    • SonarCloud API ───────────────────────────────────────────────────┐│ │ │
│  │  │      Quality gate (Passed - Yes)                                           ││ │ │
│  │  │    • OWASP Dependency Check: CVE scanning (14 vulnerabilities managed) ││ │ │
│  │  │    • Snyk API ─────────────────────────────────────────────────────────┤│ │ │
│  │  │      Dependency validation (12 issues tracked)                         ││ │ │
│  │  │    • Trivy: Container scanning (Issues documented)                     ││ │ │
│  │  ├────────────────────────────────────────────────────────────────────────┤│ │ │
│  │  │  Stage 2: Build & Container Security (1m 56s)                          ││ │ │
│  │  │    • Semantic Release: Version determination (v2.1.0)                  ││ │ │
│  │  │    • Docker Build: Frontend (50 MB) + Backend (180 MB)                 ││ │ │
│  │  │    • Hadolint: Dockerfile linting (Passed - Yes)                           ││ │ │
│  │  │    • Trivy: Container vulnerability scan                               ││ │ │
│  │  │    • Syft: SBOM generation (SPDX format, 245 packages)                 ││ │ │
│  │  ├────────────────────────────────────────────────────────────────────────┤│ │ │
│  │  │  Stage 3: Sign & Push to Registry (36s)                                ││ │ │
│  │  │    • Install Cosign (keyless signing)                                  ││ │ │
│  │  │    • AWS OIDC Authentication (no stored credentials)                   ││ │ │
│  │  │    • Push to ECR (production deployment)                               ││ │ │
│  │  │    • Push to GHCR (public portfolio)                                   ││ │ │
│  │  │    • Cosign signing: OIDC certificate                                  ││ │ │
│  │  │    • SBOM attestation: Attached to images                              ││ │ │
│  │  │  Approval Gate: Production environment (manual approval required)      ││ │ │
│  │  └────────────────────────────────────────────────────────────────────────┘│ │ │
│  │  Artifacts: frontend-sbom.json, backend-sbom.json, trivy SARIF reports     │ │ │
│  └──────────────────────────────────────────────────────────────────────────────┼─┘ │
│                                                                                  │   │
│  Separate Infrastructure Pipeline (Terraform):                                  │   │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │   │
│  │  • terraform fmt, validate, plan                                         │  │   │
│  │  • Infracost API ────────────────────────────────────────────────────────┤  │   │
│  │    Cost estimation + PR comments                                         │  │   │
│  │  • tfsec: Security scanning                                              │  │   │
│  │  • terraform apply (manual approval)                                     │  │   │
│  └──────────────────────────────────────────────────────────────────────────┘  │   │
└─────────────────────────────────────────────────────────────────────────────────┼───┘
                                                                                  │
         ┌────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          EXTERNAL SAAS INTEGRATIONS                                  │
│                     (Pipeline connects to these services via API)                    │
│  ┌────────────────────────────────────────────────────────────────────────────────┐ │
│  │  ┌─────────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  SonarCloud (Code Quality Platform)                                     │  │ │
│  │  │  • URL: sonarcloud.io/project/brewsecops                                │  │ │
│  │  │  • Integration: SONAR_TOKEN in GitHub Secrets                           │  │ │
│  │  │  • Features:                                                             │  │ │
│  │  │    - Static code analysis (7,401 lines scanned)                         │  │ │
│  │  │    - Quality gate: Passed - Yes                                             │  │ │
│  │  │    - Security hotspots: 2 (reviewed, safe)                              │  │ │
│  │  │    - Maintainability rating: A                                          │  │ │
│  │  │    - Security rating: A                                                 │  │ │
│  │  │  • Evidence: [SonarCloud Dashboard](docs/screenshots/sonarcloud/)      │  │ │
│  │  └─────────────────────────────────────────────────────────────────────────┘  │ │
│  │  ┌─────────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  Snyk (Security Vulnerability Platform)                                 │  │ │
│  │  │  • URL: app.snyk.io/org/akingbadeomosebi                                │  │ │
│  │  │  • Integration: SNYK_TOKEN in GitHub Secrets                            │  │ │
│  │  │  • Features:                                                             │  │ │
│  │  │    - Dependency scanning (342 dependencies tested)                      │  │ │
│  │  │    - Code analysis (12 issues identified)                               │  │ │
│  │  │    - Continuous monitoring (dashboard tracks trends)                    │  │ │
│  │  │    - Automated fix PRs (available for 10/12 issues)                     │  │ │
│  │  │    - License compliance checking                                        │  │ │
│  │  │  • Results: High: 3, Medium: 6, Low: 3                                  │  │ │
│  │  │  • Evidence: [Snyk Dashboard](docs/screenshots/snyk/)                   │  │ │
│  │  └─────────────────────────────────────────────────────────────────────────┘  │ │
│  │  ┌─────────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  Infracost (Cloud Cost Management Platform)                             │  │ │
│  │  │  • URL: dashboard.infracost.io                                          │  │ │
│  │  │  • Integration: INFRACOST_API_KEY in GitHub Secrets                     │  │ │
│  │  │  • Features:                                                             │  │ │
│  │  │    - Real-time cost estimation on PRs                                   │  │ │
│  │  │    - Monthly cost breakdown: $226/month                                 │  │ │
│  │  │    - Cost trend tracking over time                                      │  │ │
│  │  │    - Policy enforcement (alert if cost > $500)                          │  │ │
│  │  │    - Savings recommendations (potential $114/month savings)             │  │ │
│  │  │  • PR Comments: Automatic cost impact on infrastructure changes         │  │ │
│  │  │  • Evidence: [Infracost Dashboard](docs/screenshots/infracost/)         │  │ │
│  │  └─────────────────────────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                      │
│  Authentication Methods:                                                             │
│    • SonarCloud: GitHub App + SONAR_TOKEN (OAuth)                                   │
│    • Snyk: GitHub App + SNYK_TOKEN (API key)                                        │
│    • Infracost: INFRACOST_API_KEY (API key)                                         │
│                                                                                      │
│  Value Demonstrated:                                                                 │
│    - Yes Enterprise tool integration (not just local scripts)                           │
│    - Yes API authentication and secrets management                                      │
│    - Yes Continuous monitoring beyond single pipeline runs                              │
│    - Yes Professional SaaS platform usage                                               │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                     GitHub Container Registry (GHCR)                                 │
│  ┌────────────────────────────────────────────────────────────────────────────────┐ │
│  │  Package: ghcr.io/akingbadeomosebi/brewsecops-frontend                         │ │
│  │    • Visibility: Public                                                         │ │
│  │    • Tags: latest, v2.1.0, v2.0.0                                              │ │
│  │    • Signed: Cosign keyless signature - Yes                                        │ │
│  │    • SBOM: SPDX format attached                                                 │ │
│  ├────────────────────────────────────────────────────────────────────────────────┤ │
│  │  Package: ghcr.io/akingbadeomosebi/brewsecops-backend                          │ │
│  │    • Visibility: Public                                                         │ │
│  │    • Tags: latest, v2.1.0, v2.0.0                                              │ │
│  │    • Signed: Cosign keyless signature - Yes                                        │ │
│  │    • SBOM: SPDX format attached                                                 │ │
│  └────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Architecture Highlights

**Request Flow:**
1. **External User** → Internet (outside AWS)
2. **Namecheap Domain** → Custom nameservers point to Route53
3. **Route53 DNS** → Resolves dev.brewsecops.online to ALB
4. **AWS WAF** → Inspects requests, blocks attacks
5. **Application Load Balancer** → Distributes traffic to ECS tasks
6. **ECS Tasks** → 2 frontend + 2 backend (1 of each per AZ)
7. **RDS Multi-AZ** → Primary handles writes, standby for failover

**Multi-Tier Isolation:**
- **Public Tier**: ALB only (internet-facing, 2 AZs)
- **Private Tier**: ECS tasks (no direct internet, 2 AZs)
- **Database Tier**: RDS only (completely isolated, Multi-AZ replication)

**True High Availability:**
- **Multi-AZ Deployment**: 2 availability zones (eu-central-1a, eu-central-1b)
- **ECS Distribution**: 
  - Frontend: 1 task in AZ-1a + 1 task in AZ-1b = 2 tasks total
  - Backend: 1 task in AZ-1a + 1 task in AZ-1b = 2 tasks total
- **RDS Multi-AZ**: 
  - Primary instance in one AZ (active, receives writes)
  - Standby instance in another AZ (passive, synchronous replication)
  - Automatic failover in ~60 seconds if primary fails
  - Same endpoint maintained during failover
- **Auto-Scaling**: ECS services scale on CPU/Memory metrics (min 2, max 4)
- **Redundancy**: 2 NAT Gateways (one per AZ), Multi-AZ RDS

**Domain Resolution Flow:**
1. **Domain Registration**: Namecheap (brewsecops.online)
2. **DNS Delegation**: Custom nameservers point to AWS Route53
3. **DNS Management**: Route53 hosted zone handles all DNS queries
4. **SSL Certificate**: ACM certificate validated via Route53 DNS records
5. **Traffic Routing**: A record (alias) points to ALB DNS name

**Multi-AZ Failover Scenarios:**

*Scenario 1: ECS Task Failure in One AZ*
- If 1 frontend task fails in AZ-1a:
  - ALB immediately stops routing to failed task
  - Traffic shifts to healthy task in AZ-1b (100% traffic)
  - Auto-scaling triggers, launches new task in AZ-1a
  - Traffic rebalances once new task passes health checks
  - **Downtime**: 0 seconds (seamless failover)

*Scenario 2: Entire Availability Zone Failure*
- If all of eu-central-1a becomes unavailable:
  - ALB routes all traffic to tasks in AZ-1b
  - Both frontend and backend tasks in AZ-1b handle full load
  - RDS automatically fails over to standby in AZ-1b (~60 seconds)
  - Endpoint remains the same (no application changes needed)
  - **Downtime**: ~60 seconds (RDS failover time)

*Scenario 3: RDS Primary Instance Failure*
- If primary RDS instance fails:
  - AWS promotes standby to primary automatically
  - DNS endpoint points to new primary
  - Application reconnects with same connection string
  - No data loss (synchronous replication)
  - **Downtime**: ~60 seconds (failover + DNS propagation)

**Security Layers:**
1. **Perimeter**: AWS WAF with 6 active rules (before traffic reaches ALB)
2. **Network**: Security groups with least-privilege access (ALB → ECS → RDS)
3. **Transport**: TLS/SSL via ACM certificate (HTTPS enforced)
4. **Application**: IAM roles for ECS tasks (no hardcoded credentials)
5. **Supply Chain**: Cosign image signing + SBOM (verified container provenance)
6. **Monitoring**: CloudWatch logs and WAF request logging (full audit trail)

---

## Technology Stack

### Infrastructure Layer

| Technology | Purpose | Configuration |
|------------|---------|---------------|
| **Terraform** | Infrastructure as Code | 11 modules, 2,767 lines of HCL |
| **AWS ECS Fargate** | Container orchestration | Serverless, 4 tasks across 2 AZs |
| **AWS VPC** | Network foundation | Multi-AZ with public/private/database subnets |
| **AWS RDS** | PostgreSQL database | db.t3.micro, Multi-AZ, 20GB encrypted storage |
| **AWS ALB** | Load balancing | Path-based routing, health checks |
| **AWS WAF** | Web application firewall | 6 rules: rate limiting, SQL injection, XSS, bot control |
| **AWS Route53** | DNS management | Hosted zone, A records (alias to ALB) |
| **AWS ACM** | SSL/TLS certificates | Automatic DNS validation, free |
| **AWS ECR** | Container registry | Image scanning, lifecycle policies |
| **AWS CloudWatch** | Monitoring & logging | Logs, metrics, alarms, Container Insights |

### Application Layer

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | Frontend UI framework |
| **TypeScript** | 5.0+ | Type-safe frontend development |
| **Vite** | 5.0+ | Fast build tool and dev server |
| **Tailwind CSS** | 3.4+ | Utility-first CSS framework |
| **Node.js** | 20 LTS | Backend runtime |
| **Express** | 4.18+ | RESTful API framework |
| **PostgreSQL** | 15 | Relational database |
| **pg** | 8.11+ | PostgreSQL client for Node.js |
| **Docker** | 24.0+ | Containerization |
| **Nginx** | 1.25 | Frontend web server |

### CI/CD & Security

| Tool | Type | Purpose | Integration |
|------|------|---------|-------------|
| **GitHub Actions** | CI/CD Platform | Workflow orchestration | Native |
| **Gitleaks** | CLI Tool | Secret detection | Runs in pipeline |
| **ESLint** | CLI Tool | JavaScript/TypeScript linting | Runs in pipeline |
| **SonarCloud** | SaaS Platform | Code quality analysis | API via SONAR_TOKEN |
| **OWASP Dependency Check** | CLI Tool | CVE scanning | Runs in pipeline |
| **Snyk** | SaaS Platform | Security validation + monitoring | API via SNYK_TOKEN |
| **Trivy** | CLI Tool | Container scanning | Runs in pipeline |
| **Hadolint** | CLI Tool | Dockerfile linting | Runs in pipeline |
| **Cosign** | CLI Tool | Image signing | Keyless OIDC signing |
| **Syft** | CLI Tool | SBOM generation | SPDX format output |
| **Infracost** | SaaS Platform | Cost estimation + governance | API via INFRACOST_API_KEY |

**External SaaS Integrations** (demonstrates professional tool usage):
- **SonarCloud**: Continuous code quality monitoring with dashboard
- **Snyk**: Ongoing vulnerability tracking with automated fix PRs
- **Infracost**: Cost trend analysis with PR comments and policy enforcement

---

## Infrastructure Components

### 76 AWS Resources Deployed

| Component Category | Resources | Details |
|-------------------|-----------|---------|
| **VPC & Networking** | 15 | VPC, 6 subnets, 2 NAT Gateways, Internet Gateway, 4 route tables, DB subnet group |
| **Compute (ECS)** | 12 | Cluster, 2 services, 2 task definitions, 4 tasks, task roles, execution roles, log groups |
| **Load Balancing** | 7 | ALB, 2 target groups, 2 listeners (HTTP, HTTPS), 2 listener rules, health checks |
| **Database (RDS)** | 8 | DB instance, subnet group, parameter group, option group, security group, backups, monitoring |
| **Container Registry** | 4 | 2 ECR repositories, 2 lifecycle policies, image scanning configs |
| **DNS & Certificates** | 5 | Route53 hosted zone, 3 DNS records (A, CNAME), ACM certificate |
| **Security (WAF)** | 9 | Web ACL, 6 rules (4 managed + 2 custom), logging config, CloudWatch log group |
| **IAM & Security** | 10 | 3 security groups, 5 IAM roles, OIDC provider, KMS key |
| **Monitoring** | 4 | 3 CloudWatch log groups, Container Insights, custom metrics |
| **Other** | 2 | S3 bucket (Terraform state), DynamoDB table (state locks) |

### Terraform Module Structure

```
infra/terraform/
├── bootstrap/                    # State management (S3, DynamoDB)
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
│
├── modules/
│   ├── vpc/                      # Multi-AZ VPC with 6 subnets
│   ├── security-groups/          # ALB, ECS, RDS security groups
│   ├── ecr/                      # Container registries
│   ├── ecs-cluster/              # ECS cluster with Fargate
│   ├── ecs-service/              # ECS services with auto-scaling
│   ├── alb/                      # Application Load Balancer
│   ├── rds/                      # PostgreSQL Multi-AZ
│   ├── route53/                  # DNS management
│   ├── acm/                      # SSL certificates
│   ├── waf/                      # Web Application Firewall
│   └── monitoring/               # CloudWatch logs and metrics
│
└── environments/
    └── dev/                      # Development environment
        ├── main.tf              # Module composition
        ├── backend.tf           # S3 state backend
        ├── variables.tf         # Input variables
        ├── terraform.tfvars     # Variable values (not in Git)
        └── outputs.tf           # Output values
```

**Key Design Principles:**
- **Modularity**: Each module is self-contained and reusable
- **Separation**: Network, compute, database, security layers separated
- **State Management**: Remote S3 backend with DynamoDB locking
- **Environment Parity**: Same modules across dev/staging/prod

---

## Security Implementation

### 6-Layer Defense-in-Depth

**Layer 1: Perimeter Security (AWS WAF)**
- Rate limiting: 2000 requests/5 minutes per IP
- SQL injection protection (tested with real payloads)
- XSS prevention (tested with script injection)
- Known bad inputs blocking
- Bot control (verified bots allowed, malicious blocked)
- Geographic restrictions (optional)
- **Evidence**: [WAF Testing Screenshots](docs/screenshots/waf/)

**Layer 2: Network Security**
- Security groups with least-privilege rules
- Private subnets for compute resources
- Isolated database subnet (no internet)
- NAT Gateways for outbound traffic only
- **Evidence**: [Security Groups](docs/screenshots/aws/security-groups.png)

**Layer 3: Transport Security**
- TLS 1.3 via AWS Certificate Manager
- Automatic certificate renewal
- HTTPS enforcement (HTTP redirects to HTTPS)
- **Evidence**: [SSL Certificate](docs/screenshots/local-app/ssl-cert.png)

**Layer 4: Application Security**
- IAM roles for ECS tasks (least privilege)
- Secrets in environment variables (Terraform managed)
- Connection pooling with limits
- Input validation on API layer
- **Evidence**: [ECS Task Roles](docs/screenshots/aws/ecs-task-definition.png)

**Layer 5: Supply Chain Security**
- Container image signing with Cosign (keyless OIDC)
- Software Bill of Materials (SBOM) in SPDX format
- Image vulnerability scanning (ECR + Trivy)
- Multi-stage Docker builds (reduced attack surface)
- **Evidence**: [Cosign Verification](docs/screenshots/cosign%20%26%20namescheap-dns/cosign-frontend.png)

**Layer 6: Monitoring & Detection**
- CloudWatch Logs for all components
- WAF request logging (30-day retention)
- Container Insights metrics
- Automated alerting (future enhancement)
- **Evidence**: [CloudWatch Logs](docs/screenshots/aws/cloudwatch-logs.png)

### Real Security Testing Results

**SQL Injection (Blocked - Yes)**
- Payload: `' OR '1'='1`, `'; DROP TABLE users; --`
- Result: 403 Forbidden from WAF
- [Test Evidence](docs/screenshots/waf/waf-tests-sql-injection-tests.png)

**Cross-Site Scripting (Blocked - Yes)**
- Payload: `<script>alert('XSS')</script>`, `<img src=x onerror=alert(1)>`
- Result: 403 Forbidden from WAF
- [Test Evidence](docs/screenshots/waf/waf-tests-script-tag-event-handler-javascript-protocol-data-exfiltration-form-action-hijacking.png)

**Rate Limiting (Working - Yes)**
- Test: 2500 requests from single IP in 5 minutes
- Result: First 2000 allowed, remaining 500 blocked
- [Test Evidence](docs/screenshots/waf/waf-rate-limit-blocks.png)

**Bot Control (Working - Yes)**
- Verified bots: Googlebot, Bingbot → Allowed
- Malicious bots: Scrapers → Blocked
- [Test Evidence](docs/screenshots/waf/waf-bot-control-test.png)

### Security Scanning Pipeline

| Stage | Tool | Purpose | Status |
|-------|------|---------|--------|
| **Secrets** | Gitleaks | Detect API keys, passwords, tokens | - Yes No leaks |
| **Code Quality** | ESLint + SonarCloud | Find bugs, code smells, security hotspots | - Yes Quality gate passed |
| **Dependencies** | OWASP + Snyk | CVE detection in npm packages | ⚠️ 14 managed CVEs |
| **Container** | Trivy | Image vulnerabilities, OS packages | ⚠️ Issues tracked |
| **Dockerfile** | Hadolint | Best practices enforcement | - Yes Passed |
| **Supply Chain** | Cosign + Syft | Image signing + SBOM generation | - Yes Verified |

**View Complete Results**: [GitHub Security Report](docs/screenshots/github/github-security-report.png)

---

## CI/CD Pipeline

### 3-Stage Automated Pipeline

**Pipeline Duration**: 6 minutes 9 seconds  
**Workflow File**: `.github/workflows/pipeline.yml`  
**Trigger**: Push to main branch  
**Visual Evidence**: [Complete Pipeline Run](docs/screenshots/github/app-devsecops-pipeline.png)

### Stage 1: Security Scanning (3m 19s)

```yaml
security-scan:
  runs-on: ubuntu-latest
  steps:
    - Checkout code
    - Run Gitleaks (secret detection)
    - Run ESLint (code quality + security)
    - Run SonarCloud (static analysis)
    - Run OWASP Dependency Check (CVE scanning)
    - Run Snyk (validation)
    - Run Trivy (container pre-scan)
```

**Output**: "No leaks detected" - Yes  
**Evidence**: [Security Scanning Stage](docs/screenshots/github/security-scanning.png)

### Stage 2: Build & Container Security (1m 56s)

```yaml
build-and-scan:
  needs: security-scan
  runs-on: ubuntu-latest
  steps:
    - Semantic Release (determine version)
    - Docker Build (frontend + backend)
    - Hadolint (Dockerfile linting)
    - Trivy (container vulnerability scan)
    - Syft (generate SBOM)
```

**Artifacts**:
- Frontend image: 50 MB (multi-stage build)
- Backend image: 180 MB (multi-stage build)
- SBOM files: frontend-sbom.json, backend-sbom.json

**Evidence**: [Build Stage](docs/screenshots/github/build-&-container-security.png)

### Stage 3: Sign & Push to Registry (36s)

```yaml
sign-and-push:
  needs: build-and-scan
  runs-on: ubuntu-latest
  environment: production  # Manual approval required
  steps:
    - Install Cosign
    - Configure AWS credentials (OIDC)
    - Login to ECR
    - Login to GHCR
    - Push images to ECR
    - Push images to GHCR
    - Sign images with Cosign (keyless)
    - Attach SBOM attestation
```

**Dual Registry Strategy**:
- **AWS ECR**: Production deployment (ECS pulls from here)
- **GitHub Container Registry**: Public portfolio demonstration

**Evidence**: [Sign & Push Stage](docs/screenshots/github/sign-and-push-to-registry.png)

### External Service Integrations

The pipeline integrates with professional SaaS platforms, demonstrating enterprise-level tool usage:

#### SonarCloud Integration
- **Platform**: sonarcloud.io
- **Authentication**: GitHub App + SONAR_TOKEN (stored in GitHub Secrets)
- **Purpose**: Continuous code quality monitoring
- **Features**:
  - Deep static analysis beyond ESLint
  - Quality gate enforcement (blocks merges if standards not met)
  - Technical debt tracking
  - Security hotspot detection
  - Historical trend analysis
- **Results**: 
  - Quality gate: Passed - Yes
  - Lines analyzed: 7,401
  - Maintainability rating: A
  - Security rating: A
- **Evidence**: [SonarCloud Dashboard](docs/screenshots/sonarcloud/sonarcloud2.png)

#### Snyk Integration
- **Platform**: app.snyk.io
- **Authentication**: GitHub App + SNYK_TOKEN (stored in GitHub Secrets)
- **Purpose**: Continuous security monitoring + automated fixes
- **Features**:
  - Dependency vulnerability scanning (342 packages)
  - Code security analysis
  - License compliance checking
  - Automated fix PRs
  - Real-time dashboard tracking
  - Integration with GitHub Security tab
- **Results**:
  - Total issues: 12 (3 High, 6 Medium, 3 Low)
  - Fix available: 10/12 via automated PRs
- **Evidence**: [Snyk Overview](docs/screenshots/snyk/snyk-overview1.png)

#### Infracost Integration
- **Platform**: dashboard.infracost.io
- **Authentication**: INFRACOST_API_KEY (stored in GitHub Secrets)
- **Purpose**: Infrastructure cost governance
- **Features**:
  - Real-time cost estimates on Terraform PRs
  - Monthly cost breakdown per resource
  - Cost trend tracking over time
  - Policy enforcement (alerts if cost > $500)
  - Savings recommendations
  - Historical cost analysis
- **Results**:
  - Current monthly cost: $226
  - Potential savings: $114/month (optimization suggestions)
  - Policy status: Passed (under $500 threshold)
- **Evidence**: [Infracost PR Comment](docs/screenshots/infracost/infracost-pr-request.png)

**Why External Integrations Matter**:
1. **Professional Tool Usage**: Not just running local scripts, but leveraging enterprise platforms
2. **Continuous Monitoring**: These platforms track trends over time, not just point-in-time scans
3. **API Integration Skills**: Demonstrates ability to connect CI/CD to external services
4. **Secrets Management**: Proper use of GitHub Secrets for API authentication
5. **Cost Awareness**: Infracost shows financial responsibility in infrastructure decisions

### Manual Approval Gates

**Production Deployment Approval**:
- Environment: production
- Required reviewers: 1
- Prevents accidental production changes
- [Approval Gate Evidence](docs/screenshots/github/pipeline-human-gate.png)

### Deployment Workflow

Separate workflow for infrastructure deployment:

```yaml
# .github/workflows/deploy.yml
deploy-infrastructure:
  steps:
    - terraform init
    - terraform plan (review required)
    - terraform apply (manual approval)
    - Update ECS services (force new deployment)
    - Verify health checks
```

**Evidence**: [Deploy Infrastructure](docs/screenshots/github/deploy-infrastructure-summary.png)

---

## Cost Analysis

### Current Deployment Cost

**Development Environment (Deployed):** $226/month

Based on **real Infracost analysis** from deployed infrastructure:

**Visual Evidence**: [Infracost Cost Breakdown](docs/screenshots/infracost/infracost-cost-estimates.png)

| Service | Configuration | Monthly Cost |
|---------|---------------|--------------|
| **ECS Frontend Service** | 2 tasks × 256 CPU × 512 MB | $41 |
| **ECS Backend Service** | 2 tasks × 512 CPU × 1024 MB | $41 |
| **NAT Gateway (AZ-1a)** | 1 NAT + data processing | $38 |
| **NAT Gateway (AZ-1b)** | 1 NAT + data processing | $38 |
| **RDS PostgreSQL** | db.t3.micro Multi-AZ, 20GB gp3 | $36 |
| **Application Load Balancer** | 1 ALB | $20 |
| **AWS WAF** | Web ACL + 6 rules | $10 |
| **KMS Key** | Encryption key | $1 |
| **CloudWatch Logs** | Log groups (within free tier) | $0 |
| **Route53** | Hosted zone + queries | < $1 |
| **S3 + DynamoDB** | Terraform state storage | < $1 |
| **Dev Total** | | **$226/month** |

---

### Multi-Environment Cost Projection

**If All Environments Were Deployed:**

#### Staging Environment (Code Ready, Not Deployed)

| Service | Configuration | Monthly Cost |
|---------|---------------|--------------|
| **ECS Frontend** | 2 tasks × 512 CPU × 1024 MB | $50 |
| **ECS Backend** | 2 tasks × 512 CPU × 1024 MB | $50 |
| **NAT Gateways** | 2 NAT gateways | $76 |
| **RDS PostgreSQL** | db.t3.micro Multi-AZ | $36 |
| **ALB** | 1 ALB | $20 |
| **WAF** | Web ACL + rules | $10 |
| **Other** | KMS, logs, DNS | $8 |
| **Staging Total** | | **$250/month** |

#### Production Environment (Code Ready, Not Deployed)

| Service | Configuration | Monthly Cost |
|---------|---------------|--------------|
| **ECS Frontend** | 4 tasks × 1024 CPU × 2048 MB | $100 |
| **ECS Backend** | 4 tasks × 1024 CPU × 2048 MB | $100 |
| **NAT Gateways** | 2 NAT gateways | $76 |
| **RDS PostgreSQL** | db.t3.small Multi-AZ | $60 |
| **ALB** | 1 ALB | $20 |
| **WAF** | Web ACL + rules | $10 |
| **Other** | KMS, logs, DNS, backups | $12 |
| **Prod Total** | | **$378/month** |

#### Shared Infrastructure

| Service | Details | Monthly Cost |
|---------|---------|------|
| S3 (Terraform state) | < 1 GB storage (3 state files) | < $1/month |
| DynamoDB (locks) | Minimal requests | < $1/month |
| Route53 | Hosted zone + queries | ~$0.50/month |
| ECR (shared images) | 2 repositories with lifecycle | ~$2/month |
| **Shared Total** | | **~$4/month** |

---

### Cost Comparison Summary

| Scenario | Monthly Cost | Annual Cost | Status |
|----------|--------------|-------------|--------|
| **Current (Dev Only)** | $226 | $2,712 | Deployed |
| **+ Staging** | $476 | $5,712 | Code ready |
| **+ Production** | $854 | $10,248 | Code ready |

**Current Portfolio Strategy:**
- **Deployed**: Dev environment only ($226/month)
- **Savings**: $628/month by not deploying staging/prod
- **Annual Savings**: $7,536 during job search
- **Deployment Time**: Can deploy staging/prod in < 15 minutes when needed

---

### Cost Optimization Strategies

**Identified via Infracost**: [Savings Suggestions](docs/screenshots/infracost/infracost-savings-suggestions.png)

| Strategy | Savings Per Environment | Trade-offs | Recommendation |
|----------|------------------------|-----------|----------------|
| **Fargate Spot** | $58/month (70% off compute) | Task interruptions possible | - Yes Good for dev/staging |
| **Single NAT Gateway** | $38/month | No AZ redundancy | No Keep Multi-AZ for HA demo |
| **RDS Single-AZ** | $18/month | No automatic failover | No Keep Multi-AZ for portfolio |
| **Smaller RDS instance** | $10/month | Slower performance | - Yes Could use db.t3.nano for dev |
| **Reduce log retention** | $2/month | Less historical data | - Yes 7 days sufficient for dev |

**Why I'm NOT Applying These for Portfolio:**
- Current dev environment demonstrates **production-grade** capabilities
- Multi-AZ, proper NAT redundancy, and adequate RDS sizing show enterprise thinking
- Optimizing further would save ~$100/month but reduce architectural quality
- German employers value **proper architecture** over cost-cutting corners

**Optimized Cost if All Deployed**: ~$650/month (applying Fargate Spot + smaller dev RDS)  
**Current Choice**: $226/month (dev only) - Best balance of capability demonstration and cost

---

### Infracost Integration

**PR Cost Comments**: Automatic cost estimates on infrastructure changes  
**Policy Enforcement**: Alert if monthly cost exceeds $500  
**Trend Analysis**: [Cost History Dashboard](docs/screenshots/infracost/infracost-issue-explorer.png)

**Example Infracost Output:**
```
Project: infra/terraform/environments/dev

 Name                                      Monthly Qty  Unit   Monthly Cost

 aws_ecs_service.frontend
 ├─ Per GB per hour                                744  GB-hours      $41.00
 aws_ecs_service.backend
 ├─ Per GB per hour                                744  GB-hours      $41.00
 aws_nat_gateway.main[0]
 ├─ NAT gateway                                    730  hours         $32.85
 ├─ Data processed                                 100  GB             $4.50
 aws_nat_gateway.main[1]
 ├─ NAT gateway                                    730  hours         $32.85
 ├─ Data processed                                 100  GB             $4.50

 OVERALL TOTAL                                                       $226.00
```

---

## Quick Start Guide

### Prerequisites

```bash
# Required tools
terraform >= 1.5.0
aws-cli >= 2.0
docker >= 24.0
git >= 2.30

# AWS credentials configured
aws configure
```

### 1. Clone Repository

```bash
git clone https://github.com/AkingbadeOmosebi/brewsecops.git
cd brewsecops
```

### 2. Deploy Bootstrap Infrastructure

```bash
cd infra/terraform/bootstrap
terraform init
terraform plan
terraform apply

# Outputs: S3 bucket name, DynamoDB table name
```

### 3. Deploy Dev Environment

```bash
cd ../environments/dev

# Create terraform.tfvars (not in Git)
cat > terraform.tfvars <<EOF
domain_name = "brewsecops.online"
db_master_password = "YourSecurePassword123!"
frontend_image_tag = "latest"
backend_image_tag = "latest"
waf_rate_limit = 2000
EOF

terraform init
terraform plan
terraform apply
```

**Expected duration**: ~15 minutes  
**Resources created**: 76 AWS resources

### 4. Push Container Images to ECR

```bash
# Login to ECR
aws ecr get-login-password --region eu-central-1 | \
  docker login --username AWS --password-stdin \
  194722436853.dkr.ecr.eu-central-1.amazonaws.com

# Pull from GitHub Container Registry
docker pull ghcr.io/akingbadeomosebi/brewsecops-frontend:latest
docker pull ghcr.io/akingbadeomosebi/brewsecops-backend:latest

# Tag for ECR
docker tag ghcr.io/akingbadeomosebi/brewsecops-frontend:latest \
  194722436853.dkr.ecr.eu-central-1.amazonaws.com/brewsecops-frontend-dev:latest

docker tag ghcr.io/akingbadeomosebi/brewsecops-backend:latest \
  194722436853.dkr.ecr.eu-central-1.amazonaws.com/brewsecops-backend-dev:latest

# Push to ECR
docker push 194722436853.dkr.ecr.eu-central-1.amazonaws.com/brewsecops-frontend-dev:latest
docker push 194722436853.dkr.ecr.eu-central-1.amazonaws.com/brewsecops-backend-dev:latest
```

### 5. Verify ECS Services

```bash
# Check service status
aws ecs describe-services \
  --cluster brewsecops-cluster-dev \
  --services brewsecops-frontend-dev brewsecops-backend-dev \
  --region eu-central-1

# Wait for tasks to be RUNNING and healthy
aws ecs list-tasks --cluster brewsecops-cluster-dev --region eu-central-1
```

### 6. Initialize Database

```bash
# Get RDS endpoint from Terraform output
RDS_ENDPOINT=$(terraform output -raw rds_endpoint)

# Connect to database
psql -h $RDS_ENDPOINT -U postgres -d brewsecops -p 5432

# In psql console:
\i akings-coffee-app/database/schema.sql
\i akings-coffee-app/database/seed.sql

# Verify
SELECT COUNT(*) FROM products;  -- Should return 23
```

### 7. Access Application

```bash
# Get ALB DNS name
ALB_DNS=$(terraform output -raw alb_dns_name)

# Test endpoints
curl http://$ALB_DNS/
curl http://$ALB_DNS/api/health
curl http://$ALB_DNS/api/products

# Access via custom domain (after DNS propagation)
open https://dev.brewsecops.online
```

---

## Project Statistics

### Code Metrics

| Metric | Value |
|--------|-------|
| **Total Lines of Code** | 10,168 lines |
| **Infrastructure (Terraform)** | 2,767 lines |
| **Application (React + Node.js)** | 7,401 lines |
| **Terraform Modules** | 11 modules |
| **AWS Resources** | 76 resources |
| **Container Images** | 2 (frontend 50MB, backend 180MB) |
| **Git Commits** | 40+ meaningful commits |

### Security Metrics

| Metric | Value |
|--------|-------|
| **Security Scanners** | 6 tools |
| **Secrets Detected** | 0 (Gitleaks) |
| **Code Quality** | A rating (SonarCloud) |
| **Critical CVEs** | 0 |
| **High CVEs** | 3 (managed) |
| **Medium CVEs** | 6 (tracked) |
| **Low CVEs** | 8 (documented) |
| **Container Layers** | 8 (multi-stage optimized) |
| **SBOM Components** | 245 packages |

### Infrastructure Metrics

| Metric | Value |
|--------|-------|
| **Availability Zones** | 2 (Multi-AZ) |
| **Subnets** | 6 (2 public, 2 private, 2 database) |
| **ECS Tasks** | 4 (2 frontend, 2 backend) |
| **Load Balancer Targets** | 4 IPs (2/2 healthy per target group) |
| **Database Size** | 20 GB (gp3 encrypted) |
| **WAF Rules** | 6 active rules |
| **CloudWatch Log Groups** | 4 groups |

### Performance Metrics

| Metric | Value |
|--------|-------|
| **Infrastructure Deployment** | ~15 minutes |
| **Pipeline Duration** | 6m 9s |
| **Security Scanning** | 3m 19s |
| **Container Build** | 1m 56s |
| **Sign & Push** | 36s |
| **Application Response Time** | 50-100ms (average) |
| **Health Check Interval** | 30 seconds |
| **Auto-Scaling Cooldown** | 60s (scale out), 120s (scale in) |

---

## Documentation

### Complete Documentation Suite

| Document | Description | Link |
|----------|-------------|------|
| **README.md** | Overview and quick start | (This file) |
| **SCREENSHOTS.md** | 77 screenshots with descriptions | [View](docs/SCREENSHOTS.md) |
| **ARCHITECTURE.md** | System design and data flow | [View](docs/Architecture.md) |
| **CHALLENGES-AND-LEARNINGS.md** | Problem-solving documentation | [View](docs/Challenges%20and%20Learnings.md) |
| **HANDOFF-DOCUMENTATION.md** | Detailed technical handoff | [View](HANDOFF-DOCUMENTATION.md) |

### Repository Structure

```
brewsecops/
├── .github/
│   └── workflows/
│       ├── pipeline.yml           # DevSecOps CI/CD
│       └── deploy.yml             # Infrastructure deployment
│
├── akings-coffee-app/             # Application code
│   ├── frontend/                  # React 18 + TypeScript
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── backend/                   # Node.js 20 + Express
│   │   ├── routes/
│   │   ├── config/
│   │   ├── Dockerfile
│   │   └── server.js
│   ├── database/
│   │   ├── schema.sql             # Database schema
│   │   └── seed.sql               # Sample data (23 products)
│   └── docker-compose.yml         # Local development
│
├── infra/terraform/
│   ├── bootstrap/                 # State management
│   ├── modules/                   # 11 reusable modules
│   │   ├── vpc/
│   │   ├── security-groups/
│   │   ├── ecr/
│   │   ├── ecs-cluster/
│   │   ├── ecs-service/
│   │   ├── alb/
│   │   ├── rds/
│   │   ├── route53/
│   │   ├── acm/
│   │   ├── waf/
│   │   └── monitoring/
│   └── environments/
│       └── dev/                   # Dev environment
│           ├── main.tf
│           ├── backend.tf
│           ├── variables.tf
│           ├── terraform.tfvars   # NOT in Git
│           └── outputs.tf
│
├── docs/
│   ├── SCREENSHOTS.md             # Visual documentation
│   ├── Architecture.md            # System design
│   ├── Challenges and Learnings.md # Problem-solving
│   └── screenshots/               # 77 organized images
│       ├── local-app/
│       ├── aws/
│       ├── github/
│       ├── waf/
│       ├── infracost/
│       ├── sonarcloud/
│       ├── snyk/
│       └── cosign & namescheap-dns/
│
├── .gitleaks.toml                 # Secret scanning config
├── sonar-project.properties       # SonarCloud config
├── .eslintrc.json                 # ESLint config
└── README.md                      # This file
```

---

## Contact

**Akingbade Omosebi**  
📍 Location: Berlin, Germany  
💼 Target Role: Mid-Level DevOps Engineer / Platform Engineer  
Salary Range: €55,000 - €70,000  
**Portfolio:** Production-grade AWS infrastructure with comprehensive DevSecOps implementation


**Project Links:**
- **GitHub Repository**: [brewsecops](https://github.com/AkingbadeOmosebi/brewsecops)
- **Container Registry**: [GHCR Packages](https://github.com/AkingbadeOmosebi?tab=packages)
- **Live Demo**: `https://dev.brewsecops.online` (SSL enabled)

---

## Key Selling Points for German Tech Market

### Why This Project Stands Out

1. **Production-Grade Architecture**: Not a toy project - Multi-AZ, auto-scaling, WAF, proper security
2. **Multi-Environment Capability**: 3 environments designed (dev deployed, staging/prod code-ready) - demonstrates enterprise thinking
3. **Security-First Mindset**: 6 scanning tools, real WAF testing, image signing, SBOM generation
4. **Professional Tool Integration**: SonarCloud, Snyk, and Infracost SaaS platforms (not just CLI scripts)
5. **Cost-Conscious Engineering**: $226/month vs $854/month potential - saves $628/month without sacrificing demo quality
6. **Comprehensive Documentation**: 4 detailed docs + 77 screenshots - German engineering standards
7. **Real Problem-Solving**: Challenges documented with root cause analysis and prevention strategies
8. **Infrastructure-as-Code Mastery**: 11 modular Terraform components, reusable across environments
9. **Full-Stack Capability**: React + Node.js + PostgreSQL + AWS + CI/CD
10. **Professional Workflow**: Manual approval gates, semantic versioning, dual registries
11. **API Integration Skills**: Connected GitHub Actions to 3 external SaaS platforms with proper authentication
12. **Business Acumen**: Strategic deployment decisions balancing technical showcase with financial responsibility

### Skills Demonstrated

**DevOps Core:**
- Infrastructure-as-code (Terraform)
- Container orchestration (ECS Fargate)
- CI/CD automation (GitHub Actions)
- Configuration management
- GitOps practices

**Security (DevSecOps):**
- Static code analysis (SonarCloud, ESLint)
- Dependency scanning (OWASP, Snyk)
- Container security (Trivy)
- Secret detection (Gitleaks)
- Image signing (Cosign)
- Web application firewall (AWS WAF)

**Cloud Platform (AWS):**
- VPC networking (Multi-AZ)
- Container services (ECS, ECR)
- Database management (RDS)
- Load balancing (ALB)
- DNS & certificates (Route53, ACM)
- Security services (WAF, Security Groups)
- Monitoring (CloudWatch)

**Soft Skills:**
- Systematic problem-solving
- Comprehensive documentation
- Cost-conscious architecture
- Security-aware development

---

## License

MIT License - See [LICENSE](LICENSE) file for details.

---

**Last Updated**: January 11, 2026  
**Version**: 2.1.0  
**Status**: Production-Ready - Yes

*"Built to showcase enterprise-level DevSecOps capabilities for the German tech market."*