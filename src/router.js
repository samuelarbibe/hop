
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Shop from './views/Shop.vue';
import Shipping from './components/Shipping.vue';
import Payment from './components/Payment.vue';
import Approved from './components/Approved.vue';

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        { path: '', name: 'home', component: Shop },
        {
            path: '/shipping',
            name: 'shipping',
            component: Shipping,
        },
        {
            path: '/payment',
            name: 'payment',
            component: Payment,
        },
        {
            path: '/approved',
            name: 'approved',
            component: Approved,
        },
    ]
});

export default router;
