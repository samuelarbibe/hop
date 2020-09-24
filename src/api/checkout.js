import 'firebase/firebase-firestore';
import 'firebase/firebase-functions';

export default {
    order(data,  errorCb) {
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
                console.log(err);
                errorCb(err);
            });
    },
    charge(data, successCb, errorCb) {
        return fetch(`${process.env.VUE_APP_FUNCTIONS_HOST}/charge`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(function () {
                successCb();
            })
            .catch((err) => {
                console.log(err);
                errorCb();
            });
    },
}


