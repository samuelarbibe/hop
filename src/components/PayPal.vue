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
    createOrderDetails() {
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
    const self = this;
    let lockedOrderDetails = null;
    let lockedShippingOption = null;

    paypal
      .Buttons({
        onClick: () => {
          // set cart status to locked
          self.$store.dispatch("cart/setIsCartLocked", true);
          lockedOrderDetails = self.createOrderDetails();
          lockedShippingOption = self.selectedShippingOption;
        },
        createOrder: () => checkout.order(lockedOrderDetails, self.setError),
        onApprove: (data, actions) => {
          self.setProccesing();
          const chargingData = {
            orderID: data.orderID,
            shipping: lockedShippingOption,
          };
          return checkout.charge(
            chargingData,
            actions,
            self.setApproved,
            self.setError
          );
        },
        onShippingChange: (data, actions) =>
          checkout.checkShippingAddress(data, actions),
        onError: (err) => self.setError(),
        onCancel: () => {
          self.$store.dispatch("cart/setIsCartLocked", false);
        },
      })
      .render("#paypal-button-container");
  },
};
</script>