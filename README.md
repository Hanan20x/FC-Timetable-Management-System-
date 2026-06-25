# UTM Timetable Management System

Full-stack timetable management system for Universiti Teknologi Malaysia's
Faculty of Computing — Vue 3 frontend + Express/Sequelize/PostgreSQL backend.

## Project Overview

The UTM Timetable Management System (TMS) is a responsive, mobile-first Single Page Application (SPA) designed to modernize timetable management for the Faculty of Computing at Universiti Teknologi Malaysia. 

By upgrading the legacy desktop-only system, this platform allows students and lecturers to easily access personalized schedules, real-time updates, and academic analytics from any device. Built with Vue.js, Node.js, and PostgreSQL, the system securely integrates with existing JSON timetable data while adding advanced features like role-based access, schedule conflict detection, and interactive visual insights.

## Status

| Layer | Status |
|---|---|
| **Frontend** | Complete — branded for UTM, wired to the real backend |
| **Backend** | Complete — built and verified end-to-end against a real PostgreSQL database |
| **Integration** | Complete — frontend calls the live API; verified with a real headless browser doing a full create→view→delete round trip against a real running backend + Postgres |

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



## What's built

**Frontend** — Login (real auth, persists across refresh), Dashboard
(role-aware hero + live timetable preview), Timetable (full weekly grid
with server-side filters), Room Management (full CRUD against the real
API), Analytics (utilization chart, conflict detection, optimization
suggestions — all server-computed), Profile (avatar-only nav, not in the
sidebar). Branded for UTM: real logo and official maroon/gold colors
sourced from `brand.utm.my`, not approximated. See `Frontend/README.md`
for full design-system notes.

**Backend** — 7 PostgreSQL tables (Session, User, Subject, Room,
StudentCourse, LecturerCourse, Schedule) with proper foreign keys and
indexes via Sequelize migrations. JWT auth with bcrypt password hashing.
CORS dynamically configured for seamless multi-instance local development (`http://localhost:*`).
Full REST CRUD for Rooms and Subjects (admin-gated mutations). Role-scoped
Schedule queries (students see their enrollments, lecturers see their
teaching load, admins see everything). Analytics endpoints that are a
direct, faithful port of the frontend's original mock conflict-detection
logic, now running as real SQL queries. A seeder that generates the same
demo dataset the frontend was designed around (10 rooms, 12 subjects, 12
lecturers, 60 students, ~29 schedule entries, 300 enrollments). See
`Backend/README.md` for the full API reference and architecture notes.

## How the integration was verified

Every claim above was checked by actually running the thing, not just
reviewing the code:

- Migrations and seeder run for real against a live PostgreSQL instance
- Every API endpoint tested with real `curl` requests: auth success/failure,
  role-based 403s, duplicate/foreign-key/validation 400s and 409s
- The committed repo was cloned fresh into an empty directory and run
  through `npm install` → `migrate` → `seed` → `start` → login with zero
  manual fixes, to prove the *committed* code works standalone
- The frontend was driven through a real headless browser against the real
  running backend: logged in for real (confirmed an actual 3-part JWT in
  localStorage), navigated every page with zero console errors, confirmed
  a page refresh mid-session stays logged in instead of bouncing to
  `/login`, and round-tripped a real room through the actual UI — created
  it via the form, watched the count go from 10 to 11 rooms in the live
  database, deleted it via the confirmation dialog, watched it return to 10
