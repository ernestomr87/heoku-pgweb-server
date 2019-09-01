("use strict");

const externalApi = require("../external_api/api");

module.exports = {
  getEds: async (req, res) => {
    try {
      const response = await externalApi.getEds();
      const response1 = await externalApi.getModels();
      const response2 = await externalApi.getNodes();

      const {
        data: { eds }
      } = response;
      const {
        data: { models }
      } = response1;
      const {
        data: { nodes }
      } = response2;

      return res.status(200).send({
        eds,
        models,
        nodes
      });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  addEd: async (req, res) => {
    try {
      const data = {
        nodeid: req.body.nodeid,
        modelid: req.body.modelid,
        status: req.body.status
      };

      const response = await externalApi.addModel(data);
      const {
        data: { edis }
      } = response;

      return res.status(200).send({ edis });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  delEd: async (req, res) => {
    try {
      const data = {
        id: req.body.id
      };

      const response = await externalApi.delModel(data);
      const {
        data: { edid }
      } = response;

      return res.status(200).send({ edid });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  enabledEd: async (req, res) => {
    try {
      const data = {
        id: req.body.id
      };

      const response = await externalApi.enabledEd(data);
      const {
        data: { edid }
      } = response;

      return res.status(200).send({ edid });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  disabledEd: async (req, res) => {
    try {
      const data = {
        id: req.body.id
      };

      const response = await externalApi.disabledEd(data);
      const {
        data: { edid }
      } = response;

      return res.status(200).send({ edid });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  }
};
