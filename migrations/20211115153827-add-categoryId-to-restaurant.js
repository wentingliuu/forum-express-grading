'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Restaurants', 'CategoryId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Restaurants', 'CategoryId')
  }
}
