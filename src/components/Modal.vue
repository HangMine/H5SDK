<template>
  <div class="ln-modal">
    <Dialog v-model="show" :show-confirm-button="false" :overlayStyle="{ 'background-color': 'rgba(0, 0, 0, 0.4)' }">
      <div class="modal-title">
        {{ title }}
        <div v-if="!isForceCert" class="close-icon-wrap" @click="close">
          <Icon class="close-icon" name="cross" />
        </div>
      </div>

      <div class="modal-wrap">
        <component
          :is="currentComponentName"
          @hook:mounted="componentMounted"
          @change-component="changeComponent"
          @close="close"
        ></component>
      </div>
    </Dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { Dialog, Icon } from 'vant';
import Login from '@/components/Login';
import PhoneRegister from '@/components/PhoneRegister';
import PhoneLogin from '@/components/PhoneLogin';
import ForgetPassword from '@/components/ForgetPassword';
import UserAccount from '@/components/UserAccount';
import BindPhone from '@/components/BindPhone';
import Certification from '@/components/Certification';

export default {
  name: 'modal',
  components: {
    Dialog: Dialog.Component,
    Icon,
    Login,
    PhoneRegister,
    PhoneLogin,
    ForgetPassword,
    UserAccount,
    BindPhone,
    Certification
  },
  data() {
    return {
      show: false,
      currentComponentName: 'Login',
      title: '账号登录',
      // 保存当前组件实例，暂时没用到
      currentComponent: null,
      titleMap: {
        Login: '账号登录',
        PhoneRegister: '手机注册',
        PhoneLogin: '手机登录',
        ForgetPassword: '忘记密码',
        UserAccount: '用户账号',
        BindPhone: '绑定手机',
        Certification: '实名认证'
      }
    };
  },
  computed: {
    ...mapState(['isShow', 'componentName', 'componentParams']),
    ...mapGetters(['isForceCert'])
  },

  watch: {
    isShow(val) {
      this.show = val;
    },
    componentName(val) {
      this.currentComponentName = val;
    },
    currentComponentName(val) {
      this.title = this.titleMap[val] || '';
    }
  },
  created() {},
  mounted() {},
  methods: {
    close() {
      this.$store.commit('CLOSE');
    },
    // 动态组件加载完成时
    componentMounted(component) {
      this.currentComponent = component;
    },
    // 切换动态组件
    changeComponent(nextComponentName) {
      this.$store.commit('SHOW', nextComponentName);
    }
  }
};
</script>
<style lang="scss">
.modal-title {
  text-align: center;
  padding: 15px;
  .close-icon-wrap {
    position: absolute;
    right: 6px;
    top: 10px;
    width: 30px;
    height: 30px;
    .close-icon {
      vertical-align: middle;
    }
  }
}

.modal-wrap {
  margin: 0 auto;
  background: white;
  border-radius: 5px;
  overflow: hidden;
  width: 80vw;
  padding: 0 0 10px 0;
  .bottom {
    margin: 16px;
    .login-row {
      + .login-row {
        margin-top: 10px;
      }
    }
    .link-wrap {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>
