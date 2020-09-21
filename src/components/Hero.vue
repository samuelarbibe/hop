<template>
  <div class="hero">
    <img
      class="image"
      src="https://firebasestorage.googleapis.com/v0/b/hop-tlv.appspot.com/o/images%2FIMG_6314.jpg?alt=media&token=e7e6496d-01e6-41cc-a840-1032424804b2"
      alt="Placeholder image"
    />
    <div class="title has-text-centered">
      <h1 class="title is-1 has-text-white">House of Pasta</h1>
      <button class="button shop-button is-large" v-scroll-to="'#productList'">Order</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "hero",
};
</script>

<style scoped>
.hero {
  display: grid;
  grid-template: 1fr / 1fr;
  place-items: center;
}

.image {
  z-index: -999;
  grid-column: 1 / 1;
  grid-row: 1 / 1;
}
.title {
  grid-column: 1 / 1;
  grid-row: 1 / 1;
}
</style>