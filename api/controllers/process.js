("use strict");
const uuidv4 = require("uuid/v4");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("./../../db/models");
const User = db.User;
const Process = db.Process;
const TypeOfPermits = db.TypeOfPermits;
const Notification = db.Notification;
const BillingInformation = db.BillingInformation;
const Engines = db.Engines;

const _ = require("lodash");
const map = require("async/map");

const mailer = require("./../util/mailer");
const paypal = require("./../util/paypal");

const externalApi = require("../external_api/api");
const apiKey = require("./../../config/config")["apiKey"];
const allowedFiles = require("./../../config/config")["allowedFiles"];
const { getStatus } = require("./../util/functions");

const env = process.env.NODE_ENV || "production";
const config = require("./../../config/config.json")[env];

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

const consultAndCreate = async (res, data) => {
  const {
    username,
    secret,
    processId,
    processName,
    engineId,
    engineName,
    engineDomain,
    engineSource,
    engineTarget,
    files
  } = data;

  map(
    files,
    async item => {
      const fileName = item.fileName;
      const fileType = item.fileType;
      const file = item.file.replace(`data:${fileType};base64,`, "");
      const process = await Process.create({
        fileName,
        // fileId,
        status: "waiting",
        fileType,
        processId,
        processName,
        engineId,
        engineName,
        engineDomain,
        engineSource,
        engineTarget,
        secret,
        email: username
      });

      const quote = await externalApi.quoteFile(
        username,
        engineSource,
        engineTarget,
        engineId,
        fileName,
        fileType,
        file
      );

      const error = quote.data.error;
      const errorMessage = quote.data.errormessage;
      const fileId = quote.data.fileId;

      if (error !== 0 && fileId) {
        await Process.update(
          {
            fileId
          },
          {
            where: {
              id: process.id
            }
          }
        );
        return true;
      } else {
        throw new Error(errorMessage);
      }
    },
    err => {
      if (err) {
        return res.status(500).send({
          error: err
        });
      }
      mailer.main(username, "received", null, true);
      return res.status(200).json({
        data: "ok"
      });
    }
  );
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
      let bi = null;
      if (
        req.userRol === "client" ||
        (req.userRol === "user" && !req.hasClient)
      ) {
        bi = await BillingInformation.findOne({
          where: {
            UserId: req.userId
          }
        });
      }
      if (req.userRol === "user" && req.hasClient) {
        bi = await BillingInformation.findOne({
          where: {
            UserId: req.hasClient
          }
        });
      }

      return res.status(200).send({
        process,
        billingInformation: bi
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
        where: {
          [Op.or]: {
            uuid: uuid,
            fileId: uuid
          }
        }
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
            let result = filterEngines(
              engines,
              typeOfPermits.typeOfProcesses,
              allowedFiles
            );
            return res.status(200).send({
              value: typeOfPermits.defaultValue,
              process: result,
              allowedFiles
            });
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

  getProcessByListId: async (req, res) => {
    let secret = req.query.secret;

    try {
      let process = await Process.findAll({
        where: {
          secret
        }
      });
      return res.status(200).send(process);
    } catch (err) {
      res.status(400).send({
        error: err
      });
    }
  },

  sendFileToExternalProcess: (req, res) => {
    try {
      const data = {
        username: req.body.email,
        secret: req.body.secret,
        processId: req.body.process.id,
        processName: req.body.process.name,
        engineId: req.body.engine.id,
        engineName: req.body.engine.name,
        engineDomain: req.body.engine.domain,
        engineSource: req.body.engine.source,
        engineTarget: req.body.engine.target,
        files: req.body.files
      };

      return consultAndCreate(res, data);
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
        async item => {
          const fileName = item.fileName;
          const fileType = item.fileType;
          const file = item.file.replace(`data:${fileType};base64,`, "");
          const process = await Process.create({
            fileName,
            // fileId,
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
          });

          const quote = await externalApi.quoteFile(
            username,
            engineSource,
            engineTarget,
            engineId,
            fileName,
            fileType,
            file
          );

          const error = quote.data.error;
          const errorMessage = quote.data.errormessage;
          const fileId = quote.data.fileId;

          if (error !== 0 && fileId && req.userId) {
            const user = await User.findOne({
              where: {
                id: req.userId
              }
            });
            let aux = null;
            if (user.UserId) {
              const client = await User.findOne({
                where: {
                  id: user.UserId
                }
              });
              if (client) {
                aux = client.email;
              }
            }

            await Process.update(
              {
                fileId,
                client: aux
              },
              {
                where: {
                  id: process.id
                }
              }
            );
            user.addProcess(process);

            return true;
          } else {
            throw new Error(errorMessage);
          }
        },
        err => {
          if (err) {
            return res.status(500).send({
              error: err
            });
          }
          return res.status(200).json({
            data: "ok"
          });
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

        // let email = process.email;
        // let freeUser = process.email ? true : false;

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
            let user = await User.findOne({
              where: { id: process.UserId }
            });
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

        // if (freeUser) {
        //   if (email) {
        //     //Envio de Email Usuario Casual
        //     mailer.main(email, type, process.uuid, freeUser);
        //   } else {
        //     //Envio de Email Usuario Registrado
        //     let user = await User.findOne({ where: { id: process.UserId } });
        //     let email = user.email;
        //     mailer.main(email, type, process.uuid, freeUser);
        //   }
        // }

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
      res.redirect(`${config.BASE}/dashboard/404`);
    } else {
      res.redirect(`${config.BASE}/dashboard/process-services/${uuid}/cancel`);
    }
  },

  return: async (req, res) => {
    return paypal.execute(req, res);
  },

  cancel_free: async (req, res) => {
    const uuid = req.params.uuid;
    if (!uuid) {
      res.redirect(`${config.BASE}/404`);
    } else {
      res.redirect(`${config.BASE}/process/${uuid}/cancel`);
    }
  },

  return_free: async (req, res) => {
    req.freeUser = true;
    return paypal.execute(req, res);
  }
};
