<template>
  <div>
    <Hero />
    <About />
    <ProductList id="productList" />
    <InstagramGallery />
    <Contact />
    <Newsletter />
  </div>
</template>

<script>
import ProductList from "./../components/ProductList.vue";
import Hero from "./../components/Hero.vue";
import About from "./../components/About.vue";
import InstagramGallery from "./../components/InstagramGallery";
import Contact from "./../components/Contact";
import Newsletter from "./../components/Newsletter";

export default {
  name: "shop",
  components: {
    ProductList,
    Hero,
    About,
    InstagramGallery,
    Contact,
    Newsletter,
  },
};
</script>