const Sequelize = require("sequelize");

const Op = Sequelize.Op;
const bcrypt = require("bcryptjs");

const moment = require("moment");

const map = require("async/map");
const parallel = require("async/parallel");

const db = require("./../../db/models");
const User = db.User;
const Process = db.Process;
const TypeOfPermits = db.TypeOfPermits;

exports.listAll = async (req, res) => {
  try {
    let users;
    if (req.userRol === "client") {
      const users = await User.findAll({
        attributes: ["id", "fullName", "email", "rol", "typeOfUser"],
        include: [
          {
            model: TypeOfPermits
          }
        ],
        where: {
          userId: req.userId,
          remove: false
        }
      });

      // users = await user.getUsers();
      return res.status(200).send({
        users
      });
    } else {
      users = await User.findAll({
        attributes: ["id", "fullName", "email", "rol", "typeOfUser"],
        include: [
          {
            model: TypeOfPermits
          }
        ],
        where: {
          remove: false
        }
      });

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
        attributes: ["fullName", "email", "rol"]
      },
      {
        where: {
          id: req.body.id,
          remove: false
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
        remove: true
      },
      {
        where: {
          id: req.body.id
        }
      }
    );
    return res.status(200).send({
      ok: "Action success"
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
      rol: req.body.rol || "user",
      typeOfUser: req.body.typeOfUser
    });

    let typeOfPermits = await TypeOfPermits.findOne({
      where: {
        id: req.body.typeOfPermits
      }
    });

    user.setTypeOfPermit(typeOfPermits);
    if (req.userRol === "client") {
      let client = await User.findOne({
        where: {
          id: req.userId
        }
      });
      await client.setUsers(user);
    }
    return res.status(200).send({
      ok: "Action success"
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
        rol: req.body.rol || "user",
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
      ok: "Action success"
    });
  } catch (err) {
    res.status(500).send(err);
  }
};
exports.profile = async (req, res) => {
  try {
    await User.update(
      {
        fullName: req.body.fullName,
        email: req.body.email
      },
      {
        where: {
          id: req.userId
        }
      }
    );
    return res.status(200).send({
      ok: "Action success"
    });
  } catch (err) {
    res.status(500).send(err);
  }
};
exports.password = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.userId
      }
    });

    const passwordIsValid = bcrypt.compareSync(
      req.body.oldPassword,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        reason: "Invalid Password!"
      });
    }

    await User.update(
      {
        password: bcrypt.hashSync(req.body.password, 8)
      },
      {
        where: {
          id: req.userId
        }
      }
    );
    return res.status(200).send({
      ok: "Action success"
    });
  } catch (err) {
    res.status(500).send(err);
  }
};
exports.userDashboard = async (req, res) => {
  try {
    let qs = [];
    for (let i = 30; i > 0; i--) {
      if (i === 30)
        start = moment()
          .endOf("day")
          .subtract(i, "days")
          .toDate();
      if (i === 1) {
        end = moment()
          .endOf("day")
          .subtract(i - 1, "days")
          .toDate();
      }
      qs.push({
        start: moment()
          .endOf("day")
          .subtract(i, "days")
          .toDate(),
        end: moment()
          .endOf("day")
          .subtract(i - 1, "days")
          .toDate()
      });
    }

    map(
      qs,
      (item, cbm) => {
        Process.findAll({
          where: {
            createdAt: {
              [Op.lt]: item.end,
              [Op.gt]: item.start
            },
            userId: req.userId
          }
        })
          .then(docs => {
            let value = 0;
            let complete = 0;
            let status = {};

            if (docs.length) {
              docs.map(item => {
                if (item.quoteSelected && item.quoteSelected.price) {
                  value = value + item.quoteSelected.price;
                }
                if (
                  item.status === "finished" ||
                  item.status === "downloaded"
                ) {
                  complete = complete + 1;
                }
                if (status[item.status]) {
                  status[item.status] = status[item.status] + 1;
                } else {
                  status[item.status] = 1;
                }
              });
            }

            item.complete = complete;
            item.count = docs.length;
            item.value = value;
            item.status = status;
            item.start = item.start.valueOf();
            item.end = item.end.valueOf();

            cbm(null, item);
          })
          .catch(err => {
            cbm(err, null);
          });
      },
      async (err, results) => {
        if (err) {
          return res.status(500).send({
            error: err
          });
        } else {
          const process = await Process.findAll({
            where: {
              userId: req.userId
            },
            limit: 5,
            order: [["createdAt", "DESC"]]
          });

          return res.status(200).send({
            data: { process, results }
          });
        }
      }
    );

    // parallel(
    //   [
    //     cbp => {
    //       //Cantidad de Procesos en el último mes x día
    //       map(
    //         qs,
    //         (item, cbm) => {
    //           Process.count({
    //             where: {
    //               createdAt: {
    //                 [Op.lt]: item.end,
    //                 [Op.gt]: item.start
    //               },
    //               userId: req.userId
    //             }
    //           })
    //             .then(c => {
    //               item["count"] = c;
    //               item.start = item.start.valueOf();
    //               item.end = item.end.valueOf();
    //               cbm(null, item);
    //             })
    //             .catch(err => {
    //               cbm(err, null);
    //             });
    //         },
    //         (err, results) => {
    //           cbp(err, results);
    //         }
    //       );
    //     },
    //     // cbp => {
    //     //   //Cantidad de Procesos totales
    //     //   Process.count({
    //     //     where: {
    //     //       userId: req.userId
    //     //     }
    //     //   })
    //     //     .then(c => {
    //     //       cbp(null, c);
    //     //     })
    //     //     .catch(err => {
    //     //       cbp(err, null);
    //     //     });
    //     // },
    //     cbp => {
    //       //Gatos en el último mes x día
    //       map(
    //         qs,
    //         (item, cbm) => {
    //           Process.findAll({
    //             where: {
    //               createdAt: {
    //                 [Op.gt]: item.start,
    //                 [Op.lt]: item.end
    //               },
    //               userId: req.userId,
    //               quoteSelected: {
    //                 [Op.ne]: null
    //               }
    //             }
    //           })
    //             .then(docs => {
    //               let value = 0;
    //               if (docs.length) {
    //                 docs.map(item => {
    //                   value = value + item.quoteSelected.price;
    //                 });
    //               }
    //               item["value"] = value;
    //               item.start = item.start.valueOf();
    //               item.end = item.end.valueOf();
    //               cbm(null, item);
    //             })
    //             .catch(err => {
    //               cbm(err, null);
    //             });
    //         },
    //         (err, results) => {
    //           cbp(err, results);
    //         }
    //       );
    //     },
    //     cbp => {
    //       //Gatos totales
    //       Process.findAll({
    //         where: {
    //           userId: req.userId
    //         }
    //       })
    //         .then(docs => {
    //           let value = 0;
    //           let count = 0;
    //           let status = {};
    //           if (docs.length) {
    //             docs.map(item => {
    //               if (item.quoteSelected && item.quoteSelected.price) {
    //                 value = value + item.quoteSelected.price;
    //                 count++;
    //               }
    //               if (status[item.status]) {
    //                 status[item.status] = status[item.status] + 1;
    //               } else {
    //                 status[item.status] = 1;
    //               }
    //             });
    //           }
    //           cbp(null, { value, count, status });
    //         })
    //         .catch(err => {
    //           cbp(err, null);
    //         });
    //     },
    //     cbp => {
    //       Process.count({
    //         where: {
    //           createdAt: {
    //             [Op.lt]: end,
    //             [Op.gt]: start
    //           },
    //           userId: req.userId,
    //           quoteSelected: {
    //             [Op.ne]: null
    //           }
    //         }
    //       })
    //         .then(count => {
    //           cbp(null, count);
    //         })
    //         .catch(err => {
    //           cbp(err, null);
    //         });
    //     }
    //   ],
    //   // optional callback
    //   function(err, results) {
    //     if (err) {
    //       return res.status(500).send({
    //         error: err
    //       });
    //     } else {
    //       const data = {
    //         weekProcess: results[0],
    //         countProcess: results[1],
    //         countProcessComplete: results[3].count,
    //         countProcessCompleteLW: results[4],
    //         weekExpenses: results[2],
    //         totalExpenses: results[3].value,
    //         status: results[3].status
    //       };
    //       return res.status(200).send({
    //         data
    //       });
    //     }
    //   }
    // );
  } catch (err) {
    return res.status(500).send({
      error: err
    });
  }
};
exports.clientDashboard = async (req, res) => {
  try {
    return res.status(200).send({
      data: "ok"
    });
  } catch (err) {
    return res.status(500).send({
      error: err
    });
  }
};
exports.adminDashboard = async (req, res) => {
  try {
    return res.status(200).send({
      data: "ok"
    });
  } catch (err) {
    return res.status(500).send({
      error: err
    });
  }
};
