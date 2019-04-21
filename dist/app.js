"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _path = _interopRequireDefault(require("path"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _morgan = _interopRequireDefault(require("morgan"));

var _index = _interopRequireDefault(require("./api/routes/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.use((0, _morgan["default"])('dev'));
app.use(_bodyParser["default"].json({
  limit: '2mb',
  extended: true
}));
app.use(_bodyParser["default"].urlencoded({
  limit: '2mb',
  extended: true
}));
app.use((0, _cors["default"])());
app.use('/', _index["default"]); // const db = require('./db/models');
// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and Resync with { force: true }');
// });

var env = process.env.NODE_ENV || 'production';

if (env === 'production') {
  // Serve any static files
  app.use(_express["default"]["static"](_path["default"].join(__dirname, './../build'))); // Handle React routing, return all requests to React app

  app.get('*', function (req, res) {
    res.sendFile(_path["default"].join(__dirname, './../build', 'index.html'));
  });
}

if (env === 'development') {
  app.get('/*', function (req, res) {
    res.send('REST API running in development mode');
  });
}

var _default = app;
exports["default"] = _default;