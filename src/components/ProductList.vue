<template>
  <div class="container">
    <div v-if="isLoading" class="loading has-text-centered">
      <span class="is-1 icon is-large">
        <i class="fas fa-spinner fa-pulse fa-lg"></i>
      </span>
    </div>
    <div v-else-if="isError" class="notification is-danger">
      <h1 class="title is-4">There was an error loading the site</h1>
      <h2 class="subtitle">Please try again later.</h2>
    </div>
    <div v-else class="">
      <h1 class="title is-3 mx-4 my-5">Menu</h1>
      <div class="columns mx-0 my-0 is-multiline">
        <div
          class="column px-0 is-one-third is-narrow"
          v-for="product in pastaProducts"
          :key="product.id"
        >
          <product
            ref="products"
            :product="product"
            @select="unslectOtherProducts"
          />
        </div>
        <div
          class="column px-0 is-one-third is-narrow"
          v-for="product in otherProducts"
          :key="product.id"
        >
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
import { mapState, mapGetters } from "vuex";
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
      isLoading: (state) => state.products.isLoading,
      isError: (state) => state.products.isError,
    }),
    ...mapGetters("products", ["pastaProducts", "otherProducts"]),
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
</style>