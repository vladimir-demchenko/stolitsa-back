'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.changeColumn('users', 'passport_number', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('users', 'passport_series', {
        type: Sequelize.STRING,
        allowNull: true
      })
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.changeColumn('users', 'passport_number', {
        type: Sequelize.INTEGER,
        allowNull: true
      })
    ])
  }
};
