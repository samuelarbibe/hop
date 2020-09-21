<template>
  <div id="app">
    <Navbar />
    <router-view class="frame" />
    <BottomNavbar />
  </div>
</template>

<script>
import { mapState } from "vuex";

import Navbar from "./components/Navbar";
import BottomNavbar from "./components/BottomNavbar";

export default {
  name: "App",
  components: {
    Navbar,
    BottomNavbar,
  },
  created() {
    this.$store.dispatch("cart/initStore");
    this.$store.dispatch("products/getAllProducts");
    this.$store.dispatch("cart/loadShippingOptions");
  },
  computed: {
    ...mapState({
      cartItems: (state) => state.cart.items,
    }),
  },
  watch: {
    cartItems: {
      handler() {
        this.$store.dispatch("cart/saveStoreInLocalStorage");
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.html {
  scroll-behavior: smooth;
}

.columns {
  align-items: stretch;
}

.frame {
  margin-top: 80px;
  margin-bottom: 60px;
}
</style>
