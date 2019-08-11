"use strict";
const nodemailer = require("nodemailer");
const _ = require("lodash");
let template = require("./emailTemplate");

const db = require("./../../db/models");
const Configuration = db.Configuration;
const CONFIG_APP = require(`./../../config/${process.env.NODE_APP}.json`);

async function main(email, status, uuid, freeUser) {
  let transporter = nodemailer.createTransport(CONFIG_APP.mailer);

  try {
    let config = await Configuration.findOne();
    let send = false;
    let type;
    if (config && config.email_notification) {
      for (let i = 0; i < config.email_notification.length; i++) {
        type = _.lowerCase(config.email_notification[i].name);
        type = _.replace(type, " ", "_");
        type = _.replace(type, "/", "_");
        if (status === type && config.email_notification[i].value) {
          if (status === "quote_ready" && freeUser) {
            send = false;
            break;
          } else {
            send = true;
            break;
          }
        }
      }
    }
    if (send || status === "received") {
      await transporter.sendMail({
        from: `"Pgweb Pangeanic 👻" <${testAccount.user}>`, // sender address
        to: `${email}`, // list of receivers
        subject: "Pgweb Pangeanic Process Status ✔", // Subject line
        text: "", // plain text body
        html: template.template(email, status, uuid, freeUser) // html body
      });
    }

    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  main
};
