import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isShow: false,
    loading: true,
    componentName: '',
    user: {
      account: '',
      // 实名登录显示类型： 0，不显示 1，登录后 2，充值前
      cert_type: 0,
      cert_url: '',
      force_cert_status: 0,
      is_bind: 0,
      // 是否强制实名，1，是 0，否
      is_force_cert: 0,
      // 是否是游客登录
      is_guest: 0,
      passwd: '',
      token: '',
      uid: ''
    },
    // 需要传递的componentParams
    componentParams: undefined,
    // 打开新页面确认框
    openConfirmShow: false,
    // 需要跳转到的新页面
    openUrl: ''
  },
  getters: {
    isForceCert: state => state.user.is_force_cert == 1 || (state.componentParams && state.componentParams.isForceCert)
  },
  mutations: {
    SHOW(state, payload = 'Login') {
      const isStringPayload = typeof payload === 'string';
      const componentName = isStringPayload ? payload : payload.name;
      const componentParams = isStringPayload ? undefined : payload.params || {};
      state.isShow = true;
      state.componentName = componentName;
      state.componentParams = componentParams;
    },
    CLOSE(state) {
      state.isShow = false;
    },
    TOGGLE(state, payload = 'Login') {
      const isStringPayload = typeof payload === 'string';
      const componentName = isStringPayload ? payload : payload.name;
      const componentParams = isStringPayload ? undefined : payload.params || {};
      state.isShow = !state.isShow;
      state.componentName = state.isShow ? componentName : '';
      state.componentParams = componentParams;
    },
    SET_USER(state, user = {}) {
      state.user = user;
    },
    SHOW_OPENCONFIRM(state, url = '') {
      state.openConfirmShow = true;
      state.openUrl = url;
    },
    CLOSE_OPENCONFIRM(state) {
      state.openConfirmShow = false;
      state.openUrl = '';
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    }
  },
  actions: {},
  modules: {}
});
