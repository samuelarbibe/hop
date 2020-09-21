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
        createOrder(data, actions) {
          return actions.order.create({
            order_application_context: {
              brand_name: "HoP",
              local: "he-IL",
            },
            purchase_units: [
              {
                amount: {
                  currency_code: "ILS",
                  value: totalPriceRef(),
                  breakdown: {
                    item_total: {
                      currency_code: "ILS",
                      value: subtotalPriceRef(),
                    },
                    shipping: {
                      currency_code: "ILS",
                      value: shippingPriceRef(),
                    },
                  },
                },
                items: productsRef().map((item) => {
                  return {
                    name: item.name,
                    description: item.description,
                    unit_amount: {
                      currency_code: "ILS",
                      value: item.price,
                    },
                    quantity: item.quantity,
                  };
                }),
              },
            ],
          });
        },
        onApprove(data, actions) {
          // This function captures the funds from the transaction.
          return actions.order.capture().then(function (details) {
            console.log(details);
            approvedRef();
            // This function shows a transaction success message to your buyer.
            // alert("Transaction completed by " + details.payer.name.given_name);
          });
        },
      })
      .render("#paypal-button-container");
  },
};
</script>