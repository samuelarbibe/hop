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
      updateDatesCb: (shippingId, updatedShippingDates) => dispatch('onShippingDatesUpdate', { shippingId, updatedShippingDates }),
      errorCb: (err) => dispatch('onUpdateErr', err),
      finallyCb: () => dispatch('afterUpdate'),
    }
    );
  },

  onUpdateErr({ commit }, err) {
    commit('setError', true);
    console.log(err);
  },
  onShippingUpdate({ commit }, updatedShippingOptions) {
    console.log('shipping options updated');

    commit('setShippingOptions', updatedShippingOptions);
    commit('setSelectedShippingOption', updatedShippingOptions[0].id);
  },
  onShippingDatesUpdate({ commit, state }, { shippingId, updatedShippingDates }) {
    let shippingOption = state.shippingOptions.find(option => option.id === shippingId);
    shippingOption.dates = updatedShippingDates;
    console.log(`shipping dates updated for ${shippingOption.name}`);

    if (shippingOption.selectedShippingDate == undefined) {
      shippingOption = {
        ...shippingOption,
        selectedShippingDate: shippingOption.dates[0],
      }
    }

    commit('updateShippingOption', shippingOption);

    if(state.shippingOptions.every((option) => option.dates != undefined)){
      commit('setLoading', false);
    }
  },

  // checkout(products) {

  // },

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
  setSelectedShippingDateOption({ commit }, { optionId, dateId }) {
    commit('setSelectedShippingDateOption', { optionId, dateId });
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

  updateShippingOption(state, updatedShippingOption) {
    const oldShippingOption = state.shippingOptions.find(option => option.id === updatedShippingOption.id);
    oldShippingOption.dates = updatedShippingOption.dates;
    oldShippingOption.selectedShippingDate = updatedShippingOption.selectedShippingDate;
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