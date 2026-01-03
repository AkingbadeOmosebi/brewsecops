# ☕ BrewSecOps - Aking's Coffee

**Brew Beautifully, Deploy Securely**

A production-grade, multi-environment DevSecOps platform demonstrating enterprise-level AWS ECS deployment with comprehensive security practices.

---

## 🎯 Project Overview

This project showcases:
- **3-Tier Architecture**: React Frontend → Node.js API → PostgreSQL Database
- **Container Orchestration**: AWS ECS Fargate with Blue/Green deployments
- **Security**: AWS WAF, TLS/SSL, OIDC Federation, Security scanning at every stage
- **CI/CD**: GitHub Actions with multi-stage DevSecOps pipeline
- **Multi-Environment**: Dev, Staging, Production with proper isolation
- **Infrastructure as Code**: Terraform modules for reproducible infrastructure

---

## 🏗️ My Forecasted Architecture HIGH-LEVEL

```
┌─────────────────────────────────────────────────┐
│              AWS Cloud (ECS Fargate)            │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐    ┌──────────────┐          │
│  │   Frontend   │───▶│   Backend    │          │
│  │ React + Nginx│    │  Node.js API │          │
│  └──────────────┘    └──────┬───────┘          │
│                              │                  │
│                              ▼                  │
│                       ┌─────────────┐           │
│                       │  PostgreSQL │           │
│                       │     RDS     │           │
│                       └─────────────┘           │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ (you have v24.1.0 ✓)
- **Docker Desktop** (running)
- **Git**

### Setup (3 commands)

```powershell
# 1. Navigate to project
cd C:\Users\aking\desktop\brewsecops

# 2. Run setup
powershell -ExecutionPolicy Bypass -File .\setup.ps1

# 3. Open browser
# Frontend: http://localhost:5173
# Backend:  http://localhost:3001
```

That's it! Docker Compose will:
1. ✅ Start PostgreSQL with schema and seed data
2. ✅ Build and start backend API
3. ✅ Build and start frontend app
4. ✅ Configure networking between services

---

or 

## Alternate quick start

```powershell or basg terminaal
# 1. Make sure Docker Desktop is running

# 2. Start everything
docker-compose up -d

# 3. Wait 30 seconds, then open:
http://localhost:5173
```

That's it!!!

---

## 📊 Services

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3001 |
| Database | localhost:5432 |

---

## 🛠️ Commands

```powershell
docker-compose logs -f      # View logs
docker-compose ps              # Check status
docker-compose down          # Stop
docker-compose down -v      # Stop + delete data
```

## 📊 What's Running

After setup, you have 3 services:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | React app with Vite dev server |
| **Backend** | http://localhost:3001 | Node.js Express API |
| **Database** | localhost:5432 | PostgreSQL with sample data |

**Test the API:**
```powershell
# Health check
curl http://localhost:3001/api/health

# Get coffee products (23 items)
curl http://localhost:3001/api/products

# Get orders (shows database state)
curl http://localhost:3001/api/orders
```

**Connect to database:**
```powershell
docker exec -it akings-coffee-db psql -U postgres -d akings_coffee

# Check data
SELECT COUNT(*) FROM products;  -- Returns 23
SELECT * FROM orders;           -- Shows sample orders
\q
```

---

## 📁 Application Project Structure

```
brewsecops/
├── frontend/                 # React application
│   ├── src/
│   ├── Dockerfile           # Multi-stage: dev & production
│   ├── nginx.conf           # Production web server config
│   └── package.json
│
├── backend/                 # Node.js Express API  
│   ├── routes/              # API endpoints
│   │   ├── health.js       # Health check (for ALB)
│   │   ├── products.js     # Coffee products
│   │   ├── orders.js       # Order management
│   │   ├── reservations.js # Table reservations
│   │   └── contact.js      # Contact messages
│   ├── config/
│   │   └── database.js     # PostgreSQL connection
│   ├── Dockerfile          # Multi-stage: dev & production
│   └── server.js
│
├── database/
│   ├── schema.sql          # Tables: products, orders, etc.
│   └── seed.sql            # 23 products, sample data
│
├── docker-compose.yml      # Local development orchestration
└── setup.ps1               # One-command setup
```

---

## 🐳 Docker Strategy

### One Dockerfile, Two Modes

Both frontend and backend use **multi-stage Dockerfiles** that support both development and production:

**Development** (docker-compose):
```bash
docker-compose up -d
# Uses: target=development
# Features: Hot reload, debugging, source maps
```

**Production** (ECS):
```bash
docker build --target production -t image:prod .
# Features: Optimized, minimal size, security hardened
```

### Image Sizes

| Service | Development | Production | Savings   |
|---------|-------------|------------|-----------|
| Frontend| 1.2GB       | 50MB       | **96%**   |
| Backend | 300MB       | 150MB      | **50%**   |

---

## 🛠️ Development Commands

```powershell
# Start all services
docker-compose up -d

# View logs (all)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f backend

# Check status
docker-compose ps

# Stop services
docker-compose down

