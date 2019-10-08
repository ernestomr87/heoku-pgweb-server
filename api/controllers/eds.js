("use strict");

const externalApi = require("../external_api/api");

module.exports = {
  getEds: async (req, res) => {
    try {
      const query = {
        ...req.query
      };

      const filter = {};
      if (query.filter === "node") {
        filter["node_id"] = query.id;
      }
      if (query.filter === "model") {
        filter["model_id"] = query.id;
      }

      const response = await externalApi.getEds(filter);
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
        modelid: req.body.modelid

  //       "nodeid":17,
	// "modelid":6,
	// "engineid":255,
	// "status": -1

        // nodeid: values.node_id,
        // modelid: values.model_id
        // status: req.body.status
      };

      const response = await externalApi.addEd(data);
      const {
        data: { edis, engineid, modelid }
      } = response;

      if (!engineid && !modelid) {
        res.status(500).json({
          error: "Model and Engine are 0"
        });
      }
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

      const response = await externalApi.delEd(data);
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
