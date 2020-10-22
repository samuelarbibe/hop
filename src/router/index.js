
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

router.beforeEach((to, from, next) => {
    if (to.name != 'shop' && store.state.cart.items.length == 0) next({ name: "shop" });
    next();
});

export default router;
