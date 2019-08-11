var paypal = require("paypal-rest-sdk");
const db = require("./../../db/models");
const Process = db.Process;
const BillingInformation = db.BillingInformation;
const externalApi = require("./../external_api/api");
const commom = require("./../../config/common");

const calculatePrice = (price, applyTax) => {
  let aux = price.toFixed(2);
  if (aux === "0.00") aux = "0.01";

  if (applyTax) {
    const tax = ((parseFloat(aux) * 21) / 100).toFixed(2);
    aux = parseFloat(aux) + parseFloat(tax);
  }
  return aux;
};

const pay = async (req, res) => {
  const uuid = req.body.uuid;
  const quote = req.body.quote;

  const billing = req.body.billing ? JSON.parse(req.body.billing) : null;
  const applyTax = billing
    ? billing.continent === "EU"
      ? true
      : false
    : false;

  if (!uuid || !quote) {
    if (req.userId) {
      return res.redirect(commom.urls.register_404);
    } else {
      return res.redirect(commom.urls.casual_404);
    }
  }

  const process = await Process.findOne({
    where: {
      uuid: uuid
    }
  });

  if (billing) {
    const billingInfo = await BillingInformation.create({
      name: billing.name,
      address: billing.address,
      country: billing.country,
      continent: billing.continent,
      vattax: billing.vattax //VAT/TAX number
    });
    await billingInfo.setProcess(process);
  }

  const selected = process.quotes.filter(item => {
    return item.optionid === parseInt(quote);
  });

  if (!selected || !selected.length) {
    if (req.userId) {
      return res.redirect(commom.urls.register_404);
    } else {
      return res.redirect(commom.urls.casual_404);
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
    return_url = `${commom.urls.base}/api/payment/${uuid}/${quote}/return`;
    cancel_url = `${commom.urls.base}/api/payment/${uuid}/cancel`;
  } else {
    return_url = `${commom.urls.base}/api/payment/${uuid}/${quote}/return_free`;
    cancel_url = `${commom.urls.base}/api/payment/${uuid}/cancel_free`;
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
              price: calculatePrice(selected[0].price, applyTax),
              currency: "EUR",
              quantity: 1
            }
          ]
        },
        amount: {
          currency: "EUR",
          total: calculatePrice(selected[0].price, applyTax)
        },
        description: selected[0].option
      }
    ]
  };

  paypal.payment.create(create_payment_json, function(error, payment) {
    if (error) {
      if (req.userId) {
        res.redirect(commom.urls.register_404);
      } else {
        res.redirect(commom.urls.casual_404);
      }
    } else {
      var links = {};
      payment.links.forEach(function(linkObj) {
        links[linkObj.rel] = {
          href: linkObj.href,
          method: linkObj.method
        };
      });

      if (links.hasOwnProperty("approval_url")) {
        res.redirect(links["approval_url"].href);
      } else {
        if (req.userId) {
          res.redirect(commom.urls.register_404);
        } else {
          res.redirect(commom.urls.casual_404);
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
      res.redirect(commom.urls.casual_404);
    } else {
      res.redirect(commom.urls.register_404);
    }
  } else {
    paypal.payment.execute(paymentId, payerId, async (error, payment) => {
      if (error) {
        if (req.freeUser) {
          res.redirect(commom.urls.casual_error(uuid));
        } else {
          res.redirect(commom.urls.register_error(uuid));
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
              res.redirect(commom.urls.casual_404);
            } else {
              res.redirect(commom.urls.register_404);
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
            res.redirect(commom.urls.casual_success(doc.fileId));
          } else {
            res.redirect(commom.urls.register_success(doc.fileId));
          }
        } else {
          if (req.freeUser) {
            res.redirect(commom.urls.casual_error(uuid));
          } else {
            res.redirect(commom.urls.register_error(uuid));
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
