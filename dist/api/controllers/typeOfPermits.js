"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var db = require("../../db/models");

var TypeOfPermits = db.TypeOfPermits;

exports.list = function (req, res) {
  // Save User to Database
  TypeOfPermits.findAll({
    where: {
      remove: false
    }
  }).then(function (result) {
    res.status(200).json(result);
  })["catch"](function (err) {
    res.status(500).json({
      err: err
    });
  });
};

exports.add = function (req, res) {
  // Save User to Database
  TypeOfPermits.create({
    name: req.body.name,
    typeOfProcesses: req.body.typeOfProcesses
  }).then(function (result) {
    res.status(200).json({
      result: result
    });
  })["catch"](function (err) {
    res.status(500).json({
      err: err
    });
  });
};

exports.edit = function (req, res) {
  // Save User to Database
  TypeOfPermits.update({
    name: req.body.name,
    typeOfProcesses: req.body.typeOfProcesses
  }, {
    where: {
      id: req.body.id
    }
  }).then(function (result) {
    res.status(200).json({
      result: result
    });
  })["catch"](function (err) {
    res.status(500).json({
      err: err
    });
  });
};

exports.remove = function (req, res) {
  // Save User to Database
  TypeOfPermits.update({
    remove: true
  }, {
    where: {
      id: req.body.id
    }
  }).then(function (result) {
    res.status(200).json({
      result: result
    });
  })["catch"](function (err) {
    res.status(500).json({
      err: err
    });
  });
};

exports["default"] =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return TypeOfPermits.update({
              "default": false
            }, {
              where: {
                "default": true
              }
            });

          case 3:
            _context.next = 5;
            return TypeOfPermits.update({
              "default": true
            }, {
              where: {
                id: req.body.id
              }
            });

          case 5:
            res.status(200).json({
              ok: true
            });
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);
            res.status(500).json({
              error: _context.t0
            });

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 8]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();