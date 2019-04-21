"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Sequelize = require('sequelize');

var Op = Sequelize.Op;

var bcrypt = require('bcryptjs');

var db = require('./../../db/models');

var User = db.User;
var TypeOfPermits = db.TypeOfPermits;

exports.listAll =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var users, _users;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (!(req.userRol === 'client')) {
              _context.next = 8;
              break;
            }

            _context.next = 4;
            return User.findAll({
              attributes: ['id', 'fullName', 'email', 'rol', 'typeOfUser'],
              include: [{
                model: TypeOfPermits
              }],
              where: {
                userId: req.userId
              }
            });

          case 4:
            _users = _context.sent;
            return _context.abrupt("return", res.status(200).send({
              users: _users
            }));

          case 8:
            _context.next = 10;
            return User.findAll({
              attributes: ['id', 'fullName', 'email', 'rol', 'typeOfUser'],
              include: [{
                model: TypeOfPermits
              }]
            }, {
              where: {
                removed: false
              }
            });

          case 10:
            users = _context.sent;
            return _context.abrupt("return", res.status(200).send({
              users: users
            }));

          case 12:
            _context.next = 17;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", res.status(500).send({
              error: _context.t0
            }));

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 14]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.get =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var user;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return User.findOne({
              attributes: ['fullName', 'email', 'rol']
            }, {
              where: {
                id: req.body.id
              }
            }, {
              include: [{
                model: TypeOfPermits
              }]
            });

          case 3:
            user = _context2.sent;
            return _context2.abrupt("return", res.status(200).send({
              user: user
            }));

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", res.status(500).send({
              error: _context2.t0
            }));

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 7]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.remove =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return User.update({
              removed: true
            }, {
              where: {
                id: req.body.id
              }
            });

          case 3:
            return _context3.abrupt("return", res.status(200).send({
              ok: 'Action success'
            }));

          case 6:
            _context3.prev = 6;
            _context3.t0 = _context3["catch"](0);
            res.status(500).send(_context3.t0);

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 6]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.create =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res) {
    var user, typeOfPermits, client;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return User.create({
              fullName: req.body.fullName,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, 8),
              rol: req.body.rol || 'user',
              typeOfUser: req.body.typeOfUser
            });

          case 3:
            user = _context4.sent;
            _context4.next = 6;
            return TypeOfPermits.findOne({
              where: {
                id: req.body.typeOfPermits
              }
            });

          case 6:
            typeOfPermits = _context4.sent;
            user.setTypeOfPermit(typeOfPermits);

            if (!(req.userRol === 'client')) {
              _context4.next = 14;
              break;
            }

            _context4.next = 11;
            return User.findOne({
              where: {
                id: req.userId
              }
            });

          case 11:
            client = _context4.sent;
            _context4.next = 14;
            return client.setUsers(user);

          case 14:
            return _context4.abrupt("return", res.status(200).send({
              ok: 'Action success'
            }));

          case 17:
            _context4.prev = 17;
            _context4.t0 = _context4["catch"](0);
            res.status(500).send(_context4.t0);

          case 20:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 17]]);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

exports.update =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(req, res) {
    var user;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return User.update({
              fullName: req.body.fullName,
              email: req.body.email,
              rol: req.body.rol || 'user',
              typeOfUser: req.body.typeOfUser
            }, {
              where: {
                id: req.body.id
              }
            });

          case 3:
            _context5.next = 5;
            return User.findOne({
              where: {
                id: req.body.id
              }
            });

          case 5:
            user = _context5.sent;
            user.setTypeOfPermit(req.body.typeOfPermits);
            return _context5.abrupt("return", res.status(200).send({
              ok: 'Action success'
            }));

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5["catch"](0);
            res.status(500).send(_context5.t0);

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 10]]);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();