'use strict';
module.exports = (sequelize, DataTypes) => {
  const Configuration = sequelize.define('Configuration', {
    mode: DataTypes.STRING,//sandbox or live
    client_id: DataTypes.STRING,
    client_secret: DataTypes.STRING,
    email_notification: DataTypes.JSON
  }, {});
  Configuration.associate = function(models) {
    // associations can be defined here
  };
  return Configuration;
};