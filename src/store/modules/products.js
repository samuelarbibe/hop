import shop from '../../api/shop'

// initial state
const state = () => ({
    all: [],
    isError: false,
    isLoading: false,
})

// getters
const getters = {}

// actions
const actions = {
    getAllProducts({ commit }) {
        commit('setError', false);
        commit('setLoading', true);

        shop.getProducts().then((products) => {
            commit('setProducts', products)
        }).catch((err) => {
            commit('setError', true);
            console.log(err);
        }).finally(() => {
            commit('setLoading', false)
        });
    }
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