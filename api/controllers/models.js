("use strict");
const db = require("./../../db/models");
const Training = db.Training;
const User = db.User;

const moment = require("moment");
const FormData = require("form-data");
const fs = require("fs");
const Path = require("path");
const _ = require("lodash");
const map = require("async/map");

const externalApi = require("../external_api/api");

const { saveFile, deleteFolderRecursive } = require("./../util/functions");

module.exports = {
  getModels: async (req, res) => {
    try {
      let response;
      if (req.user && req.user.rol === "client") {
        const data = {
          client_id: req.user.id
        };
        response = await externalApi.getModels(data);
      } else {
        response = await externalApi.getModels();
      }
      const {
        data: { models }
      } = response;

      return res.status(200).send({
        models
      });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  getTrainings: async (req, res) => {
    try {
      let trainings = [];
      const model = req.query.model;
      if (model && req.user && req.user.rol === "admin") {
        trainings = await Training.findAll({
          where: {
            model
          }
        });
      } else if (model && req.user && req.user.rol === "client") {
        trainings = await Training.findAll({
          where: {
            model,
            UserId: req.user.id
          }
        });
      }

      return res.status(200).send({
        trainings
      });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  addModel: async (req, res) => {
    try {
      const data = {
        name: req.body.name,
        descr: req.body.descr,
        src: req.body.src,
        tgt: req.body.tgt,
        path: req.body.path,
        father: req.body.father,
        olmode: req.body.olmode,
        trainable: req.body.trainable
      };

      const response = await externalApi.addModel(data);
      const {
        data: { modelid, engineid }
      } = response;

      return res.status(200).send({ modelid, engineid });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  delModel: async (req, res) => {
    try {
      const data = {
        id: req.body.id
      };

      const response = await externalApi.delModel(data);
      const {
        data: { model_id }
      } = response;

      return res.status(200).send({ model_id });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  cloneModel: async (req, res) => {
    try {
      const data = {
        name: req.body.name,
        descr: req.body.descr,
        olmode: req.body.olmode,
        trainable: req.body.trainable,
        father: req.body.father,
        client_id: req.user.rol === "admin" ? 0 : req.user.id
      };

      const response = await externalApi.cloneModel(data);
      const {
        data: { modelid, engineid }
      } = response;

      return res.status(200).send({ modelid, engineid });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  train: async (req, res) => {
    try {
      const files = req.body.files;
      const model = req.body.model;
      const src = req.body.src;
      const tgt = req.body.tgt;
      const apikey = req.user.apikey;
      const username = req.user.email;

      const folderName = moment().valueOf();
      const pathFolder = Path.resolve(
        __dirname,
        `./../../uploads/${folderName}/`
      );

      map(
        files,
        async item => {
          const fileName = item.fileName;
          const fileType = item.fileType;
          const file = item.file;

          const training = await Training.create({
            title: fileName,
            model: model,
            apikey: apikey,
            src: src,
            tgt: tgt,
            status: "*" //solicitado
          });

          fs.mkdirSync(pathFolder);
          const path = Path.resolve(
            __dirname,
            `./../../uploads/${folderName}/`,
            fileName
          );

          const save = await saveFile(file, folderName, fileName, fileType);

          if (save) {
            let form = new FormData();

            form.append("file", fs.createReadStream(path));
            form.append("title", fileName);
            form.append("engine", 0);
            form.append("model", model);
            form.append("apikey", apikey);
            form.append("processname", "train");
            form.append("username", username);
            form.append("modestatus", 4);

            form.append("src", src);
            form.append("tgt", tgt);

            form.append(
              "notiflink",
              "http://pgweb.pangeamt.com:3004/api/notification/models"
            );

            let body = await externalApi.sendfile(form);

            const fileId = body.data.fileId;
            if (fileId && req.userId) {
              const user = await User.findOne({
                where: {
                  id: req.userId
                }
              });

              await Training.update(
                {
                  fileId
                },
                {
                  where: {
                    id: training.id
                  }
                }
              );
              user.addTraining(training);
              return true;
            } else {
              throw new Error(errorMessage);
            }
          } else {
            throw new Error("Error to save file");
          }
        },
        err => {
          deleteFolderRecursive(pathFolder);
          if (err) {
            return res.status(500).send({
              error: err
            });
          } else {
            return res.status(200).json({
              data: "ok"
            });
          }
        }
      );
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  notification: async (req, res) => {
    try {
      console.log("\x1b[33m%s\x1b[0m", "***************MODELS****************");
      console.log("\x1b[33m%s\x1b[0m", JSON.stringify(req.body));
      console.log("\x1b[33m%s\x1b[0m", "*************************************");

      // {"training":{"msg":"Training finished","result":"OK","alignations trained":6},"fileid":"1323eb51a671457abf7b43e26f436e6f","data":{"message":"Training Finished","apikey":"d1d0a149-35c9-4276-af75-4457da20d96a","status":2}}

      let fileId = req.body.fileid;
      let apikey = req.body.data.apikey;
      let status = req.body.data.status;

      let msg = req.body.training.msg || null;
      let result = req.body.training.result || null;
      let alignationsTrained = req.body.training["alignations trained"] || null;

      if (fileId && apikey && status) {
        await Training.update(
          {
            status,
            msg,
            result,
            alignationsTrained
          },
          {
            where: {
              fileId,
              apikey
            }
          }
        );
        return res.status(200).send({
          data: {
            fileId,
            apiKey
          }
        });
      } else {
        return res.status(400).send({
          error: "Bad Request"
        });
      }

      // return res.status(200).send();
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  }
};
