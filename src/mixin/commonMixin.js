export default {
  methods: {
    changeComponent(componentName) {
      this.$emit('change-component', componentName);
    },
    formCheck(formName, formItem) {
      return this.$refs[formName].validate(formItem);
    }
  }
};
