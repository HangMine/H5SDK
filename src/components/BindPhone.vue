<template>
  <div class="ln-bind-phone">
    <Form ref="form">
      <Field
        v-model="info"
        name="info"
        placeholder="请输入您的11位手机号码"
        :rules="[{ required: true, message: '请填写手机号码' }]"
      >
        <i slot="left-icon" class="iconfont iconphone"></i>
      </Field>
      <check-code v-model="code" :params="codeParams"></check-code>
      <div class="bottom">
        <Row class="login-row" gutter="10">
          <Col span="12"><Button block type="info" @click="changeComponent('Login')">返回</Button></Col>
          <Col span="12"><Button block type="info" @click="next">确认绑定</Button></Col>
        </Row>

        <AgreeRegister v-model="agree"></AgreeRegister>
      </div>
    </Form>
  </div>
</template>

<script>
import { Form, Field, Button, Col, Row } from 'vant';
import { commonMixin } from '@/mixin';
import AgreeRegister from '@/components/AgreeRegister';
import CheckCode from '@/components/CheckCode';
import channelServer from '@/server/channelServer';
import cookies from '@/cookies';
export default {
  name: 'ln-bind-phone',
  mixins: [commonMixin],
  components: { Form, Field, Button, Col, Row, AgreeRegister, CheckCode },
  data() {
    return {
      info: '',
      code: '',
      token: '',
      agree: true
    };
  },
  created() {},
  computed: {
    codeParams() {
      return {
        mobile: this.info,
        type: 4 /* 绑定手机 */
      };
    }
  },
  methods: {
    next() {
      this.formCheck('form').then(() => {
        const params = {
          info: this.info,
          code: this.code,
          token: cookies.getItem('ln_h5sdk_guest_token') || cookies.getItem('ln_h5sdk_user_token') || ''
        };
        channelServer.bindPhone(params).then(() => {
          this.$store.commit('SHOW', 'Login');
        });
      });
    }
  }
};
</script>
<style lang="scss">
/* @import url() */
.ln-bind-phone {
}
</style>
