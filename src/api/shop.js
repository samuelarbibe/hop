import firebase from "firebase/app";
import 'firebase/firebase-firestore';
import 'firebase/firebase-functions';

export default {
    updateShopStatus({ updateCb, errorCb, finallyCb }) {
        const db = firebase.firestore();
        const statusRef = db.collection("statuses").where("name", "==", "shop");

        return statusRef.onSnapshot((snapshot) => {
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                let status = doc.data();
                status.id = doc.id;
                updateCb(status);
            } else {
                errorCb('no shop status found');
            }

        }, errorCb, finallyCb)
    },

    updateProducts({ updateCb, errorCb, finallyCb }) {
        const db = firebase.firestore();
        const productsRef = db.collection("products").where("inventory", ">", 0);

        return productsRef.onSnapshot((snapshot) => {
            let updatedProducts = [];
            snapshot.forEach((doc) => {
                let product = doc.data();
                product.id = doc.id;
                updatedProducts.push(product);
            });
            updateCb(updatedProducts);
        }, errorCb, finallyCb)
    },

    updateShippingOptions({ updateShippingCb, errorCb }) {
        const db = firebase.firestore();
        const shippingRef = db.collection("shipping").where("inventory", ">", 0);

        return shippingRef.onSnapshot((snapshot) => {
            let updatedShippingOptions = [];
            snapshot.forEach((doc) => {
                let option = doc.data();
                option.id = doc.id;
                updatedShippingOptions.push(option);
            });
            updateShippingCb(updatedShippingOptions);
        }, errorCb);
    },

    subscribeToNewsletter(email, { successCb, usedEmailCb, errorCb }) {
        const db = firebase.firestore();
        const subsRef = db.collection("subscribers");

        return subsRef.where("email", "==", email).get().then((snapshot) => {
            if (!snapshot.empty) {
                usedEmailCb();
            } else {
                subsRef.add({
                    email: email,
                    subscription_date: firebase.firestore.FieldValue.serverTimestamp(),
                }).then(() => {
                    successCb()
                }).catch((err) => {
                    errorCb(err);
                });
            }
        }).catch((err) => {
            errorCb(err);
        });
    },
}


