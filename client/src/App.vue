<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <EmailForm @formSubmitted="submitForm" />
  <DeliverabilityRating :rating="deliverabilityRating" />
</template>

<script>
import EmailForm from "./components/pages/EmailForm.vue";
import DeliverabilityRating from "./components/pages/DeliverabilityRating.vue";

export default {
  name: "App",
  components: {
    EmailForm,
    DeliverabilityRating,
  },
  data() {
    return {
      deliverabilityRating: null,
    };
  },
  methods: {
    async submitForm(formData) {
      try {
        const response = await fetch("http://localhost:3000/email-form", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        this.deliverabilityRating = data.deliverabilityRating;
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
