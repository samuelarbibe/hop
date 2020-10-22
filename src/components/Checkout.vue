<template>
  <div class="container section">
    <h2 class="title is-3 shipping-header mt-4">Checkout</h2>
    <LoadingPopup v-if="isLoading" />
    <div v-else-if="isError" class="notification is-danger" dir="rtl">
      <h2 class="title is-4">הייתה בעיה בביצוע התשלום.</h2>
    </div>
    <div v-else-if="isSuccess" class="notification is-success" dir="rtl">
      <h2 class="title is-4">התשלום התבצע בהצלחה!</h2>
      <p class="is-size-4-desktop">
        <span>תודה רבה על הקניה </span>
        <span>{{ details.payer.name.given_name }}.</span>
      </p>
      <br />
      <p class="is-size-4-desktop">
        <span>כל הפרטים על הקניה נשלחו ל-</span>
        <a>{{ details.payer.email_address }}</a>
      </p>
    </div>
    <div v-show="!isError && !isSuccess" class="columns mx-0">
      <div class="column is-hidden-desktop is-hidden-tablet">
        <ItemList />
      </div>
      <div class="column">
        <div class="container">
          <div class="is-hidden-mobile notification container mb-5 pr-5 ">
            <p class="subtitle is-size-5" dir="rtl">
              התשלום מתבצע באמצעות פייפל, וישנה האפשרות לשלם באמצעות חשבון
              PayPal או באמצעות כרטיס אשראי.
            </p>
          </div>
          <PayPalCheckout
            @loading="setLoading"
            @success="setSuccess"
            @error="setError"
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
import LoadingPopup from "./LoadingPopup";
import PayPalCheckout from "./PayPal";
import ItemList from "./ItemList";

export default {
  name: "checkout",
  components: {
    PayPalCheckout,
    ItemList,
    LoadingPopup,
  },
  data() {
    return {
      isLoading: false,
      isError: false,
      isSuccess: false,
      details: {
        payer: {
          name: {
            given_name: "samuel",
          },
          email_address: "samuel.arbibe@gmail.com",
        },
      },
    };
  },
  methods: {
    setError() {
      this.$store.dispatch("cart/setIsCartLocked", false);
      this.isLoading = false;
      this.isError = true;
      this.$swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    },
    setLoading() {
      this.isError = false;
      this.isLoading = true;
    },
    setSuccess(details) {
      this.$store.dispatch("cart/emptyCart");
      this.details = details;
      this.isError = false;
      this.isLoading = false;
      this.isSuccess = true;
    },
  },
};
</script>

<style scoped>
.is-loading {
  max-width: 500px;
}
</style>