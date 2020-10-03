<template>
  <div class="popup box has-text-centered" dir="rtl">
    <div class="container section py-4">
      <span class="icon is-large is-size-1 has-text-info">
        <i class="fas fa-info-circle fa-lg"></i>
      </span>
    </div>
    <h2 class="title is-3">החנות סגורה!</h2>
    <p class="subtitle is-size-5">אנו מצטערים, אך החנות נסגרה</p>
    <button class="button is-info" @click="ok()">חזור לדף הבית</button>
  </div>
</template>
<script>
export default {
  name: "shop-closed-dialog",
  methods: {
    ok() {
      this.$router.push({ name: "shop" }).catch(() => {});
    },
  },
};
</script>

<style scoped>
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 80%;
  max-width: 400px;
  height: 300px;
  transform: translate(-50%, -50%);
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>