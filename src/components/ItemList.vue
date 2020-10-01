<template>
  <div v-if="isLoading" class="loading has-text-centered">
    <span class="is-1 icon is-large">
      <i class="fas fa-spinner fa-pulse fa-lg"></i>
    </span>
  </div>
  <div v-else-if="isError" class="notification is-danger">
    <h2 class="title is-4">There was an error loading the shipping options.</h2>
    <h2 class="subtitle">Please try again later.</h2>
  </div>
  <div v-else class="container">
    <table class="table is-fullwidth">
      <tbody>
        <tr v-for="product in cartProducts" :key="product.id">
          <td>
            <img class="image is-128x128" :src="product.images[0]" :alt="product.name" />
          </td>
          <td>
            <div class="columns">
              <div class="name column">
                <p class="is-size-4">{{product.name}}</p>
              </div>
              <div class="quantity column is-narrow has-text-centered">
                <div class="field has-addons">
                  <p v-if="isEditable" class="control">
                    <button
                      class="button"
                      @click="incrementQuantity(product)"
                      :disabled="product.quantity >= product.inventory"
                    >
                      <span class="icon is-small">
                        <i class="fas fa-plus"></i>
                      </span>
                    </button>
                  </p>
                  <b class="is-size-5 px-3 py-1">{{product.quantity}}</b>
                  <p v-if="isEditable" class="control">
                    <button
                      class="button is-disabled"
                      @click="decrementQuantity(product)"
                      :disabled="product.quantity == 1"
                    >
                      <span class="icon is-small">
                        <i class="fas fa-minus"></i>
                      </span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </td>
          <td>
            <div class="columns">
              <div class="column has-text-right">
                <p class="is-size-4 price">{{product.quantity * product.price}} ₪</p>
              </div>
              <div v-if="isEditable" class="column is-narrow">
                <button class="button remove-button" @click="removeProduct(product)">
                  <span class="icon has-text-danger is-size-4">
                    <i class="far fa-trash-alt"></i>
                  </span>
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="level is-mobile">
      <div class="level-left">
        <h2 class="subtitle is-4">Subtotal</h2>
      </div>
      <div class="right">
        <h2 class="subtitle is-4">{{cartSubtotalPrice}} ₪</h2>
      </div>
    </div>
    <div class="level is-mobile">
      <div class="level-left">
        <h2 class="subtitle is-4">Shipping</h2>
      </div>
      <div class="right">
        <h2 class="subtitle is-4">{{cartShippingPrice}} ₪</h2>
      </div>
    </div>
    <div  class="level is-mobile">
      <div class="level-left">
        <h2 class="title is-3">Total</h2>
      </div>
      <div class="right">
        <h2 class="title is-3">{{cartTotalPrice}} ₪</h2>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "item-list",
  props: {
    isEditable: Boolean,
  },
  computed: {
    ...mapGetters("cart", [
      "cartProducts",
      "cartSubtotalPrice",
      "cartTotalPrice",
      "cartShippingPrice",
    ]),
    ...mapState({
      isLoading: (state) => state.cart.isLoading,
      isError: (state) => state.cart.isError,
    }),
  },
  methods: {
    incrementQuantity(product) {
      this.$store.dispatch("cart/incrementProductQuantity", product);
    },
    decrementQuantity(product) {
      this.$store.dispatch("cart/decrementProductQuantity", product);
    },
    removeProduct(product) {
      this.$store.dispatch("cart/removeProductFromCart", product);
    },
  },
};
</script>

<style scoped>
.button {
  width: 100%;
}

.price {
  white-space: nowrap;
}

.remove-button {
  border: 0;
}

.cart-buttons-level {
  margin-top: 70px;
}

.cart-header {
  padding-bottom: 30px;
}
</style>