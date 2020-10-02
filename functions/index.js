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
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
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
    const shipping = req.body.shipping;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    return client.execute(request).then((capture) => {
      console.log(`order ${capture.result.id} captured.`);

      let request = new paypal.orders.OrdersGetRequest(orderID);

      return client.execute(request).then((order) => {
        console.log(`saving order ${order.result.id} in database...`);

        const batch = db.batch();
        
        console.log(`saving order...`);
        // Save order in db
        const orderRef = db.collection('orders').doc(order.result.id);
        const orderData = {
          ...order.result,
          status: 'PAYED',
          shipping: {
            id: shipping.id,
            name: shipping.name,
            title: shipping.title,
            type: shipping.type,
            date: shipping.selectedShippingDate,
          }
        };

        batch.set(orderRef, orderData);

        // Decrement items inventory
        order.result.purchase_units[0].items.forEach((item) => {
          console.log(`updating inventory for item ${item.sku}...`);
          const itemRef = db.collection('products').doc(item.sku);
          const quantity = Number(item.quantity);
          const decrement = admin.firestore.FieldValue.increment(-1 * quantity);

          batch.update(itemRef, { inventory: decrement });
        });
        
        console.log(`updating shipping inventory...`);
        // Decrement shipping inventory
        const shippingRef = db.collection('shipping').doc(shipping.id);
        const decrement = admin.firestore.FieldValue.increment(-1);
        batch.update(shippingRef, { inventory: decrement });

        return batch.commit().then(() => {
          console.log(`order ${order.result.id} saved in database.`);
          console.info(`order ${order.result.id} was successful.`);
          return res.sendStatus(200);
        }).catch((err) => {
          console.error(`Error saving data in the DB: ${err}`);
          return res.sendStatus(200);
        });
      })
    }).catch((err) => {
      console.error(err);
      return res.sendStatus(500);
    });
  });
});
