<template>
  <div class="container section">
    <div class="columns">
      <div class="column title-container">
        <h2 class="subheader">The Tel-Aviv</h2>
        <h1 class="section-title header">House of Pasta</h1>
        <button
          class="button section-button is-large is-rounded"
          v-scroll-to="'#productListAnchor'"
        >
          Order Now
        </button>
      </div>
      <div class="column">
        <transition name="fade">
          <img v-show="loaded" :src="selectedImage" alt="" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "hero",
  data() {
    return {
      loaded: false,
      src: [
        "https://firebasestorage.googleapis.com/v0/b/hop-tlv.appspot.com/o/images%2Fbalanzoni_png?alt=media&token=45fce120-0af9-406a-9558-e7b031aed71e",
        "https://firebasestorage.googleapis.com/v0/b/hop-tlv.appspot.com/o/images%2Ffreccia_png?alt=media&token=16ac13cd-ba6e-4adf-a088-f809e712617c",
        "https://firebasestorage.googleapis.com/v0/b/hop-tlv.appspot.com/o/images%2Fmezzaluna_png?alt=media&token=8599a001-4e92-4a44-8865-86f1c6bbac66",
      ],
      selectedImage: "",
    };
  },
  methods: {
    onLoaded() {
      this.selectedImage = this.src[
        Math.floor(Math.random() * this.src.length)
      ];
    },
  },
  mounted() {
    this.selectedImage = this.src[Math.floor(Math.random() * this.src.length)];
    this.loaded = true;
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  /* max-height: 600px; */
  /* background-image: url("https://firebasestorage.googleapis.com/v0/b/hop-tlv.appspot.com/o/images%2FIMG_6314.jpg?alt=media&token=e7e6496d-01e6-41cc-a840-1032424804b2"); */
  background-size: 100%;
}

.title-container {
  display: flex !important;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.subheader {
  font-size: 30px;
}

.header {
  font-size: 60px !important;
}

img {
  /* -webkit-filter: drop-shadow(10px 10px 10px rgba(0, 0, 0, 0.2)); */
  filter: drop-shadow(-20px 20px 10px rgba(93, 68, 68, 0.2));
}

.fade-enter-active {
  transition: opacity 0.5s ease-in-out;
  transition-delay: 1s;
}

.fade-enter-to {
  opacity: 1;
}

.fade-enter {
  opacity: 0;
}
</style>