<template>
  <div class="section">
    <div class="container">
      <div v-if="cartProducts.length == 0">
        <div class="columns is-centered">
          <div class="column is-narrow">
            <h1 class="title is-4">Your cart is empty!</h1>
          </div>
          <div class="column is-narrow">
            <button class="button is-dark is-outlined" @click="goToHome()">Continue Shopping</button>
          </div>
        </div>
      </div>
      <div v-else class="container">
        <table class="table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in cartProducts" :key="product.id">
              <td>
                <img class="image is-128x128" :src="product.image" :alt="product.name" />
              </td>
              <td>
                <p class="is-size-4">{{product.name}}</p>
                <br />
                <b class="is-size-5">{{product.price}} ₪</b>
              </td>
              <td>
                <b class="is-size-5">{{product.quantity}}</b>
                <div class="field has-addons">
                  <p class="control">
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
                  <p class="control">
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
              </td>
              <td>
                <span class="is-size-4">{{product.quantity * product.price}} ₪</span>
              </td>
              <td>
                <button class="button is-danger is-outlined" @click="removeProduct(product)">
                  <span class="icon">
                    <i class="fas fa-trash-alt"></i>
                  </span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="section">
          <div class="columns">
            <div class="column">
              <h1 class="title is-3">Total: {{cartTotalPrice}} ₪</h1>
            </div>
            <div class="column is-narrow">
              <button class="button is-dark is-outlined" @click="goToHome()">Continue Shopping</button>
            </div>
            <div class="column is-narrow">
              <button class="button is-dark">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "cart",
  computed: {
    ...mapGetters("cart", ["cartProducts", "cartTotalPrice"]),
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
    goToHome() {
      this.$router.push({ name: "home" }).catch(() => {});
    },
  },
};
</script>

<style scoped>
.table {
  width: 100%;
}

.button {
  width: 100%;
}
</style>