var paypal = require("paypal-rest-sdk");

const pay = async (req, res) => {
  paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id:
      "AXy5cDc_WO6r1wBrjAx6UYFN2Z9p3X1OQdquzb2FJbAZA5LCfFPZK9ezDwhVZhKbtXivmzaq7iZhZkbZ",
    client_secret:
      "EPgXpTNIz-93NwL_jNxKpEexaq74c12fjSlNsatyxI6dUTh4tqVShRx3k4VL7gMJz9Gs4x6pUnfE8xnH"
  });

  var create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal"
    },
    redirect_urls: {
      return_url: "http://localhost:3000/api/return",
      cancel_url: "http://localhost:3000/api/cancel"
    },
    transactions: [
      {
        // "item_list": {
        //     "items": [{
        //         "name": "item",
        //         "sku": "item",
        //         "price": "1.00",
        //         "currency": "USD",
        //         "quantity": 1
        //     }]
        // },
        amount: {
          currency: "EUR",
          total: "1.00"
        },
        description: "This is the payment description."
      }
    ]
  };
  //   const response = paypal.payment.create(create_payment_json);

  paypal.payment.create(create_payment_json, (error, transaction) => {
    if (error) {
      if(req.userId){
        return res.redirect("");
      }else{
        return res.redirect("");
      }
      
    } else {
      var id = transaction.id;
      var links = transaction.links;
      var counter = links.length;
      while (counter--) {
        if (links[counter].method == "REDIRECT") {
          // redirect to paypal where user approves the transaction
          return res.redirect(links[counter].href);
        }
      }
    }
  });
};

module.exports = {
  pay
};
