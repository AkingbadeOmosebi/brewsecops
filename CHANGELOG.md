# Changelog

All notable changes to BrewSecOps will be documented in this file.

## [1.0.0] - 2026-01-02

### Added
- Initial release of BrewSecOps DevSecOps platform
- 3-tier architecture: React frontend, Node.js backend, PostgreSQL database
- Coffee shop application with 23 products
- Multi-item shopping cart
- Customer portal with authentication
- Password-protected order management
- Order preparation time tracking (4-10 minutes)
- Session timeout (3 minutes)
- Real-time order status updates
- Docker containerization with multi-stage builds
- Complete database CRUD operations
- Professional dark theme UI with Tailwind CSS
- Responsive design for mobile/tablet/desktop
- Health check endpoints for AWS ECS
- brewcoffee.com company branding

### Technical Stack
- Frontend: React 18, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, PostgreSQL
- Infrastructure: Docker, Docker Compose
- Security: Helmet.js, CORS, input validation, parameterized queries

### Database
- Products table with 23 coffee items
- Orders with customer authentication
- Order items with transaction support
- Reservations and contact messages
- Sample data with @brewcoffee.com emails

### Features
- Multi-item cart with quantity adjustment
- Password authentication system
- 3-minute session timeout with countdown
- Random order preparation time (4-10 min)
- Order pickup status tracking
- Delete pending orders
- Real-time database state visualization

[1.0.0]: https://github.com/yourusername/brewsecops/releases/tag/v1.0.0