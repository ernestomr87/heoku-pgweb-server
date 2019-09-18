("use strict");
const uuidv4 = require("uuid/v4");
const moment = require("moment");
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

const CONFIG_APP = require(`./../../config/${process.env.NODE_APP}.json`);
const common = require("./../../config/common");
const apiKey = CONFIG_APP.apiKey;
const allowedFiles = CONFIG_APP.allowedFiles;

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
  const apikey = "casualuser";

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
        file,
        apikey
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
    console.log(
      "\x1b[33m%s\x1b[0m",
      "req.headers.origin",
      JSON.stringify(req.headers)
    );
    try {
      const user = await User.findOne({
        where: {
          id: req.userId
        }
      });

      const process = await user.getProcesses({
        attributes: [
          "id",
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
          "quoteSelected",
          "downloaded"
        ],
        where: {
          removed: false
        }
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

  enginesByUser: async (req, res) => {
    try {
      const id = parseInt(req.userId);
      const user = await User.findByPk(id);

      if (user.rol === "user") {
        const response = await externalApi.enginesByUser({ user_id: id });
        const {
          data: { user_engines }
        } = response;
        if (!user_engines) return res.status(200).send([]);

        const data = {
          allowedFiles,
          process: [
            {
              id: 1,
              name: "translation",
              updatedAt: "2019-08-12T03:29:32.000Z",
              engines: user_engines.map(item => {
                item.source = item.src;
                item.target = item.tgt;
                item.name = item.descr;
                delete item.src;
                delete item.tgt;
                delete item.descr;
                return item;
              })
            }
          ]
        };

        return res.status(200).send({ ...data });
      } else {
        return res.status(403).send("Permissions Required!");
      }
    } catch (err) {
      res.status(500).json({
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
      const apikey = req.user.apikey;

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
              file,
              apikey
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
      const apikey = req.user.apikey;
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

          let quote;
          if (req.user.typeOfUser === 1) {
            quote = await externalApi.processFile(
              username,
              engineSource,
              engineTarget,
              engineId,
              fileName,
              fileType,
              file,
              apikey
            );
          } else {
            quote = await externalApi.quoteFile(
              username,
              engineSource,
              engineTarget,
              engineId,
              fileName,
              fileType,
              file,
              apikey
            );
          }

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
      const apikey = req.user.apikey;

      let result = await externalApi.processFileAfterQuoteFile(
        fileId,
        quote.optionid,
        apikey
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
    console.log("\x1b[33m%s\x1b[0m", "*******************************");
    console.log("\x1b[33m%s\x1b[0m", JSON.stringify(req.body));
    console.log("\x1b[33m%s\x1b[0m", "*******************************");

    if (req.body.fileid && req.body.data) {
      let apikey = req.body.data.apikey;
      let type = _.lowerCase(getStatus(req.body.data.status));
      type = _.replace(type, " ", "_");
      type = _.replace(type, "/", "_");
      console.log("\x1b[33m%s\x1b[0m", "NOTIFICATION", type);

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
          const response = await externalApi.retrievefile(
            process.fileId,
            apikey
          );
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
      res.redirect(common.urls.register_404);
    } else {
      res.redirect(common.urls.register_cancel(uuid));
    }
  },

  return: async (req, res) => {
    req.freeUser = false;
    return paypal.execute(req, res);
  },

  cancel_free: async (req, res) => {
    const uuid = req.params.uuid;
    if (!uuid) {
      res.redirect(common.urls.casual_404);
    } else {
      res.redirect(common.urls.casual_cancel(uuid));
    }
  },

  return_free: async (req, res) => {
    req.freeUser = true;
    return paypal.execute(req, res);
  },

  setDownload: async (req, res) => {
    try {
      const id = req.body.id;
      if (id) {
        await Process.update(
          {
            downloaded: true
          },
          {
            where: {
              id: id
            }
          }
        );
      } else {
        return res.status(400).send({
          error: "Bad Request"
        });
      }

      return res.status(200).send({ data: "ok" });
    } catch (error) {
      return res.status(500).send({
        error: error
      });
    }
  },

  removed: async (req, res) => {
    try {
      const id = req.body.id;
      if (id) {
        await Process.update(
          {
            removed: true
          },
          {
            where: {
              id: id
            }
          }
        );
      } else {
        return res.status(400).send({
          error: "Bad Request"
        });
      }

      return res.status(200).send({ data: "ok" });
    } catch (error) {
      return res.status(500).send({
        error: error
      });
    }
  },

  getStats: async (req, res) => {
    try {
      let userData = null;

      let start, end;
      if (req.body.period === "month") {
        start = moment(req.body.from_date).format("YYYY.MM");
        end = moment(req.body.to_date).format("YYYY.MM");
      } else {
        start = moment(req.body.from_date).format("YYYY.MM.DD");
        end = moment(req.body.to_date).format("YYYY.MM.DD");
      }
      const data = {
        userId: req.body.userId || req.userId,
        period: req.body.period,
        apikey: req.body.apikey,
        from_date: start,
        to_date: end
      };

      if (!data.apikey) {
        const user = await User.findByPk(data.userId);
        userData = {
          email: user.email,
          fullName: user.fullName,
          rol: user.rol
        };
        data.apikey = user.apikey;
      }

      //2019.09.13
      const response = await externalApi.getstats(data);
      const {
        data: { Stats, FileStats }
      } = response;

      if (Stats) {
        return res.status(200).send({ Stats, FileStats, user: userData });
      } else {
        res.status(500).json({
          error: { message: "Bad Request" }
        });
      }
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },

  translate: async (req, res) => {
    try {
      const engine = req.body.engine;
      const form = {
        src: engine.source,
        tgt: engine.target,
        apikey: req.user.apikey,
        engine: engine.id,
        text: [req.body.text]
      };

      //2019.09.13
      const response = await externalApi.translate(form);
      const { data } = response;

      return res.status(200).send({ data });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  }
};
