"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("BillingInformation", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      country: DataTypes.STRING,
      continent: DataTypes.STRING,
      vattax: DataTypes.STRING, //VAT/TAX number
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
    return queryInterface.dropTable("billingInformations");
  }
};
