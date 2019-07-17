var paypal = require("paypal-rest-sdk");
const db = require("./../../db/models");
const Process = db.Process;
const externalApi = require("./../external_api/api");

const BASE = "http://localhost:3000";
// const BASE_PAY = "http://localhost:3002/api/payment";
const BASE_PAY = "http://pgweb.pangeamt.com:3002/api/payment";

const pay = async (req, res) => {
  const uuid = req.body.uuid;
  const quote = req.body.quote;
  if (!uuid || !quote) {
    return res.redirect("/dashboard/404");
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
    return res.redirect("/dashboard/404");
  }

  paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id:
      "AfPicIIQ1ojiVJmbG4IxNexzRx0MoaN1lQquHiTTcYC1s3biDk9c-bwjSP4dd-Y1OHPjlU1y-nfZS6st",
    client_secret:
      "ENCfTk5hKDGJLzdxEPtwH8lBgOBL1rfi4PqwRbGW0f3WOs2zBhwW0lLks0qzqCpnNJrLddY5-nimpBm1"
  });

  var create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal"
    },
    redirect_urls: {
      return_url: `${BASE_PAY}/${uuid}/${quote}/return`,
      cancel_url: `${BASE_PAY}/${uuid}/cancel`
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
      res.redirect(`/dashboard/process-services/${uuid}/error`);
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
        res.redirect(`/dashboard/process-services/${uuid}/error`);
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
    res.redirect(`/dashboard/404`);
  } else {
    paypal.payment.execute(paymentId, payerId, async (error, payment) => {
      if (error) {
        res.redirect(`/dashboard/process-services/${uuid}/error`);
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
            return res.redirect(`/dashboard/404`);
          }

          selected[0].paymentId = paymentId;
          selected[0].payerId = payerId;
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

          res.redirect(
            `/dashboard/process-services/${doc.fileId}/success`
          );
        } else {
          res.redirect(`/dashboard/process-services/${doc.uuid}/error`);
        }
      }
    });
  }
};

module.exports = {
  pay,
  execute
};
