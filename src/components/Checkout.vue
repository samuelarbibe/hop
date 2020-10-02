<template>
  <div class="container section">
    <h2 class="title is-3 shipping-header">Checkout</h2>
    <div
      v-if="isLoading"
      class="notification is-info has-text-centered"
      dir="rtl"
    >
      <h2 class="title is-4">מעבדים את התשלום...</h2>
      <span class="is-1 icon is-large">
        <i class="fas fa-spinner fa-pulse fa-lg"></i>
      </span>
    </div>
    <div v-else-if="isError" class="notification is-danger" dir="rtl">
      <h2 class="title is-4">התשלום לא התבצע.</h2>
    </div>
    <div v-else-if="isSuccess" class="notification is-success" dir="rtl">
      <h2 class="title is-4">התשלום התבצע בהצלחה!</h2>
    </div>
    <div v-show="!isLoading && !isError && !isSuccess" class="columns mx-0">
      <div class="column">
        <div class="container">
          <div class="notification container my-5">
            <h2 class="subtitle" dir="rtl">
              התשלום מתבצע באמצעות פייפל, וישנה האפשרות לשלם באמצעות חשבון
              PayPal או באמצעות כרטיס אשראי.
            </h2>
          </div>
          <PayPalCheckout
            @loading="setLoading()"
            @success="setSuccess()"
            @error="setError()"
          />
        </div>
      </div>
      <div class="column is-hidden-mobile">
        <ItemList />
      </div>
    </div>
  </div>
</template>

<script>
import PayPalCheckout from "./PayPal";
import ItemList from "./ItemList";

export default {
  name: "checkout",
  components: {
    PayPalCheckout,
    ItemList,
  },
  data() {
    return {
      isLoading: false,
      isError: false,
      isSuccess: false,
    };
  },
  methods: {
    setError() {
      this.$store.dispatch("cart/setIsCartLocked", false);
      this.isLoading = false;
      this.isError = true;
    },
    setLoading() {
      this.isError = false;
      this.isLoading = true;
    },
    setSuccess() {
      this.$store.dispatch("cart/setIsCartLocked", true);
      this.$store.dispatch("cart/emptyCart");
      this.isError = false;
      this.isLoading = false;
      this.isSuccess = true;
    },
  },
};
</script>

<style scoped>
</style>