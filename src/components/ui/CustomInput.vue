<template>
  <div class="input-wrapper">
    <label v-if="label" :for="name">{{ label }}</label>
    <div class="input-content" :class="{ 'input-content-error': error }">
      <input
        :id="name"
        :name="name"
        :type="type"
        :placeholder="placeholder"
        :value="inputModel"
        @input="updateValue"
      />
      <svg
        v-if="!error"
        class="info-icon"
        xmlns="http://www.w3.org/2000/svg"
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
      <svg
        v-if="error"
        class="error-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M9.99995 8.33334L9.99995 11.6667M9.99995 14.1667H10.0083M8.54302 4.28915L3.04221 14.1906C2.42505 15.3015 3.22833 16.6667 4.49914 16.6667H15.5008C16.7716 16.6667 17.5748 15.3015 16.9577 14.1906L11.4569 4.28915C10.8219 3.14613 9.17803 3.14613 8.54302 4.28915Z"
          stroke="#F64C4C"
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
    value: [String, Number],
    hint: String,
    error: Boolean,
    errorText: String,
    placeholder: String,
  },
  emits: ['update:modelValue'],
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
      this.$emit("update:modelValue", newVal);
    },
  },
  methods: {
    updateValue(event) {
      this.inputModel = event.target.value;
    },
  },
};
</script>

<style scoped>
@import "./CustomInput.scss";
</style>
