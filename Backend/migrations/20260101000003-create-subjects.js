'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subjects', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      kod_subjek: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      nama_subjek: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      kredit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      faculty_code: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('subjects');
  },
};
