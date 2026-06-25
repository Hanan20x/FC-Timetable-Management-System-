# FC Timetable Management System

Full-stack timetable management system for Universiti Teknologi Malaysia's
Faculty of Computing — Vue 3 frontend + Express/Sequelize/PostgreSQL backend.

## Project Overview

The FC Timetable Management System (TMS) is a responsive, mobile-first Single Page Application (SPA) designed to modernize timetable management for the Faculty of Computing at Universiti Teknologi Malaysia. 

By upgrading the legacy desktop-only system, this platform allows students and lecturers to easily access personalized schedules, real-time updates, and academic analytics from any device. Built with Vue.js, Node.js, and PostgreSQL, the system securely integrates with existing JSON timetable data while adding advanced features like role-based access, schedule conflict detection, and interactive visual insights.

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Vue 3, Vite, Tailwind CSS |
| **Backend** | Node.js, Express, Sequelize ORM |
| **Database** | PostgreSQL |

## Project structure

```
.
├── Frontend/    Vue 3 + Vite + Tailwind dashboard (see Frontend/README.md)
└── Backend/     Express + Sequelize + PostgreSQL API (see Backend/README.md)
```

Each half has its own detailed README — this file is just the map.

## Quick start

You need two terminals (or run the backend first, frontend second).

### Backend
```bash
cd Backend
npm install
cp .env.example .env   # then fill in your local Postgres credentials
npm run migrate
npm run seed
npm run dev             # http://localhost:5000
```

### Frontend
```bash
cd Frontend
npm install
cp .env.example .env   # defaults to http://localhost:5000/api — adjust if your backend runs elsewhere
npm run dev              # http://localhost:5173
```



## Features

**Frontend**
- **Authentication:** Secure login with role-based access control and session persistence.
- **Dashboard:** Role-aware welcome hero and live timetable overview.
- **Timetable Viewer:** Full weekly interactive grid with server-side dynamic filtering.
- **Room Management:** Complete interface for adding, editing, and removing physical rooms.
- **Analytics:** Server-computed utilization charts, schedule conflict detection, and optimization suggestions.
- **Branding:** Officially branded for UTM with accurate logos and maroon/gold color schemes.

**Backend**
- **Database Architecture:** 7 normalized PostgreSQL tables with proper foreign keys via Sequelize migrations.
- **Security:** JWT-based authentication, bcrypt password hashing, and dynamic CORS configuration for local development.
- **RESTful API:** Full CRUD endpoints with admin-gated mutations.
- **Role-Scoping:** Data is strictly scoped so students see enrollments, lecturers see teaching loads, and admins see everything.
- **Analytical Engine:** SQL-driven timetable conflict detection and statistics logic.
- **Seeding:** Built-in seeder generating a realistic campus dataset (rooms, subjects, lecturers, and students).


