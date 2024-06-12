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
        :error="!isDeliveryRateNumber"
      />
      <CustomInput
        placeholder="Open Rate"
        type="number"
        v-model="openRate"
        errorText="Please enter a number"
        :error="!isOpenRateNumber"
      />
      <CustomInput
        placeholder="Click Rate"
        type="number"
        v-model="clickRate"
        errorText="Please enter a number"
        :error="!isClickRateNumber"
      />
      <CustomInput
        placeholder="Complaint Rate"
        type="number"
        v-model="complaintRate"
        errorText="Please enter a number"
        :error="!isComplaintRateNumber"
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
      complaintRate: "",
    };
  },
  computed: {
    isDeliveryRateNumber() {
      return this.isNumber(this.deliveryRate);
    },
    isOpenRateNumber() {
      return this.isNumber(this.openRate);
    },
    isClickRateNumber() {
      return this.isNumber(this.clickRate);
    },
    isComplaintRateNumber() {
      return this.isNumber(this.complaintRate);
    },
  },
  methods: {
    isNumber(value) {
      return value === "" || /^-?\d+(\.\d+)?$/.test(value);
    },
    handleSubmit() {
      this.$emit("submit", {
        campaignName: this.campaignName,
        deliveryRate: this.deliveryRate,
        openRate: this.openRate,
        clickRate: this.clickRate,
        complaintRate: this.complaintRate,
      });
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
