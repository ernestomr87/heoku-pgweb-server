'use strict';

module.exports = function (sequelize, DataTypes) {
  var TypeOfPermits = sequelize.define('TypeOfPermits', {
    name: DataTypes.STRING,
    typeOfProcesses: DataTypes.JSON,
    remove: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    "default": {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});

  TypeOfPermits.associate = function (models) {// associations can be defined here
    // TypeOfPermits.belongsTo(models.User);
  };

  return TypeOfPermits;
};