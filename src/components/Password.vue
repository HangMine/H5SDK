<template>
  <Field
    v-model="password"
    :type="type"
    :placeholder="placeholder"
    :rules="[{ required: true, message: '请填写密码' }]"
  >
    <i slot="left-icon" class="iconfont iconlock"></i>
    <i
      slot="right-icon"
      class="iconfont iconeye"
      :class="{ iconeye: type === 'password', 'iconeye-close': type === 'text' }"
      @click="changeType"
    ></i>
  </Field>
</template>

<script>
import { Field } from 'vant';
export default {
  name: 'ln-password',
  components: { Field },
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '密码'
    }
  },
  data() {
    return {
      password: '',
      type: 'password'
    };
  },
  watch: {
    value: {
      handler(val) {
        this.password = val;
      },
      immediate: true
    },
    password(val) {
      this.$emit('input', val);
    }
  },
  created() {},
  mounted() {},
  methods: {
    changeType() {
      this.type = this.type === 'password' ? 'text' : 'password';
    }
  }
};
</script>
<style lang="scss">
/* @import url() */
</style>
