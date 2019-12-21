var express = require("express");
var cors = require("cors");
var path = require("path");
var bodyParser = require("body-parser");
var index = require("./api/routes/index");
var app = express();
var fileUpload = require("express-fileupload");
var morgan = require("morgan");
var winston = require("./config/winston");

const APP_CONFIG = require(`./config/${process.env.NODE_APP}.json`);
const BASE_URL = `${APP_CONFIG.host}`;

app.use(morgan("combined", { stream: winston.stream }));
app.use(
  fileUpload({
    limits: { fileSize: 500 * 1024 * 1024 }
  })
);
global.APP_ROOT = path.resolve(__dirname);

// require("./api/controllers/users").listCorp();

app.set("trust proxy");


app.use(
  bodyParser.json({
    limit: "500mb",
    extended: true
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "500mb",
    extended: true
  })
);

app.use(cors());

app.use("/", index);

// const db = require("./db/models");
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync with { force: true }");
// });

var env = process.env.NODE_ENV || "production";

app.use(
  express.static("public", {
    setHeaders: (res, path, stat) => {
      console.log(++counter);
    }
  })
);

app.get("/*", function(req, res) {
  res.send("REST API running in " + env + " mode");
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // add this line to include winston logging
  winston.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
