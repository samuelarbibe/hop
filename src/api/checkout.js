import 'firebase/firebase-firestore';
import 'firebase/firebase-functions';

export default {

    order({ orderDetails, errorCb }) {
        return fetch(`${process.env.VUE_APP_FUNCTIONS_HOST}/order`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(orderDetails),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                return data.orderID;
            }).catch((err) => {
                console.error(err);
                errorCb(err);
            });
    },

    charge({ chargingData, successCb, errorCb }) {
        return fetch(`${process.env.VUE_APP_FUNCTIONS_HOST}/charge`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(chargingData),
        })
            .then((res) => {
                if (!res.ok) {
                    throw Error(res.statusText);
                }
                this.updateStock(chargingData);
                
                return res.json();
            }).then((details) => {
                successCb(details);
            })
            .catch((err) => {
                console.error(err);
                errorCb();
            });
    },

    updateStock(orderData) {
        return fetch(`${process.env.VUE_APP_FUNCTIONS_HOST}/updateStock`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(orderData),
        })
            .then((res) => {
                if (!res.ok) {
                    throw Error(res.statusText);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    },

    checkShippingAddress(data, actions) {
        const zipCode = data.shipping_address.postal_code;
        if (zipCode >= 61000 && zipCode <= 76104) {
            return actions.resolve();
        }
        return actions.reject();
    }
}


