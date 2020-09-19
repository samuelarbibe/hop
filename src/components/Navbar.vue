<template>
  <nav class="navbar is-fixed-top is-mobile columns" role="navigation" aria-label="main navigation">
    <div class="column">
      <a class="title is-1" @click="goToHome()">HoP</a>
    </div>
    <div class="column is-narrow">
      <button class="button is-large" @click="goToCart()">
        <span class="icon">
          <i class="fas fa-shopping-cart fa-lg"></i>
        </span>
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: "navbar",
  data() {
    return {
      navbarOpen: false,
    };
  },
  methods: {
    toggleNavbar() {
      this.navbarOpen = !this.navbarOpen;
    },
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
  padding: 10px 20px 0px 20px;
}
</style>