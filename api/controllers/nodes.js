("use strict");

const externalApi = require("../external_api/api");

module.exports = {
  getNodes: async (req, res) => {
    try {
      const response = await externalApi.getNodes();
      const {
        data: { nodes }
      } = response;

      return res.status(200).send({
        nodes
      });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  addNode: async (req, res) => {
    try {
      const data = {
        name: req.body.name,
        ipaddress: req.body.ipaddress,
        port: req.body.port,
        status: req.body.status
      };

      const response = await externalApi.addNode(data);
      const {
        data: { nodeid }
      } = response;

      return res.status(200).send({ nodeid });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  delNode: async (req, res) => {
    try {
      const data = {
        id: req.body.id
      };

      const response = await externalApi.delNode(data);
      const {
        data: { nodeid }
      } = response;

      return res.status(200).send({ nodeid });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  restartNode: async (req, res) => {
    try {
      const data = {
        id: req.body.id
      };

      const response = await externalApi.restartNode(data);
      const {
        data: { nodeid }
      } = response;

      return res.status(200).send({ nodeid });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  enabledNode: async (req, res) => {
    try {
      const data = {
        id: req.body.id
      };

      const response = await externalApi.enabledNode(data);
      const {
        data: { node_id }
      } = response;

      return res.status(200).send({ node_id });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  disabledNode: async (req, res) => {
    try {
      const data = {
        id: req.body.id
      };

      const response = await externalApi.disabledNode(data);
      const {
        data: { node_id }
      } = response;

      return res.status(200).send({ node_id });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  }
};
