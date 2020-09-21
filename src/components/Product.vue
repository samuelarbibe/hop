<template>
  <div
    :class="{'columns':true, 'px-0':true, 'mx-0':true, 'is-product-in-cart': isInCart, 'is-selected': isSelected && !isInCart}"
  >
    <button
      v-if="!isSelected"
      class="product-listing columns is-mobile has-text-left"
      @click="select()"
    >
      <div class="column product-info">
        <p class="is-size-6-mobile">{{product.name}}</p>
        <p class="is-size-6-mobile">{{product.description}}</p>
        <div class="bottom-content">
          <div class="columns is-mobile">
            <div class="column">
              <span v-if="isInCart" class="is-size-6-mobile">{{product.price * quantity}} ₪</span>
              <span v-else class="is-size-6-mobile">{{product.price}} ₪</span>
            </div>
            <div v-if="!isInStock" class="column has-text-right">
              <span class="has-text-danger is-size-6-mobile">לא במלאי</span>
            </div>
            <div v-else-if="isInCart" class="column has-text-right has-text-info mr-2">
              <b class="is-size-5-mobile">X{{quantity}}</b>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-one-third-mobile">
        <figure class="image is-square">
          <img :src="product.image" alt="Placeholder image" />
        </figure>
      </div>
    </button>
    <div v-else class="product-details">
      <a class="column is-full-mobile px-0 py-0" @click="unselect()">
        <figure class="image is-square">
          <img :src="product.image" alt="Placeholder image" />
          <button class="button is-rounded close-button" @click="unselect()">
            <span class="icon is-large">
              <i class="fas fa-times fa-lg"></i>
            </span>
          </button>
        </figure>
      </a>
      <div class="column product-info mx-3">
        <h1 class="title is-3">{{product.name}}</h1>
        <h2 class="subtitle is-4">{{product.description}}</h2>
        <div class="bottom-content">
          <div class="columns is-mobile">
            <div class="column">
              <span v-if="isInCart" class="is-size-5-mobile">{{product.price * quantity}} ₪</span>
              <span v-else class="is-size-5-mobile">{{product.price}} ₪</span>
            </div>
            <div v-if="!isInStock" class="column has-text-right">
              <span class="has-text-danger is-size-6-mobile">לא במלאי</span>
            </div>
            <div v-else-if="isInCart" class="column has-text-right has-text-info mr-2">
              <b class="is-size-5-mobile">X{{quantity}}</b>
            </div>
          </div>
        </div>
      </div>
      <div class="column container mx-3">
        <div class="columns is-mobile">
          <div class="column is-size-5">
            <span>Amount:</span>
            <b class="pl-2">{{quantity}}</b>
          </div>
          <div class="column is-narrow">
            <div v-if="isInCart" class="field has-addons">
              <p class="control">
                <button
                  class="button"
                  @click="addToCart(product)"
                  :disabled="quantity >= product.inventory"
                >
                  <span class="icon is-large">
                    <i class="fas fa-plus fa-md"></i>
                  </span>
                </button>
              </p>
              <p class="control">
                <button
                  class="button is-disabled"
                  @click="decrementQuantity(product)"
                  :disabled="quantity == 0"
                >
                  <span class="icon is-large">
                    <i class="fas fa-minus fa-md"></i>
                  </span>
                </button>
              </p>
            </div>
            <button
              v-else
              class="button add-button is-info buy-button"
              :disabled="!canAddToCart"
              @click="addToCart(product)"
            >Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "product",
  props: ["product"],
  data() {
    return {
      isSelected: false,
    };
  },
  computed: {
    isInCart() {
      return this.quantity > 0;
    },
    ...mapState({
      cartItems: (state) => state.cart.items,
    }),
    quantity() {
      let itemProduct = this.cartItems.find(
        (item) => item.id == this.product.id
      );
      if (itemProduct == null) {
        return 0;
      }
      return itemProduct.quantity;
    },
    isInStock() {
      return this.product.inventory > 0;
    },
    canAddToCart() {
      return this.quantity < this.product.inventory;
    },
  },
  methods: {
    select() {
      this.$emit('select');
      this.isSelected = true;
    },
    unselect() {
      this.isSelected = false;
    },
    decrementQuantity(product) {
      this.$store.dispatch("cart/decrementProductQuantity", product);
    },
    addToCart() {
      try {
        this.$store.dispatch("cart/addProductToCart", this.product);
      } catch (err) {
        this.$toast.open({
          message: "לא ניתן להוסיף את המוצר",
          type: "error",
          duration: 1000,
          dismissible: true,
          position: "bottom",
        });
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>
.product-listing {
  background-color: transparent;
  border: 0;
  width: 100%;
  margin: 0px;
}

.product-details {
  border-bottom-width: 7px;
  border-bottom-style: solid;
  border-bottom-color: white;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  border: 0;
  opacity: 0.9;
}

.product-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.is-product-in-cart {
  background-color: hsl(0, 0%, 96%);
  border-left-width: 7px;
  border-left-style: solid;
  border-left-color: hsl(204, 86%, 53%);
}

.is-selected {
  background-color: hsl(0, 0%, 96%);
  border-left-width: 7px;
  border-left-style: solid;
  border-left-color: hsl(0, 0%, 48%);
}
</style>