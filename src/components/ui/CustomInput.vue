<template>
    <div class="input-wrapper">
      <label v-if="label" :for="name">{{ label }}</label>
      <input :id="name" :name="name" :type="type" v-model="inputModel" />
    </div>
  </template>
  
  <script>
  export default {
    name: 'CustomInput',
    props: {
      label: String,
      name: String,
      type: {
        type: String,
        default: 'text'
      },
      value: String
    },
    data() {
      return {
        inputModel: this.value
      }
    },
    watch: {
      value(newVal) {
        this.inputModel = newVal;
      },
      inputModel(newVal) {
        this.$emit('input', newVal);
      }
    }
  }
  </script>
  
  <style scoped>
  .input-wrapper {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input {
    width: 50%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  </style>