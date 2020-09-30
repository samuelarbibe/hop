<template>
  <div>
    <div id="heroAnchor" />
    <Hero />
    <About />
    <div id="productListAnchor" />
    <ProductList />
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

<style scoped>
#productListAnchor {
  display: block;
  position: relative;
  top: -60px;
  visibility: hidden;
}

#heroAnchor {
  display: block;
  position: relative;
  top: -60px;
  visibility: hidden;
}
</style>