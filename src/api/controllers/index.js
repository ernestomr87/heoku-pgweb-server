'use strict';

const auth = require('./auth');
const configuration = require('./configuration');
const process = require('./process');
const typeOfPermits = require('./typeOfPermits');
const users = require('./users');

module.exports = {
  auth,
  configuration,
  process,
  typeOfPermits,
  users,
};
