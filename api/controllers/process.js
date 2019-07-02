("use strict");
const uuidv4 = require("uuid/v4");
var path = require("path");

const db = require("./../../db/models");
const User = db.User;
const Process = db.Process;
const TypeOfPermits = db.TypeOfPermits;
const Notification = db.Notification;
const Engines = db.Engines;
const _ = require("lodash");
const mailer = require("./../util/mailer");

const compressing = require("compressing");
const randomstring = require("randomstring");

const externalApi = require("../external_api/api");
const apiKey = require("./../../config/config")["apiKey"];
const { getStatus } = require("./../util/functions");

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

var walkSync = function(dir, filelist) {
  var fs = fs || require("fs"),
    files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + "/" + file).isDirectory()) {
      filelist = walkSync(dir + file + "/", filelist);
    } else {
      var bitmap = fs.readFileSync(dir + "/" + file);
      // convert binary data to base64 encoded string
      const base64 = new Buffer(bitmap).toString("base64");
      let aux={
        fileName,
        fileType,
        file:base64
      }
      filelist.push(aux);
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

  sendFileToExternalProcess: (req, res) => {
    try {
      const processId = req.body.process.id;
      const processName = req.body.process.name;

      const engineId = req.body.engine.id;
      const engineName = req.body.engine.name;
      const engineDomain = req.body.engine.domain;
      const engineSource = req.body.engine.source;
      const engineTarget = req.body.engine.target;

      const fileName = req.body.file.fileName;
      const fileType = req.body.file.fileType;
      const file = req.body.file.file.replace(`data:${fileType};base64,`, "");
      const username = req.body.email;

      var extension = fileName.substr(fileName.lastIndexOf(".") + 1);
      if (!/(zip)$/gi.test(extension)) {
        try {
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
                    return res.status(200).json({
                      data: "ok"
                    });
                  })
                  .catch(err => {
                    res.status(500).json({
                      error: err
                    });
                  });
              } else {
                return res.status(400).send({
                  error: errorMessage
                });
              }
            })
            .catch(err => {
              res.status(400).send({
                error: err
              });
            });
        } catch (err) {
          console.log(err);
        }
      } else {
        const name = `${randomstring.generate(5)}-${fileName}`;
        require("fs").writeFile(`uploads/${name}`, file, "base64", function(
          err
        ) {
          if (!err) {
            compressing.zip
              .uncompress(`uploads/${name}`, `uploads/dir/${name}`)
              .then(() => {
                let fileList = walkSync(
                  `${path.join(global.APP_ROOT, "/uploads/dir/" + name + "/")}`,
                  []
                );

                console.log(fileList);

                return res.status(200).json({
                  data: "ok"
                });
              })
              .catch(err => {
                console.log(err);
                return res.status(500).send({
                  error: err
                });
              });
          } else {
            return res.status(500).send({
              error: err
            });
          }
        });
      }
    } catch (error) {
      return res.status(500).send({
        error: error
      });
    }
  },

  processFile: (req, res) => {
    try {
      const processId = req.body.process.id;
      const processName = req.body.process.name;

      const engineId = req.body.engine.id;
      const engineName = req.body.engine.name;
      const engineDomain = req.body.engine.domain;
      const engineSource = req.body.engine.source;
      const engineTarget = req.body.engine.target;

      const fileName = req.body.file.fileName;
      const fileType = req.body.file.fileType;
      const file = req.body.file.file.replace(`data:${fileType};base64,`, "");
      const username = req.userEmail;

      try {
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
                      status: 0,
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
                            return res.status(200).json({
                              data: "ok"
                            });
                          })
                          .catch(err => {
                            res.status(500).json({
                              description: "Can not access User Page",
                              error: err
                            });
                          });
                      })
                      .catch(err => {
                        res.status(500).json({
                          description: "Can not access User Page",
                          error: err
                        });
                      });
                  })
                  .catch(err => {
                    res.status(500).json({
                      description: "Can not access User Page",
                      error: err
                    });
                  });
              } else {
                return res.status(200).json({
                  data: "ok"
                });
              }
            } else {
              return res.status(400).send({
                error: errorMessage
              });
            }
          })
          .catch(err => {
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

  quoteFile: (req, res) => {
    try {
      const processId = req.body.process.id;
      const processName = req.body.process.name;

      const engineId = req.body.engine.id;
      const engineName = req.body.engine.name;
      const engineDomain = req.body.engine.domain;
      const engineSource = req.body.engine.source;
      const engineTarget = req.body.engine.target;

      const fileName = req.body.file.fileName;
      const fileType = req.body.file.fileType;
      const file = req.body.file.file.replace(`data:${fileType};base64,`, "");
      const username = req.userEmail;

      try {
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
                      status: 0,
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
                            return res.status(200).json({
                              data: "ok"
                            });
                          })
                          .catch(err => {
                            res.status(500).json({
                              description: "Can not access User Page",
                              error: err
                            });
                          });
                      })
                      .catch(err => {
                        res.status(500).json({
                          description: "Can not access User Page",
                          error: err
                        });
                      });
                  })
                  .catch(err => {
                    res.status(500).json({
                      description: "Can not access User Page",
                      error: err
                    });
                  });
              } else {
                return res.status(200).json({
                  data: "ok"
                });
              }
            } else {
              return res.status(400).send({
                error: errorMessage
              });
            }
          })
          .catch(err => {
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

        if (email) {
          //Envio de Email Usuario Casual
          mailer.main(email, type, process.uuid, freeUser);
        } else {
          //Envio de Email Usuario Registrado
          let user = await User.findOne({ where: { id: process.UserId } });
          let email = user.email;
          mailer.main(email, type, process.uuid, freeUser);
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
  }
};
