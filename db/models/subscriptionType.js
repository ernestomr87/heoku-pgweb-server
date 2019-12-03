"use strict";
module.exports = (sequelize, DataTypes) => {
  const SubscriptionType = sequelize.define(
    "SubscriptionType",
    {
      pages: DataTypes.INTEGER,
      pricePerAdditionalPage: DataTypes.FLOAT,
      maxUsers: DataTypes.INTEGER,
      maxClones: DataTypes.INTEGER,
      canTrain: DataTypes.BOOLEAN,
      canUseApi: DataTypes.BOOLEAN,
    },
    {}
  );
  SubscriptionType.associate = function(models) {
    
  };
  return SubscriptionType;
};
