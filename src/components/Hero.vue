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
        <div class="pic">
          <transition name="img" v-for="(item, index) in images" :key="item">
            <img
              v-show="index === mark"
              :src="item"
              @mouseenter="stop"
              @mouseleave="play"
            />
          </transition>
        </div>
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
      images: [
        "https://firebasestorage.googleapis.com/v0/b/hop-tlv.appspot.com/o/images%2Fbalanzoni_png?alt=media&token=45fce120-0af9-406a-9558-e7b031aed71e",
        "https://firebasestorage.googleapis.com/v0/b/hop-tlv.appspot.com/o/images%2Ffreccia_png?alt=media&token=16ac13cd-ba6e-4adf-a088-f809e712617c",
        "https://firebasestorage.googleapis.com/v0/b/hop-tlv.appspot.com/o/images%2Fmezzaluna_png?alt=media&token=8599a001-4e92-4a44-8865-86f1c6bbac66",
        "https://firebasestorage.googleapis.com/v0/b/hop-tlv.appspot.com/o/images%2Ftortelli_png?alt=media&token=0d117bad-0876-4db0-bd7d-a4b1be06ec40",
      ],
      mark: 0,
      timer: "",
    };
  },
  methods: {
    autoplay() {
      if (this.mark < this.images.length - 1) {
        this.mark++;
      } else {
        this.mark = 0;
      }
    },
    play() {
      this.timer = setInterval(this.autoplay, 8000);
    },
    change(num) {
      this.mark = num;
    },
    stop() {
      clearInterval(this.timer);
      this.timer = null;
    },
  },
  created() {
    this.play();
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>

<style scoped>
.container {
  width: 100%;
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

.pic {
  display: grid;
  grid-template: 1fr/1fr;
}

.piv > div {
  grid-area: 1 / 1;
}

img {
  grid-area: 1 / 1;
  filter: drop-shadow(-20px 20px 10px rgba(93, 68, 68, 0.2));
  transition: transform 1s;
}

img:hover {
  transform: scale(1.05);
}

.img-enter-active,
.img-leave-active {
  /* animation: zoom-in 3s; */
  transition: opacity 0.5s ease-in-out;
}

.img-enter,
.img-leave-to {
  opacity: 0;
}

.img-enter-to,
.img-leave {
  opacity: 1;
}

@keyframes zoom-in {
  0% {
    /* opacity: 0; */
    transform: scale(0.9);
  }
  100% {
    /* opacity: 1; */
    transform: scale(1);
  }
}
</style>