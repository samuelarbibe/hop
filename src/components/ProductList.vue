<template>
  <div class="container">
    <h1 class="title is-2 mx-4 my-5">Our Pastas</h1>
    <div v-if="isLoading" class="loading">
      <span class="is-1 icon is-large">
        <i class="fas fa-spinner fa-pulse fa-lg"></i>
      </span>
    </div>
    <div v-else-if="isError" class="notification is-danger">
      <h1 class="title is-4">There was an error loading the site</h1>
      <h2 class="subtitle">Please try again later.</h2>
    </div>
    <div v-else class="columns mx-0 my-0 is-multiline">
      <div class="column px-0 is-one-third is-narrow" v-for="product in products" :key="product.id">
        <product ref="products" :product="product" @select="unslectOtherProducts"/>
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
    }
  },
  computed: {
    ...mapState({
      products: (state) => state.products.all,
      isLoading: (state) => state.products.isLoading,
      isError: (state) => state.products.isError,
    }),
  },
  methods: {
    unslectOtherProducts() {
      this.$refs.products.forEach(product => product.unselect());
    }
  }
};
</script>

<style scoped>
.loading {
  text-align: center;
}
</style>