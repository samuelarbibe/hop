import firebase from "firebase/app";
import "firebase/firestore";

export default {
    //TODO:  convert to callbacks
    async getProducts() {
        const db = firebase.firestore();
        const productsRef = db.collection("products");

        const snapshot = await productsRef.where("inventory", ">", 0)
            .get();
        return snapshot.docs.map((doc) => {
            let product = doc.data();
            product.id = doc.id;
            return product;
        });
    },

    async getShippingOptions() {
        const db = firebase.firestore();
        const shippingRef = db.collection("shipping");
        const snapshot = await shippingRef
            .get();

        let promises = snapshot.docs.map(async doc => {
            let subSnapshot = await shippingRef.doc(doc.id).collection("dates").get()
            let option = doc.data();
            option.dates = subSnapshot.docs.map(subDoc => {
                const data = subDoc.data();
                return {
                    id: subDoc.id,
                    from: data.from.seconds * 1000,
                    to: data.to.seconds * 1000
                }
            });
            option.id = doc.id;
            return option;
        });

        return Promise.all(promises);
    }
}


