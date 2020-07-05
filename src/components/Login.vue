<template>
  <div class="ln-login">
    <Form ref="form">
      <Field v-model="username" placeholder="账号" :rules="[{ required: true, message: '请填写账号' }]">
        <i slot="left-icon" class="iconfont iconuser"></i>
      </Field>
      <Password v-model="password"></Password>
      <div class="bottom">
        <Row class="login-row">
          <Button class="login-btn" block type="info" @click="login">
            进入游戏
          </Button>
        </Row>

        <Row class="login-row" gutter="10">
          <Col span="12"><Button block type="info" native-type="button" @click="guestLogin">游客登录</Button></Col>
          <Col span="12"><Button block type="info" @click="changeComponent('PhoneRegister')">手机注册</Button></Col>
        </Row>

        <Row class="login-row link-wrap">
          <!-- <span class="link" @click="changeComponent('PhoneLogin')">手机登录</span> -->
          <span class="link" @click="changeComponent('ForgetPassword')">忘记密码?</span>
        </Row>
      </div>
    </Form>
  </div>
</template>

<script>
import cookies from '@/cookies';
import { Form, Field, Button, Col, Row, Dialog } from 'vant';
import { commonMixin } from '@/mixin';
import Password from '@/components/Password';
// 不能直接在这里解构，后续需检查 ！！
import server from '@/server';
import channelServer from '@/server/channelServer';
export default {
  name: 'ln-login',
  mixins: [commonMixin],
  components: { Form, Field, Button, Col, Row, Password },
  data() {
    return {
      username: '',
      password: ''
    };
  },
  created() {},
  mounted() {
    const cookieUserName = cookies.getItem('ln_h5sdk_user_name');
    if (cookieUserName) {
      this.username = cookieUserName;
    }
  },
  methods: {
    // 进入游戏
    login() {
      this.formCheck('form').then(() => {
        const params = {
          uname: this.username,
          upass: this.password
        };
        server.login(params);
      });
    },
    guestLogin() {
      channelServer.guestLogin();
    }
  }
};
</script>
<style lang="scss">
/* @import url() */
.ln-login {
}
</style>