# Stop and remove data (fresh start)
docker-compose down -v

# Rebuild after code changes
docker-compose up -d --build
```

---

## 📊 API Endpoints

### Products
- `GET /api/products` - Get all coffee products
- `GET /api/products?category=espresso` - Filter by category
- `GET /api/products/:id` - Get specific product

### Orders (Demonstrates Statefulness)
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get specific order
- `POST /api/orders` - Create new order

### Reservations
- `GET /api/reservations` - Get all reservations
- `POST /api/reservations` - Create reservation

### Contact
- `GET /api/contact` - Get messages
- `POST /api/contact` - Send message

### Health
- `GET /api/health` - Health check (for ALB)

---

## 🔐 Security Features

- ✅ **Helmet.js**: HTTP security headers
- ✅ **CORS**: Restricted to frontend origin
- ✅ **Input Validation**: All endpoints validated
- ✅ **SQL Injection Prevention**: Parameterized queries
- ✅ **Non-root User**: Backend runs as nodejs user
- ✅ **Environment Variables**: No secrets in code
- ✅ **Health Checks**: Monitoring for ECS

---

## 🐛 Troubleshooting

### Docker not running
```powershell
# Start Docker Desktop
# Wait until icon stops animating (1-2 minutes)
docker ps  # Should not error
```

### Port already in use
```powershell
# Find process
netstat -ano | findstr :5173
netstat -ano | findstr :3001

# Kill it
taskkill /PID <PID> /F
```

### Services won't start
```powershell
# Fresh restart
docker-compose down -v
docker-compose up -d

# Check logs
docker-compose logs
```

### Database connection failed
```powershell
# Make sure .env has correct values
cat backend/.env

# Should show:
# DB_HOST=postgres (not localhost when in Docker)
```

## 🎓 What This Demonstrates

For recruiters, this project shows:

✅ **Docker Best Practices**
- Multi-stage builds for size optimization
- Environment-specific configurations
- Health checks and monitoring

✅ **Modern Development Workflow**
- Docker Compose for local dev
- Hot reload for fast iteration
- Clear separation of concerns

✅ **Production-Ready Code**
- Security hardening
- Error handling
- Proper logging
- Database transactions

✅ **DevSecOps Maturity**
- Container optimization (96% size reduction)
- Non-root containers
- Health monitoring
- Ready for orchestration

---

## 👨‍💻 Author

**Aking**
- Aspiring DevSecOps Engineer
- Building production-grade platforms

---

## 📄 License

Forecasted Portfolio project for educational and career purposes.


| Layer | Technology |
|-------|------------|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, Shadcn UI |
| **Backend** | Node.js, Express, PostgreSQL Driver |
| **Database** | PostgreSQL 16 |
| **Containers** | Docker, Docker Compose |
| **Cloud** | AWS ECS Fargate, RDS, ALB, WAF, Route53, ACM |
| **IaC** | Terraform |
| **CI/CD** | GitHub Actions, AWS CodeDeploy |
| **Security** | Gitleaks, Trivy, SonarCloud, OWASP, tfsec |

---

## 📊 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products?category=espresso` - Filter by category

### Orders
- `GET /api/orders` - Get all orders (demonstrates stateful data)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order

### Reservations
- `GET /api/reservations` - Get all reservations
- `POST /api/reservations` - Create new reservation

### Contact
- `GET /api/contact` - Get all messages
- `POST /api/contact` - Send contact message

### Health
- `GET /api/health` - Health check endpoint (for ALB)

---

## 🎨 Application Features

### Customer Features
-  Browse coffee menu by category
-  Place orders (persisted in database)
-  Make table reservations
-  Contact form
-  Fully responsive design

### Admin Features (Coming)
-  View all orders and reservations
-  Analytics dashboard
-  Real-time notifications

---

## 🔐 Security Features

- **Helmet.js**: HTTP security headers
- **CORS**: Configured for frontend origin only
- **Input Validation**: Express-validator for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **Environment Variables**: Sensitive data not in code
- **Health Checks**: Monitoring endpoints for ECS
- **Rate Limiting**: (Coming in production)

---

## Troubleshooting

### Port Already in Use
```powershell
# Find process using port
netstat -ano | findstr :5173
netstat -ano | findstr :3001
netstat -ano | findstr :5432

# Kill process by PID
taskkill /PID <PID> /F
```

### Database Connection Issues
```powershell
# Restart PostgreSQL container
docker-compose restart postgres

# View PostgreSQL logs
docker-compose logs postgres
```

### Frontend Not Loading
```powershell
# Rebuild frontend container
docker-compose up -d --build frontend

# Check if backend is responding
curl http://localhost:3001/api/health
```

---

## 👨‍💻 Author

**Akingbade**
- Aspiring DevSecOps Engineer
- Building production-grade platforms for career advancement

---

## 📄 License

This project is for portfolio and educational purposes.

---

## Acknowledgments

- Built with modern DevSecOps practices
- Designed for enterprise-level deployment
- Security-first approach throughout
