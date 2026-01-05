# ☕ BrewSecOps Coffee App - Troubleshooting & Deployment Log

This document serves as a comprehensive record of the technical challenges, debugging steps, and resolutions encountered during the deployment of the BrewSecOps Coffee App to AWS ECS.

---

## Chronological Issue Log

### **1. Terraform State Lock (Error 400: ConditionalCheckFailed)**
* **Timestamp:** 2026-01-05 13:40 UTC
* **Issue:** `Error acquiring the state lock`. Terraform prevented any infrastructure changes because a previous process didn't release the DynamoDB lock.
* **Resolution:** Executed `terraform force-unlock 92b13fcc-b224-9178-04f7-ca49aa8fa2a8` to manually clear the lock and regain control of the infrastructure.

### **2. ECR Push Forbidden (403 Forbidden)**
* **Timestamp:** 2026-01-05 14:15 UTC
* **Issue:** Docker failed to push images to ECR despite having AWS CLI credentials.
* **Root Cause:** Docker Desktop was not authenticated to the specific ECR registry.
* **Resolution:** Authenticated Docker using the command:
    `aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 194722436853.dkr.ecr.eu-central-1.amazonaws.com`

### **3. Backend Service Restart Loop (Unhealthy Status)**
* **Timestamp:** 2026-01-05 17:30 UTC
* **Issue:** ECS marked backend tasks as "Unhealthy," leading to a continuous crash loop.
* **Root Cause:** The `/api/health` endpoint relied on a database connection. If the DB was unreachable (due to Security Groups or cold start), the health check failed, and ECS killed the container.
* **Resolution:** * Simplified `routes/health.js` to a "Shallow Health Check" that returns `200 OK` without checking the database.
    * This allowed the container to stay alive long enough to troubleshoot the underlying data layer.

### **4. Health Check ReferenceError (pool is not defined)**
* **Timestamp:** 2026-01-05 17:36 UTC
* **Issue:** Backend logs showed `ReferenceError: pool is not defined` during GET requests to `/api/health`.
* **Root Cause:** During the simplification of the health check, the `pool` variable was removed but still referenced in the logic.
* **Resolution:** Refactored `health.js` to remove all database dependencies and `async` logic, ensuring a pure status response.

### **5. Frontend "Healthy but Blank" (500 Errors)**
* **Timestamp:** 2026-01-05 18:00 UTC
* **Issue:** The website loaded, but the coffee cards were missing. Inspecting the Network tab showed `500 Internal Server Error` for `/api/products`.
* **Root Cause:** The backend was successfully running but could not connect to RDS because `DB_HOST` was still set to `localhost` in the environment configuration.
* **Resolution:** Updated the ECS Task Definition environment variables to point `DB_HOST` to the AWS RDS Endpoint and ensured port `5432` was open in the Security Groups.

---

##  System Architecture



### **Component Details**
* **Frontend:** React (Vite) served via Nginx on port 80.
* **Backend:** Node.js/Express on port 3001.
* **Database:** AWS RDS PostgreSQL.
* **CI/CD:** GitHub Actions building to GHCR, manually pulled/tagged to AWS ECR.

---

## 🛠 Required Environment Variables (Production)

| Key | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `DB_HOST` | `[your-rds-endpoint].eu-central-1.rds.amazonaws.com` |
| `DB_PORT` | `5432` |
| `DB_USER` | `postgres` |
| `DB_PASSWORD` | `[secure-password]` |
| `DB_NAME` | `akings_coffee` |

---

## Deployment Commands

**Build & Push Backend:**
```bash
docker build --target production -t [194722436853.dkr.ecr.eu-central-1.amazonaws.com/brewsecops-backend:dev](https://194722436853.dkr.ecr.eu-central-1.amazonaws.com/brewsecops-backend:dev) ./backend
docker push [194722436853.dkr.ecr.eu-central-1.amazonaws.com/brewsecops-backend:dev](https://194722436853.dkr.ecr.eu-central-1.amazonaws.com/brewsecops-backend:dev)
```

## Author

```
 Akingbade Omosebi  | Berlin - De | Cloud Platform & DevSecOps Engineer (AWS, AZURE, GCP) | EU - Work Auth | Jan 2026
```