<template>
  <div class="section">
    <div class="container">
      <div v-if="isLoading" class="loading">
        <span class="is-1 icon is-large">
          <i class="fas fa-spinner fa-pulse fa-lg"></i>
        </span>
      </div>
      <div v-else-if="isError" class="notification is-danger">
        <h1 class="title is-4">There was an error loading the site</h1>
        <h2 class="subtitle">Please try again later.</h2>
      </div>
      <div v-else class="columns is-multiline">
        <div class="column is-one-third" v-for="product in products" :key="product.id">
          <pasta :product="product" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Pasta from "./Pasta";

export default {
  name: "pastaGrid",
  components: {
    Pasta,
  },
  computed: {
    ...mapState({
      products: (state) => state.products.all,
      isLoading: (state) => state.products.isLoading,
      isError: (state) => state.products.isError,
    }),
  },
};
</script>

<style scoped>

.loading {
  text-align: center;
}
</style>