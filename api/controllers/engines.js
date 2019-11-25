("use strict");

const db = require("./../../db/models");
const User = db.User;
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
  },
  enginesByUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      let response;
      const id = parseInt(req.params.id);
      const data = {
        engines: [],
        user: {
          email: user.email,
          fullName: user.fullName,
          rol: user.rol
        }
      };

      if (user.rol === "user") {
        response = await externalApi.enginesByUser({ user_id: id });
        const {
          data: { user_engines }
        } = response;
        data.engines = user_engines || [];
      }
      if (user.rol === "client") {
        response = await externalApi.enginesByClient({
          client_id: id
        });
        const {
          data: { client_engines }
        } = response;
        data.engines = client_engines || [];
      }
      return res.status(200).send({ ...data });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  addUserEngine: async (req, res) => {
    try {
      const user = await User.findByPk(req.body.id);
      let response;
      const id = parseInt(req.body.id);
      const engine = parseInt(req.body.engine);

      if (user.rol === "user") {
        response = await externalApi.addUserEngine({
          user_id: id,
          engine_id: engine
        });
      }
      if (user.rol === "client") {
        response = await externalApi.addClientEngine({
          client_id: id,
          engine_id: engine,
          grant_all: 0
        });
      }

      const {
        data: { auth_id }
      } = response;
      if (!auth_id) return res.status(200).send(null);
      return res.status(200).send({ auth_id });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  delUserEngine: async (req, res) => {
    try {
      const user = await User.findByPk(req.body.id);
      let response;
      const id = parseInt(req.body.id);
      const engine = parseInt(req.body.engine);

      if (user.rol === "user") {
        response = await externalApi.delUserEngine({
          user_id: id,
          engine_id: engine
        });
      }
      if (user.rol === "client") {
        response = await externalApi.delClientEngine({
          client_id: id,
          engine_id: engine,
          grant_all: 1
        });
      }

      const {
        data: { auth_id }
      } = response;
      if (!auth_id) return res.status(200).send(null);
      return res.status(200).send({ auth_id });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  updateClientEngine: async (req, res) => {
    try {
      const user = await User.findByPk(req.userId);

      let response;
      const grant_all = parseInt(req.body.grant_all);
      const engine_id = parseInt(req.body.engine_id);

      if (user.rol === "client") {
        response = await externalApi.updateClientEngine({
          client_id: req.userId,
          engine_id,
          grant_all
        });

        const {
          data: { auth_id }
        } = response;
        if (!auth_id) return res.status(200).send(null);
        return res.status(200).send({ auth_id });
      } else {
        return res.status(403).send("Permissions Required!");
      }
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  }
};
