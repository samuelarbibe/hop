<template>
  <div id="paypal-button-container"></div>
</template>
<script
    src="https://www.paypal.com/sdk/js?client-id=AfmG4QqEw-HCpIVoa0onYWSoeZAtRgXIPoe4_HNF1g_PGrG1PXkC_i8zQZYBFryvVdrL2XNU2kezJJ8l&currency=ILS"></script>
<script>
import { mapState, mapGetters } from "vuex";
import checkout from "../api/checkout";

export default {
  computed: {
    ...mapGetters("cart", [
      "cartProducts",
      "cartSubtotalPrice",
      "cartTotalPrice",
      "cartShippingPrice",
    ]),
    ...mapState({
      selectedShippingOption: (state) => state.cart.selectedShippingOption,
    }),
  },
  methods: {
    setError() {
      this.$emit("error");
    },
    setProccesing() {
      this.$emit("loading");
    },
    setApproved() {
      this.$emit("success");
    },
    getRequestBody() {
      return {
        intent: "CAPTURE",
        application_context: {
          return_url:
            window.location.origin +
            this.$router.resolve({ name: "shop" }).href,
          cancel_url:
            window.location.origin +
            this.$router.resolve({ name: "checkout" }).href,
          brand_name: "HoP TLV",
          locale: "he-IL",
          landing_page: "BILLING",
          shipping_preference:
            this.selectedShippingOption.type === "PICKUP"
              ? "NO_SHIPPING"
              : "GET_FROM_FILE",
          user_action: "CONTINUE",
        },
        purchase_units: [
          {
            amount: {
              currency_code: "ILS",
              value: this.cartTotalPrice,
              breakdown: {
                item_total: {
                  currency_code: "ILS",
                  value: this.cartSubtotalPrice,
                },
                shipping: {
                  currency_code: "ILS",
                  value: this.cartShippingPrice,
                },
              },
            },
            items: this.cartProducts.map((item) => {
              return {
                name: item.name,
                description: item.description,
                unit_amount: {
                  currency_code: "ILS",
                  value: item.price,
                },
                sku: item.id,
                quantity: item.quantity,
              };
            }),
          },
        ],
      };
    },
  },
  mounted() {
    const requestBodyRef = this.getRequestBody;
    const processingRef = this.setProccesing;
    const approvedRef = this.setApproved;
    const errorRef = this.setError;
    const shippingRef = this.selectedShippingOption;

    paypal
      .Buttons({
        createOrder: () => checkout.order(requestBodyRef(), errorRef),
        onApprove: (data) => {
          processingRef();
          const chargingData = {
            orderID: data.orderID,
            shipping: shippingRef
          }
          return checkout.charge(chargingData, approvedRef, errorRef);
        },
        onShippingChange: (data, actions) => {
          const zipCode = data.shipping_address.postal_code;
          if (zipCode >= 61000 && zipCode <= 76104) {
            return actions.resolve();
          }
          return actions.reject();
        },
        onError: (err) => errorRef(),
      })
      .render("#paypal-button-container");
  },
};
</script>