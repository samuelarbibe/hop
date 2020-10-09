import shop from '../../api/shop'

const state = () => ({
  items: [],
  shippingOptions: [],
  selectedShippingOption: null,
  isError: false,
  isLoading: false,
  isCartSynced: true,
  isShippingSynced: true,
  isCartLocked: false,
  unsubscribe: null,
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
    return (getters.cartSubtotalPrice + getters.cartShippingPrice).toFixed(2);
  }
}

const actions = {
  loadShippingOptions({ commit, dispatch }) {
    commit('setError', false);
    commit('setLoading', true);

    const unsubscribe = shop.updateShippingOptions({
      updateShippingCb: (updatedShippingOptions) => dispatch('onShippingUpdate', updatedShippingOptions),
      errorCb: (err) => dispatch('onUpdateErr', err),
    });

    commit('setUnsubscribe', unsubscribe);
  },

  unloadShippingOptions({ commit, state, dispatch }) {
    if (state.unsubscribe != null) {
      console.log('unsubscribed from shipping options');
      state.unsubscribe();
      dispatch('emptyCart');
      commit('setShippingOptions', []);
    }
  },

  onUpdateErr({ commit }, err) {
    commit('setError', true);
    console.log(err);
  },

  onShippingUpdate({ state, commit }, updatedShippingOptions) {
    console.log('shipping options updated');

    if (state.selectedShippingOption != null) {
      commit('setShippingOptions', updatedShippingOptions);

      const updatedSelectedShippingOption = updatedShippingOptions.find(option => option.id === state.selectedShippingOption.id);

      // If selected option no longer exists
      if (updatedSelectedShippingOption === undefined) {
        commit('setIsShippingSynced', false);
        commit('setSelectedShippingOption', updatedShippingOptions[0].id);
        console.log('selected option no longer exists');
      } else {

        // If selected option has changed
        if (
          updatedSelectedShippingOption.price !== state.selectedShippingOption.price ||
          updatedSelectedShippingOption.free_above !== state.selectedShippingOption.free_above
        ) {
          commit('setIsShippingSynced', false);
          console.log('selected option changed');
          commit('setSelectedShippingOption', updatedSelectedShippingOption.id);
        }
      }
    }

    commit('setShippingOptions', updatedShippingOptions);
    commit('setLoading', false);
  },

  emptyCart({ commit }) {
    commit('setCartItems', { items: [] });
    commit('setSelectedShippingOption', null);
    commit('setIsCartSynced', true);
    commit('setIsShippingSynced', true);
    commit('setIsCartLocked', false);
  },

  addProductToCart({ state, commit }, product) {
    if (product.inventory > 0) {
      const cartItem = state.items.find(item => item.id === product.id)
      if (!cartItem) {
        commit('pushProductToCart', { id: product.id })
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
  setIsCartSynced({ commit }, isCartSynced) {
    commit('setIsCartSynced', isCartSynced);
  },
  setIsShippingSynced({ commit }, isShippingSynced) {
    commit('setIsShippingSynced', isShippingSynced);
  },
  setIsCartLocked({ commit }, isCartLocked) {
    commit('setIsCartLocked', isCartLocked);
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
    if (selectedOptionId === null) {
      state.selectedShippingOption = null;
    } else {
      state.selectedShippingOption = state.shippingOptions.find(options => options.id === selectedOptionId);
    }
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

  setIsCartSynced(state, isCartSynced) {
    state.isCartSynced = isCartSynced;
  },

  setIsShippingSynced(state, isShippingSynced) {
    state.isShippingSynced = isShippingSynced;
  },

  setIsCartLocked(state, isCartLocked) {
    state.isCartLocked = isCartLocked;
  },

  setUnsubscribe(state, unsubscribe) {
    state.unsubscribe = unsubscribe;
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