<template>
  <div id="app">
    <Navbar />
    <router-view class="frame"/>
    <Footer />
  </div>
</template>

<script>
// import PastaGrid from "./components/PastaGrid";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export default {
  name: "App",
  components: {
    // PastaGrid,
    Footer,
    Navbar,
  },
  created() {
    this.$store.dispatch("products/getAllProducts");
  },
};
</script>

<style scoped>
.columns {
  align-items: stretch;
}

.frame {
  margin-top: 80px;
}
</style>
