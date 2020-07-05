<template>
  <div class="ln-forget-password">
    <Form ref="form">
      <Field
        v-model="mobile"
        name="mobile"
        placeholder="请输入您的11位手机号码"
        :rules="[{ required: true, message: '请填写手机号码' }]"
      >
        <i slot="left-icon" class="iconfont iconphone"></i>
      </Field>
      <check-code v-model="code" :params="codeParams"></check-code>
      <Password v-model="upass" placeholder="新密码"></Password>
      <div class="bottom">
        <Row class="login-row" gutter="10">
          <Col span="12"><Button block type="info" @click="changeComponent('Login')">返回</Button></Col>
          <Col span="12"><Button block type="info" @click="next">确定</Button></Col>
        </Row>
      </div>
    </Form>
  </div>
</template>

<script>
import { Form, Field, Button, Col, Row } from 'vant';
import { commonMixin } from '@/mixin';
import Password from '@/components/Password';
import CheckCode from '@/components/CheckCode';
import channelServer from '@/server/channelServer';
export default {
  name: 'ln-forget-password',
  mixins: [commonMixin],
  components: { Form, Field, Button, Col, Row, Password, CheckCode },
  data() {
    return {
      mobile: '',
      code: '',
      upass: ''
    };
  },
  created() {},
  computed: {
    codeParams() {
      return {
        mobile: this.mobile,
        type: 3 /* 找回密码 */
      };
    }
  },
  methods: {
    next() {
      this.formCheck('form').then(() => {
        const params = {
          mobile: this.mobile,
          code: this.code,
          upass: this.upass
        };
        channelServer.forgetPassword(params).then(data => {
          this.changeComponent('Login');
        });
      });
    }
  }
};
</script>
<style lang="scss">
/* @import url() */
.ln-forget-password {
}
</style>
