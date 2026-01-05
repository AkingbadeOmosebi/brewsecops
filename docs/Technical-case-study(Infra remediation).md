# Case Study: Resolving Deployment Bottlenecks and Resource Contention for BrewSecOps

## 1. Executive Summary
As I consider myself the Lead Infrastructure Engineer for the BrewSecOps deployment, I spearheaded the transition of a multi-tier application into a containerized AWS environment using Terraform. During the project’s final lifecycle phase, the backend service encountered critical instability. Through a rigorous root-cause analysis (RCA), I identified and resolved a multi-layered failure involving memory exhaustion (OOM), networking port misalignment, and security group egress restrictions. My intervention resulted in a 100% healthy infrastructure state, a successful TLS handshake, and a stable connection to the RDS database.

## 2. The Challenge
The deployment initialised correctly but failed to reach a steady "Healthy" state. The backend targets were consistently marked as unhealthy by the Application Load Balancer (ALB), and the ECS service entered a persistent "CrashLoop" state, triggering the AWS ECS Circuit Breaker.

## 3. Technical Deep-Dive & Remediation

### Phase I: Resolving Memory Choking (The Hardware Bottleneck)
**Incident:** Inspection of the ECS Task events revealed the backend container was exiting with **Exit Code 137**.
**Diagnosis:** I recognized this as an Out-of-Memory (OOM) killer event. The original allocation of 512 MiB was insufficient for the Node.js runtime and its associated database connection pooling, causing the process to "choke" during the heavy initialization phase.
**Action:** I re-engineered the Terraform task definition to double the resource allocation to **1024 MiB RAM** and **512 CPU units**. 
**Outcome:** This provided the computational headroom required for the application to stabilize and successfully complete its bootstrap sequence.

### Phase II: Networking & Port Alignment
**Incident:** The ALB reported "Connection Refused" when attempting health checks.
**Diagnosis:** I identified a port mismatch between the infrastructure code (defaulting to 5000) and the application's actual listening port (3001). 
**Action:** I performed a "Three-Point Alignment" across the Terraform modules:
- Re-configured the **ALB Target Group** to forward traffic specifically to port 3001.
- Updated the **Security Group** ingress rules to authorize port 3001.
- Validated that the container's environment variable `PORT` was explicitly set to 3001.

### Phase III: Database Connectivity & Security
**Incident:** The application was unable to fetch data from the RDS instance despite ports being open.
**Diagnosis:** I discovered that while the RDS security group allowed inbound traffic, the ECS Task Security Group lacked the necessary **egress (outbound)** rule to talk to the database on port 5432.
**Action:** I implemented a specific egress rule in the ECS Security Group, restricted only to the RDS Security Group ID, maintaining a "Principle of Least Privilege" security posture.

## 4. Final System Architecture

- **Entry Point:** ALB Listener on Port 443 with ACM-issued SSL/TLS certificate.
- **Service Layer:** ECS Fargate (2 Tasks) with auto-healing enabled.
- **Persistence:** RDS Multi-AZ instance with security group isolation.

## 5. Key Achievements
- **Reduced Deployment Failure Rate:** Eliminated OOM crashes through data-driven resource sizing.
- **Security Compliance:** Enforced 100% HTTPS traffic with an automated Port 80-to-443 redirect.
- **Infrastructure as Code (IaC):** 100% of the remediation was performed through Terraform to ensure environment parity.

## Author

```
 Akingbade Omosebi  | Berlin - De | Cloud Platform & DevSecOps Engineer (AWS, AZURE, GCP) | EU - Work Auth | Jan 2026
```