# 🏋️ FitFusion – Gym & Fitness Tracker

<div align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Flask-3.0-000000?logo=flask&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?logo=githubactions&logoColor=white" />
  <img src="https://img.shields.io/badge/Jenkins-Pipeline-D24939?logo=jenkins&logoColor=white" />
</div>

> **Final Year Major Project** – A complete full-stack fitness tracking web application with DevOps integration.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | JWT-based login, register, logout with bcrypt password hashing |
| 📊 **Dashboard** | Fitness overview with real-time stats, charts and analytics |
| 🏋️ **Workout Tracker** | Add, edit, delete workouts (exercise, sets, reps, duration) |
| 🥗 **Diet Tracker** | Log meals, track calories, macros and daily water intake |
| ⚖️ **BMI Calculator** | Calculate BMI with visual gauge and history tracking |
| 📈 **Progress Analytics** | Chart.js graphs — weekly workouts, calories, BMI, macros |
| 🛡️ **Admin Panel** | Manage users, view reports, monitor activity |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** – dark fitness theme
- **React Router DOM** – client-side routing
- **Chart.js + react-chartjs-2** – analytics charts
- **Axios** – API integration

### Backend
- **Python Flask** – REST API
- **Flask-JWT-Extended** – JWT authentication
- **bcrypt** – password hashing
- **MySQL Connector** – database
- **Flask-CORS** – cross-origin support

### Database
- **MySQL 8** with 4 normalized tables

### DevOps
- **Docker + Docker Compose** – containerization
- **GitHub Actions** – CI/CD pipeline
- **Jenkins** – deployment pipeline

---

## 📁 Project Structure

```
FitFusion/
├── frontend/           # React + Vite + Tailwind
├── backend/            # Flask REST API
├── database/           # MySQL schema
├── docker/             # Dockerfile + docker-compose
├── .github/workflows/  # GitHub Actions CI
├── Jenkinsfile         # Jenkins pipeline
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- MySQL 8+
- Docker (optional)

---

### Option A – Docker Compose (Recommended)

```bash
# Clone the repo
git clone https://github.com/yourusername/fitfusion.git
cd fitfusion

# Start all services
cd docker
docker-compose up -d

# Frontend → http://localhost:3000
# Backend  → http://localhost:5000
# MySQL    → localhost:3306
```

---

### Option B – Manual Setup

#### 1. Database Setup

```sql
-- Run the SQL schema
mysql -u root -p < database/fitfusion.sql
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate   # Windows
source venv/bin/activate # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
copy .env.example .env
# Edit .env with your DB credentials

# Run Flask
python app.py
# API available at http://localhost:5000
```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# Available at http://localhost:5173
```

---

## 🔑 Default Admin Credentials

| Field    | Value                   |
|----------|-------------------------|
| Email    | `admin@fitfusion.com`   |
| Password | `Admin@123`             |

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET  | `/api/auth/profile` | Get current user profile |

### Workouts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/workouts/` | Get all user workouts |
| POST   | `/api/workouts/` | Add new workout |
| PUT    | `/api/workouts/<id>` | Update workout |
| DELETE | `/api/workouts/<id>` | Delete workout |
| GET    | `/api/workouts/summary/weekly` | Weekly analytics |

### Diet
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/diet/` | Get all meals |
| POST   | `/api/diet/` | Add meal |
| PUT    | `/api/diet/<id>` | Update meal |
| DELETE | `/api/diet/<id>` | Delete meal |
| GET    | `/api/diet/summary?date=YYYY-MM-DD` | Daily summary |

### BMI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/bmi/calculate` | Calculate and save BMI |
| GET    | `/api/bmi/history` | Get BMI records |

### Admin *(admin role required)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/admin/users` | List all users |
| DELETE | `/api/admin/users/<id>` | Delete user |
| GET    | `/api/admin/reports` | App-wide stats |

---

## 🐳 Docker

```bash
# Build images manually
docker build -t fitfusion-backend -f docker/Dockerfile .
docker build -t fitfusion-frontend -f frontend/Dockerfile.frontend frontend/

# Or use compose
cd docker && docker-compose up --build
```

---

## 🔄 CI/CD

### GitHub Actions
The `.github/workflows/ci.yml` runs on every push:
1. **Backend lint** – flake8 check
2. **Backend test** – pytest
3. **Frontend build** – Vite production build
4. **Docker push** – on `main` branch only

Required GitHub Secrets: `DOCKER_USERNAME`, `DOCKER_PASSWORD`

### Jenkins
The `Jenkinsfile` defines:
1. `Checkout` → `Backend Lint` → `Backend Test`
2. `Frontend Build` → `Docker Build` → `Docker Push`
3. `Deploy` (docker-compose on main)

Required Jenkins credential: `docker-hub-credentials`

---

## 📊 Database Schema

```sql
users        (id, name, email, password, role, created_at)
workouts     (id, user_id, exercise_name, sets, reps, duration, notes, workout_date)
diet         (id, user_id, meal_name, calories, protein, carbs, fat, water_intake, meal_type, diet_date)
bmi_records  (id, user_id, weight, height, bmi_value, category, record_date)
```

---

## 👨‍💻 Author

Developed as a **Final Year Major Project** demonstrating full-stack development with modern DevOps practices.

---

## 📄 License

MIT License – Free to use for educational purposes.
