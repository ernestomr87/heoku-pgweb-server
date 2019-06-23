"use strict";
module.exports = (sequelize, DataTypes) => {
  const Engines = sequelize.define(
    "Engines",
    {
      name: DataTypes.STRING,
      engines: DataTypes.JSON
    },
    {}
  );
  Engines.associate = function(models) {
    // associations can be defined here
  };
  return Engines;
};
