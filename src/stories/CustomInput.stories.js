import CustomInput from "../components/ui/CustomInput.vue";

export default {
  title: "CustomInput",
  component: CustomInput,
  argTypes: {
    label: { control: "text" },
    name: { control: "text" },
    type: { control: "text" },
    value: { control: "text" },
    hint: { control: "text" },
    error: { control: "boolean" },
    errorText: { control: "text" },
    placeholder: { control: "text" },
  },
};

export const Default = (args) => ({
  components: { CustomInput },
  setup() {
    return { args };
  },
  template: '<CustomInput v-bind="args" />',
});
