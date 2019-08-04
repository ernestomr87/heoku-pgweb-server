const db = require("../../db/models");
const BillingInformation = db.BillingInformation;
const User = db.User;

exports.get = async (req, res) => {
  let uid = null;
  if (req.userRol === "admin") {
    uid = req.query.userId;
  }
  if (req.userRol === "client" || (req.userRol === "user" && !req.hasClient)) {
    uid = req.userId;
  }
  if (req.userRol === "user" && req.hasClient) {
    uid = req.hasClient;
  }

  const bi = await BillingInformation.findOne({
    where: {
      UserId: uid
    }
  });

  if (bi.id) {
    return res.status(200).send({
      data: {
        id: bi.id,
        name: bi.name,
        address: bi.address,
        country: bi.country,
        vattax: bi.vattax
      }
    });
  } else {
    return res.status(200).send({
      data: {
        name: "",
        address: "",
        country: "ES",
        vattax: ""
      }
    });
  }

  return res.status(403).json({
    error: "Forbidden !!"
  });
};

exports.add = async (req, res) => {
  try {
    const name = req.body.name;
    const address = req.body.address;
    const country = req.body.country;
    const continent = req.body.continent;
    const vattax = req.body.vattax;

    const billingInfo = await BillingInformation.create({
      name: name,
      address: address,
      country: country,
      continent: continent,
      vattax: vattax //VAT/TAX number
    });

    let userId = null;
    if (req.userRol === "admin") {
      userId = req.body.userId;
    }
    if (
      req.userRol === "client" ||
      (req.userRol === "user" && !req.hasClient)
    ) {
      userId = req.userId;
    }

    const user = await User.findByPk(userId);
    user.setBillingInformation(billingInfo);

    return res.status(200).send({
      data: "ok"
    });
  } catch (error) {}
};

exports.edit = async (req, res) => {
  try {
    const id = req.body.id;
    const name = req.body.name;
    const address = req.body.address;
    const country = req.body.country;
    const continent = req.body.continent;
    const vattax = req.body.vattax;

    let userId = null;
    if (req.userRol === "admin") {
      userId = req.body.userId;
    }
    if (
      req.userRol === "client" ||
      (req.userRol === "user" && !req.hasClient)
    ) {
      userId = req.userId;
    }

    await BillingInformation.update(
      {
        name: name,
        address: address,
        country: country,
        continent: continent,
        vattax: vattax //VAT/TAX number
      },
      {
        where: {
          id: id,
          UserId: userId
        }
      }
    );

    return res.status(200).send({
      data: "ok"
    });
  } catch (error) {}
};
