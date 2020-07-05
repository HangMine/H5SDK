<template>
  <div class="ln-user-account">
    <span class="form-title">当前账号:</span>
    <h2 class="number">
      {{ user.account || '请先登录' }}
      <van-button type="info" size="small" @click="bindPhone">绑定手机</van-button>
    </h2>
    <div v-if="user.is_guest">
      <span class="form-title">账号密码</span>
      <h2 class="number">
        {{ showUpass || '******' }}
        <van-icon class="eye-icon" :name="`${isShowPass ? 'closed-eye' : 'eye-o'}`" @click="toggleShowPass" />
      </h2>
    </div>

    <Form ref="form">
      <div class="bottom">
        <Row class="login-row">
          <Button class="login-btn" block type="info" native-type="button" @click="changeComponent('Login')">
            切换账号
          </Button>
        </Row>
      </div>
    </Form>
  </div>
</template>

<script>
import { Form, Button, Row, Dialog } from 'vant';
import { mapState } from 'vuex';

export default {
  name: 'ln-user-account',
  components: { Form, Row, Button },
  data() {
    return {
      isShowPass: false
    };
  },
  computed: {
    ...mapState(['user']),
    showUpass() {
      const passwd = this.user.passwd;
      return this.isShowPass ? passwd : passwd.replace(/./g, '*');
    }
  },
  created() {},
  mounted() {},
  methods: {
    toggleShowPass() {
      this.isShowPass = !this.isShowPass;
    },
    bindPhone() {
      if (!this.user.account) {
        Dialog({ message: '请先登录' });
        return;
      }
      this.changeComponent('BindPhone');
    },
    changeComponent(components) {
      this.$store.commit('SHOW', components);
    }
  }
};
</script>
<style lang="scss">
@import '@/assets/css/var.scss';
.ln-user-account {
  .number {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: $theme-color;
    margin: 5px 15px;
    font-size: 20px;
    .eye-icon {
      color: #969799;
    }
  }
}
</style>
