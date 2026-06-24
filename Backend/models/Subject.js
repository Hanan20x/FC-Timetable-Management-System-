const { DataTypes, Model } = require('sequelize');

class Subject extends Model {}

module.exports = (sequelize) => {
  Subject.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      kod_subjek: {
        // e.g. "SECJ1013"
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      nama_subjek: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      kredit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 6 },
      },
      faculty_code: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Subject',
      tableName: 'subjects',
    }
  );
  return Subject;
};
