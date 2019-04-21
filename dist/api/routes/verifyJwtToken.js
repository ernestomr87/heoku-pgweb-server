"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var jwt = require('jsonwebtoken');

var config = require('./../../config/config');

var db = require('./../../db/models/index');

var User = db.User;

var verifyToken =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res, next) {
    var token;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            token = req.headers['x-access-token'];

            if (token) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", res.status(403).send({
              auth: false,
              message: 'No token provided.'
            }));

          case 3:
            jwt.verify(token, config.secret, function (err, decoded) {
              if (err) {
                return res.status(500).send({
                  auth: false,
                  message: 'Fail to Authentication. Error -> ' + err
                });
              }

              req.userId = decoded.id;
              req.userEmail = decoded.email;
              req.userRol = decoded.rol;
              req.userTypeOfPermitId = decoded.TypeOfPermitId;
              next();
            });

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function verifyToken(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var isAdmin =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res, next) {
    var user;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return User.findById(req.userId);

          case 3:
            user = _context2.sent;

            if (!(user.rol === 'admin')) {
              _context2.next = 9;
              break;
            }

            next();
            return _context2.abrupt("return");

          case 9:
            res.status(403).send('Require Admin Role!');
            return _context2.abrupt("return");

          case 11:
            _context2.next = 16;
            break;

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](0);
            res.status(500).json({
              error: _context2.t0
            });

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 13]]);
  }));

  return function isAdmin(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

var isClient =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res, next) {
    var user;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return User.findById(req.userId);

          case 3:
            user = _context3.sent;

            if (!(user.rol === 'client')) {
              _context3.next = 9;
              break;
            }

            next();
            return _context3.abrupt("return");

          case 9:
            res.status(403).send('Require Client Role!');
            return _context3.abrupt("return");

          case 11:
            _context3.next = 16;
            break;

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3["catch"](0);
            res.status(500).json({
              error: _context3.t0
            });

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 13]]);
  }));

  return function isClient(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

var isUser =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res, next) {
    var user;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return User.findById(req.userId);

          case 3:
            user = _context4.sent;

            if (!(user.rol === 'user')) {
              _context4.next = 9;
              break;
            }

            next();
            return _context4.abrupt("return");

          case 9:
            res.status(403).send('Require User Role!');
            return _context4.abrupt("return");

          case 11:
            _context4.next = 16;
            break;

          case 13:
            _context4.prev = 13;
            _context4.t0 = _context4["catch"](0);
            res.status(500).json({
              error: _context4.t0
            });

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 13]]);
  }));

  return function isUser(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

var authJwt = {};
authJwt.verifyToken = verifyToken;
authJwt.isAdmin = isAdmin;
authJwt.isClient = isClient;
authJwt.isUser = isUser;
module.exports = authJwt;