const { DataTypes, Model } = require('sequelize');

class Room extends Model {}

module.exports = (sequelize) => {
  Room.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      kod_ruang: {
        // e.g. "FSKM-DK1"
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      nama_ruang: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      nama_ruang_singkatan: {
        // short label used in the timetable grid, e.g. "DK1"
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      kapasiti: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 },
      },
      jenis_ruang: {
        type: DataTypes.ENUM('Lecture Hall', 'Classroom', 'Computer Lab', 'Seminar Room'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Room',
      tableName: 'rooms',
    }
  );
  return Room;
};
