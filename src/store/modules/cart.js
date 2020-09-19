import shop from '../../api/shop'

const state = () => ({
  items: [],
  checkoutStatus: null
})

const getters = {
  cartProducts: (state, getters, rootState) => {
    return state.items.map(({ id, quantity }) => {
      const product = rootState.products.all.find(product => product.id === id)
      return {
        ...product,
        quantity
      }
    })
  },

  cartTotalPrice: (state, getters) => {
    return getters.cartProducts.reduce((total, product) => {
      return total + product.price * product.quantity
    }, 0)
  }
}

const actions = {
  checkout({ commit, state }, products) {
    const savedCartItems = [...state.items]
    commit('setCheckoutStatus', null)
    // empty cart
    commit('setCartItems', { items: [] })
    shop.buyProducts(
      products,
      () => commit('setCheckoutStatus', 'successful'),
      () => {
        commit('setCheckoutStatus', 'failed')
        commit('setCartItems', { items: savedCartItems })
      }
    )
  },

  addProductToCart({ state, commit }, product) {
    commit('setCheckoutStatus', null)
    if (product.inventory > 0) {
      const cartItem = state.items.find(item => item.id === product.id)
      if (!cartItem) {
        if (product.inventory > 1) {
          commit('pushProductToCart', { id: product.id })
        }
      } else {
        if (cartItem.quantity < product.inventory) {
          commit('incrementItemQuantity', cartItem)
        }
      }
    }
  },
  incrementProductQuantity({ commit }, product) {
    commit('incrementItemQuantity', { id: product.id });
  },
  decrementProductQuantity({ commit }, product) {
    commit('decrementItemQuantity', { id: product.id });
  },
  removeProductFromCart({ commit }, product) {
    commit('removeProductFromCart', { id: product.id });
  }
}

// mutations
const mutations = {
  pushProductToCart(state, { id }) {
    state.items.push({
      id,
      quantity: 1
    })
  },

  removeProductFromCart(state, { id }) {
    state.items = state.items.filter(item => item.id != id);
  },

  decrementItemQuantity(state, { id }) {
    const cartItem = state.items.find(item => item.id === id)
    cartItem.quantity--;
  },

  incrementItemQuantity(state, { id }) {
    const cartItem = state.items.find(item => item.id === id)
    cartItem.quantity++;
  },

  setCartItems(state, { items }) {
    state.items = items
  },

  setCheckoutStatus(state, status) {
    state.checkoutStatus = status
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}