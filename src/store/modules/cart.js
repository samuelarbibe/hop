import shop from '../../api/shop'

const state = () => ({
  items: [],
  shippingOptions: [],
  checkoutStatus: null,
  selectedShippingOption: null,
  saveToLocalStorage: true,
  isError: false,
  isLoading: false,
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

  cartSubtotalPrice: (state, getters) => {
    return getters.cartProducts.reduce((total, product) => {
      return total + product.price * product.quantity
    }, 0)
  },

  cartDeliveryPrice: (state, getters) => {
    const price = state.selectedShippingOption.price;
    if (price > 0) {
      const freeAbove = state.selectedShippingOption.free_above;
      if (getters.cartSubtotalPrice >= freeAbove) {
        return 0;
      }
    }
    return price;
  },

  cartTotalPrice: (state, getters) => {
    return getters.cartSubtotalPrice + getters.cartDeliveryPrice;
  }
}

const actions = {
  loadShippingOptions({ commit }) {
    commit('setError', false);
    commit('setLoading', true);

    shop.getShippingOptions().then((options) => {
      commit('setShippingOptions', options);
      commit('setSelectedShippingOption', options[0].id);
    }).catch((err) => {
      commit('setError', true);
      console.log(err);
    }).finally(() => {
      commit('setLoading', false)
    });
  },

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
          commit('incrementItemQuantity', { id: cartItem.id });
        }
      }
    }
  },
  decrementProductQuantity({ state, commit }, product) {
    const cartItem = state.items.find(item => item.id === product.id)
    if (!cartItem) {
      throw Error('Could decrement as item is not in cart.');
    } else {
      if (cartItem.quantity == 1) {
        commit('removeProductFromCart', { id: cartItem.id });
      } else {
        commit('decrementItemQuantity', { id: product.id });
      }
    }
  },
  removeProductFromCart({ commit }, product) {
    commit('removeProductFromCart', { id: product.id });
  },
  initStore({ commit }) {
    commit('loadStoreFromLocalStorage');
  },
  saveStoreInLocalStorage({ commit }) {
    commit('saveStoreInLocalStorage');
  },
  setSelectedShippingOption({ commit }, selectedOptionId) {
    commit('setSelectedShippingOption', selectedOptionId);
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

  setShippingOptions(state, options) {
    state.shippingOptions = options;
  },

  setSelectedShippingOption(state, selectedOptionId) {
    state.selectedShippingOption = state.shippingOptions.find(options => options.id === selectedOptionId);
  },

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
    state.items = items;
  },

  setCheckoutStatus(state, status) {
    state.checkoutStatus = status;
  },

  loadStoreFromLocalStorage(state) {

    let localStorageCartData = localStorage.getItem('cartItems');
    let localStorageCheckoutData = localStorage.getItem('cartItems');

    if (localStorageCartData) {
      state.items = JSON.parse(localStorageCartData);
    }

    if (localStorageCheckoutData) {
      state.checkoutStatus = JSON.parse(localStorageCheckoutData);
    }
  },

  saveStoreInLocalStorage(state) {
    localStorage.setItem('cartItems', JSON.stringify(state.items));
    localStorage.setItem('checkoutStatus', JSON.stringify(state.checkoutStatus));
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}