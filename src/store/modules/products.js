import shop from '../../api/shop'

// initial state
const state = () => ({
    all: [],
    isError: false,
    isLoading: false,
    unsubscribe: null,
})

// getters
const getters = {
    pastaProducts: (state) => {
        return state.all.filter(product => product.category === "pasta");
    },
    otherProducts: (state) => {
        return state.all.filter(product => product.category !== "pasta");
    }
}

// actions
const actions = {
    loadProducts({ commit, dispatch }) {
        commit('setError', false);
        commit('setLoading', true);

        const unsubscribe = shop.updateProducts({
            updateCb: (updatedProducts) => dispatch('onUpdate', updatedProducts),
            errorCb: (err) => dispatch('onUpdateErr', err),
            finallyCb: () => dispatch('afterUpdate'),
        }
        );

        commit('setUnsubscribe', unsubscribe);
    },

    unloadProducts({ commit, state }) {
        if (state.unsubscribe != null) {
            console.log('unsubscribed from products');
            state.unsubscribe();
            commit('setProducts', []);
        }
    },

    onUpdateErr({ commit }, err) {
        commit('setError', true);
        console.log(err);
    },

    onUpdate({ commit, rootState, dispatch }, updatedProducts) {
        let invalidCartQuantity = false;
        rootState.cart.items.forEach((item) => {
            const product = updatedProducts.find(product => product.id === item.id);
            if (product === undefined) {
                dispatch('cart/setProductQuantity', { product: item, quantity: 0 }, { root: true });
                invalidCartQuantity = true;
            }
            else if (item.quantity > product.inventory) {
                dispatch('cart/setProductQuantity', { product: item, quantity: product.inventory }, { root: true });
                invalidCartQuantity = true;
            }
        });
        if (invalidCartQuantity) {
            commit('cart/setIsCartSynced', false, { root: true });
        }
        console.log('products updated');
        commit('setProducts', updatedProducts);
        commit('setLoading', false);
    },
}

// mutations
const mutations = {
    setError(state, isError) {
        state.isError = isError
    },

    setLoading(state, isLoading) {
        state.isLoading = isLoading
    },

    setProducts(state, products) {
        state.all = products
    },

    decrementProductInventory(state, { id }) {
        const product = state.all.find(product => product.id === id)
        product.inventory--
    },

    setUnsubscribe(state, unsubscribe) {
        state.unsubscribe = unsubscribe;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}