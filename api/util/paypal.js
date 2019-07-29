var paypal = require("paypal-rest-sdk");
const db = require("./../../db/models");
const Process = db.Process;
const externalApi = require("./../external_api/api");
const env = process.env.NODE_ENV || "production";
const config = require("./../../config/config.json")[env];

const pay = async (req, res) => {
  const uuid = req.body.uuid;
  const quote = req.body.quote;
  if (!uuid || !quote) {
    if (req.userId) {
      return res.redirect(`${config.BASE}/dashboard/404`);
    } else {
      return res.redirect(`${config.BASE}/404`);
    }
  }

  const process = await Process.findOne({
    where: {
      uuid: uuid
    }
  });

  const selected = process.quotes.filter(item => {
    return item.optionid === parseInt(quote);
  });

  if (!selected || !selected.length) {
    if (req.userId) {
      return res.redirect(`${config.BASE}/dashboard/404`);
    } else {
      return res.redirect(`${config.BASE}/404`);
    }
  }

  paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id:
      "AfPicIIQ1ojiVJmbG4IxNexzRx0MoaN1lQquHiTTcYC1s3biDk9c-bwjSP4dd-Y1OHPjlU1y-nfZS6st",
    client_secret:
      "ENCfTk5hKDGJLzdxEPtwH8lBgOBL1rfi4PqwRbGW0f3WOs2zBhwW0lLks0qzqCpnNJrLddY5-nimpBm1"
  });

  let return_url;
  let cancel_url;

  if (req.userId) {
    return_url = `${config.BASE}/api/payment/${uuid}/${quote}/return`;
    cancel_url = `${config.BASE}/api/payment/${uuid}/cancel`;
  } else {
    return_url = `${config.BASE}/api/payment/${uuid}/${quote}/return_free`;
    cancel_url = `${config.BASE}/api/payment/${uuid}/cancel_free`;
  }

  var create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal"
    },
    redirect_urls: {
      return_url: return_url,
      cancel_url: cancel_url
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: `${process.processName}--${process.fileName}`,
              sku: process.id,
              price: selected[0].price.toFixed(2),
              currency: "EUR",
              quantity: 1
            }
          ]
        },
        amount: {
          currency: "EUR",
          total: selected[0].price.toFixed(2)
        },
        description: selected[0].option
      }
    ]
  };

  paypal.payment.create(create_payment_json, function(error, payment) {
    if (error) {
      if (req.userId) {
        res.redirect(`${config.BASE}/dashboard/process-services/${uuid}/error`);
      } else {
        res.redirect(`${config.BASE}?pay=error&uuid=${uuid}`);
      }
    } else {
      //capture HATEOAS links
      var links = {};
      payment.links.forEach(function(linkObj) {
        links[linkObj.rel] = {
          href: linkObj.href,
          method: linkObj.method
        };
      });

      //if redirect url present, redirect user
      if (links.hasOwnProperty("approval_url")) {
        res.redirect(links["approval_url"].href);
      } else {
        if (req.userId) {
          res.redirect(
            `${config.BASE}/dashboard/process-services/${uuid}/error`
          );
        } else {
          res.redirect(`${config.BASE}?pay=error&uuid=${uuid}`);
        }
      }
    }
  });
};

const execute = async (req, res) => {
  const uuid = req.params.uuid;
  const quote = req.params.quote;
  const token = req.query.token;
  const paymentId = req.query.paymentId;
  const payerId = { payer_id: req.query.PayerID };

  if (!uuid || !paymentId || !payerId) {
    if (req.freeUser) {
      res.redirect(`${config.BASE}/404`);
    } else {
      res.redirect(`${config.BASE}/dashboard/404`);
    }
  } else {
    paypal.payment.execute(paymentId, payerId, async (error, payment) => {
      if (error) {
        if (req.freeUser) {
          res.redirect(`${config.BASE}?pay=error&uuid=${doc.uuid}`);
        } else {
          res.redirect(
            `${config.BASE}/dashboard/process-services/${uuid}/error`
          );
        }
      } else {
        if (payment.state == "approved") {
          const doc = await Process.findOne({
            where: {
              uuid: uuid
            }
          });

          const selected = doc.quotes.filter(item => {
            return item.optionid === parseInt(quote);
          });

          if (!selected || !selected.length) {
            if (req.freeUser) {
              res.redirect(`${config.BASE}/404`);
            } else {
              res.redirect(`${config.BASE}/dashboard/404`);
            }
          }

          selected[0].paymentId = paymentId;
          selected[0].payerId = req.query.PayerID;
          selected[0].token = token;

          await Process.update(
            {
              quoteSelected: selected[0]
            },
            {
              where: {
                uuid: uuid
              },
              returning: true,
              plain: true
            }
          );

          await externalApi.processFileAfterQuoteFile(doc.fileId, quote);

          if (req.freeUser) {
            res.redirect(`${config.BASE}?pay=success&fileId=${doc.fileId}`);
          } else {
            res.redirect(
              `${config.BASE}/dashboard/process-services/${doc.fileId}/success`
            );
          }
        } else {
          if (req.freeUser) {
            res.redirect(`${config.BASE}?pay=error&uuid=${doc.uuid}`);
          } else {
            res.redirect(
              `${config.BASE}/dashboard/process-services/${doc.uuid}/error`
            );
          }
        }
      }
    });
  }
};

module.exports = {
  pay,
  execute
};
