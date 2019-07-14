("use strict");
const uuidv4 = require("uuid/v4");
const path = require("path");

const fs = require("fs");
const rimraf = require("rimraf");
const util = require("util");

const db = require("./../../db/models");
const User = db.User;
const Process = db.Process;
const TypeOfPermits = db.TypeOfPermits;
const Notification = db.Notification;
const Engines = db.Engines;
const Group = db.Group;

const _ = require("lodash");
const map = require("async/map");

const mailer = require("./../util/mailer");
const paypal = require("./../util/paypal");

const compressing = require("compressing");
const randomstring = require("randomstring");

const externalApi = require("../external_api/api");
const apiKey = require("./../../config/config")["apiKey"];
const { getStatus } = require("./../util/functions");

const writeFile = util.promisify(fs.writeFile);

const filterEngines = (engines, types) => {
  let newArrays = [];
  for (let i = 0; i < engines.length; i++) {
    let array = [];
    for (let j = 0; j < engines[i].engines.length; j++) {
      types.map(item => {
        if (parseInt(item) === engines[i].engines[j].id) {
          array.push(engines[i].engines[j]);
        }
      });
    }
    if (array.length) {
      engines[i].engines = array;
      newArrays.push(engines[i]);
    }
  }
  return newArrays;
};

var extTypes = {
  docx: "application/msword",
  xlsx: "application/vnd.ms-excel",
  pptx: "application/vnd.ms-powerpoint",
  odt: "application/vnd.oasis.opendocument.text",
  zip: "application/zip"
};

const getExt = path => {
  var i = path.lastIndexOf(".");
  return i < 0 ? "" : path.substr(i + 1);
};

const getContentType = ext => {
  return extTypes[ext.toLowerCase()] || "application/octet-stream";
};

var walkSync = (dir, filelist) => {
  var files = fs.readdirSync(dir);
  filelist = filelist || [];
  let count = 0;

  files.forEach(function(file) {
    if (fs.statSync(dir + "/" + file).isDirectory()) {
      filelist = walkSync(dir + file + "/", filelist);
    } else {
      var extension = file.substr(file.lastIndexOf(".") + 1);
      if (/(docx|xlsx|pptx|odt)$/gi.test(extension)) {
        if (file[0] !== "." && count <= 50) {
          var bitmap = fs.readFileSync(dir + "/" + file);
          // convert binary data to base64 encoded string
          const base64 = new Buffer(bitmap).toString("base64");
          let aux = {
            fileName: file,
            fileType: getContentType(getExt(file)),
            file: base64
          };

          filelist.push(aux);
          count++;
        }
      }
    }
  });
  return filelist;
};

