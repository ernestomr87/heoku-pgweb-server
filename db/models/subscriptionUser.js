"use strict";
module.exports = (sequelize, DataTypes) => {
  const SubscriptionUser = sequelize.define(
    "SubscriptionUser",
    {
      status: DataTypes.ENUM("active", "suspended", "terminated"),
      terminatedAt: DataTypes.DATE
    },
    {}
  );
  SubscriptionUser.associate = function(models) {
    SubscriptionUser.belongsTo(models.User);
    SubscriptionUser.belongsTo(models.SubscriptionType);
  };
  return SubscriptionUser;
};
