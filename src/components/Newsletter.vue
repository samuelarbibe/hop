<template>
  <div class="container section">
    <div class="container section">
      <div class="title has-text-centered">
        <h2 class="section-title">Newsletter</h2>
      </div>
    </div>
    <div id="newsletter-input-container" class="container has-text-centered">
      <p class="section-subtitle">Get notified about new products</p>
      <div class="columns" >
        <div class="column">
          <input
            type="text"
            class="input"
            placeholder="Email"
            v-model="email"
          />
        </div>
        <div v-if="notValid" class="mx-3 has-text-danger">
          <span>Invalid Email</span>
        </div>
        <div class="column is-narrow">
          <button class="button is-dark" @click="subscribe()">Subscribe</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import shop from "../api/shop";

export default {
  name: "newsletter",
  data() {
    return {
      email: "",
      notValid: false,
    };
  },
  computed: {
    isValid() {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.email).toLowerCase());
    },
  },
  methods: {
    subscribe() {
      if (this.isValid) {
        this.notValid = false;
        const toastRef = this.$toast;
        shop.subscribeToNewsletter(this.email.toLowerCase(), {
          successCb() {
            toastRef.open({
              message: "הרשמה הוצלחה",
              type: "success",
              duration: 1000,
              dismissible: true,
              position: "bottom",
            });
          },
          usedEmailCb() {
            toastRef.open({
              message: "אתה כבר רשום",
              type: "warning",
              duration: 1000,
              dismissible: true,
              position: "bottom",
            });
          },
          errorCb(err) {
            toastRef.open({
              message: "לא הצלחנו לרשום אותך...",
              type: "error",
              duration: 1000,
              dismissible: true,
              position: "bottom",
            });
            console.log(err);
          },
        });
      } else {
        this.notValid = true;
      }
    },
  },
};
</script>

<style scoped>
.button {
  width: 100%;
}

#newsletter-input-container {
  margin: 0 auto;
  max-width: 600px;
}
</style>