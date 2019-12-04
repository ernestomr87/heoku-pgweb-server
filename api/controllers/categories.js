("use strict");

const db = require("./../../db/models");
const Category = db.Category;
const { logsConsole } = require("./../util/functions");

module.exports = {
  list: async (req, res) => {
    try {
      const doc = await Category.findAll();

      return res.status(200).send(doc);
    } catch (err) {
      logsConsole({
        message: err.message,
        method: "categories.get",
        line: 20
      });
      res.status(500).json({
        error: err
      });
    }
  },
  get: async (req, res) => {
    try {
      const doc = await Category.findByPk(req.params.id);

      return res.status(200).send({
        data: doc
      });
    } catch (err) {
      logsConsole({
        message: err.message,
        method: "categories.get",
        line: 20
      });
      res.status(500).json({
        error: err
      });
    }
  },
  add: async (req, res) => {
    try {
      const { name } = req.body;

      let doc = await Category.create({
        name
      });

      return res.status(200).send({
        data: {
          id: doc.id
        }
      });
    } catch (err) {
      logsConsole({
        message: err.message,
        method: "categories.get",
        line: 20
      });
      res.status(500).json({
        error: err
      });
    }
  },
  save: async (req, res) => {
    try {
      const { id, name } = req.body;

      await Category.update(
        {
          name
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
        method: "categories.save",
        line: 124
      });
      res.status(500).json({
        error: err
      });
    }
  },
  remove: async (req, res) => {
    try {
      const doc = await Category.findByPk(req.params.id);

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
        method: "categories.remove",
        line: 150
      });
      res.status(500).send(err);
    }
  }
};
