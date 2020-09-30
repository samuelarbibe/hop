<template>
  <div class="container section">
    <div class="title has-text-centered">
      <h2 class="subheader">The Tel-Aviv</h2>
      <h1 class="section-title header">House of Pasta</h1>
      <button
        class="button section-button is-large is-rounded"
        v-scroll-to="'#productListAnchor'"
      >
        Order Now
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
  height: 400px;
  /* background-image: url("https://firebasestorage.googleapis.com/v0/b/hop-tlv.appspot.com/o/images%2FIMG_6314.jpg?alt=media&token=e7e6496d-01e6-41cc-a840-1032424804b2"); */
  background-size: 100%;
}

.title {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}

.subheader {
  font-size: 30px;
}

.header {
  font-size: 60px !important;
}
</style>