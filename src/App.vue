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
.frame {
  padding-top: 60px;
  padding-bottom: 60px;
}
</style>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
body::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
body {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

@import url("https://fonts.googleapis.com/css2?family=Bungee&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Bungee+Hairline&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Rubik&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Barlow+Condensed&display=swap");
h1 {
  font-family: "Barlow Condensed", "Rubik";
}

p {
  font-family: "Rubik";
}

.section-button {
  background-color: rgba(247, 247, 247, 1) !important;
  color: rgb(100, 100, 100) !important;
  font-weight: bold !important;
  font-size: 25px !important;
  border: 0 !important;
}

.section-title {
  font-size: 40px;
  margin: 0 0 20px 0;
  font-family: "Bungee";
}

.section-subtitle {
  font-size: 25px;
  font-weight: bold;
  margin: 0 0 40px 0px !important;
}
</style>
