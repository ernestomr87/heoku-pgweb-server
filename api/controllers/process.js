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
      } else {
        const name = `${randomstring.generate(5)}-${fileName}`;

        fs.mkdirSync(`uploads/${name}`, { recursive: true });
        await writeFile(`uploads/${name}/${name}`, file, "base64");

        await compressing.zip.uncompress(
          `uploads/${name}/${name}`,
          `uploads/${name}`
        );

        let fileList = await walkSync(
          `${path.join(global.APP_ROOT, `uploads/${name}/`)}`,
          []
        );

        await rimraf(`${path.join(global.APP_ROOT, `uploads/${name}`)}`, () => {
          Group.create({
            name: name,
            total: 0,
            complete: 0
          })
            .then(group => {
              map(
                fileList,
                (item, cbm) => {
                  externalApi
                    .processFile(
                      username,
                      engineSource,
                      engineTarget,
                      engineId,
                      item.fileName,
                      item.fileType,
                      item.file
                    )
                    .then(result => {
                      const error = result.data.error;
                      const errorMessage = result.data.errormessage;
                      const fileId = result.data.fileId;
                      if (error !== 0 && fileId) {
                        Process.create({
                          status: "waiting",
                          fileName: item.fileName,
                          fileId,
                          fileType: item.fileType,
                          processId,
                          processName,
                          engineId,
                          engineName,
                          engineDomain,
                          engineSource,
                          engineTarget,
                          email: username
                        })
                          .then(doc => {
                            doc.setGroup(group);
                            cbm(null, doc);
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
                function(err, results) {
                  if (err) {
                    return res.status(500).send({
                      error: err
                    });
                  } else {
                    Group.update(
                      {
                        total: results.length
                      },
                      {
                        where: { id: group.id }
                      }
                    )
                      .then(() => {
                        return res.status(200).json({
                          data: "ok"
                        });
                      })
                      .catch(err => {
                        return res.status(500).send({
                          error: err
                        });
                      });
                  }
                }
              );
            })
            .catch(err => {
              return res.status(500).send({
                error: err
              });
            });
        });
      }
    } catch (error) {
      return res.status(500).send({
        error: error
      });
    }
  },

  processFile: async (req, res) => {
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

      var extension = fileName.substr(fileName.lastIndexOf(".") + 1);
      if (!/(zip)$/gi.test(extension)) {
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
      } else {
        const name = `${randomstring.generate(5)}-${fileName}`;

        fs.mkdirSync(`uploads/${name}`, { recursive: true });
        await writeFile(`uploads/${name}/${name}`, file, "base64");

        await compressing.zip.uncompress(
          `uploads/${name}/${name}`,
          `uploads/${name}`
        );

        let fileList = await walkSync(
          `${path.join(global.APP_ROOT, `uploads/${name}/`)}`,
          []
        );

        await rimraf(`${path.join(global.APP_ROOT, `uploads/${name}`)}`, () => {
          Group.create({
            name: name,
            total: 0,
            complete: 0
          })
            .then(group => {
              map(
                fileList,
                (item, cbm) => {
                  externalApi
                    .processFile(
                      username,
                      engineSource,
                      engineTarget,
                      engineId,
                      item.fileName,
                      item.fileType,
                      item.file
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
                                status: "waiting",
                                fileName: item.fileName,
                                fileId,
                                fileType: item.fileType,
                                processId,
                                processName,
                                engineId,
                                engineName,
                                engineDomain,
                                engineSource,
                                engineTarget,
                                email: username
                              })
                                .then(process => {
                                  process.setGroup(group);
                                  user
                                    .addProcess(process)
                                    .then(function() {
                                      cbm(null, process);
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
                        cbm(errorMessage, null);
                      }
                    })
                    .catch(err => {
                      cbm(err, null);
                    });
                },
                function(err, results) {
                  if (err) {
                    return res.status(500).send({
                      error: err
                    });
                  } else {
                    Group.update(
                      {
                        total: results.length
                      },
                      {
                        where: { id: group.id }
                      }
                    )
                      .then(() => {
                        return res.status(200).json({
                          data: "ok"
                        });
                      })
                      .catch(err => {
                        return res.status(500).send({
                          error: err
                        });
                      });
                  }
                }
              );
            })
            .catch(err => {
              return res.status(500).send({
                error: err
              });
            });
        });
      }
    } catch (error) {
      return res.status(400).send({
        error: error
      });
    }
  },

  quoteFile: async (req, res) => {
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

      var extension = fileName.substr(fileName.lastIndexOf(".") + 1);
      if (!/(zip)$/gi.test(extension)) {
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
      } else {
        const name = `${randomstring.generate(5)}-${fileName}`;

        fs.mkdirSync(`uploads/${name}`, { recursive: true });
        await writeFile(`uploads/${name}/${name}`, file, "base64");

        await compressing.zip.uncompress(
          `uploads/${name}/${name}`,
          `uploads/${name}`
        );

        let fileList = await walkSync(
          `${path.join(global.APP_ROOT, `uploads/${name}/`)}`,
          []
        );

        await rimraf(`${path.join(global.APP_ROOT, `uploads/${name}`)}`, () => {
          Group.create({
            name: name,
            total: 0,
            complete: 0
          })
            .then(group => {
              map(
                fileList,
                (item, cbm) => {
                  externalApi
                    .quoteFile(
                      username,
                      engineSource,
                      engineTarget,
                      engineId,
                      item.fileName,
                      item.fileType,
                      item.file
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
                                status: "waiting",
                                fileName: item.fileName,
                                fileId,
                                fileType: item.fileType,
                                processId,
                                processName,
                                engineId,
                                engineName,
                                engineDomain,
                                engineSource,
                                engineTarget,
                                email: username
                              })
                                .then(process => {
                                  process.setGroup(group);
                                  user
                                    .addProcess(process)
                                    .then(function() {
                                      cbm(null, process);
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
                        cbm(errorMessage, null);
                      }
                    })
                    .catch(err => {
                      cbm(err, null);
                    });
                },
                function(err, results) {
                  if (err) {
                    return res.status(500).send({
                      error: err
                    });
                  } else {
                    Group.update(
                      {
                        total: results.length
                      },
                      {
                        where: { id: group.id }
                      }
                    )
                      .then(() => {
                        return res.status(200).json({
                          data: "ok"
                        });
                      })
                      .catch(err => {
                        return res.status(500).send({
                          error: err
                        });
                      });
                  }
                }
              );
            })
            .catch(err => {
              return res.status(500).send({
                error: err
              });
            });
        });
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
