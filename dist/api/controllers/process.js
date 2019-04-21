"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

'use strict';

var uuidv4 = require('uuid/v4');

var db = require('./../../db/models');

var User = db.User;
var Process = db.Process;
var TypeOfPermits = db.TypeOfPermits;
var Notification = db.Notification;

var _ = require('lodash');

var mailer = require('./../util/mailer');

var externalApi = require('../external_api/api');

var apiKey = require('./../../config/config')['apiKey'];

var socketApi = require('./../../socketApi');

var _require = require('./../util/functions'),
    getStatus = _require.getStatus;

var filterEngines = function filterEngines(engines, types) {
  var newArrays = [];

  var _loop = function _loop(i) {
    var array = [];

    var _loop2 = function _loop2(j) {
      types.map(function (item) {
        if (parseInt(item) === engines[i].engines[j].id) {
          array.push(engines[i].engines[j]);
        }
      });
    };

    for (var j = 0; j < engines[i].engines.length; j++) {
      _loop2(j);
    }

    if (array.length) {
      engines[i].engines = array;
      newArrays.push(engines[i]);
    }
  };

  for (var i = 0; i < engines.length; i++) {
    _loop(i);
  }

  return newArrays;
};

module.exports = {
  getProcess: function () {
    var _getProcess = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(req, res) {
      var user, process;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return User.findOne({
                where: {
                  id: req.userId
                }
              });

            case 3:
              user = _context.sent;
              _context.next = 6;
              return user.getProcesses({
                attributes: ['fileName', 'fileId', 'processId', 'processName', 'engineId', 'engineName', 'engineDomain', 'engineSource', 'engineTarget', 'status', 'quotes', 'fileDownload']
              });

            case 6:
              process = _context.sent;
              return _context.abrupt("return", res.status(200).send({
                process: process
              }));

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](0);
              res.status(500).json({
                error: _context.t0
              });

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 10]]);
    }));

    function getProcess(_x, _x2) {
      return _getProcess.apply(this, arguments);
    }

    return getProcess;
  }(),
  getProcessByUuid: function () {
    var _getProcessByUuid = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(req, res) {
      var uuid, process;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              uuid = req.params.uuid;
              _context2.prev = 1;
              _context2.next = 4;
              return Process.findOne({
                where: {
                  uuid: uuid
                }
              });

            case 4:
              process = _context2.sent;
              return _context2.abrupt("return", res.status(200).send(process));

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](1);
              res.status(400).send({
                error: _context2.t0
              });

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[1, 8]]);
    }));

    function getProcessByUuid(_x3, _x4) {
      return _getProcessByUuid.apply(this, arguments);
    }

    return getProcessByUuid;
  }(),
  getExternalEngines: function () {
    var _getExternalEngines = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(req, res) {
      var engines, typeOfPermits, result, _typeOfPermits, _result;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return externalApi.describeEngines();

            case 3:
              engines = _context3.sent;

              if (!engines.data.success) {
                _context3.next = 26;
                break;
              }

              if (req.userId) {
                _context3.next = 15;
                break;
              }

              _context3.next = 8;
              return TypeOfPermits.findOne({
                where: {
                  "default": true
                }
              });

            case 8:
              typeOfPermits = _context3.sent;

              if (!typeOfPermits) {
                _context3.next = 12;
                break;
              }

              result = filterEngines(engines.data.data, typeOfPermits.typeOfProcesses);
              return _context3.abrupt("return", res.status(200).send(result));

            case 12:
              return _context3.abrupt("return", res.status(200).send(engines.data.data));

            case 15:
              if (!(req.userRol === 'admin')) {
                _context3.next = 19;
                break;
              }

              return _context3.abrupt("return", res.status(200).send(engines.data.data));

            case 19:
              _context3.next = 21;
              return TypeOfPermits.findOne({
                where: {
                  id: req.userTypeOfPermitId
                }
              });

            case 21:
              _typeOfPermits = _context3.sent;

            case 22:
              if (!_typeOfPermits) {
                _context3.next = 25;
                break;
              }

              _result = filterEngines(engines.data.data, _typeOfPermits.typeOfProcesses);
              return _context3.abrupt("return", res.status(200).send(_result));

            case 25:
              return _context3.abrupt("return", res.status(200).send(engines.data.data));

            case 26:
              res.status(400).send({
                error: engines.data.error || 'No data'
              });
              _context3.next = 32;
              break;

            case 29:
              _context3.prev = 29;
              _context3.t0 = _context3["catch"](0);
              res.status(400).send({
                error: _context3.t0
              });

            case 32:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 29]]);
    }));

    function getExternalEngines(_x5, _x6) {
      return _getExternalEngines.apply(this, arguments);
    }

    return getExternalEngines;
  }(),
  sendFileToExternalProcess: function sendFileToExternalProcess(req, res) {
    try {
      var processId = req.body.process.id;
      var processName = req.body.process.name;
      var engineId = req.body.engine.id;
      var engineName = req.body.engine.name;
      var engineDomain = req.body.engine.domain;
      var engineSource = req.body.engine.source;
      var engineTarget = req.body.engine.target;
      var fileName = req.body.file.fileName;
      var fileType = req.body.file.fileType;
      var file = req.body.file.file.replace("data:".concat(fileType, ";base64,"), '');
      var username = req.body.email;

      try {
        externalApi.processFile(username, engineSource, engineTarget, engineId, fileName, fileType, file).then(function (result) {
          var error = result.data.error;
          var errorMessage = result.data.errormessage;
          var fileId = result.data.fileId;

          if (error !== 0 && fileId) {
            Process.create({
              fileName: fileName,
              fileId: fileId,
              status: 'waiting',
              fileType: fileType,
              processId: processId,
              processName: processName,
              engineId: engineId,
              engineName: engineName,
              engineDomain: engineDomain,
              engineSource: engineSource,
              engineTarget: engineTarget,
              email: username
            }).then(function () {
              return res.status(200).json({
                data: 'ok'
              });
            })["catch"](function (err) {
              res.status(500).json({
                error: err
              });
            });
          } else {
            return res.status(400).send({
              error: errorMessage
            });
          }
        })["catch"](function (err) {
          res.status(400).send({
            error: err
          });
        });
      } catch (err) {
        console.log(err);
      }
    } catch (error) {
      return res.status(400).send({
        error: error
      });
    }
  },
  processFile: function processFile(req, res) {
    try {
      var processId = req.body.process.id;
      var processName = req.body.process.name;
      var engineId = req.body.engine.id;
      var engineName = req.body.engine.name;
      var engineDomain = req.body.engine.domain;
      var engineSource = req.body.engine.source;
      var engineTarget = req.body.engine.target;
      var fileName = req.body.file.fileName;
      var fileType = req.body.file.fileType;
      var file = req.body.file.file.replace("data:".concat(fileType, ";base64,"), '');
      var username = req.userEmail;

      try {
        externalApi.processFile(username, engineSource, engineTarget, engineId, fileName, fileType, file).then(function (result) {
          var error = result.data.error;
          var errorMessage = result.data.errormessage;
          var fileId = result.data.fileId;

          if (error !== 0 && fileId) {
            if (req.userId) {
              User.findOne({
                where: {
                  id: req.userId
                }
              }).then(function (user) {
                Process.create({
                  fileName: fileName,
                  fileId: fileId,
                  status: 0,
                  fileType: fileType,
                  processId: processId,
                  processName: processName,
                  engineId: engineId,
                  engineName: engineName,
                  engineDomain: engineDomain,
                  engineSource: engineSource,
                  engineTarget: engineTarget
                }).then(function (process) {
                  user.addProcess(process).then(function () {
                    return res.status(200).json({
                      data: 'ok'
                    });
                  })["catch"](function (err) {
                    res.status(500).json({
                      description: 'Can not access User Page',
                      error: err
                    });
                  });
                })["catch"](function (err) {
                  res.status(500).json({
                    description: 'Can not access User Page',
                    error: err
                  });
                });
              })["catch"](function (err) {
                res.status(500).json({
                  description: 'Can not access User Page',
                  error: err
                });
              });
            } else {
              return res.status(200).json({
                data: 'ok'
              });
            }
          } else {
            return res.status(400).send({
              error: errorMessage
            });
          }
        })["catch"](function (err) {
          res.status(400).send({
            error: err
          });
        });
      } catch (err) {
        console.log(err);
      }
    } catch (error) {
      return res.status(400).send({
        error: error
      });
    }
  },
  quoteFile: function quoteFile(req, res) {
    try {
      var processId = req.body.process.id;
      var processName = req.body.process.name;
      var engineId = req.body.engine.id;
      var engineName = req.body.engine.name;
      var engineDomain = req.body.engine.domain;
      var engineSource = req.body.engine.source;
      var engineTarget = req.body.engine.target;
      var fileName = req.body.file.fileName;
      var fileType = req.body.file.fileType;
      var file = req.body.file.file.replace("data:".concat(fileType, ";base64,"), '');
      var username = req.userEmail;

      try {
        externalApi.quoteFile(username, engineSource, engineTarget, engineId, fileName, fileType, file).then(function (result) {
          var error = result.data.error;
          var errorMessage = result.data.errormessage;
          var fileId = result.data.fileId;

          if (error !== 0 && fileId) {
            if (req.userId) {
              User.findOne({
                where: {
                  id: req.userId
                }
              }).then(function (user) {
                Process.create({
                  fileName: fileName,
                  fileId: fileId,
                  status: 0,
                  fileType: fileType,
                  processId: processId,
                  processName: processName,
                  engineId: engineId,
                  engineName: engineName,
                  engineDomain: engineDomain,
                  engineSource: engineSource,
                  engineTarget: engineTarget
                }).then(function (process) {
                  user.addProcess(process).then(function () {
                    return res.status(200).json({
                      data: 'ok'
                    });
                  })["catch"](function (err) {
                    res.status(500).json({
                      description: 'Can not access User Page',
                      error: err
                    });
                  });
                })["catch"](function (err) {
                  res.status(500).json({
                    description: 'Can not access User Page',
                    error: err
                  });
                });
              })["catch"](function (err) {
                res.status(500).json({
                  description: 'Can not access User Page',
                  error: err
                });
              });
            } else {
              return res.status(200).json({
                data: 'ok'
              });
            }
          } else {
            return res.status(400).send({
              error: errorMessage
            });
          }
        })["catch"](function (err) {
          res.status(400).send({
            error: err
          });
        });
      } catch (err) {
        console.log(err);
      }
    } catch (error) {
      return res.status(400).send({
        error: error
      });
    }
  },
  processFileAfterQuoteFile: function () {
    var _processFileAfterQuoteFile = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(req, res) {
      var fileId, quote, result;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              fileId = req.body.fileId;
              quote = req.body.quote;
              _context4.next = 5;
              return externalApi.processFileAfterQuoteFile(fileId, quote.optionid);

            case 5:
              result = _context4.sent;
              _context4.next = 8;
              return Process.update({
                quoteSelected: quote
              }, {
                where: {
                  fileId: result.data.fileId
                }
              });

            case 8:
              return _context4.abrupt("return", res.status(200).json({
                data: 'ok'
              }));

            case 11:
              _context4.prev = 11;
              _context4.t0 = _context4["catch"](0);
              return _context4.abrupt("return", res.status(500).send({
                error: _context4.t0
              }));

            case 14:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[0, 11]]);
    }));

    function processFileAfterQuoteFile(_x7, _x8) {
      return _processFileAfterQuoteFile.apply(this, arguments);
    }

    return processFileAfterQuoteFile;
  }(),
  notification: function () {
    var _notification = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(req, res) {
      var type, query, process, noty, _notification2, email, freeUser, user, status, response;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!(req.body.fileid && req.body.data)) {
                _context5.next = 55;
                break;
              }

              type = _.lowerCase(getStatus(req.body.data.status));
              type = _.replace(type, ' ', '_');
              type = _.replace(type, '/', '_');
              query = {
                status: type,
                uuid: uuidv4()
              };

              if (req.body.data.status === 7) {
                if (req.body.quotes.length) {
                  query['quotes'] = req.body.quotes;
                } else {
                  delete query.status;
                }
              }

              _context5.prev = 6;
              _context5.next = 9;
              return Process.update(query, {
                where: {
                  fileId: req.body.fileid
                }
              });

            case 9:
              _context5.next = 11;
              return Process.findOne({
                where: {
                  fileId: req.body.fileid
                }
              });

            case 11:
              process = _context5.sent;
              noty = {
                type: type,
                data: {
                  fileId: req.body.fileid,
                  fileName: process.fileName,
                  userId: process.UserId,
                  email: process.email
                }
              };
              _context5.next = 15;
              return Notification.findOrCreate({
                where: {
                  data: {
                    fileId: req.body.fileid
                  }
                },
                defaults: noty
              });

            case 15:
              _notification2 = _context5.sent;
              email = process.email;
              freeUser = process.email ? true : false;

              if (!_notification2[1]) {
                _context5.next = 28;
                break;
              }

              if (!process.UserId) {
                _context5.next = 25;
                break;
              }

              _context5.next = 22;
              return User.findOne({
                where: {
                  id: process.UserId
                }
              });

            case 22:
              user = _context5.sent;
              email = user.email;
              user.addNotifications(_notification2[0]);

            case 25:
              mailer.main(email, type, process.uuid, freeUser);
              _context5.next = 30;
              break;

            case 28:
              _context5.next = 30;
              return Notification.update({
                type: type
              }, {
                where: {
                  data: {
                    fileId: req.body.fileid
                  }
                }
              });

            case 30:
              socketApi.sendNotificationDashboard(noty);
              status = parseInt(req.body.data.status);
              mailer.main(email, type, process.uuid, freeUser);

              if (!(status === 100)) {
                _context5.next = 46;
                break;
              }

              _context5.next = 36;
              return externalApi.retrievefile(process.fileId);

            case 36:
              response = _context5.sent;

              if (!(response.data.success && parseInt(response.data.status) >= 110)) {
                _context5.next = 46;
                break;
              }

              type = _.lowerCase(getStatus(parseInt(response.data.status)));
              type = _.replace(type, ' ', '_');
              type = _.replace(type, '/', '_');
              _context5.next = 43;
              return Process.update({
                status: type,
                fileDownload: response.data.data
              }, {
                where: {
                  fileId: req.body.fileid
                }
              });

            case 43:
              noty = {
                type: type,
                data: {
                  fileId: req.body.fileid,
                  fileName: process.fileName,
                  userId: process.UserId,
                  email: process.email
                }
              };
              socketApi.sendNotificationDashboard(noty);
              mailer.main(email, type, process.uuid, freeUser);

            case 46:
              return _context5.abrupt("return", res.status(200).send({
                data: {
                  fileId: process.fileId,
                  apiKey: apiKey
                }
              }));

            case 49:
              _context5.prev = 49;
              _context5.t0 = _context5["catch"](6);
              console.error(_context5.t0);
              return _context5.abrupt("return", res.status(500).send({
                error: _context5.t0
              }));

            case 53:
              _context5.next = 56;
              break;

            case 55:
              return _context5.abrupt("return", res.status(400).send({
                error: 'Bad Request'
              }));

            case 56:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[6, 49]]);
    }));

    function notification(_x9, _x10) {
      return _notification.apply(this, arguments);
    }

    return notification;
  }()
};