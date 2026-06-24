# UTM Timetable Management System — Frontend

Vue 3 (Composition API) + Vite + Tailwind CSS frontend for the UTM Faculty
of Computing Timetable Management System. Talks to the real Express/
Sequelize/PostgreSQL backend in `../Backend` — see that folder's README
for API details and setup.

## Status: wired to the real backend

### What's built
- **Login** (`/login`) — real JWT auth against `POST /api/auth/login`,
  demo account quick-select for Admin / Lecturer / Student roles, session
  persists across page refresh via `localStorage`.
- **Dashboard** (`/dashboard`) — role-aware hero, stat cards, and a live
  timetable preview (today's sessions, or the full week if none today) —
  all fetched from the real API.
- **Timetable** (`/timetable`) — full weekly grid, room/subject filters
  (server-side, re-fetches on change), My View vs. All Sessions toggle
  (admin only).
- **Room Management** (`/rooms`) — full CRUD against the real
  `/api/rooms` endpoints, with utilization bars, a search box, and the
  backend's actual error messages surfaced in the UI (duplicate room
  code, delete blocked by dependent schedules, etc.).
- **Analytics** (`/analytics`) — Chart.js room utilization bar chart,
  conflict detection panel (room double-booking, lecturer double-booking,
  capacity overflow), and optimization suggestions — all computed
  server-side by the backend, fetched via `/api/analytics`.
- **Profile** (`/profile`) — reachable **only** via the header avatar (not
  in the sidebar), shows user details and enrolled subjects / teaching
  load (derived from the already-scoped `/api/schedules` response).

### Design system
**Branded for Universiti Teknologi Malaysia (UTM).** Colors and logo are
sourced directly from UTM's own brand site (`brand.utm.my`), not approximated:
- **Maroon** `#5C001F` (RGB 92,0,31) — official UTM corporate color
- **Gold** `#F8BE17` (RGB 248,190,23) — official UTM corporate color
- Full tint/shade ramps (`maroon-50`...`maroon-900`, `gold-50`...`gold-900`)
  derived from those two anchors in `tailwind.config.js`, with both
  lightness *and* saturation tapered at the light end so tints read as
  soft neutrals rather than oversaturated hues. Maroon's 300–400 steps
  trend magenta at this particular hue and are intentionally avoided in
  UI usage — stick to 50/100/200 (tints) and 600–900 (solid/dark).
- **Logo**: the actual official UTM emblem (open book, golden circle,
  round-bottom flask, crescent) downloaded from `brand.utm.my`, stored in
  `public/branding/`. Includes the full color lockup (`utm-logo.png`), a
  white-reversed variant for dark backgrounds (`utm-logo-white.png`,
  `utm-emblem-white.png`), and an emblem-only crop for compact spaces
  (`utm-emblem.png`).

Dashboard theme: dark slate-900 sidebar (showing the actual UTM emblem),
sticky `backdrop-blur-md bg-white/80` header, slate-50 content background,
white cards with `rounded-2xl`/`rounded-3xl` and `shadow-soft`/
`shadow-card`. Primary actions and hero sections use solid/gradient
maroon; gold is the accent color (notification dot, greeting text, active
nav icon, utilization bars). Tailwind v3 (config-driven), not v4.

### Data layer
- `src/services/` — one module per backend resource (`authService.js`,
  `roomService.js`, `scheduleService.js`, `subjectService.js`,
  `userService.js`, `analyticsService.js`), each a thin wrapper around the
  shared `api.js` axios instance. `api.js` attaches the JWT from
  `localStorage` to every request via an interceptor, and redirects to
  `/login` on a 401.
- `src/stores/auth.js` — real auth store. `login()` calls the backend,
  persists the token + user to `localStorage`. `refreshProfile()` is
  called once on app load (from the router guard) to validate any
  persisted token against the backend rather than trusting it
  indefinitely.
- `src/data/constants.js` — static `days`/`timeSlots` arrays used to
  render the timetable grid's rows/columns. Not mock data — just fixed UI
  scaffolding.
- `src/data/mockData.js` and `src/data/analytics.js` — **no longer used
  by the live app** (confirmed: neither is bundled into any production
  build chunk). Kept as offline fixtures for UI development without a
  running backend. Delete them if you don't want the dead weight.

Three demo accounts exist as real seeded rows in the database (see
`Backend/scripts/seed.js`) and the login screen's quick-select buttons
just pre-fill the form — the backend still validates them for real:
- `admin` / `admin123`
- `STAFF1000` / `lecturer123`
- `A22001` / `student123`

## Running locally

```bash
npm install
cp .env.example .env   # adjust VITE_API_URL if your backend isn't on :5000
npm run dev             # http://localhost:5173
npm run build           # production build to dist/
```

The backend must be running (see `../Backend/README.md`) for anything
beyond the login screen to work — every page does a real fetch on mount.

## Verified by actual testing, not just code review

A real headless browser was driven through the full app against the real
running backend + Postgres:
- Logged in for real; confirmed an actual 3-part JWT landed in
  `localStorage`, not a placeholder string
- Navigated every page (Dashboard → Timetable → Room Management →
  Analytics → Profile) with **zero browser console errors**
- Refreshed the page mid-session on a protected route and confirmed it
  stayed on that route instead of bouncing to `/login` — proves the
  localStorage persistence and the router's profile-revalidation both work
- Round-tripped a real room through the actual UI: clicked "Add Room",
  filled the form, submitted — watched the room count go from 10 to 11 in
  the live database. Then deleted it via the actual confirmation dialog —
  watched the count return to 10.
