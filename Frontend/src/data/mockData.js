// Mock data layer — mirrors the relational backend schema (Sessions,
// Users, Subjects, Rooms, Schedules, StudentCourse, LecturerCourse).
//
// STATUS: no longer imported by the live app — every page now calls the
// real backend via src/services/. Kept around as an offline fixture for
// UI development without a running backend/database. Safe to delete.

export const currentSession = {
  id: 1,
  sesi: '2025/2026',
  semester: 1,
  is_active: true,
}

export const rooms = [
  { id: 1, kod_ruang: 'FSKM-DK1', nama_ruang: 'Dewan Kuliah 1', nama_ruang_singkatan: 'DK1', kapasiti: 120, jenis_ruang: 'Lecture Hall' },
  { id: 2, kod_ruang: 'FSKM-DK2', nama_ruang: 'Dewan Kuliah 2', nama_ruang_singkatan: 'DK2', kapasiti: 100, jenis_ruang: 'Lecture Hall' },
  { id: 3, kod_ruang: 'FSKM-K1.1', nama_ruang: 'Kuliah 1.1', nama_ruang_singkatan: 'K1.1', kapasiti: 45, jenis_ruang: 'Classroom' },
  { id: 4, kod_ruang: 'FSKM-K1.2', nama_ruang: 'Kuliah 1.2', nama_ruang_singkatan: 'K1.2', kapasiti: 45, jenis_ruang: 'Classroom' },
  { id: 5, kod_ruang: 'FSKM-K2.1', nama_ruang: 'Kuliah 2.1', nama_ruang_singkatan: 'K2.1', kapasiti: 40, jenis_ruang: 'Classroom' },
  { id: 6, kod_ruang: 'FSKM-LAB1', nama_ruang: 'Lab Komputer 1', nama_ruang_singkatan: 'LAB1', kapasiti: 35, jenis_ruang: 'Computer Lab' },
  { id: 7, kod_ruang: 'FSKM-LAB2', nama_ruang: 'Lab Komputer 2', nama_ruang_singkatan: 'LAB2', kapasiti: 35, jenis_ruang: 'Computer Lab' },
  { id: 8, kod_ruang: 'FSKM-LAB3', nama_ruang: 'Lab Rangkaian', nama_ruang_singkatan: 'LAB3', kapasiti: 30, jenis_ruang: 'Computer Lab' },
  { id: 9, kod_ruang: 'FSKM-SEM1', nama_ruang: 'Bilik Seminar 1', nama_ruang_singkatan: 'SEM1', kapasiti: 20, jenis_ruang: 'Seminar Room' },
  { id: 10, kod_ruang: 'FSKM-SEM2', nama_ruang: 'Bilik Seminar 2', nama_ruang_singkatan: 'SEM2', kapasiti: 20, jenis_ruang: 'Seminar Room' },
]

export const subjects = [
  { id: 1, kod_subjek: 'SECJ1013', nama_subjek: 'Programming Technique I', kredit: 3, faculty_code: 'FSKM' },
  { id: 2, kod_subjek: 'SECJ1023', nama_subjek: 'Programming Technique II', kredit: 3, faculty_code: 'FSKM' },
  { id: 3, kod_subjek: 'SECR1043', nama_subjek: 'Discrete Structure', kredit: 3, faculty_code: 'FSKM' },
  { id: 4, kod_subjek: 'SECD2523', nama_subjek: 'Database', kredit: 3, faculty_code: 'FSKM' },
  { id: 5, kod_subjek: 'SECD2613', nama_subjek: 'Web Technology', kredit: 3, faculty_code: 'FSKM' },
  { id: 6, kod_subjek: 'SECP3133', nama_subjek: 'Software Engineering', kredit: 3, faculty_code: 'FSKM' },
  { id: 7, kod_subjek: 'SECR2043', nama_subjek: 'Computer Organisation & Design', kredit: 3, faculty_code: 'FSKM' },
  { id: 8, kod_subjek: 'SECV3203', nama_subjek: 'Computer Networks', kredit: 3, faculty_code: 'FSKM' },
  { id: 9, kod_subjek: 'SECI2143', nama_subjek: 'Artificial Intelligence', kredit: 3, faculty_code: 'FSKM' },
  { id: 10, kod_subjek: 'SECJ2154', nama_subjek: 'Operating Systems', kredit: 4, faculty_code: 'FSKM' },
  { id: 11, kod_subjek: 'SECD2553', nama_subjek: 'Human Computer Interaction', kredit: 3, faculty_code: 'FSKM' },
  { id: 12, kod_subjek: 'SECP2613', nama_subjek: 'System Analysis & Design', kredit: 3, faculty_code: 'FSKM' },
]

const lecturerNames = [
  'Dr. Aiman Hakim', 'Dr. Siti Norfarahin', 'Prof. Dr. Razman Ali', 'Dr. Nurul Izzati',
  'Assoc. Prof. Dr. Khairul Anwar', 'Dr. Mei Ling Tan', 'Dr. Farah Diyana', 'Dr. Hafiz Rahman',
  'Prof. Dr. Vasanthi Kumar', 'Dr. Amirul Syafiq', 'Dr. Suhana Mokhtar', 'Dr. Jason Lim',
]

