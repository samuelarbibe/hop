<template>
  <div class="container section">
    <div class="title has-text-centered">
      <h2 class="is-size-3 has-text-white">The Tel-Aviv</h2>
      <h1 class="is-size-1 has-text-weight-semibold has-text-white py-4">House of Pasta</h1>
      <button class="button shop-button is-large is-rounded" v-scroll-to="'#productList'">
        Order
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "hero",
};
</script>

<style scoped>
.container {
  display: table;
  width: 100%;
  min-height: 600px;
  max-height: 1000px;
  background-image: url("https://firebasestorage.googleapis.com/v0/b/hop-tlv.appspot.com/o/images%2FIMG_6314.jpg?alt=media&token=e7e6496d-01e6-41cc-a840-1032424804b2");
  background-size: 100%;
}

.title {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}

.shop-button {
  background-color: rgba(255, 255, 255, 0.6);
  border: 0;
}
</style>