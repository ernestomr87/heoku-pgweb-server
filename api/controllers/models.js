("use strict");
const db = require("./../../db/models");
const Training = db.Training;
const User = db.User;

const moment = require("moment");
const FormData = require("form-data");
const fs = require("fs");
const Path = require("path");
const _ = require("lodash");
const map = require("async/mapSeries");

const externalApi = require("../external_api/api");

const { saveFileV2, deleteFolderRecursive } = require("./../util/functions");

const APP_CONFIG = require(`./../../config/${process.env.NODE_APP}.json`);
const BASE_URL = `${APP_CONFIG.host}:${APP_CONFIG.port}`;

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

          const save = await saveFileV2(file, folderName, fileName, fileType);

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

            form.append("notiflink", `${BASE_URL}/api/notification/models`);

            let body = await externalApi.sendfileV2(form);

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
      console.log("\n");
      console.log("\x1b[33m%s\x1b[0m", "***************MODELS****************");
      console.log("\x1b[33m%s\x1b[0m", JSON.stringify(req.body));
      console.log("\x1b[33m%s\x1b[0m", "*************************************");
      console.log("\n");
      const query = {};

      const {
        fileid: fileId,
        data: { apikey, status },
        training: { msg, result }
      } = req.body;

      if (status) query["status"] = status;

      if (msg) query["msg"] = msg;

      if (result) query["result"] = result;

      if (req.body.training["alignations trained"])
        query["alignationsTrained"] = req.body.training["alignations trained"];

      if (fileId && apikey && status) {
        await Training.update(query, {
          where: {
            fileId,
            apikey
          }
        });
        return res.status(200).send({
          data: {
            fileId,
            apikey
          }
        });
      } else {
        return res.status(400).send({
          error: "Bad Request"
        });
      }

      // return res.status(200).send();
    } catch (err) {
      console.log("\n");
      console.log("\x1b[31m%s\x1b[0m", "***************MODELS****************");
      console.log("\x1b[31m%s\x1b[0m", err.message);
      console.log("\x1b[31m%s\x1b[0m", "*************************************");
      console.log("\n");

      res.status(500).json({
        error: err
      });
    }
  }
};
