
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Shop from './views/Shop.vue';
import Shipping from './components/Shipping.vue';
import Payment from './components/Payment.vue';
import Approved from './components/Approved.vue';
import store from "./store/index.js";

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        { path: '', name: 'home', component: Shop },
        {
            path: '/shipping',
            name: 'shipping',
            component: Shipping,
            beforeEnter(to, from, next) {
                if (store.state.cart.items.length == 0) next({ name: "home" });
                next();
            },
        },
        {
            path: '/payment',
            name: 'payment',
            component: Payment,
            beforeEnter: (to, from, next) => {
                if (from.name != 'shipping') next({ name: 'shipping' });
                else next()
            }
        },
        {
            path: '/approved',
            name: 'approved',
            component: Approved,
            beforeEnter: (to, from, next) => {
                if (from.name != 'payment') next({ name: 'payment' });
                else next()
            }
        },
    ]
});

export default router;
