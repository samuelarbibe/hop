<template>
  <div>
    <div id="heroAnchor" />
    <Hero />
    <div id="background-section-1" />
    <About />
    <div id="productListAnchor" />
    <ProductList />
    <InstagramGallery />
    <Contact />
    <div id="background-section-2" />
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

#background-section-1 {
  z-index: -999;
  position: absolute;
  margin-top: 240px;
  left: 0px;
  width: 100%;
  height: 750px;
  background-color: rgb(246, 246, 246);
}

#background-section-2 {
  z-index: -999;
  position: absolute;
  width: 100%;
  margin-top:30px;
  height: 500px;
  background-color: rgb(246, 246, 246);
}
</style>