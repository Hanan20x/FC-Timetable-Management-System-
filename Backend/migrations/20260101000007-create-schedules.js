'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('schedules', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      subject_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'subjects', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'rooms', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      lecturer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'sessions', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      section: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      day_of_week: {
        type: Sequelize.ENUM(
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ),
        allowNull: false,
      },
      time_slot: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      span: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      enrolled: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.addIndex('schedules', ['day_of_week', 'time_slot']);
    await queryInterface.addIndex('schedules', ['room_id']);
    await queryInterface.addIndex('schedules', ['lecturer_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('schedules');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_schedules_day_of_week";');
  },
};
