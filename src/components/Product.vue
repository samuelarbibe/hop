<template>
  <div
    dir="rtl"
    :class="{
      'columns product-container my-0': true,
      'is-row-reverse-mobile product-container-mobile': !isSelected,
    }"
  >
    <a
      @click="click()"
      :class="{
        'column image-container': true,
        'is-one-third-mobile': !isSelected,
        'no-padding-x-mobile image-container-desktop': isSelected,
      }"
    >
      <figure :class="{ image: true, 'is-selected-mobile': isSelected }">
        <img :src="product.images[0]" :alt="`${product.name} Thumbnail`" />
        <button
          v-if="isSelected"
          class="button is-rounded close-button is-hidden-desktop"
        >
          <div class="icon is-large">
            <i class="fas fa-times fa-lg"></i>
          </div>
        </button>
      </figure>
    </a>
    <a @click="click()" class="column product-info" dir="ltr">
      <p
        class="is-size-6-mobile is-size-4-desktop has-text-black-ter has-text-weight-semibold"
      >
        {{ product.name }}
      </p>
      <p class="description is-size-5-desktop has-text-grey" dir="rtl">
        {{ product.description }}
      </p>
      <div class="columns is-mobile">
        <div class="column">
          <span v-if="isInCart" class="is-size-6-mobile is-size-5-desktop"
            >{{ product.price * quantity }} ₪</span
          >
          <span v-else class="is-size-6-mobile is-size-5-desktop"
            >{{ product.price }} ₪</span
          >
        </div>
        <div v-if="!isInStock" class="column has-text-right">
          <span class="has-text-danger is-size-6-mobile is-size-5-desktop"
            >לא במלאי</span
          >
        </div>
        <div
          v-else-if="isInCart"
          class="column has-text-right has-text-info mr-2"
        >
          <b class="is-size-5-mobile is-size-4-desktop">X{{ quantity }}</b>
        </div>
      </div>
    </a>
    <div
      :class="{ 'column is-narrow': true, 'is-hidden-mobile': !isSelected }"
      dir="ltr"
    >
      <div class="columns is-mobile product-options">
        <div class="column is-size-6 amount-container">
          <div class="amount-child">
            <span>Amount:</span>
            <b class="pl-2">{{ quantity }}</b>
          </div>
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
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "product",
  props: ["product", "height"],
  data() {
    return {
      isSelected: false,
    };
  },
  components: {},
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
    click() {
      this.isSelected ? this.unselect() : this.select();
      this.$emit("select");
    },
    select() {
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
.product-container {
  background-color: transparent;
  flex-direction: column;
  height: 100%;
  margin: 0px;
  border-bottom: 1px solid rgba(100, 100, 100, 0.15);
}

.image-container-desktop {
  width: 100%;
}

.image-container {
  transition: width 0.3s, padding 0.3s ease-in-out;
}

.product-container {
  transition: height 0.2s ease-in-out;
}

.image {
  height: 100%;
  /* display: flex; */
}

.image > img {
  max-height: 100%;
  object-fit: cover;
  border-radius: 5px;
}

a {
  color: black;
}

@media (max-width: 768px) {
  .is-row-reverse-mobile {
    flex-direction: row;
    display: flex;
  }

  .no-padding-x-mobile {
    padding-right: 0px;
    padding-left: 0px;
  }

  .product-container-mobile {
    height: 130px;
  }

  .is-selected-mobile > img {
    border-radius: 0px;
  }

  .description {
    font-size: 14px;
  }
}

.close-button {
  width: 0px;
  position: absolute;
  top: 10px;
  right: 10px;
  border: 0;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
}

.product-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-options {
  /* border-top: 1px solid rgba(100, 100, 100, 0.15); */
}

.amount-container {
  display: flex;
  align-items: center;
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