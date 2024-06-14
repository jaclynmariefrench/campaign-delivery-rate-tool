<template>
  <form @submit.prevent="handleSubmit" class="email-form">
    <div class="input-container">
      <CustomInput
        placeholder="Campaign Name"
        type="text"
        v-model="campaignName"
      />
      <CustomInput
        placeholder="Delivery Rate"
        type="number"
        v-model="deliveryRate"
        errorText="Please enter a number"
        :error="isDeliveryRateEmpty"
      />
      <CustomInput
        placeholder="Open Rate"
        type="number"
        v-model="openRate"
        errorText="Please enter a number"
        :error="isOpenRateEmpty"
      />
      <CustomInput
        placeholder="Click Rate"
        type="number"
        v-model="clickRate"
        errorText="Please enter a number"
        :error="isClickRateEmpty"
      />
      <CustomInput
        placeholder="Complaint Rate"
        type="number"
        v-model="complaintRate"
        errorText="Please enter a number"
        :error="isComplaintRateEmpty"
      />
    </div>
    <div class="button-container">
      <CustomButton type="submit">Calculate</CustomButton>
    </div>
  </form>
</template>

<script>
import CustomInput from "../ui/CustomInput.vue";
import CustomButton from "../ui/CustomButton.vue";

export default {
  components: {
    CustomInput,
    CustomButton,
  },
  data() {
    return {
      campaignName: '',
      deliveryRate: '',
      openRate: '',
      clickRate: '',
      complaintRate: '',
      formSubmitted: false,
    };
  },
  computed: {
    isDeliveryRateEmpty() {
      return this.formSubmitted && this.isEmpty(this.deliveryRate);
    },
    isOpenRateEmpty() {
      return this.formSubmitted && this.isEmpty(this.openRate);
    },
    isClickRateEmpty() {
      return this.formSubmitted && this.isEmpty(this.clickRate);
    },
    isComplaintRateEmpty() {
      return this.formSubmitted && this.isEmpty(this.complaintRate);
    },
  },
  methods: {
    isEmpty(value) {
      return value === "";
    },
    async handleSubmit() {
      this.formSubmitted = true;
      if (
        this.isDeliveryRateEmpty ||
        this.isOpenRateEmpty ||
        this.isClickRateEmpty ||
        this.isComplaintRateEmpty
      ) {
        return;
      }

      const formData = {
        campaignName: this.campaignName,
        deliveryRate: this.deliveryRate,
        openRate: this.openRate,
        clickRate: this.clickRate,
        complaintRate: this.complaintRate,
      };
      try {
        console.log(formData);
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    },
  },
}
</script>

<style>
@import "./EmailForm.scss";

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
