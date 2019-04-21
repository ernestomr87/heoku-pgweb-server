'use strict';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var nodemailer = require('nodemailer');

var template = require('./emailTemplate');

var testAccount = {
  user: 'ernestomr87@gmail.com',
  pass: 'Violet@r87'
};

function main(_x, _x2, _x3, _x4) {
  return _main.apply(this, arguments);
}

function _main() {
  _main = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(email, status, uuid, freeUser) {
    var transporter, info;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: testAccount.user,
                pass: testAccount.pass
              }
            });
            _context.prev = 1;
            _context.next = 4;
            return transporter.sendMail({
              from: "\"Pgweb Pangeanic \uD83D\uDC7B\" <".concat(testAccount.user, ">"),
              // sender address
              to: "".concat(email),
              // list of receivers
              subject: 'Pgweb Pangeanic Process Status ✔',
              // Subject line
              text: '',
              // plain text body
              html: template.template(email, status, uuid, freeUser) // html body

            });

          case 4:
            info = _context.sent;
            return _context.abrupt("return", true);

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](1);
            console.log(_context.t0);
            return _context.abrupt("return", false);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 8]]);
  }));
  return _main.apply(this, arguments);
}

module.exports = {
  main: main
};