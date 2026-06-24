const { DataTypes, Model } = require('sequelize');

class Schedule extends Model {}

module.exports = (sequelize) => {
  Schedule.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lecturer_id: {
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
      day_of_week: {
        type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
        allowNull: false,
      },
      time_slot: {
        // e.g. "08:00 - 09:00" — stored as a label to match the frontend's mock data shape;
        // a future iteration could normalize this into start_time/end_time columns.
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      span: {
        // number of consecutive time slots this session occupies (1 = one hour)
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      enrolled: {
        // snapshot count used for capacity-overflow analytics; kept denormalized
        // for fast reads rather than COUNT()-ing student_courses on every request
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Schedule',
      tableName: 'schedules',
      indexes: [
        // speeds up conflict-detection queries (same day+slot grouped by room/lecturer)
        { fields: ['day_of_week', 'time_slot'] },
        { fields: ['room_id'] },
        { fields: ['lecturer_id'] },
      ],
    }
  );
  return Schedule;
};
