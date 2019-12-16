"use strict";
module.exports = (sequelize, DataTypes) => {
  const SubscriptionType = sequelize.define(
    "SubscriptionType",
    {
      title: DataTypes.STRING,
      pages: DataTypes.INTEGER,
      freePages: DataTypes.INTEGER,
      price: DataTypes.FLOAT,
      minPrice: DataTypes.FLOAT,
      pricePerAdditionalPage: DataTypes.FLOAT,
      period: DataTypes.INTEGER,
      freeDays: DataTypes.INTEGER,
      maxSharedEngines: DataTypes.INTEGER,
      maxPrivateInstances: DataTypes.INTEGER,
      maxUsers: DataTypes.INTEGER,
      maxClones: DataTypes.INTEGER,
      canTrain: DataTypes.BOOLEAN,
      canUseApi: DataTypes.BOOLEAN,
      canUsePGB: DataTypes.BOOLEAN,
      recomended: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      remove: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {}
  );
  SubscriptionType.associate = function(models) {
    SubscriptionType.belongsTo(models.Category);
  };
  return SubscriptionType;
};
