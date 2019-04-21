'use strict';

module.exports = function (sequelize, DataTypes) {
  var BillingInformation = sequelize.define('BillingInformation', {
    billingAddress: DataTypes.STRING,
    nif: DataTypes.STRING
  }, {});

  BillingInformation.associate = function (models) {// associations can be defined here
  };

  return BillingInformation;
};