<template>
  <nav
    class="navbar columns is-mobile is-fixed-bottom"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="column">
      <div class="cart-price ml-2">
        <b class="is-size-5">{{price}} ₪</b>
      </div>
    </div>
    <div class="column is-narrow">
      <router-link v-if="next" :to="next">
        <button class="button is-info is-rounded">continue</button>
      </router-link>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "bottom-navbar",
  computed: {
    ...mapGetters("cart", ["cartTotalPrice", "cartSubtotalPrice"]),
    routes() {
      return this.$router.options.routes;
    },
    routeIndex() {
      return this.routes.findIndex((r) => r.name === this.$route.name);
    },
    next() {
      const route = this.routes[this.routeIndex + 1];
      return route && { name: route.name };
    },
    prev() {
      const route = this.routes[this.routeIndex - 1];
      return route && { name: route.name };
    },
    price() {
      if (this.$route.name === "shop") {
        return this.cartSubtotalPrice;
      }
      return this.cartTotalPrice;
    },
  },
};
</script>

<style scoped>
.navbar {
  margin: 0px !important;
  z-index: 999;
}
.cart-price {
  display: flex;
  height: 100%;
  align-items: center;
}
</style>