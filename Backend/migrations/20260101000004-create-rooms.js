'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rooms', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      kod_ruang: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      nama_ruang: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      nama_ruang_singkatan: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      kapasiti: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      jenis_ruang: {
        type: Sequelize.ENUM('Lecture Hall', 'Classroom', 'Computer Lab', 'Seminar Room'),
        allowNull: false,
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
    await queryInterface.dropTable('rooms');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_rooms_jenis_ruang";');
  },
};
