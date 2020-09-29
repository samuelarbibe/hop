import 'firebase/firebase-firestore';
import 'firebase/firebase-functions';

export default {
    order(data, errorCb) {
        return fetch(`${process.env.VUE_APP_FUNCTIONS_HOST}/order`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                return data.orderID;
            }).catch((err) => {
                console.error(err);
                errorCb(err);
            });
    },
    charge(data, actions, successCb, errorCb) {
        return fetch(`${process.env.VUE_APP_FUNCTIONS_HOST}/charge`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(() => {
                successCb();
            })
            .catch((err) => {
                console.error(err);
                errorCb();
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


