"use strict";

var db = require('./../../db/models');

var config = require('./../../config/config');

var User = db.User;
var Notification = db.Notification;
var TypeOfPermits = db.TypeOfPermits;

var jwt = require('jsonwebtoken');

var bcrypt = require('bcryptjs');

exports.signup = function (req, res) {
  // Save User to Database
  User.create({
    fullName: req.body.fullName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    rol: 'user'
  }).then(function () {
    res.send('User registered successfully!');
  })["catch"](function (err) {
    res.status(500).send('Fail! Error -> ' + err);
  });
};

exports.signin = function (req, res) {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(function (user) {
    if (!user) {
      return res.status(404).send('User Not Found.');
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        auth: false,
        accessToken: null,
        reason: 'Invalid Password!'
      });
    }

    var token = jwt.sign({
      id: user.id,
      email: user.email,
      rol: user.rol,
      TypeOfPermitId: user.TypeOfPermitId
    }, config.secret, {
      expiresIn: 86400 // expires in 24 hours

    });
    res.status(200).send({
      auth: true,
      accessToken: token,
      id: user.id,
      email: user.email,
      rol: user.rol,
      typeOfUser: user.typeOfUser
    });
  })["catch"](function (err) {
    res.status(500).send('Error -> ' + err);
  });
};

exports.userContent = function (req, res) {
  User.findOne({
    where: {
      id: req.userId
    },
    attributes: ['fullName', 'email', 'id', 'rol', 'typeOfUser'],
    include: [{
      model: Notification,
      attributes: ['type', 'data', 'check']
    }, {
      model: TypeOfPermits
    }]
  }).then(function (user) {
    res.status(200).json({
      user: user
    });
  })["catch"](function (err) {
    res.status(500).json({
      description: 'Can not access User Page',
      error: err
    });
  });
};