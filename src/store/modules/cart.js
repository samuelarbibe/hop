import shop from '../../api/shop'

const state = () => ({
  items: [],
  shippingOptions: [],
  selectedShippingOption: null,
  isError: false,
  isLoading: false,
  isInSync: true,
  isInCheckout: false,
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

  cartShippingPrice: (state, getters) => {
    if (state.selectedShippingOption == null) {
      return 0;
    }
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
    return getters.cartSubtotalPrice + getters.cartShippingPrice;
  }
}

const actions = {
  loadShippingOptions({ commit, dispatch }) {
    commit('setError', false);
    commit('setLoading', true);

    shop.updateShippingOptions({
      updateShippingCb: (updatedShippingOptions) => dispatch('onShippingUpdate', updatedShippingOptions),
      errorCb: (err) => dispatch('onUpdateErr', err),
    });
  },

  onUpdateErr({ commit }, err) {
    commit('setError', true);
    console.log(err);
  },

  onShippingUpdate({ state, commit }, updatedShippingOptions) {
    console.log('shipping options updated');

    updatedShippingOptions = updatedShippingOptions.map(shippingOption => {
      if (shippingOption.selectedShippingDate == undefined) {
        return {
          ...shippingOption,
          selectedShippingDate: shippingOption.dates[0],
        }
      }
      return shippingOption;
    });

    commit('setShippingOptions', updatedShippingOptions);

    if (!updatedShippingOptions.includes(option => option.id === state.selectedShippingOption.id)) {
      commit('setSelectedShippingOption', updatedShippingOptions[0].id);
    }

    commit('setLoading', false);
  },

  emptyCart({ commit }) {
    commit('setCartItems', { items: [] });
  },

  addProductToCart({ state, commit }, product) {
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
  setProductQuantity({ state, commit }, { product, quantity }) {
    const cartItem = state.items.find(item => item.id === product.id)
    if (!cartItem) {
      throw Error('Could decrement as item is not in cart.');
    } else {
      if (quantity <= 0) {
        commit('removeProductFromCart', { id: cartItem.id });
      } else {
        commit('setItemQuantity', { id: product.id, quantity: quantity });
      }
    }
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
  setSelectedShippingDateOption({ commit }, { optionId, dateId }) {
    commit('setSelectedShippingDateOption', { optionId, dateId });
  },
  setCartIsSync({ commit }, isInSync) {
    commit('setCartIsSync', isInSync);
  },
  setIsInCheckout({ commit }, isInCheckout) {
    commit('setIsInCheckout', isInCheckout);
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

  setShippingOptions(state, options) {
    state.shippingOptions = options;
  },

  setSelectedShippingOption(state, selectedOptionId) {
    state.selectedShippingOption = state.shippingOptions.find(options => options.id === selectedOptionId);
  },

  setSelectedShippingDateOption(state, { optionId, dateId }) {
    let option = state.shippingOptions.find(option => option.id === optionId);
    let selectedDate = option.dates.find(date => date.id === dateId);
    option.selectedShippingDate = selectedDate;
    state.selectedShippingOption = null;
    state.selectedShippingOption = option;
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

  setItemQuantity(state, { id, quantity }) {
    const cartItem = state.items.find(item => item.id === id)
    cartItem.quantity = quantity;
  },

  incrementItemQuantity(state, { id }) {
    const cartItem = state.items.find(item => item.id === id)
    cartItem.quantity++;
  },

  setCartItems(state, { items }) {
    state.items = items;
  },

  setCartIsSync(state, isInSync) {
    state.isInSync = isInSync;
  },

  setIsInCheckout(state, isInCheckout) {
    state.isInSync = isInCheckout;
  },

  loadStoreFromLocalStorage(state) {
    let localStorageCartData = localStorage.getItem('cartItems');

    if (localStorageCartData) {
      state.items = JSON.parse(localStorageCartData);
    }
  },

  saveStoreInLocalStorage(state) {
    localStorage.setItem('cartItems', JSON.stringify(state.items));
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}