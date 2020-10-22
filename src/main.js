import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase/app';
import store from './store'
import router from './router'
import VueToast from 'vue-toast-notification';
import VueScrollTo from 'vue-scrollto';
import VueSweetalert2 from 'vue-sweetalert2';
import VueCarousel from 'vue-carousel';
import "firebase/analytics";
import 'vue-toast-notification/dist/theme-default.css';
import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_CONFIG_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_CONFIG_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_CONFIG_DB_URL,
  projectId: process.env.VUE_APP_FIREBASE_CONFIG_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_CONFIG_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_CONFIG_MSG_ID,
  appId: process.env.VUE_APP_FIREBASE_CONFIG_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_CONFIG_MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);

if (process.env.NODE_ENV !== 'development') {
  firebase.analytics();
}

Vue.prototype.$analytics = firebase.analytics();
Vue.use(VueToast);
Vue.use(VueScrollTo);
Vue.use(VueSweetalert2);
Vue.use(VueCarousel);

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
