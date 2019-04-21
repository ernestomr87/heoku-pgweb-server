const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var bcrypt = require('bcryptjs');

const db = require('./../../db/models');
const User = db.User;
const TypeOfPermits = db.TypeOfPermits;

exports.listAll = async (req, res) => {
  try {
    let users;
    if (req.userRol === 'client') {
      const users = await User.findAll({
        attributes: ['id', 'fullName', 'email', 'rol', 'typeOfUser'],
        include: [
          {
            model: TypeOfPermits
          }
        ],
        where: {
          userId: req.userId
        }
      });

      // users = await user.getUsers();
      return res.status(200).send({
        users
      });
    } else {
      users = await User.findAll(
        {
          attributes: ['id', 'fullName', 'email', 'rol', 'typeOfUser'],
          include: [
            {
              model: TypeOfPermits
            }
          ]
        },
        {
          where: {
            removed: false
          }
        }
      );

      return res.status(200).send({
        users
      });
    }
  } catch (err) {
    return res.status(500).send({
      error: err
    });
  }
};
exports.get = async (req, res) => {
  try {
    const user = await User.findOne(
      {
        attributes: ['fullName', 'email', 'rol']
      },
      {
        where: {
          id: req.body.id
        }
      },
      {
        include: [
          {
            model: TypeOfPermits
          }
        ]
      }
    );
    return res.status(200).send({
      user
    });
  } catch (err) {
    return res.status(500).send({
      error: err
    });
  }
};
exports.remove = async (req, res) => {
  try {
    await User.update(
      {
        removed: true
      },
      {
        where: {
          id: req.body.id
        }
      }
    );
    return res.status(200).send({
      ok: 'Action success'
    });
  } catch (err) {
    res.status(500).send(err);
  }
};
exports.create = async (req, res) => {
  try {
    let user = await User.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      rol: req.body.rol || 'user',
      typeOfUser: req.body.typeOfUser
    });

    let typeOfPermits = await TypeOfPermits.findOne({
      where: {
        id: req.body.typeOfPermits
      }
    });

    user.setTypeOfPermit(typeOfPermits);
    if (req.userRol === 'client') {
      let client = await User.findOne({
        where: {
          id: req.userId
        }
      });
      await client.setUsers(user);
    }
    return res.status(200).send({
      ok: 'Action success'
    });
  } catch (err) {
    res.status(500).send(err);
  }
};
exports.update = async (req, res) => {
  try {
    await User.update(
      {
        fullName: req.body.fullName,
        email: req.body.email,
        rol: req.body.rol || 'user',
        typeOfUser: req.body.typeOfUser
      },
      {
        where: {
          id: req.body.id
        }
      }
    );
    let user = await User.findOne({
      where: {
        id: req.body.id
      }
    });
    user.setTypeOfPermit(req.body.typeOfPermits);

    return res.status(200).send({
      ok: 'Action success'
    });
  } catch (err) {
    res.status(500).send(err);
  }
};
