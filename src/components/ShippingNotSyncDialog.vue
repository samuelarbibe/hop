<template>
  <div class="modal-mask">
    <div class="popup box has-text-centered" dir="rtl">
      <div class="container section py-4">
        <span class="icon is-large is-size-1 has-text-info">
          <i class="fas fa-info-circle fa-lg"></i>
        </span>
      </div>
      <h2 class="title is-3">שינוי במשלוח</h2>
      <p class="subtitle is-size-5">
        המשלוח שבחרת עודכן על ידי בעל החנות. חזור כדי לבחור אותו שוב
      </p>
      <button class="button is-info" @click="setSynced()">עבור למשלוח</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "shipping-not-synced-dialog",
  methods: {
    setSynced() {
      this.$router.push({ name: "shipping" }).catch(() => {});
      this.$store.dispatch("cart/setIsShippingSynced", true);
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

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
</style>