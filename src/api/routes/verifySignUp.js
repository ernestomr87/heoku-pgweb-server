const db = require('./../../db/models/index');

const User = db.User;
const Role = db.Role;

const checkDuplicateUserNameOrEmail = (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      res.status(400).send('Fail -> Email is already in use!');
      return;
    }
    next();
  });
};

// const checkRolesExisted = (req, res, next) => {
//   for (let i = 0; i < req.body.roles.length; i++) {
//     if (!ROLEs.includes(req.body.roles[i].toUpperCase())) {
//       res
//         .status(400)
//         .send('Fail -> Does NOT exist Role = ' + req.body.roles[i]);
//       return;
//     }
//   }
//   next();
// };

const signUpVerify = {};
signUpVerify.checkDuplicateUserNameOrEmail = checkDuplicateUserNameOrEmail;
// signUpVerify.checkRolesExisted = checkRolesExisted;

module.exports = signUpVerify;