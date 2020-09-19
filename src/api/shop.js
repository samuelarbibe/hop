import firebase from "firebase/app";
import "firebase/firestore";

export default {
    //TODO:  convert to callbacks
    async getProducts() {
        const db = firebase.firestore();
        const productsRef = db.collection("products");
        
        const snapshot = await productsRef
            .get();
        return snapshot.docs.map((doc) => {
            let product = doc.data();
            product.id = doc.id;
            return product;
        });
    },

    // buyProducts(products, callback, errorCallback) {
    //     // TODO: implement
    // }
}


