"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullName: Sequelize.STRING,
      password: Sequelize.STRING,
      email: Sequelize.STRING,
      rol: Sequelize.STRING,
      remove: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      typeOfUser: {
        type: Sequelize.INTEGER,
        defaultValue: 3
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Users");
  }
};
