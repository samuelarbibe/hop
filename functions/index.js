/* eslint-disable promise/no-nesting */
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

const paypal = require('@paypal/checkout-server-sdk');

let clientId = functions.config().paypal.client_id;
let clientSecret = functions.config().paypal.client_secret;
// This sample uses SandboxEnvironment. In production, use LiveEnvironment
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
        orderID: order.result.id
      });
    }).catch((err) => {
      console.error(err);
      return res.sendStatus(500);
    });
  });
});

exports.process = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    console.log(`order ${order.id} approved. getting order details...`);

    const orderID = req.body.orderID;
    let request = new paypal.orders.OrdersGetRequest(orderID);

    return client.execute(request).then((order) => {

      // TODO: check that all the items are in stock

      const ref = db.collection('orders');
      // eslint-disable-next-line promise/no-nesting
      return ref.doc(order.id).set(order).then(() => {
        console.log(`order ${order.id} saved in database.`);
        return res.sendStatus(200);
      });
    })
      .catch((err) => {
        console.error(err);
        return res.sendStatus(500);
      });
  });
});

exports.charge = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    console.log(`order ${req.body.orderID} approved. capturing order...`);

    const orderID = req.body.orderID;

    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderID);
    captureRequest.requestBody({});

    return client.execute(captureRequest).then((capture) => {
      console.log(`order ${capture.result.id} captured.`);

      return res.status(200).json(capture.result);
    }).catch((err) => {
      console.error(`Error saving in payment: ${err}`);

      return res.sendStatus(500);
    });
  });
});

exports.updateStock = functions.https.onRequest((req, res) => {
  cors(req, res, () => {

    const orderID = req.body.orderID;
    const shipping = req.body.shipping;

    let request = new paypal.orders.OrdersGetRequest(orderID);

    return client.execute(request).then((order) => {
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

          return res.sendStatus(200);
        }).catch((err) => {
          console.error(`Error saving data in the DB: ${err}`);

          return res.status(500).send(`Error saving data in the DB: ${err}`);
        });
      }).catch((err) => {
        console.error(`Could not save order in DB: ${err}`);

        return res.status(500).send(`Could not save order in DB: ${err}`);
      });
    }).catch((err) => {
      console.error(`Error fetching order data from paypal: ${err}`);

      return res.status(500).send(`Error fetching order data from paypal: ${err}`);
    });
  });
});