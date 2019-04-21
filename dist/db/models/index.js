'use strict';

var _config = _interopRequireDefault(require("./../../config/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var fs = require('fs');

var path = require('path');

var Sequelize = require('sequelize');

var basename = path.basename(__filename);
var env = process.env.NODE_ENV || 'production'; // const config = require(__dirname + './../../config/config.json')[env];

var db = {};
var configuration = _config["default"][env];
var sequelize;

if (configuration.use_env_variable) {
  sequelize = new Sequelize(process.env[configuration.use_env_variable], configuration);
} else {
  sequelize = new Sequelize(configuration.database, configuration.username, configuration.password, configuration);
}

fs.readdirSync(__dirname).filter(function (file) {
  return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
}).forEach(function (file) {
  var model = sequelize['import'](path.join(__dirname, file));
  db[model.name] = model;
});
Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;