<template>
  <div class="container section">
    <div class="container section">
      <div class="title has-text-centered">
        <h2 class="section-title">Gallery</h2>
      </div>
    </div>
    <div class="container has-text-centered">
      <a
        href="https://www.instagram.com/hoptlv/?hl=en"
        class="button section-button is-large is-rounded"
      >
        <span class="icon is-large">
          <i class="fab fa-instagram fa-lg"></i>
        </span>
        <span> Follow us</span>
      </a>
    </div>
    <div v-if="isLoading" class="loading has-text-centered">
      <span class="is-1 icon is-large">
        <i class="fas fa-spinner fa-pulse fa-lg"></i>
      </span>
    </div>
    <div v-else-if="isError" class="notification">
      <h1 class="title is-4">
        There was an error loading the instagram images.
      </h1>
    </div>
    <div v-else class="container columns is-multiline is-mobile mt-6">
      <div
        v-for="post in posts"
        :key="post.url"
        class="column is-one-third py-0 px-0 mx-0 my-0"
      >
        <img :src="post.thumbnail" :alt="post.caption" />
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "instagram-gallery",
  data() {
    return {
      isLoading: false,
      isError: false,
      posts: [],
    };
  },
  mounted() {
    this.isLoading = true;
    this.isError = false;
    axios
      .get("https://www.instagram.com/hoptlv/?__a=1")
      .then((res) => {
        this.posts = res.data.graphql.user.edge_owner_to_timeline_media.edges
          .slice(0, 9)
          .map((post) => {
            return {
              url: post.node.display_url,
              thumbnail: post.node.thumbnail_src,
              caption: post.node.accessibility_caption,
            };
          });
      })
      .catch((err) => {
        this.isError = true;
        console.log(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  },
  components: {},
};
</script>

<style scoped>


#follow-us-header {
  font-weight: bold;
  font-size: 25px;
}
</style>