const db = require("./../../db/models/index");

const User = db.User;

const checkDuplicateUserNameOrEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
        remove: false
      }
    });

    if (user) {
      res.status(400).send("Fail -> Email is already in use!");
    } else {
      next();
    }
  } catch (error) {
    res.status(500).send(err);
  }
};

const signUpVerify = {};
signUpVerify.checkDuplicateUserNameOrEmail = checkDuplicateUserNameOrEmail;

module.exports = signUpVerify;
