<template>
    <button :class="buttonClass" @click="onClick">
      <slot>Button Text</slot>
    </button>
  </template>
  
  <script>
  export default {
    name: 'CustomButton',
    props: {
      buttonClass: {
        type: String,
        default: 'btn'
      },
      onClick: Function
    }
  }
  </script>
  
  <style scoped>
  @import "./CustomButton.scss";
  </style>