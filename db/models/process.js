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
      client: DataTypes.STRING,
      secret: DataTypes.STRING,
      quotes: DataTypes.JSON,
      quoteSelected: DataTypes.JSON,
      fileDownload: DataTypes.JSON,
      fileDownloadFolder: DataTypes.STRING,
      fileDownloadName: DataTypes.STRING,
      hostClient: DataTypes.STRING,
      downloaded: DataTypes.BOOLEAN,
      removed: DataTypes.BOOLEAN
    },
    {}
  );
  Process.associate = function(models) {
    // associations can be defined here
    Process.belongsTo(models.Group);
  };
  return Process;
};
