<template>
  <div id="app">
    <Navbar />
    <CartNotSyncDialog v-if="!this.isCartSynced" />
    <ShippingNotSyncDialog v-if="!this.isShippingSynced" />
    <router-view class="frame" />
    <BottomNavbar v-if="cartItems.length > 0" />
  </div>
</template>

<script>
import { mapState } from "vuex";

import Navbar from "./components/Navbar";
import BottomNavbar from "./components/BottomNavbar";
import CartNotSyncDialog from "./components/CartNotSyncDialog";
import ShippingNotSyncDialog from "./components/ShippingNotSyncDialog";

export default {
  name: "App",
  components: {
    Navbar,
    BottomNavbar,
    CartNotSyncDialog,
    ShippingNotSyncDialog,
  },
  created() {
    // this.$store.dispatch("cart/initStore");
    this.$store.dispatch("cart/loadShippingOptions");
    this.$store.dispatch("products/getAllProducts");
  },
  computed: {
    ...mapState({
      cartItems: (state) => state.cart.items,
      isCartSynced: (state) => state.cart.isCartSynced,
      isShippingSynced: (state) => state.cart.isShippingSynced,
    }),
  },
};
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
body::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
body {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.frame {
  margin-top: 60px;
  margin-bottom: 60px;
}
</style>
