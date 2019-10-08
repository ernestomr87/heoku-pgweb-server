("use strict");

const externalApi = require("../external_api/api");

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
  addModel: async (req, res) => {
    try {
      const data = {
        name: req.body.name,
        descr: req.body.descr,
        src: req.body.src,
        tgt: req.body.tgt,
        path: req.body.path,
        father: req.body.father,
        olmode: req.body.olmode
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
        father: req.body.father
      };
      if (req.body.client_id) {
        data["client_id"] = req.body.client_id;
      }

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
