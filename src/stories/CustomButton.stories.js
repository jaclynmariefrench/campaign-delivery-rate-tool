import CustomButton from '../components/ui/CustomButton.vue'

export default {
    title: 'CustomButton',
    component: CustomButton,
  };
  
  export const Default = () => ({
    components: { CustomButton },
    template: '<CustomButton />',
  });