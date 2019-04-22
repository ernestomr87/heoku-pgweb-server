('use strict');

const db = require('./../../db/models');
const Configuration = db.Configuration;

module.exports = {
    getConfiguration: async (req, res) => {
        try {
            const configuration = await Configuration.findOne();

            return res.status(200).send({
                configuration
            });
        } catch (err) {
            res.status(500).json({
                error: err
            });
        }
    },
    setPaypal: async (req, res) => {
        try {
            let query = {
                mode: req.body.mode,
                client_id: req.body.client_id,
                client_secret: req.body.client_secret,
            };

            const config = await Configuration.findAll();

            if (config.length) {
                const config = await Configuration.findOne();
                await Configuration.update(
                    query,
                    {
                        where: {
                            id: config.id
                        }
                    }
                );

                return res.status(200).send({
                    response: 'success'
                });
            } else {
                await Configuration.create({
                    mode: req.body.mode,
                    client_id: req.body.client_id,
                    client_secret: req.body.client_secret,
                    email_notification: {}
                })
                return res.status(200).send({
                    response: 'success'
                });
            }


        } catch (err) {
            res.status(500).json({
                error: err
            });
        }
    },
    setEmailNotification: async (req, res) => {
        try {
            let query = {
                email_notification: req.body.email_notification,
            };

            const config = await Configuration.findAll();

            if (config.length) {
                const config = await Configuration.findOne();
                await Configuration.update(
                    query,
                    {
                        where: {
                            id: config.id
                        }
                    }
                );

                return res.status(200).send({
                    response: 'success'
                });
            } else {
                await Configuration.create({
                    mode: 'sandbox',
                    client_id: "",
                    client_secret: "",
                    email_notification: req.body.email_notification
                })
                return res.status(200).send({
                    response: 'success'
                });
            }


        } catch (err) {
            res.status(500).json({
                error: err
            });
        }
    },
};