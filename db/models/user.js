'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      fullName: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      rol: DataTypes.STRING,
      remove: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      typeOfUser: {
        type: DataTypes.INTEGER,
        defaultValue: 3
      },
    },
    {}
  );
  User.associate = function(models) {
    User.hasMany(models.Process);
    User.hasMany(models.Notification);
    User.hasMany(models.User);
    User.belongsTo(models.TypeOfPermits);
    User.hasOne(models.BillingInformation);

  };
  return User;
};

