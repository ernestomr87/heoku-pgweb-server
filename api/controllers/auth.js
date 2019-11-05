const uuidv4 = require("uuid/v4");
const db = require("./../../db/models");
const config = require(`./../../config/${process.env.NODE_APP}.json`);
const User = db.User;
const Notification = db.Notification;
const TypeOfPermits = db.TypeOfPermits;
const BillingInformation = db.BillingInformation;

const externalApi = require("../external_api/api");

var jwt = require("jsonwebtoken");
var randtoken = require("rand-token");
var bcrypt = require("bcryptjs");

var refreshTokens = {};

exports.signup = async (req, res) => {
  try {
    const query = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      rol: "user",
      apikey: uuidv4()
    };

    // Save User to Database

    const user = await User.create(query);

    if (req.body.clientId) {
      const client = await User.findByPk(req.body.clientId);
      if (client.id) {
        user.setTypeOfPermit(client.TypeOfPermitId);

        let users = await client.getUsers();
        users.push(user);
        await client.setUsers(users);

        const data = {
          id: user.id,
          APIKey: user.apikey,
          client_id: client.id
        };
        await externalApi.addUser(data);
      }
    }

    res.status(200).send({ userId: user.id });
  } catch (error) {
    res.status(500).send("Fail! Error -> " + error);
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
        remove: false
      }
    });

    if (!user) {
      return res.status(404).send("User Not Found.");
    }
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        auth: false,
        accessToken: null,
        reason: "Invalid Password!"
      });
    }

    var token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol,
        hasClient: user.UserId,
        TypeOfPermitId: user.TypeOfPermitId,
        typeOfUser: user.typeOfUser,
        apikey: user.apikey
      },
      config.secret,
      {
        expiresIn: 86400 // expires in 24 hours
      }
    );

    var refreshToken = randtoken.uid(256);
    refreshTokens[refreshToken] = req.body.email;

    let needBillingInformation = false;
    if (user.rol === "client" || (user.rol === "user" && !user.UserId)) {
      const bi = await BillingInformation.findOne({
        where: {
          UserId: user.id
        }
      });
      if (!bi) {
        needBillingInformation = true;
      }
    }

    res.status(200).send({
      auth: true,
      accessToken: token,
      refreshToken: refreshToken,
      id: user.id,
      email: user.email,
      rol: user.rol,
      hasClient: user.UserId,
      typeOfUser: user.typeOfUser,
      needBillingInformation
    });
  } catch (error) {
    res.status(500).send("Error -> " + error);
  }
};

exports.refreshToken = async (req, res) => {
  var email = req.body.email;
  var refreshToken = req.body.refreshToken;
  if (refreshToken in refreshTokens && refreshTokens[refreshToken] === email) {
    const user = await User.findOne({
      where: {
        email: req.body.email,
        remove: false
      }
    });

    var token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol,
        hasClient: user.UserId,
        TypeOfPermitId: user.TypeOfPermitId,
        typeOfUser: user.typeOfUser,
        apikey: user.apikey
      },
      config.secret,
      {
        expiresIn: 86400 // expires in 24 hours
      }
    );
    res.status(200).send({
      accessToken: token
    });
  } else {
    res.send(401);
  }
};

exports.userContent = (req, res) => {
  console.log("------------------------");
  User.findOne({
    where: {
      id: req.userId
    },
    attributes: [
      "fullName",
      "email",
      "id",
      "rol",
      "typeOfUser",
      "UserId",
      "apikey"
    ],
    include: [
      {
        model: Notification,
        attributes: ["type", "data", "check"]
      },
      {
        model: TypeOfPermits
      }
    ]
  })
    .then(user => {
      res.status(200).json({
        user: user
      });
    })
    .catch(err => {
      res.status(500).json({
        description: "Can not access User Page",
        error: err
      });
    });
};
