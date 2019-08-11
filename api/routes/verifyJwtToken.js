const jwt = require("jsonwebtoken");
const config = require(`./../../config/${process.env.NODE_APP}.json`);
const db = require("./../../db/models/index");
const User = db.User;

function getClientIp(req) {
  var ipAddress;
  // The request may be forwarded from local web server.
  var forwardedIpsStr = req.header("x-forwarded-for");
  if (forwardedIpsStr) {
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
    // the first one
    var forwardedIps = forwardedIpsStr.split(",");
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    // If request was not forwarded
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
}

const verifyToken = async (req, res, next) => {
  console.log("\x1b[33m%s\x1b[0m", "req.headers.origin", getClientIp(req));
  let token = req.headers["x-access-token"] || req.body.token;

  if (!token) {
    return res.status(403).send({
      auth: false,
      message: "No token provided."
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(500).send({
        auth: false,
        message: "Fail to Authentication. Error -> " + err
      });
    }
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.userRol = decoded.rol;
    req.hasClient = decoded.hasClient;
    req.userTypeOfPermitId = decoded.TypeOfPermitId;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (user.rol === "admin") {
      next();
      return;
    } else {
      res.status(403).send("Require Admin Role!");
      return;
    }
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

const isClient = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (user.rol === "client") {
      next();
      return;
    } else {
      res.status(403).send("Require Client Role!");
      return;
    }
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

const isAdminIsCLient = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (user.rol === "client" || user.rol === "admin") {
      next();
      return;
    } else {
      res.status(403).send("Require Client or Admin Role!");
      return;
    }
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

const isUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (user.rol === "user") {
      next();
      return;
    } else {
      res.status(403).send("Require User Role!");
      return;
    }
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

const authJwt = {};
authJwt.verifyToken = verifyToken;
authJwt.isAdmin = isAdmin;
authJwt.isClient = isClient;
authJwt.isUser = isUser;
authJwt.isAdminIsCLient = isAdminIsCLient;

module.exports = authJwt;
