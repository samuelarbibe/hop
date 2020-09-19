<template>
  <div class="card pasta-card">
    <div class="card-image">
      <figure class="image">
        <img :src="product.image" alt="Placeholder image" />
      </figure>
    </div>
    <div class="card-content">
      <p class="title is-4">{{product.name}}</p>

      <div class="content has-text-right">{{product.description}}</div>
      <div class="bottom-content">
        <div class="columns">
          <div class="column">
            <b class="is-size-4">{{product.price}} ₪</b>
          </div>
          <div class="column is-narrow">
            <button class="button is-dark buy-button" @click="addToCart(product)">הוסף לסל</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "pasta",
  props: ["product"],
    methods: {
    addToCart(product) {
      this.$store.dispatch('cart/addProductToCart', product);
    },
    toggleNavbar() {
      this.navbarOpen = !this.navbarOpen;
    },
  },
};
</script>

<style scoped>
.pasta-card {
  height: 100%;
}

.card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.buy-button {
  width: 100%;
}
</style>