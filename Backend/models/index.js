const sequelize = require('../config/database');

const Session = require('./Session')(sequelize);
const User = require('./User')(sequelize);
const Subject = require('./Subject')(sequelize);
const Room = require('./Room')(sequelize);
const StudentCourse = require('./StudentCourse')(sequelize);
const LecturerCourse = require('./LecturerCourse')(sequelize);
const Schedule = require('./Schedule')(sequelize);

// --- Associations -----------------------------------------------------

// StudentCourse: junction between User(student) <-> Subject, scoped to a Session
StudentCourse.belongsTo(User, { foreignKey: 'student_id', as: 'student' });
StudentCourse.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });
StudentCourse.belongsTo(Session, { foreignKey: 'session_id', as: 'session' });
User.hasMany(StudentCourse, { foreignKey: 'student_id', as: 'enrollments' });
Subject.hasMany(StudentCourse, { foreignKey: 'subject_id', as: 'studentCourses' });
Session.hasMany(StudentCourse, { foreignKey: 'session_id', as: 'studentCourses' });

// LecturerCourse: junction between User(lecturer) <-> Subject, scoped to a Session
LecturerCourse.belongsTo(User, { foreignKey: 'lecturer_id', as: 'lecturer' });
LecturerCourse.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });
LecturerCourse.belongsTo(Session, { foreignKey: 'session_id', as: 'session' });
User.hasMany(LecturerCourse, { foreignKey: 'lecturer_id', as: 'teachingAssignments' });
Subject.hasMany(LecturerCourse, { foreignKey: 'subject_id', as: 'lecturerCourses' });
Session.hasMany(LecturerCourse, { foreignKey: 'session_id', as: 'lecturerCourses' });

// Schedule: the timetable matrix, ties Subject + Room + Lecturer + Session together
Schedule.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });
Schedule.belongsTo(Room, { foreignKey: 'room_id', as: 'room' });
Schedule.belongsTo(User, { foreignKey: 'lecturer_id', as: 'lecturer' });
Schedule.belongsTo(Session, { foreignKey: 'session_id', as: 'session' });
Subject.hasMany(Schedule, { foreignKey: 'subject_id', as: 'schedules' });
Room.hasMany(Schedule, { foreignKey: 'room_id', as: 'schedules' });
User.hasMany(Schedule, { foreignKey: 'lecturer_id', as: 'teachingSchedules' });
Session.hasMany(Schedule, { foreignKey: 'session_id', as: 'schedules' });

module.exports = {
  sequelize,
  Session,
  User,
  Subject,
  Room,
  StudentCourse,
  LecturerCourse,
  Schedule,
};
