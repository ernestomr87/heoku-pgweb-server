'use strict';
module.exports = (sequelize, DataTypes) => {
  const BillingInformation = sequelize.define('BillingInformation', {
    billingAddress: DataTypes.STRING,
    nif: DataTypes.STRING
  }, {});
  BillingInformation.associate = function(models) {
    // associations can be defined here
  };
  return BillingInformation;
};