# FC Timetable Management System — Backend

Express + Sequelize + PostgreSQL API for the FC Timetable Management System.
Verified end-to-end against a real PostgreSQL instance — migrations, seeder,
and every endpoint below were actually run and tested, not just reviewed.

## Stack

- **Runtime**: Node.js + Express 5
- **Database**: PostgreSQL via Sequelize ORM
- **Auth**: JWT (jsonwebtoken) + bcryptjs password hashing
- **Validation**: manual validation in controllers (see note below)

## Setup

### 1. Install dependencies
```bash
cd Backend
npm install
```

### 2. Configure your database connection
Copy `.env.example` to `.env` and fill in your local Postgres credentials
(get these from pgAdmin: right-click your server → Properties → Connection
tab for host/port/username; the database name is whatever you created,
e.g. `ttms_db`):

```bash
cp .env.example .env
```

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ttms_db
DB_USER=postgres
DB_PASSWORD=your_actual_password
JWT_SECRET=generate_a_long_random_string_here
```

Generate a strong `JWT_SECRET` with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Run migrations
This creates all 7 tables (sessions, users, subjects, rooms, student_courses,
lecturer_courses, schedules) with proper foreign keys and indexes:
```bash
npm run migrate
```

### 4. Seed the database
Wipes and recreates everything with realistic demo data (10 rooms, 12
subjects, 12 lecturers, 60 students, ~29 weekly schedule entries, 300
enrollments):
```bash
npm run seed
```

This prints three demo accounts you can log in with:
```
admin / admin123
STAFF1000 / lecturer123  (Dr. Aiman Hakim)
A22001 / student123      (Aiman Rahman)
```

### 5. Start the server
```bash
npm run dev      # nodemon, auto-restarts on file changes
# or
npm start        # plain node, for production
```

Server runs on `http://localhost:5000` by default (configurable via `PORT`
in `.env`). You should see:
```
✓ Database connection established.
✓ Server running on http://localhost:5000
```

## Project structure

```
Backend/
├── config/
│   ├── database.js      # Sequelize connection used by the running app
│   └── config.js         # Sequelize CLI config (migrations use this)
├── models/                # Sequelize models + associations (index.js)
├── migrations/            # Versioned schema changes — run via sequelize-cli
├── controllers/           # Route handler logic
├── routes/                 # Express routers, wire URLs to controllers
├── middleware/
│   ├── auth.js            # requireAuth, requireRole
│   ├── jwt.js              # token sign/verify helpers
│   └── errorHandler.js     # centralized error handling + asyncHandler wrapper
├── scripts/
│   └── seed.js              # database seeder (wipes + recreates demo data)
├── .sequelizerc             # points sequelize-cli at config/, not the default location
├── .env.example
└── server.js                 # entry point
```

## API Reference

All endpoints except `/api/health` and `POST /api/auth/login` require
`Authorization: Bearer <token>`.

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/login` | public | `{ username, password }` → `{ token, user }` |
| GET | `/api/auth/profile` | authenticated | Returns the current user |

### Rooms
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/rooms` | any authenticated user | List all rooms |
| GET | `/api/rooms/:id` | any authenticated user | Get one room |
| POST | `/api/rooms` | admin only | Create a room |
| PUT | `/api/rooms/:id` | admin only | Update a room (partial updates supported) |
| DELETE | `/api/rooms/:id` | admin only | Delete a room (blocked with 409 if it has scheduled sessions) |

### Subjects
Same pattern as Rooms: `GET` open to any authenticated user, `POST`/`PUT`/`DELETE` admin-only.

### Schedules
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/schedules` | any authenticated user | Role-scoped by default: students see their enrolled subjects, lecturers see their own teaching sessions, admins see everything. Pass `?scope=all` (admin only) to force a full unscoped view. Filter with `?room_id=`, `?subject_id=`, `?day_of_week=`. |
| GET | `/api/schedules/:id` | any authenticated user | Get one schedule entry with subject/room/lecturer/session joined |
| POST | `/api/schedules` | admin only | Create a timetable entry |
| PUT | `/api/schedules/:id` | admin only | Update a timetable entry |
| DELETE | `/api/schedules/:id` | admin only | Delete a timetable entry |

### Analytics
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/analytics` | any authenticated user | Combined: `{ utilization, conflicts, suggestions }` |
| GET | `/api/analytics/utilization` | any authenticated user | Per-room weekly utilization % and average fill rate |
| GET | `/api/analytics/conflicts` | any authenticated user | Detected room double-bookings, lecturer double-bookings, and capacity overflows |
| GET | `/api/analytics/suggestions` | any authenticated user | Plain-English optimization suggestions derived from the above |

This logic is a direct, faithful port of `Frontend/src/data/analytics.js` —
same detection rules, now running against real joined SQL data instead of
an in-memory mock array.

## Design notes / things worth knowing

- **Role-based access** is enforced server-side via `requireRole('admin')`
  middleware — not just hidden in the UI. A student token hitting
  `POST /api/rooms` gets a real 403, verified by actual testing.
- **Schedule scoping** for students works by first resolving their
  `student_courses` enrollments to a list of subject IDs, then filtering
  schedules by those IDs — mirrors exactly how the frontend mock's
  `getScheduleForUser()` worked, just as a real two-step SQL query instead
  of an in-memory filter.
- **Validation** is currently hand-rolled per-controller (see
  `roomController.js`'s `validateRoomInput`) rather than using a schema
  library like `express-validator` (it's installed but not wired up yet) or
  `zod`. This keeps the dependency surface small for now; swapping to a
  schema-based approach later is a contained change since all validation
  logic is isolated at the top of each controller function.
- **Soft delete vs. hard delete**: rooms and schedules are hard-deleted.
  Deleting a room with active schedules is blocked (409) rather than
  cascading the delete, so an admin can't accidentally erase a term's worth
  of timetable entries by deleting one room.
- **Password hashing**: `User.setPassword()` is the only way to set a
  password — it always goes through bcrypt with 10 salt rounds. There's no
  path that lets `password_hash` be set directly with plaintext.
- **JWT** payload is intentionally minimal (`sub`, `username`, `user_type`)
  — the full user record is always re-fetched from the database on each
  authenticated request via `requireAuth`, so a user that's deleted or
  changes role doesn't keep working on a stale token until expiry.

## Known gaps / next steps

- No automated test suite yet (all verification so far has been manual
  `curl` testing against a real database during development).
- No rate limiting on `/api/auth/login` (brute-force protection).
- No pagination on `GET /api/rooms`, `/api/subjects`, or `/api/schedules` —
  fine at this data scale, would need it before scaling to many sessions'
  worth of historical schedules.
- StudentCourse / LecturerCourse don't have their own dedicated REST routes
  yet (enrollment management) — they're currently only populated by the
  seeder. Add `routes/enrollments.js` if the frontend needs to manage
  enrollments directly rather than via re-seeding.
