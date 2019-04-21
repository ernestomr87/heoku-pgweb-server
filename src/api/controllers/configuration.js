('use strict');

const db = require('./../../db/models');
const Configuration = db.Configuration;

module.exports = {
  getConfiguration: async (req, res) => {
    try {
      const configuration = await Configuration.findOne();

      return res.status(200).send({
        configuration
      });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  setPaypal: async (req, res) => {
    try {
      let query = {
        mode: req.body.mode,
        client_id: req.body.client_id,
        client_secret: req.body.client_secret,
      };

      await Configuration.update(
        query
      );

      return res.status(200).send({
        response: 'success'
      });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  },
  setEmailNotification: async (req, res) => {
    try {
      let query = {
        email_notification: req.body.email_notification,
      };

      await Configuration.update(
        query
      );

      return res.status(200).send({
        response: 'success'
      });
    } catch (err) {
      res.status(500).json({
        error: err
      });
    }
  }
};