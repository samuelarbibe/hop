<template>
  <div class>
    <Hero />
    <About />
    <ProductList id="productList" />
  </div>
</template>

<script>
import ProductList from "./../components/ProductList.vue";
import Hero from "./../components/Hero.vue";
import About from "./../components/About.vue";

export default {
  name: "shop",
  components: {
    ProductList,
    Hero,
    About,
  },
};
</script>