import CustomButton from "../components/ui/CustomButton.vue";

export default {
  title: "CustomButton",
  component: CustomButton,
  argTypes: {
    buttonText: { control: "text" },
  },
};

export const Default = (args, { argTypes }) => ({
  components: { CustomButton },
  props: Object.keys(argTypes),
  template: `<CustomButton>${args.buttonText}</CustomButton>`,
});
