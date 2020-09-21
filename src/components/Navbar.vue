<template>
  <nav class="navbar is-fixed-top is-mobile columns" role="navigation" aria-label="main navigation">
    <div class="column">
      <a class="title is-1" @click="goToHome()">HoP</a>
    </div>
  </nav>
</template>

<script>
export default {
  name: "navbar",
  methods: {
    goToCart() {
      this.$router.push({ name: "cart" }).catch(() => {});
    },
    goToHome() {
      this.$router.push({ name: "home" }).catch(() => {});
    },
  },
};
</script>

<style scoped>
.navbar {
  margin: 0;
}

.cart-button {
  border: 0;
}
</style>