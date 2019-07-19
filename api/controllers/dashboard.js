("use strict");
const apiKey = require("./../../config/config")["apiKey"];
var Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "production";
var config = require("./../../config/config.json")[env];
var sequelize = new Sequelize(
  config.database_dashboard,
  config.username,
  config.password,
  config
);

const db = require("./../../db/models");
// const Configuration = db.Configuration;

const { countFiles } = require("./../external_api/queries.js");

module.exports = {
  get: async (req, res) => {
    try {
      sequelize
        .query(countFiles("ernestomr87@gmail.com"), {
          type: sequelize.QueryTypes.SELECT
        })
        .then(data => {
          return res.status(200).send(data);
        })
        .catch(error => {
          res.status(400).send(error);
        });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  }
};
