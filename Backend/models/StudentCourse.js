const { DataTypes, Model } = require('sequelize');

class StudentCourse extends Model {}

module.exports = (sequelize) => {
  StudentCourse.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      section: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'StudentCourse',
      tableName: 'student_courses',
      indexes: [
        // a student can't enroll in the same subject+section+session twice
        { unique: true, fields: ['student_id', 'subject_id', 'session_id', 'section'] },
      ],
    }
  );
  return StudentCourse;
};
