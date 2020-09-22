<template>
  <div id="paypal-button-container"></div>
</template>
<script
    src="https://www.paypal.com/sdk/js?client-id=AfmG4QqEw-HCpIVoa0onYWSoeZAtRgXIPoe4_HNF1g_PGrG1PXkC_i8zQZYBFryvVdrL2XNU2kezJJ8l&currency=ILS"></script>
<script>
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      paypal: {
        sandbox: "<sandbox client id>",
        production: "<production client id>",
      },
    };
  },
  computed: {
    ...mapGetters("cart", [
      "cartProducts",
      "cartSubtotalPrice",
      "cartTotalPrice",
      "cartShippingPrice",
    ]),
  },
  methods: {
    products() {
      return this.cartProducts;
    },
    subtotalPrice() {
      return this.cartSubtotalPrice;
    },
    shippingPrice() {
      return this.cartShippingPrice;
    },
    totalPrice() {
      return this.cartTotalPrice;
    },
    goToApproved() {
      this.$router.push({ name: "approved" }).catch(() => {});
    },
  },
  mounted() {
    const productsRef = this.products;
    const subtotalPriceRef = this.subtotalPrice;
    const shippingPriceRef = this.shippingPrice;
    const totalPriceRef = this.totalPrice;
    const approvedRef = this.goToApproved;
    paypal
      .Buttons({
        createOrder() {
          return fetch("http://localhost:5001/hop-tlv/us-central1/checkout", {
            method: "post",
            headers: {
              "content-type": "application/json",
            },
          })
            .then(function (res) {
              return res.json();
            })
            .then(function (data) {
              return data.orderID; // Use the same key name for order ID on the client and server
            });
        },
      })
      .render("#paypal-button-container");
  },
};
</script>