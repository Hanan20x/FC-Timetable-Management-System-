# UTM Timetable Management System

Full-stack timetable management system for Universiti Teknologi Malaysia's
Faculty of Computing — Vue 3 frontend + Express/Sequelize/PostgreSQL backend.

## Status

| Layer | Status |
|---|---|
| **Frontend** | Complete — built against mock data, branded for UTM |
| **Backend** | Complete — built and verified end-to-end against a real PostgreSQL database |
| **Integration** | Not yet wired together — frontend still reads from `src/data/mockData.js` rather than calling the live API |

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
npm run dev              # http://localhost:5173
```

Demo accounts (created by the seeder, work in both the frontend mock auth
and the real backend once integrated):
```
admin / admin123
STAFF1000 / lecturer123   (Dr. Aiman Hakim)
A22001 / student123        (Aiman Rahman)
```

## What's built

**Frontend** — Login, Dashboard (role-aware hero + live timetable preview),
Timetable (full weekly grid with filters), Room Management (full CRUD UI),
Analytics (utilization chart, conflict detection, optimization suggestions),
Profile (avatar-only nav, not in the sidebar). Branded for UTM: real logo
and official maroon/gold colors sourced from `brand.utm.my`, not
approximated. See `Frontend/README.md` for full design-system notes.

**Backend** — 7 PostgreSQL tables (Session, User, Subject, Room,
StudentCourse, LecturerCourse, Schedule) with proper foreign keys and
indexes via Sequelize migrations. JWT auth with bcrypt password hashing.
Full REST CRUD for Rooms and Subjects (admin-gated mutations). Role-scoped
Schedule queries (students see their enrollments, lecturers see their
teaching load, admins see everything). Analytics endpoints that are a
direct, faithful port of the frontend's mock conflict-detection logic, now
running as real SQL queries. A seeder that generates the same demo dataset
the frontend was designed around (10 rooms, 12 subjects, 12 lecturers, 60
students, ~29 schedule entries, 300 enrollments). See `Backend/README.md`
for the full API reference and architecture notes.

## Next step: integration

The frontend currently imports directly from `Frontend/src/data/mockData.js`
and `Frontend/src/data/analytics.js`. To connect it to the real backend:

1. Create `Frontend/src/services/api.js` with a small fetch/axios wrapper
   that attaches the JWT to the `Authorization` header.
2. Replace `useAuth()`'s mock `login()` in `Frontend/src/stores/auth.js`
   with a real `POST /api/auth/login` call, storing the returned token.
3. Replace the imports in `Dashboard.vue`, `Timetable.vue`,
   `RoomManagement.vue`, `Analytics.vue`, and `Profile.vue` from
   `mockData.js`/`analytics.js` with calls to the new API service.
4. Remove the mock data files once nothing imports them, or keep them
   around as Storybook-style fixtures for offline UI development — your
   call.

This is a contained, mechanical change since the backend's response shapes
(`{ room }`, `{ rooms }`, `{ schedules }`, `{ utilization, conflicts,
suggestions }`) were deliberately designed to mirror the mock data's shape.
