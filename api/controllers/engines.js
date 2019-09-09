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
        serviceid: req.body.serviceid,
        inserviceid: req.body.inserviceid,
        src: req.body.src,
        tgt: req.body.tgt,
        descr: req.body.descr,
        domain: req.body.domain,
        flavor: req.body.flavor,
        status: -1
      };

      const response = await externalApi.addEngine(data);
      const {
        data: { engineid }
      } = response;

      if (engineid) {
        return res.status(200).send({ engineid });
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
  delEngine: async (req, res) => {
    try {
      const data = {
        id: req.body.id
      };

      const response = await externalApi.delEngine(data);
      const {
        data: { engine_id }
      } = response;

      return res.status(200).send({ engine_id });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  enabledEngine: async (req, res) => {
    try {
      const data = {
        id: req.body.id
      };

      const response = await externalApi.enabledEngine(data);
      const {
        data: { engine_id }
      } = response;

      return res.status(200).send({ engine_id });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  disabledEngine: async (req, res) => {
    try {
      const data = {
        id: req.body.id
      };

      const response = await externalApi.disabledEngine(data);
      const {
        data: { engine_id }
      } = response;

      return res.status(200).send({ engine_id });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  }
};
