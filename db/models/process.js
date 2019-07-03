"use strict";
module.exports = (sequelize, DataTypes) => {
  const Process = sequelize.define(
    "Process",
    {
      fileName: DataTypes.STRING,
      uuid: DataTypes.STRING,
      fileId: DataTypes.STRING,
      fileType: DataTypes.STRING,
      status: DataTypes.STRING,
      processId: DataTypes.STRING,
      processName: DataTypes.STRING,
      engineId: DataTypes.STRING,
      engineName: DataTypes.STRING,
      engineDomain: DataTypes.STRING,
      engineSource: DataTypes.STRING,
      engineTarget: DataTypes.STRING,
      email: DataTypes.STRING,
      quotes: DataTypes.JSON,
      quoteSelected: DataTypes.JSON,
      fileDownload: DataTypes.JSON
    },
    {}
  );
  Process.associate = function(models) {
    // associations can be defined here
    Process.belongsTo(models.Group);
  };
  return Process;
};
