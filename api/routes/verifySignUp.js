const db = require("./../../db/models/index");

const User = db.User;

const checkDuplicateUserNameOrEmail = (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      res.status(400).send("Fail -> Email is already in use!");
      return;
    }
    next();
  });
};

const signUpVerify = {};
signUpVerify.checkDuplicateUserNameOrEmail = checkDuplicateUserNameOrEmail;

module.exports = signUpVerify;
