"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Configurations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mode: Sequelize.STRING, //sandbox or live
      client_id: Sequelize.STRING,
      client_secret: Sequelize.STRING,
      email_notification: Sequelize.JSON
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Configurations");
  }
};
