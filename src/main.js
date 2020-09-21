import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase/app';
import store from './store'
import router from './router'
import VueToast from 'vue-toast-notification';
import VueScrollTo from 'vue-scrollto';
import 'vue-toast-notification/dist/theme-default.css';
import "firebase/analytics";
import './../node_modules/bulma/css/bulma.css';
import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bulma-social/bin/bulma-social.min.css';

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyD86UgZH4dSKIxaJj3MwKzC7HozhkDMI4U",
  authDomain: "hop-tlv.firebaseapp.com",
  databaseURL: "https://hop-tlv.firebaseio.com",
  projectId: "hop-tlv",
  storageBucket: "hop-tlv.appspot.com",
  messagingSenderId: "1050183563912",
  appId: "1:1050183563912:web:74749496d04c1f4f09fd3d",
  measurementId: "G-31CKE5143V"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

if (process.env.NODE_ENV !== 'development') {
  firebase.analytics();
}

Vue.prototype.$analytics = firebase.analytics();
Vue.use(VueToast);
Vue.use(VueScrollTo);

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
