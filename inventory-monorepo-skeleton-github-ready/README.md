# Inventory Monorepo

A white-label streamlined **inventory catalogue application** with real-time control, automation, and ease of use.

## 🚀 Features
- Real-time Inventory Tracking
- Barcode/QR Code Scanning
- Automated Reordering & Low Stock Alerts
- Multi-location & Multi-warehouse Support
- Product Cataloging & Tagging
- Supplier & Purchase Order Management
- Returns & Exchanges Workflows
- Mobile Access (PWA frontend)
- Analytics & Reporting Dashboards
- User Role Management & Security
- Integration with POS / e-commerce / ERP
- Batch & Serial Number Tracking
- Custom Stocktaking Tools
- Machine Learning Demand Forecasting
- IoT & RFID Integration (future-ready)

## 🛠️ Tech Stack
- **Backend**: Node.js, Express, Prisma, PostgreSQL, Redis, MQTT
- **Frontend**: React (PWA-ready)
- **ML Service**: Python, Flask, scikit-learn
- **Infra**: Docker Compose (Postgres, Redis, Mosquitto MQTT)

## 📦 Getting Started
```bash
# 1. Clone repo
git clone <your-repo-url>
cd inventory-monorepo

# 2. Start services
docker-compose up --build

# 3. Access apps
Frontend: http://localhost:3000
Backend API: http://localhost:4000
ML Service: http://localhost:5001
```

### Default Admin Credentials
- **Email**: admin@example.com  
- **Password**: changeme

## 🧪 Testing APIs
Import the included **Postman Collection**: `Inventory-API.postman_collection.json`

## ⚡ Deployment
- Push to GitHub
- GitHub Actions workflow will lint & test backend/frontend automatically

## 📄 License
MIT
