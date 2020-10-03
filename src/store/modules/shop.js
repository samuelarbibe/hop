import shop from '../../api/shop'

// initial state
const state = () => ({
    status: null,
    isError: false,
    isLoading: false,
})

// getters
const getters = {
    isShopOpen(state) {
        return state.status.is_open;
    }
}

// actions
const actions = {
    loadShopStatus({ commit, dispatch }) {
        commit('setError', false);
        commit('setLoading', true);

        shop.subscribeToShopStatus({
            updateCb: (status) => dispatch('onUpdate', status),
            errorCb: (err) => dispatch('onUpdateErr', err),
        }
        );
    },

    onUpdateErr({ commit }, err) {
        commit('setError', true);
        console.log(err);
    },

    onUpdate({ commit }, status) {
        console.log('shop status updated');
        commit('setStatus', status);
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

    setStatus(state, status) {
        state.status = status;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}