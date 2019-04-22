'use strict';
const nodemailer = require('nodemailer');
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
            config.email_notification.map((item) => {
                console.log("-------------->",item.name);
                type = _.lowerCase(item.name);
                console.log("-------------->",type);
                type = _.replace(type, ' ', '_');
                console.log("-------------->",type);
                type = _.replace(type, '/', '_');
                console.log("-------------->",type);
                if (item.name === type) send = true;
            })
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
