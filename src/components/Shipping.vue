<template>
  <div class="container section">
    <h2 class="title is-3 shipping-header mt-4">Shipping</h2>
    <div class="columns mx-0">
      <div class="column">
        <div class="container">
          <div v-if="isLoading" class="loading has-text-centered">
            <span class="is-1 icon is-large">
              <i class="fas fa-spinner fa-pulse fa-lg"></i>
            </span>
          </div>
          <div v-else-if="isError" class="notification is-danger">
            <h2 class="title is-4">
              There was an error loading the shipping options.
            </h2>
            <h2 class="subtitle">Please try again later.</h2>
          </div>
          <div
            v-else-if="selectedShippingOption && selectedShippingType"
            class="container"
          >
            <div class="control">
              <div
                v-for="shippingType in shippingTypes"
                :key="shippingType.type"
              >
                <button
                  dir="rtl"
                  @click="selectShippingType(shippingType)"
                  :class="{
                    'button option-button px-2 ': true,
                    'is-success':
                      shippingType.type == selectedShippingType.type,
                  }"
                >
                  <p class="has-text-right">
                    <span class="icon">
                      <i
                        v-if="shippingType.type == selectedShippingType.type"
                        class="fas fa-dot-circle"
                      ></i>
                      <i v-else class="far fa-circle"></i>
                    </span>
                    <b class="mr-3 is-size-5">{{ shippingType.title }}</b>
                  </p>
                </button>
              </div>
            </div>

            <div class="my-5" dir="rtl">
              <h2 class="title is-5">בחר זמן</h2>
            </div>
            <div class="columns is-mobile">
              <div
                class="column"
                v-for="option in filteredShippingOptions"
                :key="option.id"
                dir="rtl"
              >
                <a @click="selectShippingOption(option.id)">
                  <div
                    :class="{
                      'notification date-button px-4': true,
                      'is-info': selectedShippingOption.id == option.id,
                    }"
                  >
                    <p>
                      {{
                        new Date(option.date.from).toLocaleString("he-IL", {
                          weekday: "long",
                        })
                      }}
                      בין
                      {{
                        new Date(option.date.from).toLocaleTimeString([], {
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      }}
                      ל-
                      {{
                        new Date(option.date.to).toLocaleTimeString([], {
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      }}
                    </p>
                  </div>
                </a>
              </div>
            </div>
            <div class="notification container mt-5 mb-2 pr-5" dir="rtl">
              <p class="is-size-5">
                <b> {{ selectedShippingOption.title }} </b>
                <br />
                <span>
                  ב{{
                    new Date(selectedShippingOption.date.from).toLocaleString(
                      "he-IL",
                      {
                        weekday: "long",
                      }
                    )
                  }}
                  בין
                  {{
                    new Date(
                      selectedShippingOption.date.from
                    ).toLocaleTimeString([], {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }}
                  ל-
                  {{
                    new Date(selectedShippingOption.date.to).toLocaleTimeString(
                      [],
                      {
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  }}
                </span>
                <br />
                <span v-if="selectedShippingOption.type === 'PICKUP'">
                  {{ selectedShippingOption.description }}
                </span>
              </p>
            </div>
            <div class="container pb-5" dir="rtl">
              <span> יש לכם שאלות? </span>
              <a href="https://wa.link/ywkq0q">דברו איתנו באווטסאפ</a>
            </div>
          </div>
          <div v-else class="notification is-danger">
            <h2 class="title is-4">
              There was an error loading the shipping options.
            </h2>
            <h2 class="subtitle">Please try again later.</h2>
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
  data() {
    return {
      selectedShippingType: null,
    };
  },
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
    shippingTypes() {
      let types = [];

      this.shippingOptions.forEach((option) => {
        if (!types.find((type) => type.type === option.type)) {
          types.push({
            type: option.type,
            title: option.title,
          });
        }
      });

      return types;
    },
    filteredShippingOptions() {
      return this.shippingOptions.filter(
        (option) => option.type === this.selectedShippingType.type
      );
    },
  },
  mounted() {
    if (this.selectedShippingOption === null) {
      this.selectShippingOption(this.shippingOptions[0].id);
    }

    this.selectedShippingType = {
      type: this.selectedShippingOption.type,
      title: this.selectedShippingOption.title,
    };
  },
  methods: {
    selectShippingOption(optionId) {
      this.$store.dispatch("cart/setSelectedShippingOption", optionId);
    },
    selectShippingType(shippingType) {
      this.selectedShippingType = shippingType;
      this.selectShippingOption(this.filteredShippingOptions[0].id);
    },
  },
};
</script>

<style scoped>
.option-button {
  width: 100%;
  justify-content: right;
  height: 55px;
  border: 0;
}

.date-button {
  white-space: normal;
}

.date-button {
  height: 100%;
}
</style>