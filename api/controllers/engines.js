("use strict");

const externalApi = require("../external_api/api");

module.exports = {
  getServices: async (req, res) => {
    try {
      const response = await externalApi.getServices();
      const {
        data: { services }
      } = response;

      return res.status(200).send({
        services
      });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  getEngines: async (req, res) => {
    try {
      const response = await externalApi.getEngines();
      const {
        data: { engines }
      } = response;

      return res.status(200).send({
        engines
      });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  addEngine: async (req, res) => {
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

      const response = await externalApi.addEngine(data);
      const {
        data: { Engineid, engineid }
      } = response;

      return res.status(200).send({ Engineid, engineid });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  delEngine: async (req, res) => {
    try {
      const data = {
        id: req.body.id
      };

      const response = await externalApi.delEngine(data);
      const {
        data: { Engine_id }
      } = response;

      return res.status(200).send({ Engine_id });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  cloneEngine: async (req, res) => {
    try {
      const data = {
        name: req.body.name,
        descr: req.body.descr,
        olmode: req.body.olmode,
        father: req.body.father
      };

      const response = await externalApi.cloneEngine(data);
      const {
        data: { Engineid, engineid }
      } = response;

      return res.status(200).send({ Engineid, engineid });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  }
};
