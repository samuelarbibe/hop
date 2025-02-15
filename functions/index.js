/* eslint-disable promise/no-nesting */
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const nodemailer = require('nodemailer');

const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

const paypal = require('@paypal/checkout-server-sdk');

let clientId = functions.config().paypal.client_id;
let clientSecret = functions.config().paypal.client_secret;

let environment = (process.env.FUNCTIONS_EMULATOR === 'true')
  ? new paypal.core.SandboxEnvironment(clientId, clientSecret)
  : new paypal.core.LiveEnvironment(clientId, clientSecret);

let client = new paypal.core.PayPalHttpClient(environment);

exports.order = functions.https.onRequest((req, res) => {
  cors(req, res, () => {

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody(req.body);

    console.log(`creating order...`);

    return client.execute(request).then((order) => {
      console.log(`order ${order.result.id} created.`);
      return res.status(200).json({
        orderId: order.result.id
      });
    }).catch((err) => {
      console.error(err);
      return res.sendStatus(500);
    });
  });
});

exports.charge = functions.https.onRequest((req, res) => {
  cors(req, res, () => {

    console.log(`order ${req.body.orderId} approved. capturing order...`);

    const orderId = req.body.orderId;

    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId);
    captureRequest.requestBody({});

    return client.execute(captureRequest).then((capture) => {
      console.log(`order ${capture.result.id} captured.`);

      updateStock(req.body);
      // sendConfirmationEmail(capture.result);

      return res.status(200).json(capture.result);
    }).catch((err) => {
      console.error(`Error saving in payment: ${err}`);

      return res.sendStatus(500);
    });
  });
});

function updateStock({ orderId, shipping }) {

  let request = new paypal.orders.OrdersGetRequest(orderId);

  client.execute(request).then((order) => {
    console.log(`saving order ${order.result.id} in database...`);

    const batch = db.batch();

    console.log(`saving order...`);
    const orderRef = db.collection('orders').doc(order.result.id);

    return orderRef.get().then((doc) => {
      if (doc.exists) {
        throw Error('order already registered.');
      }

      const orderData = {
        ...order.result,
        status: 'PAYED',
        shipping: {
          id: shipping.id,
          name: shipping.name,
          title: shipping.title,
          type: shipping.type,
          date: shipping.date,
        }
      };

      batch.set(orderRef, orderData);

      order.result.purchase_units[0].items.forEach((item) => {
        console.log(`updating inventory for item ${item.sku}...`);
        const itemRef = db.collection('products').doc(item.sku);
        const quantity = Number(item.quantity);
        const decrement = admin.firestore.FieldValue.increment(-1 * quantity);

        batch.update(itemRef, { inventory: decrement });
      });

      console.log(`updating shipping inventory...`);
      const shippingRef = db.collection('shipping').doc(shipping.id);
      const decrement = admin.firestore.FieldValue.increment(-1);

      batch.update(shippingRef, { inventory: decrement });

      return batch.commit().then(() => {
        console.log(`order ${order.result.id} saved in database.`);
        console.info(`order ${order.result.id} was successful.`);

        return;
      }).catch((err) => {
        console.error(`Error saving data in the DB: ${err}`);
      });
    }).catch((err) => {
      console.error(`Could not save order in DB: ${err}`);
    });
  }).catch((err) => {
    console.error(`Error fetching order data from paypal: ${err}`);
  });
}

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.username,
    pass: functions.config().email.password
  }
});

function sendConfirmationEmail(orderCapture) {

  let dest = orderCapture.payer.email_address;
  dest = 'samuel.arbibe@gmail.com';

  const mailOptions = {
    sendmail: true,
    from: `HOP TLV <${functions.config().email.username}>`,
    to: dest,
    subject: 'Order Confirmation',
    text: 'Your order has been recieved. A paypal email has been sent to you with the details.'
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(`Could not send confirmation mail for order ${orderCapture.id}: ${err.message}`);
    } else {
      console.log(`Confirmation mail successfully sent for order ${orderCapture.id}`);
    }
  });
}
