<template>
  <div class="modal-mask">
    <div class="popup box has-text-centered" dir="rtl">
      <h2 class="title is-3">מעבדים את התשלום...</h2>
      <div class="container section py-4">
        <span class="is-1 icon is-large">
          <i class="fas fa-spinner fa-pulse fa-lg"></i>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "loading-popup",
};
</script>

<style scoped>
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 80%;
  max-width: 400px;
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