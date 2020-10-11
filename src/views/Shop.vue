<template>
  <div>
    <div id="heroAnchor" />
    <Hero />
    <!-- <div id="background-section-1" /> -->
    <About id="about" />
    <div id="productListAnchor" />
    <div id="background-section-1">
      <ProductList />
    </div>
    <InstagramGallery />
    <Contact />
    <div id="background-section-2">
      <Newsletter />
    </div>
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
#about {
  /* max-width: 800px; */
}

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
  margin-top: -220px;
  padding-top: 200px;
  /* background-color: rgb(246, 246, 246); */
}

#background-section-2 {
  padding-bottom: 60px;
  margin-bottom: -60px;
  background-color: rgb(246, 246, 246);
}
</style>