import firebase from "firebase/app";
import 'firebase/firebase-firestore';
import 'firebase/firebase-functions';

export default {
    updateProducts({ updateCb, errorCb, finallyCb }) {
        const db = firebase.firestore();
        const productsRef = db.collection("products").where("inventory", ">", 0);

        productsRef.onSnapshot((snapshot) => {
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

        shippingRef.onSnapshot((snapshot) => {
            let updatedShippingOptions = [];
            snapshot.forEach((doc) => {
                let option = doc.data();
                option.dates = option.dates.map((date) => {
                    return {
                        id: date.id,
                        from: date.from.seconds * 1000,
                        to: date.to.seconds * 1000
                    }
                });
                option.id = doc.id;
                updatedShippingOptions.push(option);
            });
            updateShippingCb(updatedShippingOptions);
        }, errorCb);
    },

    subscribeToNewsletter(email, { successCb, usedEmailCb, errorCb }) {
        const db = firebase.firestore();
        const subsRef = db.collection("subscribers");

        subsRef.where("email", "==", email).get().then((snapshot) => {
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


