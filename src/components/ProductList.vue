<template>
  <div class="container section px-0">
    <div v-if="isLoading" class="loading has-text-centered">
      <span class="is-1 icon is-large">
        <i class="fas fa-spinner fa-pulse fa-lg"></i>
      </span>
    </div>
    <div v-else-if="isError" class="notification is-danger">
      <h2 class="title is-4">There was an error loading the site</h2>
      <h2 class="subtitle">Please try again later.</h2>
    </div>
    <div v-else class="">
      <div class="container section">
        <div class="title has-text-centered">
          <h1>Menu</h1>
        </div>
      </div>
      <div class="columns mx-0 my-0 is-multiline">
        <div
          class="column px-0 is-one-third"
          v-for="product in products"
          :key="product.id"
        >
          <div class="product-anchor" :id="product.name.replace(' ', '')" />
          <product
            ref="products"
            :product="product"
            @select="unslectOtherProducts"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Product from "./Product";

export default {
  name: "productList",
  components: {
    Product,
  },
  data() {
    return {
      selectedProduct: null,
      showPastaInfo: false,
    };
  },
  computed: {
    ...mapState({
      products: (state) => state.products.all,
      isLoading: (state) => state.products.isLoading,
      isError: (state) => state.products.isError,
    }),
    // ...mapGetters("products", ["pastaProducts", "otherProducts"]),
  },
  methods: {
    unslectOtherProducts() {
      this.$refs.products.forEach((product) => product.unselect());
    },
  },
};
</script>

<style scoped>
.loading {
  text-align: center;
}

.header {
  font-size: 40px;
  margin: 20px 0px 20px 0px;
  font-family: "Bungee";
}

.product-anchor {
  display: block;
  position: relative;
  top: -60px;
  visibility: hidden;
}
</style>