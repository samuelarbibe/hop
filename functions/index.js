const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

const paypal = require('@paypal/checkout-server-sdk');
// 1. Set up your server to make calls to PayPal

// 1b. Import the PayPal SDK client that was created in `Set up Server-Side SDK`.
/**
 *
 * PayPal HTTP client dependency
 */
let clientId = "AfmG4QqEw-HCpIVoa0onYWSoeZAtRgXIPoe4_HNF1g_PGrG1PXkC_i8zQZYBFryvVdrL2XNU2kezJJ8l";
let clientSecret = "EJNakZWPH-6QoxbPL6B8rIjhO4Q2gPHU19EOCmG_lOupcr1WIVzEN5Vn2BM82bYVeDGpUfnzU2y6rI7-";
// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);


// 2. Set up your server to receive a call from the client
exports.checkout = functions.https.onRequest((req, res) => {
  // 3. Call PayPal to set up a transaction
  cors(req, res, () => {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'ILS',
          value: '220.00'
        }
      }]
    });

    return client.execute(request).then((order) => {
      return res.status(200).json({
        orderID: order.result.id
      });
    }).catch((err) => {
      console.error(err);
      return res.send(500);
    });
  });
});
