'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    type: DataTypes.STRING,
    data: DataTypes.JSON,
    check: DataTypes.BOOLEAN
  }, {});
  Notification.associate = function(models) {
    // associations can be defined here
  };
  return Notification;
};