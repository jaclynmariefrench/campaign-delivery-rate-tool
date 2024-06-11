<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to the Campaign Delivery Rate App"/>
  <CustomButton>Analyze</CustomButton>
  <CustomInput />
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import CustomButton from './components/ui/CustomButton.vue';
import CustomInput from './components/ui/CustomInput.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    CustomButton,
    CustomInput
  }
}
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
