const { DataTypes, Model } = require('sequelize');

class LecturerCourse extends Model {}

module.exports = (sequelize) => {
  LecturerCourse.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lecturer_id: {
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
      modelName: 'LecturerCourse',
      tableName: 'lecturer_courses',
      indexes: [
        { unique: true, fields: ['lecturer_id', 'subject_id', 'session_id', 'section'] },
      ],
    }
  );
  return LecturerCourse;
};
