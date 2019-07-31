"use strict";
module.exports = (sequelize, DataTypes) => {
  const BillingInformation = sequelize.define(
    "BillingInformation",
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      country: DataTypes.STRING,
      continent: DataTypes.STRING,
      vattax: DataTypes.STRING //VAT/TAX number
    },
    {}
  );
  BillingInformation.associate = function(models) {
    // associations can be defined here
    BillingInformation.belongsTo(models.Process);
  };
  return BillingInformation;
};
