'use strict';
const nodemailer = require('nodemailer');
let template = require('./emailTemplate');

let testAccount = {
  user: 'ernestomr87@gmail.com',
  pass: 'Violet@r87'
};
async function main(email, status, uuid, freeUser) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  try {
    let info = await transporter.sendMail({
      from: `"Pgweb Pangeanic 👻" <${testAccount.user}>`, // sender address
      to: `${email}`, // list of receivers
      subject: 'Pgweb Pangeanic Process Status ✔', // Subject line
      text: '', // plain text body
      html: template.template(email, status, uuid, freeUser) // html body
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
module.exports = {
  main
};
