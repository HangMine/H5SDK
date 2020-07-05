<template>
  <row class="ln-agree-register link-wrap">
    <Checkbox v-model="agree" shape="square" :icon-size="14">同意 <span class="link">注册条款</span></Checkbox>
  </row>
</template>

<script>
import { Row, Checkbox } from 'vant';
export default {
  name: 'ln-agree-register',
  components: { Row, Checkbox },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      agree: false
    };
  },
  watch: {
    value: {
      handler(val) {
        this.agree = val;
      },
      immediate: true
    },
    agree(val) {
      this.$emit('input', val);
    }
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang="scss">
/* @import ('url') */
.ln-agree-register {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 13px;
  margin-top: 10px;
}
</style>
