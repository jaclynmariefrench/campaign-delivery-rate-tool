<template>
  <div class="input-wrapper">
    <label v-if="label" :for="name">{{ label }}</label>
    <div class="input-content">
      <input
        :id="name"
        :name="name"
        :type="type"
        :placeholder="placeholder"
        v-model="inputModel"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M10 9.16667V13.3333M10 6.66667H10.0083M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
          stroke="#141C24"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </div>
    <p class="hint" v-if="hint && !error">{{ hint }}</p>
    <p class="error" v-if="errorText && error">{{ errorText }}</p>
  </div>
</template>

<script>
export default {
  name: "CustomInput",
  props: {
    label: String,
    name: String,
    type: {
      type: String,
      default: "text",
    },
    value: String,
    hint: String,
    error: Boolean,
    errorText: String,
    placeholder: String,
  },
  data() {
    return {
      inputModel: this.value,
    };
  },
  watch: {
    value(newVal) {
      this.inputModel = newVal;
    },
    inputModel(newVal) {
      this.$emit("input", newVal);
    },
  },
};
</script>

<style scoped>
@import "./CustomInput.scss";
</style>
