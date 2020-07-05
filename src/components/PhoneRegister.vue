<template>
  <div class="ln-phone-register">
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
          <Col span="12"><Button block type="info" @click="next">注册并登录</Button></Col>
        </Row>

        <AgreeRegister v-model="agree"></AgreeRegister>
      </div>
    </Form>
  </div>
</template>

<script>
import { Form, Field, Button, Col, Row, Dialog } from 'vant';
import { commonMixin } from '@/mixin';
import AgreeRegister from '@/components/AgreeRegister';
import Password from '@/components/Password';
import server from '@/server';
import channelServer from '@/server/channelServer';
import CheckCode from '@/components/CheckCode';
export default {
  name: 'ln-phone-register',
  mixins: [commonMixin],
  components: { Form, Field, Button, Col, Row, AgreeRegister, Password, CheckCode },
  data() {
    return {
      mobile: '',
      code: '',
      upass: '',
      agree: true
    };
  },
  created() {},
  computed: {
    codeParams() {
      return {
        mobile: this.mobile,
        type: 2 /* 注册 */
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
        channelServer.phoneRegister(params).then(({ ret, msg }) => {
          if (ret == 0) {
            const params = {
              uname: this.mobile,
              upass: this.upass
            };
            server.login(params);
          }
        });
      });
    }
  }
};
</script>
<style lang="scss">
/* @import url() */
.ln-phone-register {
}
</style>
