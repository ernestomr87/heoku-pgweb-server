("use strict");

const externalApi = require("../external_api/api");

module.exports = {
  getModels: async (req, res) => {
    try {
      const response = await externalApi.getModels();
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
  addModel: async (req, res) => {
    try {
      const data = {
        name: req.body.name,
        descr: req.body.descr,
        src: req.body.src,
        tgt: req.body.tgt,
        path: req.body.path,
        father: req.body.father,
        updated: req.body.updated,
        last_tu: req.body.last_tu,
        olmode: req.body.olmode,
        status: req.body.status
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
        id: req.body.id,
        name: req.body.name,
        descr: req.body.descr,
        olmode: req.body.olmode,
        father: req.body.father
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
  }
};
