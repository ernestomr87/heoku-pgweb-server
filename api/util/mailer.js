'use strict';
const nodemailer = require('nodemailer');
let template = require('./emailTemplate');

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
        await transporter.sendMail({
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
