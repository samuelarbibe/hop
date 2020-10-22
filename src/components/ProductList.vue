/* eslint-disable no-debugger */
<template>
  <div class="container section px-0">
    <div
      v-if="isProductsLoading || isStatusLoading"
      class="loading has-text-centered"
    >
      <span class="is-1 icon is-large">
        <i class="fas fa-spinner fa-pulse fa-lg"></i>
      </span>
    </div>
    <div
      v-else-if="isProductsError || isStatusError"
      class="notification is-danger"
    >
      <h2 class="title is-4">There was an error loading the site</h2>
      <h2 class="subtitle">Please try again later.</h2>
    </div>
    <div v-else class="">
      <div class="container section">
        <div class="title has-text-centered">
          <h1>Menu</h1>
        </div>
      </div>
      <div v-if="!isShopOpen" class="has-text-centered">
        <h1 class="title">{{ status.title }}</h1>
        <p class="is-size-4">{{ status.text }}</p>
      </div>
      <div v-else class="columns mx-0 my-0 is-multiline">
        <div class="product-anchor" id="firstItemAnchor" />
        <div
          class="column px-0 is-one-third py-0"
          v-for="(product, index) in products"
          :key="index"
        >
          <product
            ref="products"
            :product="product"
            :height="productMobileHeight"
            @select="scrollToSelected(product)"
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
      productMobileHeight: 130,
    };
  },
  computed: {
    ...mapState({
      status: (state) => state.shop.status,
      isStatusLoading: (state) => state.shop.isLoading,
      isStatusError: (state) => state.shop.isError,
      products: (state) => state.products.all,
      isProductsLoading: (state) => state.products.isLoading,
      isProductsError: (state) => state.products.isError,
    }),
    ...mapGetters("shop", ["isShopOpen"]),
    ...mapGetters("products", ["pastaProducts", "otherProducts"]),
  },
  methods: {
    unslectOtherProducts(selectedProduct) {
      this.$refs.products
        .filter((product) => product.product.id !== selectedProduct.id)
        .forEach((product) => product.unselect());
    },
    scrollToSelected(selectedProduct) {
      this.unslectOtherProducts(selectedProduct);

      const selectedIndex = this.$refs.products.findIndex(
        (product) => product.product.id === selectedProduct.id
      );
      if (window.innerWidth < 769) {
        let offset = 12;

        offset += selectedIndex * this.productMobileHeight;

        if (!this.$refs.products[selectedIndex].isSelected) {
          offset -= 200;
        }

        this.$scrollTo(`#firstItemAnchor`, 300, {
          offset: offset,
          easing: "ease",
        });
        this.selectedProduct = selectedProduct;
      }
    },
  },
};
</script>

<style scoped>
.loading {
  text-align: center;
}

#firstItemAnchor {
  display: block;
  position: relative;
  top: -60px;
  visibility: hidden;
}
</style>