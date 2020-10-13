<template>
  <div>
    <div id="heroAnchor" />
    <div id="background-section-1">
      <img
        class="bg-image is-hidden-tablet"
        src="https://firebasestorage.googleapis.com/v0/b/hop-tlv.appspot.com/o/images%2FIMG_6314.jpg?alt=media&token=e7e6496d-01e6-41cc-a840-1032424804b2"
        alt="Background image"
      />
      <Hero />
      <About id="about" />
    </div>
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
.bg-image {
  position: absolute;
  z-index: -999;
  top: 0px;
  left: 0;
}

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