<template>
  <div class="ln-phone-login">
    <Form ref="form">
      <Field
        v-model="phone"
        placeholder="请输入您的11位手机号码"
        :rules="[{ required: true, message: '请填写手机号码' }]"
      >
        <i slot="left-icon" class="iconfont iconphone"></i>
      </Field>
      <check-code v-model="code"></check-code>

      <div class="bottom">
        <Row class="login-row">
          <Button class="login-btn" block type="info" native-type="submit">
            进入游戏
          </Button>
        </Row>
      </div>
    </Form>
  </div>
</template>

<script>
import { Form, Field, Button, Col, Row } from 'vant';
import { commonMixin } from '@/mixin';
import AgreeRegister from '@/components/AgreeRegister';
import CheckCode from '@/components/CheckCode';
export default {
  name: 'ln-phone-login',
  mixins: [commonMixin],
  components: { Form, Field, Button, Row, CheckCode },
  data() {
    return {
      phone: '',
      code: ''
    };
  },
  created() {},
  methods: {}
};
</script>
<style lang="scss">
/* @import url() */
.ln-phone-login {
}
</style>