export const lecturers = lecturerNames.map((name, i) => ({
  id: 100 + i,
  username: `STAFF${(1000 + i).toString()}`,
  full_name: name,
  user_type: 'lecturer',
  faculty_code: 'FSKM',
  description: 'Faculty of Computing',
  email: `${name.toLowerCase().replace(/[^a-z\s]/g, '').trim().replace(/\s+/g, '.')}@uni.edu.my`,
}))

// Generate ~60 students across a few cohort sections
const firstNames = ['Aiman', 'Aina', 'Farid', 'Nabila', 'Hakim', 'Sofea', 'Daniel', 'Iris', 'Zul', 'Lim', 'Wei', 'Putri', 'Arif', 'Sara', 'Hafiz', 'Nadia', 'Yusuf', 'Mei', 'Ravi', 'Anis']
const lastNames = ['Rahman', 'Ismail', 'Tan', 'Hashim', 'Chong', 'Yaakob', 'Krishnan', 'Othman', 'Wong', 'Bakar']

export const students = Array.from({ length: 60 }, (_, i) => {
  const fn = firstNames[i % firstNames.length]
  const ln = lastNames[(i * 3) % lastNames.length]
  return {
    id: 200 + i,
    username: `A${(22001 + i).toString()}`,
    full_name: `${fn} ${ln}`,
    user_type: 'student',
    faculty_code: 'FSKM',
    description: `Year ${1 + (i % 4)} - Bachelor of Computer Science`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@graduate.uni.edu.my`,
  }
})

export const adminUser = {
  id: 1,
  username: 'admin',
  full_name: 'Nor Adlina binti Yusoff',
  user_type: 'admin',
  faculty_code: 'FSKM',
  description: 'Faculty Timetable Administrator',
  email: 'adlina.admin@uni.edu.my',
}

export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
export const timeSlots = [
  '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
  '12:00 - 13:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00',
]

// Deterministic pseudo-random schedule generator so the grid looks full and plausible
function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

const rand = seededRandom(42)
const sections = ['01', '02', '03']

export const schedules = []
let scheduleId = 1
subjects.forEach((subject, sIdx) => {
  sections.forEach((section, secIdx) => {
    // not every subject runs every section — skip some for realism
    if (rand() < 0.25) return
    const day = days[Math.floor(rand() * days.length)]
    const slotIdx = Math.floor(rand() * (timeSlots.length - 1)) // avoid overrun
    const room = rooms[(sIdx + secIdx) % rooms.length]
    const lecturer = lecturers[(sIdx + secIdx * 2) % lecturers.length]
    schedules.push({
      id: scheduleId++,
      subject_id: subject.id,
      room_id: room.id,
      lecturer_id: lecturer.id,
      session_id: currentSession.id,
      section,
      day_of_week: day,
      time_slot: timeSlots[slotIdx],
      // duration of 1-2 slots for some variety
      span: rand() < 0.3 ? 2 : 1,
      enrolled: Math.floor(rand() * room.kapasiti * 0.9) + 5,
    })
  })
})

// Student & lecturer course enrollments derived from the schedule for consistency
export const studentCourses = []
students.forEach((student, i) => {
  // each student takes 5 subjects from a rotating window
  const startIdx = i % subjects.length
  for (let k = 0; k < 5; k++) {
    const subject = subjects[(startIdx + k) % subjects.length]
    studentCourses.push({
      student_id: student.id,
      subject_id: subject.id,
      session_id: currentSession.id,
      section: sections[(i + k) % sections.length],
    })
  }
})

export const lecturerCourses = lecturers.map((lecturer, i) => ({
  lecturer_id: lecturer.id,
  subject_id: subjects[i % subjects.length].id,
  session_id: currentSession.id,
  section: sections[i % sections.length],
}))

// --- Helper lookups -------------------------------------------------------

export function getSubject(id) {
  return subjects.find((s) => s.id === id)
}
export function getRoom(id) {
  return rooms.find((r) => r.id === id)
}
export function getLecturer(id) {
  return lecturers.find((l) => l.id === id)
}

export function getScheduleForUser(user) {
  if (!user) return []
  if (user.user_type === 'lecturer') {
    return schedules.filter((s) => s.lecturer_id === user.id)
  }
  if (user.user_type === 'student') {
    const subjectIds = new Set(
      studentCourses.filter((sc) => sc.student_id === user.id).map((sc) => sc.subject_id)
    )
    return schedules.filter((s) => subjectIds.has(s.subject_id))
  }
  // admin sees everything
  return schedules
}

export function findAllUsers() {
  return [adminUser, ...lecturers, ...students]
}

export function findUserByUsername(username) {
  return findAllUsers().find((u) => u.username.toLowerCase() === username.toLowerCase())
}
