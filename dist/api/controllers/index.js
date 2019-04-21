'use strict';

var auth = require('./auth');

var configuration = require('./configuration');

var process = require('./process');

var typeOfPermits = require('./typeOfPermits');

var users = require('./users');

module.exports = {
  auth: auth,
  configuration: configuration,
  process: process,
  typeOfPermits: typeOfPermits,
  users: users
};