
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Shop from '../views/Shop.vue';
import Shipping from '../components/Shipping.vue';
import Checkout from '../components/Checkout.vue';
import store from "../store/index.js";

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        { path: '', name: 'shop', component: Shop },
        {
            path: '/shipping',
            name: 'shipping',
            component: Shipping,
            beforeEnter(to, from, next) {
                if (store.state.cart.items.length == 0) next({ name: "shop" });
                next();
            },
        },
        {
            path: '/checkout',
            name: 'checkout',
            component: Checkout,
            beforeEnter: (to, from, next) => {
                if (from.name != 'shipping') next({ name: 'shipping' });
                else next()
            }
        },
    ]
});

export default router;
