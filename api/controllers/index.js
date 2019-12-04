"use strict";

const auth = require("./auth");
const configuration = require("./configuration");
const process = require("./process");
const typeOfPermits = require("./typeOfPermits");
const users = require("./users");
const billing = require("./billing");
const nodes = require("./nodes");
const models = require("./models");
const eds = require("./eds");
const engines = require("./engines");
const suscriptions = require("./suscriptions");
const categories = require("./categories");

module.exports = {
  auth,
  configuration,
  process,
  typeOfPermits,
  users,
  billing,
  nodes,
  models,
  eds,
  engines,
  suscriptions,
  categories
};
