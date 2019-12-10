"use strict";
module.exports = (sequelize, DataTypes) => {
  const Training = sequelize.define(
    "Training",
    {
      title: DataTypes.STRING,
      model: DataTypes.STRING,
      apikey: DataTypes.STRING,
      src: DataTypes.STRING,
      tgt: DataTypes.STRING,
      status: DataTypes.STRING,
      fileId: DataTypes.STRING,
      aggressivity: DataTypes.INTEGER,
      msg: DataTypes.STRING,
      result: DataTypes.STRING,
      alignationsTrained: DataTypes.STRING
    },
    {}
  );
  Training.associate = function(models) {
    // associations can be defined here
  };
  return Training;
};

// result, alignations trained y msg
