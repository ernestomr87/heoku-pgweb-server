"use strict";

var db = require('./../../db/models/index');

var User = db.User;
var Role = db.Role;

var checkDuplicateUserNameOrEmail = function checkDuplicateUserNameOrEmail(req, res, next) {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(function (user) {
    if (user) {
      res.status(400).send('Fail -> Email is already in use!');
      return;
    }

    next();
  });
}; // const checkRolesExisted = (req, res, next) => {
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


var signUpVerify = {};
signUpVerify.checkDuplicateUserNameOrEmail = checkDuplicateUserNameOrEmail; // signUpVerify.checkRolesExisted = checkRolesExisted;

module.exports = signUpVerify;