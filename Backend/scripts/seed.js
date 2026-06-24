/**
 * Database seeder — wipes and recreates all tables with realistic relational
 * mock data (Sessions, Users, Subjects, Rooms, Schedules, and the two
 * enrollment/assignment junction tables).
 *
 * This is a direct port of Frontend/src/data/mockData.js so the backend
 * serves the exact same demo dataset the frontend was built against.
 *
 * Usage: npm run seed
 */
require('dotenv').config();

const { sequelize, Session, User, Subject, Room, StudentCourse, LecturerCourse, Schedule } = require('../models');

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
  '12:00 - 13:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00',
];
const SECTIONS = ['01', '02', '03'];

// Deterministic pseudo-random generator so re-running the seeder produces
// the same dataset every time (mirrors the frontend mock data generator).
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const ROOMS = [
  { kod_ruang: 'FSKM-DK1', nama_ruang: 'Dewan Kuliah 1', nama_ruang_singkatan: 'DK1', kapasiti: 120, jenis_ruang: 'Lecture Hall' },
  { kod_ruang: 'FSKM-DK2', nama_ruang: 'Dewan Kuliah 2', nama_ruang_singkatan: 'DK2', kapasiti: 100, jenis_ruang: 'Lecture Hall' },
  { kod_ruang: 'FSKM-K1.1', nama_ruang: 'Kuliah 1.1', nama_ruang_singkatan: 'K1.1', kapasiti: 45, jenis_ruang: 'Classroom' },
  { kod_ruang: 'FSKM-K1.2', nama_ruang: 'Kuliah 1.2', nama_ruang_singkatan: 'K1.2', kapasiti: 45, jenis_ruang: 'Classroom' },
  { kod_ruang: 'FSKM-K2.1', nama_ruang: 'Kuliah 2.1', nama_ruang_singkatan: 'K2.1', kapasiti: 40, jenis_ruang: 'Classroom' },
  { kod_ruang: 'FSKM-LAB1', nama_ruang: 'Lab Komputer 1', nama_ruang_singkatan: 'LAB1', kapasiti: 35, jenis_ruang: 'Computer Lab' },
  { kod_ruang: 'FSKM-LAB2', nama_ruang: 'Lab Komputer 2', nama_ruang_singkatan: 'LAB2', kapasiti: 35, jenis_ruang: 'Computer Lab' },
  { kod_ruang: 'FSKM-LAB3', nama_ruang: 'Lab Rangkaian', nama_ruang_singkatan: 'LAB3', kapasiti: 30, jenis_ruang: 'Computer Lab' },
  { kod_ruang: 'FSKM-SEM1', nama_ruang: 'Bilik Seminar 1', nama_ruang_singkatan: 'SEM1', kapasiti: 20, jenis_ruang: 'Seminar Room' },
  { kod_ruang: 'FSKM-SEM2', nama_ruang: 'Bilik Seminar 2', nama_ruang_singkatan: 'SEM2', kapasiti: 20, jenis_ruang: 'Seminar Room' },
];

const SUBJECTS = [
  { kod_subjek: 'SECJ1013', nama_subjek: 'Programming Technique I', kredit: 3, faculty_code: 'FSKM' },
  { kod_subjek: 'SECJ1023', nama_subjek: 'Programming Technique II', kredit: 3, faculty_code: 'FSKM' },
  { kod_subjek: 'SECR1043', nama_subjek: 'Discrete Structure', kredit: 3, faculty_code: 'FSKM' },
  { kod_subjek: 'SECD2523', nama_subjek: 'Database', kredit: 3, faculty_code: 'FSKM' },
  { kod_subjek: 'SECD2613', nama_subjek: 'Web Technology', kredit: 3, faculty_code: 'FSKM' },
  { kod_subjek: 'SECP3133', nama_subjek: 'Software Engineering', kredit: 3, faculty_code: 'FSKM' },
  { kod_subjek: 'SECR2043', nama_subjek: 'Computer Organisation & Design', kredit: 3, faculty_code: 'FSKM' },
  { kod_subjek: 'SECV3203', nama_subjek: 'Computer Networks', kredit: 3, faculty_code: 'FSKM' },
  { kod_subjek: 'SECI2143', nama_subjek: 'Artificial Intelligence', kredit: 3, faculty_code: 'FSKM' },
  { kod_subjek: 'SECJ2154', nama_subjek: 'Operating Systems', kredit: 4, faculty_code: 'FSKM' },
  { kod_subjek: 'SECD2553', nama_subjek: 'Human Computer Interaction', kredit: 3, faculty_code: 'FSKM' },
  { kod_subjek: 'SECP2613', nama_subjek: 'System Analysis & Design', kredit: 3, faculty_code: 'FSKM' },
];

const LECTURER_NAMES = [
  'Dr. Aiman Hakim', 'Dr. Siti Norfarahin', 'Prof. Dr. Razman Ali', 'Dr. Nurul Izzati',
  'Assoc. Prof. Dr. Khairul Anwar', 'Dr. Mei Ling Tan', 'Dr. Farah Diyana', 'Dr. Hafiz Rahman',
  'Prof. Dr. Vasanthi Kumar', 'Dr. Amirul Syafiq', 'Dr. Suhana Mokhtar', 'Dr. Jason Lim',
];

const FIRST_NAMES = ['Aiman', 'Aina', 'Farid', 'Nabila', 'Hakim', 'Sofea', 'Daniel', 'Iris', 'Zul', 'Lim', 'Wei', 'Putri', 'Arif', 'Sara', 'Hafiz', 'Nadia', 'Yusuf', 'Mei', 'Ravi', 'Anis'];
const LAST_NAMES = ['Rahman', 'Ismail', 'Tan', 'Hashim', 'Chong', 'Yaakob', 'Krishnan', 'Othman', 'Wong', 'Bakar'];

