import shop from '../../api/shop'

// initial state
const state = () => ({
    all: [],
    isError: false,
    isLoading: false,
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
    getAllProducts({ commit, dispatch }) {
        commit('setError', false);
        commit('setLoading', true);

        shop.updateProducts({
            updateCb: (updatedProducts) => dispatch('onUpdate', updatedProducts),
            errorCb: (err) => dispatch('onUpdateErr', err),
            finallyCb: () => dispatch('afterUpdate'),
        }
        );
    },
    onUpdateErr({ commit }, err) {
        commit('setError', true);
        console.log(err);
    },
    onUpdate({ commit }, updatedProducts) {
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
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}