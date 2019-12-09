("use strict");

const db = require("./../../db/models");
const SubscriptionType = db.SubscriptionType;
const { logsConsole } = require("./../util/functions");

module.exports = {
  list: async (req, res) => {
    try {
      const doc = await SubscriptionType.findAll({
        where: {
          remove: false
        }
      });

      return res.status(200).send(doc);
    } catch (err) {
      logsConsole({
        message: err.message,
        method: "suscriptions.get",
        line: 20
      });
      res.status(500).json({
        error: err
      });
    }
  },
  get: async (req, res) => {
    try {
      const doc = await SubscriptionType.findByPk(req.params.id);

      return res.status(200).send({
        data: doc
      });
    } catch (err) {
      logsConsole({
        message: err.message,
        method: "suscriptions.get",
        line: 20
      });
      res.status(500).json({
        error: err
      });
    }
  },
  add: async (req, res) => {
    try {
      const {
        title,
        CategoryId,
        pages,
        freePages,
        price,
        minPrice,
        pricePerAdditionalPage,
        period,
        freeDays,
        maxSharedEngines,
        maxPrivateInstances,
        maxUsers,
        maxClones,
        canUsePGB,
        canTrain,
        canUseApi
      } = req.body;

      let doc = await SubscriptionType.create({
        title,
        CategoryId,
        pages,
        freePages,
        price,
        minPrice,
        pricePerAdditionalPage,
        period,
        freeDays,
        maxSharedEngines,
        maxPrivateInstances,
        maxUsers,
        maxClones,
        canUsePGB,
        canTrain,
        canUseApi
      });

      return res.status(200).send({
        data: {
          id: doc.id
        }
      });
    } catch (err) {
      logsConsole({
        message: err.message,
        method: "suscriptions.get",
        line: 20
      });
      res.status(500).json({
        error: err
      });
    }
  },
  save: async (req, res) => {
    try {
      const {
        id,
        title,
        CategoryId,
        pages,
        freePages,
        price,
        minPrice,
        pricePerAdditionalPage,
        period,
        freeDays,
        maxSharedEngines,
        maxPrivateInstances,
        maxUsers,
        maxClones,
        canUsePGB,
        canTrain,
        canUseApi
      } = req.body;

      await SubscriptionType.update(
        {
          title,
          CategoryId,
          pages,
          freePages,
          price,
          minPrice,
          pricePerAdditionalPage,
          period,
          freeDays,
          maxSharedEngines,
          maxPrivateInstances,
          maxUsers,
          maxClones,
          canUsePGB,
          canTrain,
          canUseApi
        },
        {
          where: {
            id: id
          }
        }
      );

      return res.status(200).send({
        data: {
          id
        }
      });
    } catch (err) {
      logsConsole({
        message: err.message,
        method: "suscriptions.save",
        line: 124
      });
      res.status(500).json({
        error: err
      });
    }
  },
  remove: async (req, res) => {
    try {
      const doc = await SubscriptionType.findByPk(req.params.id);

      doc.remove = true;
      await doc.save();
      const data = {
        id: doc.id
      };

      return res.status(200).send({
        data: data
      });
    } catch (err) {
      logsConsole({
        message: err.message,
        method: "suscriptions.remove",
        line: 150
      });
      res.status(500).send(err);
    }
  }
};
