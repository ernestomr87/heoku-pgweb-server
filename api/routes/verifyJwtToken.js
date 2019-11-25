const jwt = require("jsonwebtoken");
const config = require(`./../../config/${process.env.NODE_APP}.json`);
const db = require("./../../db/models/index");
const User = db.User;

const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"] || req.body.token;
  if (!token) {
    return res.status(403).send({
      auth: false,
      message: "No token provided."
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.log("\x1b[32m", "*******************************");
      console.log(err.message);
      console.log("\x1b[32m", "*******************************");
      return res.status(500).send({
        auth: false,
        message: "Fail to Authentication. Error -> " + err
      });
    }
    req.user = decoded;
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
