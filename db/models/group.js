"use strict";
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define(
    "Group",
    {
      name: DataTypes.STRING,
      total: DataTypes.INTEGER,
      complete: DataTypes.INTEGER
    },
    {}
  );
  Group.associate = function(models) {
    Group.belongsTo(models.User);
  };
  return Group;
};
