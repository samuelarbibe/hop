import shop from '../../api/shop'

const state = () => ({
  items: [],
  shippingOptions: [],
  selectedShippingOption: null,
  isError: false,
  isLoading: false,
  isCartSynced: true,
  isShippingSynced: true,
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

    updatedShippingOptions = updatedShippingOptions.map(updatedShippingOption => {
      return {
        ...updatedShippingOption,
        selectedShippingDate: updatedShippingOption.dates[0],
      }
    });

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

        const currentSelectedShippingDate = state.selectedShippingOption.selectedShippingDate;
        const updatedSelectedDate = updatedSelectedShippingOption.dates.find(date => date.id === currentSelectedShippingDate.id);

        // If selected date option no longer exists
        if (updatedSelectedDate === undefined) {
          commit('setIsShippingSynced', false);
          console.log('selected date no longer exists');

          commit('setSelectedShippingDateOption',
            {
              optionId: updatedSelectedShippingOption.id,
              dateId: updatedSelectedShippingOption.dates[0].id
            });

          // If selected date has changed
        } else if (
          updatedSelectedDate.from !== currentSelectedShippingDate.from ||
          updatedSelectedDate.to !== currentSelectedShippingDate.to
        ) {
          commit('setIsShippingSynced', false);
          console.log('selected date changed');
          commit('setSelectedShippingDateOption',
            {
              optionId: updatedSelectedShippingOption.id,
              dateId: updatedSelectedDate.id
            });
        }
      }
    }
    else {
      commit('setShippingOptions', updatedShippingOptions);
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
  setSelectedShippingDateOption({ commit }, { optionId, dateId }) {
    commit('setSelectedShippingDateOption', { optionId, dateId });
  },
  setIsCartSynced({ commit }, isCartSynced) {
    commit('setIsCartSynced', isCartSynced);
  },
  setIsShippingSynced({ commit }, isShippingSynced) {
    commit('setIsShippingSynced', isShippingSynced);
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

  setIsCartSynced(state, isCartSynced) {
    state.isCartSynced = isCartSynced;
  },

  setIsShippingSynced(state, isShippingSynced) {
    state.isShippingSynced = isShippingSynced;
  },

  setIsInCheckout(state, isInCheckout) {
    state.isCartSynced = isInCheckout;
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