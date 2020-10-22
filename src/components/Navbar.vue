<template>
  <nav
    class="navbar is-fixed-top is-mobile columns"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="column px-2 py-1">
      <a @click="goToHome()" v-scroll-to="'#heroAnchor'">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/hop-tlv.appspot.com/o/hop_logo.png?alt=media&token=8b386c91-f2ec-42ae-b1ee-3e8de4b5b865"
          alt=""
        />
      </a>
    </div>
  </nav>
</template>

<script>
export default {
  name: "navbar",
  methods: {
    goToHome() {
      this.$router.push({ name: "shop" }).catch(() => {});
    },
  },
};
</script>

<style scoped>
.navbar {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  margin: 0;
  z-index: 999;
}

img {
  height: 50px;
}

.cart-button {
  border: 0;
}
</style>