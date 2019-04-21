'use strict';

module.exports = function (sequelize, DataTypes) {
  var Configuration = sequelize.define('Configuration', {
    mode: DataTypes.STRING,
    client_id: DataTypes.STRING,
    client_secret: DataTypes.STRING,
    email_notification: DataTypes.JSON
  }, {});

  Configuration.associate = function (models) {// associations can be defined here
  };

  return Configuration;
};