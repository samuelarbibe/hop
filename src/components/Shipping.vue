<template>
  <div class="container section">
    <h1 class="title is-3 shipping-header">Shipping</h1>
    <div class="columns mx-0">
      <div class="column">
        <div class="container">
          <div v-if="isLoading" class="loading has-text-centered">
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
              <div v-for="option in shippingOptions" :key="option.id">
                <button
                  dir="rtl"
                  @click="selectShippingOption(option.id)"
                  :class="{'button option-button px-3':true, 'is-success':selectedShippingOption.id == option.id}"
                >
                  <span class="icon">
                    <i v-if="selectedShippingOption.id == option.id" class="fas fa-dot-circle"></i>
                    <i v-else class="far fa-circle"></i>
                  </span>
                  <span class="mr-3 is-size-5">{{option.title}}</span>
                </button>
              </div>
            </div>
            <div class="notification container mt-5 mb-2" dir="rtl">
              <h2 class="subtitle">{{selectedShippingOption.description}}</h2>
            </div>
            <div class="my-5" dir="rtl">
              <h1 v-if="selectedShippingOption.dates.length > 1" class="title is-4">בחר זמן משלוח</h1>
              <h1 v-else class="title is-4">זמן משלוח</h1>
            </div>
            <div class="columns is-mobile" :key="selectedShippingOption.selectedShippingDate.id">
              <div
                class="column"
                v-for="date in selectedShippingOption.dates"
                :key="date.id"
                dir="rtl"
              >
                <a @click="selectShippingDateOption(date.id)">
                  <div
                    :class="{'notification date-button px-4': true, 'is-info': selectedShippingOption.selectedShippingDate.id == date.id}"
                  >
                    <p>
                      {{new Date(date.from).toLocaleString('he-IL', {weekday: 'long'})}}
                      בין
                      {{new Date(date.from).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}}
                      ל-
                      {{new Date(date.to).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}}
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-hidden-mobile">
        <ItemList />
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
    selectShippingOption(optionId) {
      this.$store.dispatch("cart/setSelectedShippingOption", optionId);
    },
    selectShippingDateOption(dateId) {
      this.$store.dispatch("cart/setSelectedShippingDateOption", {
        optionId: this.selectedShippingOption.id,
        dateId: dateId,
      });
    },
  },

};
</script>

<style scoped>
.option-button {
  width: 100%;
  justify-content: right;
  height: 60px;
  border: 0;
}

.date-button {
  white-space: normal;
}
</style>