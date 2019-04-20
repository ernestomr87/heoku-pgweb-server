const db = require("../../db/models");
const TypeOfPermits = db.TypeOfPermits;

exports.list = (req, res) => {
  // Save User to Database
  TypeOfPermits.findAll({
    where: {
      remove: false
    }
  })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({ err });
    });
};

exports.add = (req, res) => {
  // Save User to Database
  TypeOfPermits.create({
    name: req.body.name,
    typeOfProcesses: req.body.typeOfProcesses
  })
    .then(result => {
      res.status(200).json({ result });
    })
    .catch(err => {
      res.status(500).json({ err });
    });
};

exports.edit = (req, res) => {
  // Save User to Database
  TypeOfPermits.update(
    {
      name: req.body.name,
      typeOfProcesses: req.body.typeOfProcesses
    },
    {
      where: {
        id: req.body.id
      }
    }
  )
    .then(result => {
      res.status(200).json({ result });
    })
    .catch(err => {
      res.status(500).json({ err });
    });
};

exports.remove = (req, res) => {
  // Save User to Database
  TypeOfPermits.update(
    {
      remove: true
    },
    {
      where: {
        id: req.body.id
      }
    }
  )
    .then(result => {
      res.status(200).json({ result });
    })
    .catch(err => {
      res.status(500).json({ err });
    });
};

exports.default = async (req, res) => {
  try {
    await TypeOfPermits.update(
      {
        default: false
      },
      {
        where: {
          default: true
        }
      }
    );

    await TypeOfPermits.update(
      {
        default: true
      },
      {
        where: {
          id: req.body.id
        }
      }
    );

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error });
  }
};
