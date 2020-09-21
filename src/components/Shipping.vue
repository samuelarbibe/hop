<template>
  <div class="section">
    <h1 class="title is-3 shipping-header">Shipping</h1>
    <div class="columns mx-0">
      <div class="column">
        <div class="container">
          <div v-if="isLoading" class="loading">
            <span class="is-1 icon is-large">
              <i class="fas fa-spinner fa-pulse fa-lg"></i>
            </span>
          </div>
          <div v-else-if="isError" class="notification is-danger">
            <h1 class="title is-4">There was an error loading the shipping options.</h1>
            <h2 class="subtitle">Please try again later.</h2>
          </div>
          <div v-else class="container">
            <div class="control is-size-4">
              <div v-for="option in shippingOptions" :key="option.id" class="option">
                <label class="radio">
                  <input
                    type="radio"
                    name="answer"
                    :value="option.id"
                    @change="deliveryOptionChanged($event)"
                    :checked="selectedShippingOption.id == option.id"
                  />
                  <span class="px-3">{{option.title}}</span>
                </label>
                <br />
              </div>
            </div>
            <div class="notification container my-5">
              <h2 class="subtitle">{{selectedShippingOption.description}}</h2>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-hidden-mobile">
        <ItemList
          :showDelivery="selectedShippingOption != null"
          :showTotal="selectedShippingOption != null"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ItemList from "./ItemList";

export default {
  name: "shipping",
  components: {
    ItemList,
  },
  computed: {
    ...mapState({
      shippingOptions: (state) => state.cart.shippingOptions,
      selectedShippingOption: (state) => state.cart.selectedShippingOption,
      isLoading: (state) => state.cart.isLoading,
      isError: (state) => state.cart.isError,
    }),
  },
  methods: {
    deliveryOptionChanged(event) {
      this.$store.dispatch(
        "cart/setSelectedShippingOption",
        event.target.value
      );
    },
  },
};
</script>

<style scoped>
.button {
  width: 100%;
}
</style>