async function seed() {
  console.log('Connecting to database...');
  await sequelize.authenticate();

  console.log('Wiping existing data...');
  // Delete in dependency order (children before parents) rather than relying
  // solely on CASCADE, so this works even if a future migration loosens FKs.
  await Schedule.destroy({ where: {}, truncate: true, cascade: true, force: true });
  await StudentCourse.destroy({ where: {}, truncate: true, cascade: true, force: true });
  await LecturerCourse.destroy({ where: {}, truncate: true, cascade: true, force: true });
  await User.destroy({ where: {}, truncate: true, cascade: true, force: true });
  await Subject.destroy({ where: {}, truncate: true, cascade: true, force: true });
  await Room.destroy({ where: {}, truncate: true, cascade: true, force: true });
  await Session.destroy({ where: {}, truncate: true, cascade: true, force: true });

  console.log('Creating session...');
  const session = await Session.create({ sesi: '2025/2026', semester: 1, is_active: true });

  console.log('Creating rooms...');
  const rooms = await Room.bulkCreate(ROOMS, { returning: true });

  console.log('Creating subjects...');
  const subjects = await Subject.bulkCreate(SUBJECTS, { returning: true });

  console.log('Creating admin user...');
  const admin = User.build({
    username: 'admin',
    full_name: 'Nor Adlina binti Yusoff',
    user_type: 'admin',
    faculty_code: 'FSKM',
    description: 'Faculty Timetable Administrator',
    email: 'adlina.admin@uni.edu.my',
  });
  await admin.setPassword('admin123');
  await admin.save();

  console.log('Creating lecturers...');
  const lecturers = [];
  for (let i = 0; i < LECTURER_NAMES.length; i++) {
    const name = LECTURER_NAMES[i];
    const slug = name.toLowerCase().replace(/[^a-z\s]/g, '').trim().replace(/\s+/g, '.');
    const lecturer = User.build({
      username: `STAFF${1000 + i}`,
      full_name: name,
      user_type: 'lecturer',
      faculty_code: 'FSKM',
      description: 'Faculty of Computing',
      email: `${slug}@uni.edu.my`,
    });
    await lecturer.setPassword('lecturer123');
    await lecturer.save();
    lecturers.push(lecturer);
  }

  console.log('Creating students...');
  const students = [];
  for (let i = 0; i < 60; i++) {
    const fn = FIRST_NAMES[i % FIRST_NAMES.length];
    const ln = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const student = User.build({
      username: `A${22001 + i}`,
      full_name: `${fn} ${ln}`,
      user_type: 'student',
      faculty_code: 'FSKM',
      description: `Year ${1 + (i % 4)} - Bachelor of Computer Science`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@graduate.uni.edu.my`,
    });
    await student.setPassword('student123');
    await student.save();
    students.push(student);
  }

  console.log('Generating schedule entries...');
  const rand = seededRandom(42);
  const scheduleRows = [];
  subjects.forEach((subject, sIdx) => {
    SECTIONS.forEach((section, secIdx) => {
      if (rand() < 0.25) return; // skip ~25% for realism, same as the frontend mock
      const day = DAYS[Math.floor(rand() * DAYS.length)];
      const slotIdx = Math.floor(rand() * (TIME_SLOTS.length - 1));
      const room = rooms[(sIdx + secIdx) % rooms.length];
      const lecturer = lecturers[(sIdx + secIdx * 2) % lecturers.length];
      scheduleRows.push({
        subject_id: subject.id,
        room_id: room.id,
        lecturer_id: lecturer.id,
        session_id: session.id,
        section,
        day_of_week: day,
        time_slot: TIME_SLOTS[slotIdx],
        span: rand() < 0.3 ? 2 : 1,
        enrolled: Math.floor(rand() * room.kapasiti * 0.9) + 5,
      });
    });
  });
  await Schedule.bulkCreate(scheduleRows);

  console.log('Generating student enrollments...');
  const studentCourseRows = [];
  students.forEach((student, i) => {
    const startIdx = i % subjects.length;
    for (let k = 0; k < 5; k++) {
      const subject = subjects[(startIdx + k) % subjects.length];
      studentCourseRows.push({
        student_id: student.id,
        subject_id: subject.id,
        session_id: session.id,
        section: SECTIONS[(i + k) % SECTIONS.length],
      });
    }
  });
  await StudentCourse.bulkCreate(studentCourseRows, { ignoreDuplicates: true });

  console.log('Generating lecturer teaching assignments...');
  const lecturerCourseRows = lecturers.map((lecturer, i) => ({
    lecturer_id: lecturer.id,
    subject_id: subjects[i % subjects.length].id,
    session_id: session.id,
    section: SECTIONS[i % SECTIONS.length],
  }));
  await LecturerCourse.bulkCreate(lecturerCourseRows, { ignoreDuplicates: true });

  console.log('\n✓ Seed complete.');
  console.log(`  Rooms: ${rooms.length}`);
  console.log(`  Subjects: ${subjects.length}`);
  console.log(`  Lecturers: ${lecturers.length}`);
  console.log(`  Students: ${students.length}`);
  console.log(`  Schedule entries: ${scheduleRows.length}`);
  console.log(`  Student enrollments: ${studentCourseRows.length}`);
  console.log(`  Lecturer assignments: ${lecturerCourseRows.length}`);
  console.log('\nDemo accounts:');
  console.log('  admin / admin123');
  console.log('  STAFF1000 / lecturer123 (Dr. Aiman Hakim)');
  console.log('  A22001 / student123 (Aiman Rahman)');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
