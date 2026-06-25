# UTM Timetable Management System

Full-stack timetable management system for Universiti Teknologi Malaysia's
Faculty of Computing — Vue 3 frontend + Express/Sequelize/PostgreSQL backend.

## Project Proposal & Background

### Introduction
The project aims to develop a mobile web-based Timetable Management System (TMS) tailored for the Faculty of Computing at Universiti Teknologi Malaysia (UTM). The purpose is to enhance accessibility, usability, and responsiveness of the current desktop-based timetable system by transforming it into a Single Page Application (SPA) suitable for mobile platforms. This system will primarily serve students and lecturers, enabling them to easily access and manage their schedules anytime, anywhere. The development process adopts an agile methodology, ensuring iterative feedback and continuous improvement through backend integration with the existing JSON-based timetable service. 

### Problem Background
The current timetable system is only available as a desktop-based web application, accessible via http://web.fc.utm.my, and not optimized for mobile platforms. It is not responsive or user-friendly on mobile devices, resulting in a poor user experience for students and lecturers who rely on smartphones and tablets for daily academic planning. The interface design and task flow are not suitable for smaller screens, making it difficult to navigate, view schedules, or perform basic interactions efficiently. The system lacks essential features such as timetable filtering, personalized reminders, and visual analytics, and offers limited accessibility without support for quick or dynamic interactions on mobile. 

### Goal
To develop a mobile web-based Single Page Application (SPA) that delivers a responsive, accessible, and user centric interface for timetable management. To integrate the system with the existing backend JSON data service, enhancing functionality with analytics features and supporting anytime anywhere access for all users in the Faculty of Computing.

### Objective
- **Testing:** Conduct user testing to gather feedback, identify issues, and improve system accuracy, performance, and user interface. 
- **Solution Design:** Design a responsive SPA interface that integrates with the JSON data service, with enhanced usability on mobile devices. 
- **Requirement Study:** Analyze the existing system to identify functional limitations and gather requirements from users including students, lecturers, and admins. 
- **Development:** Build the backend using Node.js to process course registration data and generate personalized timetables; implement the frontend using modern web technologies. 
- **Deployment & Documentation:** Finalize the system with end-user documentation and a demo video; apply user feedback to enhance overall usability.

### Project Scope
**Functions & Features:**
- Mobile-friendly user interface for timetable viewing
- Login and role-based access for students, lecturers, and admins
- Personalized timetable display and filtering
- Backend integration using the existing JSON data service
- Analytics features (e.g., class frequency, free slots, timetable stats)
- Notification/reminder feature for upcoming classes
- Admin access session management

**Users & Organization:**
- Students, Lecturers, and Admins from the Faculty of Computing, UTM

### NBAC Analysis
- **Need:** The current timetable system is not mobile-friendly, leading to poor accessibility and usability on smartphones. Users struggle with navigation, schedule viewing, and real-time updates, especially while on the move. The lack of personalization and mobile support creates frustration for students and lecturers.
- **Approach:** Develop a Single Page Application (SPA) using modern web technologies. Integrate the existing JSON data service, and build a Node.js backend to generate personalized schedules from course data. Apply an agile development strategy, with ongoing user testing and feedback.
- **Benefit:** A responsive mobile web system will offer anytime anywhere access, personalized timetables, and real-time updates, improving user satisfaction and academic planning efficiency. It also modernizes the faculty’s digital services and aligns with current mobile-first usage trends. 
- **Competitor:** Similar systems used by other faculties or universities (e.g., course management apps or LMS platforms) offer basic mobile support but often lack personalization and analytics. This solution improves upon competitors by focusing on real time integration, personalized views, and statistical insights, tailored specifically for UTM's Faculty of Computing.

### Basic Requirement
**General Requirements:**
1. Compatibility with major mobile browsers
2. Responsive design adaptable to various screen sizes
3. Reliable backend data integration
4. User session management and timeout handling
5. Secure login/authentication system

**Specific Requirements:**
1. Real-time data fetch from JSON service
2. Timetable analytics and visual graphs
3. Admin session acquisition and additional controls
4. Role-based access with respective functionalities
5. Student and lecturer timetable display with filtering options

### Proposed Solution
- **Dashboard:** Displays a quick overview of the user's current schedule along with the list of enrolled courses. This allows users to easily track their academic engagements in one place.
- **Menu Navigation:** Includes a bottom navigation bar and a clear menu layout that allows users to switch between pages like dashboard, timetable, profile, and analytics seamlessly.
- **Timetable View:** A responsive and interactive timetable layout with tabs to separate days, weeks, or course categories. Helps users visualize their schedules more clearly on mobile devices.
- **User Access & Roles:** Users sign in securely and are shown role-based interfaces (e.g., student or lecturer) with appropriate permissions and views tailored to their needs.
- **User Profile:** Shows details such as current semester, academic year, and personal academic performance. GPA trends and a summary of course history are also included for better academic insight.
- **Analytics & Insights:** Provides basic academic analytics. For lecturers, it highlights courses with the highest student enrollment; for students, it summarizes the number of courses registered and displays timetable stats.

### Conclusion
The proposed mobile web-based timetable management system aims to overcome the limitations of the existing desktop-only platform by delivering a responsive, user-friendly solution tailored for students and lecturers at the Faculty of Computing, UTM. By leveraging modern technologies such as Vue.js, Node.js, and Tailwind CSS, the system will provide personalized schedules, academic insights, and real-time access on any device. This project not only enhances accessibility and usability but also supports academic planning and decision-making through integrated analytics, ensuring a more efficient and engaging user experience for the UTM community.

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
