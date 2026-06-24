const { DataTypes, Model } = require('sequelize');

class Session extends Model {}

module.exports = (sequelize) => {
  Session.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sesi: {
        // Malaysian academic year format, e.g. "2025/2026"
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      semester: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 3 }, // semester 3 = short semester
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Session',
      tableName: 'sessions',
      indexes: [{ unique: true, fields: ['sesi', 'semester'] }],
    }
  );
  return Session;
};
