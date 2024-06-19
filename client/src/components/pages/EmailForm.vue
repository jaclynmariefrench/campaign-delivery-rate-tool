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
        type="text"
        v-model="deliveryRate"
        errorText="Please enter a number"
        :error="isDeliveryRateEmpty || isDeliveryRateInvalid"
      />
      <CustomInput
        placeholder="Open Rate"
        type="text"
        v-model="openRate"
        errorText="Please enter a number"
        :error="isOpenRateEmpty || isOpenRateInvalid"
      />
      <CustomInput
        placeholder="Click Rate"
        type="text"
        v-model="clickRate"
        errorText="Please enter a number"
        :error="isClickRateEmpty || isClickRateInvalid"
      />
      <CustomInput
        placeholder="Unsubscribe Rate"
        type="text"
        v-model="unsubscribeRate"
        errorText="Please enter a number"
        :error="isUnsubscribeRateEmpty || isUnsubscribeRateInvalid"
      />
      <CustomInput
        placeholder="Complaint Rate"
        type="text"
        v-model="complaintRate"
        errorText="Please enter a number"
        :error="isComplaintRateEmpty || isComplaintRateInvalid"
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
      campaignName: "",
      deliveryRate: "",
      openRate: "",
      clickRate: "",
      unsubscribeRate: "",
      complaintRate: "",
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
    isUnsubscribeRateEmpty() {
      return this.formSubmitted && this.isEmpty(this.unsubscribeRate);
    },
    isComplaintRateEmpty() {
      return this.formSubmitted && this.isEmpty(this.complaintRate);
    },
    isDeliveryRateInvalid() {
      return this.formSubmitted && !this.isValidNumber(this.deliveryRate);
    },
    isOpenRateInvalid() {
      return this.formSubmitted && !this.isValidNumber(this.openRate);
    },
    isClickRateInvalid() {
      return this.formSubmitted && !this.isValidNumber(this.clickRate);
    },
    isUnsubscribeRateInvalid() {
      return this.formSubmitted && !this.isValidNumber(this.unsubscribeRate);
    },
    isComplaintRateInvalid() {
      return this.formSubmitted && !this.isValidNumber(this.complaintRate);
    },
  },
  methods: {
    isEmpty(value) {
      return value === "";
    },
    isValidNumber(value) {
      // This regular expression matches a number with optional decimal places
      const regex = /^\d*\.?\d*$/;
      return regex.test(value);
    },
    async handleSubmit() {
      this.formSubmitted = true;

      if (
        this.isDeliveryRateEmpty ||
        this.isDeliveryRateInvalid ||
        this.isOpenRateEmpty ||
        this.isOpenRateInvalid ||
        this.isClickRateEmpty ||
        this.isClickRateInvalid ||
        this.isUnsubscribeRateEmpty ||
        this.isUnsubscribeRateEmpty ||
        this.isComplaintRateEmpty ||
        this.isComplaintRateInvalid
      ) {
        return;
      }

      const formData = {
        campaignName: this.campaignName,
        deliveryRate: this.deliveryRate,
        openRate: this.openRate,
        clickRate: this.clickRate,
        unsubscribeRate: this.unsubscribeRate,
        complaintRate: this.complaintRate,
      };

      // Emit the formSubmitted event with formData as payload
      this.$emit("formSubmitted", formData);
    },
  },
};
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
