"use strict";
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      name: DataTypes.STRING,
      remove: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {}
  );
  Category.associate = function(models) {
    Category.belongsTo(models.User);
  };
  return Category;
};
