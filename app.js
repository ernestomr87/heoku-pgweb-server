var express = require("express");
var cors = require("cors");
var path = require("path");
var bodyParser = require("body-parser");
// var morgan = require("morgan");
var index = require("./api/routes/index");
var app = express();
global.APP_ROOT = path.resolve(__dirname);

const winston = require("winston");
const consoleTransport = new winston.transports.Console();
const myWinstonOptions = {
  transports: [consoleTransport]
};
const logger = new winston.createLogger(myWinstonOptions);

function logRequest(req, res, next) {
  logger.info(req.url);
  next();
}

app.use(logRequest);

function logError(err, req, res, next) {
  logger.error(err);
  next();
}
app.use(logError);

// require("./api/controllers/users").listCorp();

app.set("trust proxy");
// app.use(morgan("dev"));
app.use(
  bodyParser.json({
    limit: "2mb",
    extended: true
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "2mb",
    extended: true
  })
);

app.use(cors());

app.use("/", index);

// const db = require('./db/models');
// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and Resync with { force: true }');
// });

var env = process.env.NODE_ENV || "production";

app.use(
  express.static("public", {
    setHeaders: (res, path, stat) => {
      console.log(++counter);
    }
  })
);

if (env === "production") {
  // // Serve any static files
  // app.use(express.static(path.join(__dirname, "./build")));
  // // Handle React routing, return all requests to React app
  // app.get("*", function(req, res) {
  //   res.sendFile(path.join(__dirname, "./build", "index.html"));
  // });
  app.get("*", function(req, res) {
    res.redirect(301, "http://pgweb.pangeamt.com");
  });
}

if (env === "development") {
  app.get("/*", function(req, res) {
    res.send("REST API running in development mode");
  });
}

module.exports = app;