module.exports = {
  getProcess: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          id: req.userId
        }
      });

      const process = await user.getProcesses({
        attributes: [
          "uuid",
          "fileName",
          "fileId",
          "processId",
          "processName",
          "engineId",
          "engineName",
          "engineDomain",
          "engineSource",
          "engineTarget",
          "status",
          "quotes",
          "fileDownload",
          "quoteSelected"
        ]
      });

      return res.status(200).send({
        process
      });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },

  getProcessByUuid: async (req, res) => {
    let uuid = req.params.uuid;
    try {
      let process = await Process.findOne({
        where: { uuid: uuid }
      });
      return res.status(200).send(process);
    } catch (err) {
      res.status(400).send({
        error: err
      });
    }
  },

  load: async (req, res) => {
    try {
      const engines = await externalApi.describeEngines();
      if (engines.data.success) {
        const list = [];
        engines.data.data.map(item => {
          if (item.engines && item.engines.length) {
            list.push({
              name: item.name,
              engines: item.engines
            });
          }
        });

        Engines.bulkCreate(list)
          .then(result => {
            return res.status(200).send(result);
          })
          .catch(err => {
            return res.status(500).send({
              error: err
            });
          });
      } else {
        res.status(400).send({
          error: engines.data.error || "No data"
        });
      }
    } catch (err) {
      res.status(500).send({
        error: err
      });
    }
  },

  getExternalEngines: async (req, res) => {
    try {
      const engines = await Engines.findAll();
      if (engines) {
        if (!req.userId) {
          const typeOfPermits = await TypeOfPermits.findOne({
            where: {
              default: true
            }
          });
          if (typeOfPermits) {
            let result = filterEngines(engines, typeOfPermits.typeOfProcesses);
            return res
              .status(200)
              .send({ value: typeOfPermits.defaultValue, process: result });
          }
          return res.status(200).send(engines);
        } else {
          let typeOfPermits;
          if (req.userRol === "admin") {
            return res.status(200).send(engines);
          } else {
            typeOfPermits = await TypeOfPermits.findOne({
              where: {
                id: req.userTypeOfPermitId
              }
            });
          }
          if (typeOfPermits) {
            let result = filterEngines(
              engines.data.data,
              typeOfPermits.typeOfProcesses
            );
            return res.status(200).send(result);
          }
          return res.status(200).send(engines.data.data);
        }
      }
      res.status(400).send({
        error: engines.data.error || "No data"
      });
    } catch (err) {
      res.status(500).send({
        error: err
      });
    }
  },

  sendFileToExternalProcess: async (req, res) => {
    try {
      const username = req.body.email;
      const processId = req.body.process.id;
      const processName = req.body.process.name;
      const engineId = req.body.engine.id;
      const engineName = req.body.engine.name;
      const engineDomain = req.body.engine.domain;
      const engineSource = req.body.engine.source;
      const engineTarget = req.body.engine.target;

      const files = req.body.files;

      map(
        files,
        (item, cbm) => {
          const fileName = item.fileName;
          const fileType = item.fileType;
          const file = item.file.replace(`data:${fileType};base64,`, "");
          externalApi
            .processFile(
              username,
              engineSource,
              engineTarget,
              engineId,
              fileName,
              fileType,
              file
            )
            .then(result => {
              const error = result.data.error;
              const errorMessage = result.data.errormessage;
              const fileId = result.data.fileId;
              if (error !== 0 && fileId) {
                Process.create({
                  fileName,
                  fileId,
                  status: "waiting",
                  fileType,
                  processId,
                  processName,
                  engineId,
                  engineName,
                  engineDomain,
                  engineSource,
                  engineTarget,
                  email: username
                })
                  .then(() => {
                    cbm(null, true);
                  })
                  .catch(err => {
                    cbm(err, null);
                  });
              } else {
                cbm(errorMessage, null);
              }
            })
            .catch(err => {
              cbm(err, null);
            });
        },
        err => {
          if (err) {
            return res.status(500).send({
              error: error
            });
          } else {
            mailer.main(username, "received", null, true);
            return res.status(200).json({
              data: "ok"
            });
          }
        }
      );
    } catch (error) {
      return res.status(500).send({
        error: error
      });
    }
  },

  processFile: async (req, res) => {
    try {
      const username = req.userEmail;

      const processId = req.body.process.id;
      const processName = req.body.process.name;

      const engineId = req.body.engine.id;
      const engineName = req.body.engine.name;
      const engineDomain = req.body.engine.domain;
      const engineSource = req.body.engine.source;
      const engineTarget = req.body.engine.target;

      const files = req.body.files;

      map(
        files,
        (item, cbm) => {
          const fileName = item.fileName;
          const fileType = item.fileType;
          const file = item.file.replace(`data:${fileType};base64,`, "");

          externalApi
            .processFile(
              username,
              engineSource,
              engineTarget,
              engineId,
              fileName,
              fileType,
              file
            )
            .then(result => {
              const error = result.data.error;
              const errorMessage = result.data.errormessage;
              const fileId = result.data.fileId;
              if (error !== 0 && fileId) {
                if (req.userId) {
                  User.findOne({
                    where: {
                      id: req.userId
                    }
                  })
                    .then(user => {
                      Process.create({
                        fileName,
                        fileId,
                        status: "waiting",
                        fileType,
                        processId,
                        processName,
                        engineId,
                        engineName,
                        engineDomain,
                        engineSource,
                        engineTarget
                      })
                        .then(process => {
                          user
                            .addProcess(process)
                            .then(function() {
                              cbm(null, true);
                            })
                            .catch(err => {
                              cbm(err, null);
                            });
                        })
                        .catch(err => {
                          cbm(err, null);
                        });
                    })
                    .catch(err => {
                      cbm(err, null);
                    });
                } else {
                  cbm(null, true);
                }
              } else {
                cbm(errorMessage, null);
              }
            })
            .catch(err => {
              cbm(err, null);
            });
        },
        err => {
          if (err) {
            return res.status(500).send({
              error: error
            });
          } else {
            return res.status(200).json({
              data: "ok"
            });
          }
        }
      );
    } catch (error) {
      return res.status(400).send({
        error: error
      });
    }
  },

  quoteFile: async (req, res) => {
    try {
      const username = req.userEmail;

      const processId = req.body.process.id;
      const processName = req.body.process.name;

      const engineId = req.body.engine.id;
      const engineName = req.body.engine.name;
      const engineDomain = req.body.engine.domain;
      const engineSource = req.body.engine.source;
      const engineTarget = req.body.engine.target;

      const files = req.body.files;

      map(
        files,
        (item, cbm) => {
          const fileName = item.fileName;
          const fileType = item.fileType;
          const file = item.file.replace(`data:${fileType};base64,`, "");

          externalApi
            .quoteFile(
              username,
              engineSource,
              engineTarget,
              engineId,
              fileName,
              fileType,
              file
            )
            .then(result => {
              const error = result.data.error;
              const errorMessage = result.data.errormessage;
              const fileId = result.data.fileId;
              if (error !== 0 && fileId) {
                if (req.userId) {
                  User.findOne({
                    where: {
                      id: req.userId
                    }
                  })
                    .then(user => {
                      Process.create({
                        fileName,
                        fileId,
                        status: "waiting",
                        fileType,
                        processId,
                        processName,
                        engineId,
                        engineName,
                        engineDomain,
                        engineSource,
                        engineTarget
                      })
                        .then(process => {
                          user
                            .addProcess(process)
                            .then(function() {
                              cbm(null, true);
                            })
                            .catch(err => {
                              cbm(err, null);
                            });
                        })
                        .catch(err => {
                          cbm(err, null);
                        });
                    })
                    .catch(err => {
                      cbm(err, null);
                    });
                } else {
                  cbm(null, true);
                }
              } else {
                cbm(errorMessage, null);
              }
            })
            .catch(err => {
              res.status(400).send({
                error: err
              });
            });
        },
        err => {
          if (err) {
            return res.status(500).send({
              error: error
            });
          } else {
            return res.status(200).json({
              data: "ok"
            });
          }
        }
      );
    } catch (error) {
      return res.status(400).send({
        error: error
      });
    }
  },

  processFileAfterQuoteFile: async (req, res) => {
    try {
      const fileId = req.body.fileId;
      const quote = req.body.quote;

      let result = await externalApi.processFileAfterQuoteFile(
        fileId,
        quote.optionid
      );

      await Process.update(
        {
          quoteSelected: quote
        },
        {
          where: {
            fileId: result.data.fileId
          }
        }
      );

      return res.status(200).json({
        data: "ok"
      });
    } catch (error) {
      return res.status(500).send({
        error: error
      });
    }
  },

  /*
   *  Notificaciones desde el motor de Traduccion
   */
  notification: async (req, res) => {
    if (req.body.fileid && req.body.data) {
      let type = _.lowerCase(getStatus(req.body.data.status));
      type = _.replace(type, " ", "_");
      type = _.replace(type, "/", "_");

      let query = { status: type, uuid: uuidv4() };

      if (req.body.data.status === 7) {
        if (req.body.quotes.length) {
          query["quotes"] = req.body.quotes;
        } else {
          delete query.status;
        }
      }

      try {
        await Process.update(query, {
          where: {
            fileId: req.body.fileid
          }
        });

        let process = await Process.findOne({
          where: { fileId: req.body.fileid }
        });

        let email = process.email;
        let freeUser = process.email ? true : false;

        let noty = {
          type: type,
          data: {
            fileId: req.body.fileid,
            fileName: process.fileName,
            userId: process.UserId,
            email: process.email
          }
        };

        let notification = await Notification.findOrCreate({
          where: {
            data: {
              fileId: req.body.fileid
            }
          },
          defaults: noty
        });

        if (notification[1]) {
          if (process.UserId) {
            let user = await User.findOne({ where: { id: process.UserId } });
            email = user.email;
            user.addNotifications(notification[0]);
          }
        } else {
          await Notification.update(
            {
              type: type
            },
            {
              where: {
                data: {
                  fileId: req.body.fileid
                }
              }
            }
          );
        }

        const status = parseInt(req.body.data.status);

        if (status === 100) {
          const response = await externalApi.retrievefile(process.fileId);
          if (response.data.success && parseInt(response.data.status) >= 110) {
            type = _.lowerCase(getStatus(parseInt(response.data.status)));
            type = _.replace(type, " ", "_");
            type = _.replace(type, "/", "_");

            await Process.update(
              {
                status: type,
                fileDownload: response.data.data
              },
              {
                where: {
                  fileId: req.body.fileid
                }
              }
            );
          }
        }

        return res.status(200).send({
          data: {
            fileId: process.fileId,
            apiKey
          }
        });
      } catch (err) {
        return res.status(500).send({
          error: err
        });
      }
    } else {
      return res.status(400).send({
        error: "Bad Request"
      });
    }
  },

  clearNotification: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          id: req.userId
        },
        include: [
          {
            model: Notification
          }
        ]
      });

      user.Notifications.forEach(async notification => {
        await notification.destroy();
      });
      return res.status(200).send({ data: "ok" });
    } catch (error) {
      return res.status(500).send({
        error: error
      });
    }
  },

  pay: async (req, res) => {
    return paypal.pay(req, res);
  },

  cancel: async (req, res) => {
    const uuid = req.params.uuid;
    if (!uuid) {
      res.redirect(`http://localhost:3001/dashboard/404`);
    } else {
      res.redirect(
        `http://localhost:3001/dashboard/process-services/${uuid}/cancel`
      );
    }
  },

  return: async (req, res) => {
    return paypal.execute(req, res);
  }
};
