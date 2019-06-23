"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Processes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fileName: Sequelize.STRING,
      uuid: Sequelize.STRING,
      fileId: Sequelize.STRING,
      fileType: Sequelize.STRING,
      status: Sequelize.STRING,
      processId: Sequelize.STRING,
      processName: Sequelize.STRING,
      engineId: Sequelize.STRING,
      engineName: Sequelize.STRING,
      engineDomain: Sequelize.STRING,
      engineSource: Sequelize.STRING,
      engineTarget: Sequelize.STRING,
      email: Sequelize.STRING,
      quotes: Sequelize.JSON,
      quoteSelected: Sequelize.JSON,
      fileDownload: Sequelize.JSON,
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
    return queryInterface.dropTable("Processes");
  }
};
