
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import PastaGrid from './components/PastaGrid.vue';
import Cart from './components/Cart.vue';

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        { path: '', name: 'home', component: PastaGrid },
        { path: '/cart', name: 'cart', component: Cart },
    ]
});

export default router;
