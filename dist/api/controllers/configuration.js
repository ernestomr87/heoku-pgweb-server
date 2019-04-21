"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

'use strict';

var db = require('./../../db/models');

var Configuration = db.Configuration;
module.exports = {
  getConfiguration: function () {
    var _getConfiguration = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(req, res) {
      var configuration;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return Configuration.findOne();

            case 3:
              configuration = _context.sent;
              return _context.abrupt("return", res.status(200).send({
                configuration: configuration
              }));

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](0);
              res.status(500).json({
                error: _context.t0
              });

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 7]]);
    }));

    function getConfiguration(_x, _x2) {
      return _getConfiguration.apply(this, arguments);
    }

    return getConfiguration;
  }(),
  setPaypal: function () {
    var _setPaypal = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(req, res) {
      var query;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              query = {
                mode: req.body.mode,
                client_id: req.body.client_id,
                client_secret: req.body.client_secret
              };
              _context2.next = 4;
              return Configuration.update(query);

            case 4:
              return _context2.abrupt("return", res.status(200).send({
                response: 'success'
              }));

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](0);
              res.status(500).json({
                error: _context2.t0
              });

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 7]]);
    }));

    function setPaypal(_x3, _x4) {
      return _setPaypal.apply(this, arguments);
    }

    return setPaypal;
  }(),
  setEmailNotification: function () {
    var _setEmailNotification = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(req, res) {
      var query;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              query = {
                email_notification: req.body.email_notification
              };
              _context3.next = 4;
              return Configuration.update(query);

            case 4:
              return _context3.abrupt("return", res.status(200).send({
                response: 'success'
              }));

            case 7:
              _context3.prev = 7;
              _context3.t0 = _context3["catch"](0);
              res.status(500).json({
                error: _context3.t0
              });

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 7]]);
    }));

    function setEmailNotification(_x5, _x6) {
      return _setEmailNotification.apply(this, arguments);
    }

    return setEmailNotification;
  }()
};