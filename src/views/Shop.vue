<template>
  <div class>
    <Hero />
    <ProductList id="productList"/>
  </div>
</template>

<script>
import ProductList from "./../components/ProductList.vue";
import Hero from "./../components/Hero.vue";

export default {
  name: "shop",
  components: {
    ProductList,
    Hero,
  },
};
</script>