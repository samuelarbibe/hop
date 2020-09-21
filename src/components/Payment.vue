<template>
  <div class="section">
    <h1 class="title is-3 shipping-header">Payment</h1>
    <div class="columns mx-0">
      <div class="column">
        <div class="container">
          <div class="notification container my-5">
            <h2
              class="subtitle"
              dir="rtl"
            >התשלום מתבצע באמצעות פייפל, וישנה האפשרות לשלם באמצעות חשבון PayPal או באמצעות כרטיס אשראי.</h2>
          </div>
          <PayPalCheckout />
        </div>
      </div>
      <div class="column is-hidden-mobile">
        <ItemList/>
      </div>
    </div>
  </div>
</template>

<script>
import PayPalCheckout from "./PayPal";
import ItemList from "./ItemList";

export default {
  name: "payment",
  components: {
    PayPalCheckout,
    ItemList,
  },
};
</script>

<style scoped>
</style>