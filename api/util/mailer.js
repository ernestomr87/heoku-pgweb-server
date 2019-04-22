'use strict';
const nodemailer = require('nodemailer');
const _ = require('lodash');
let template = require('./emailTemplate');

const db = require('./../../db/models');
const Configuration = db.Configuration;


let testAccount = {
    user: "pgweb@pangeanic.com",
    pass: "santac1ara"
};

async function main(email, status, uuid, freeUser) {
    let transporter = nodemailer.createTransport({
        host: "smtp.pangeanic.com",
        port: 587,
        tls: {rejectUnauthorized: false},
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });

    try {
        let config = await Configuration.findOne();
        let send = false;
        let type;
        if (config && config.email_notification) {
            for (let i = 0; i <config.email_notification.length ; i++) {
                type = _.lowerCase(config.email_notification[i].name);
                type = _.replace(type, ' ', '_');
                type = _.replace(type, '/', '_');
                if (status === type){
                    send = true;
                    break;
                }
            }
        }
        if (send) {
            await transporter.sendMail({
                from: `"Pgweb Pangeanic 👻" <${testAccount.user}>`, // sender address
                to: `${email}`, // list of receivers
                subject: 'Pgweb Pangeanic Process Status ✔', // Subject line
                text: '', // plain text body
                html: template.template(email, status, uuid, freeUser) // html body
            });
        }


        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = {
    main
};
