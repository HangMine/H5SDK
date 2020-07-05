/*
 * @Author: Hang
 * @Date: 2020-04-27 10:04:00
 * @LastEditors: Hang
 * @LastEditTime: 2020-07-02 23:33:11
 * @FilePath: /ln-project/Users/zhengmukang/Desktop/h5sdk/src/main.js
 * @Description: 暂无描述
 */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { Dialog, Button, Icon } from 'vant';
import server from './server/index';
import pay from './server/pay';
import './assets/css/init.scss';
import MetaInfo from 'vue-meta-info';

Vue.use(MetaInfo);
// var Vconsole = require('vconsole');
// var vconsole = new Vconsole();
Vue.use(Dialog);
Vue.use(Button);
Vue.use(Icon);
server.init();
pay.init();
Vue.config.productionTip = false;

// 捕获不到没有catch的promise
Vue.config.errorHandler = function(err, vm, info) {
  let {
    message, // 异常信息
    name, // 异常名称
    script, // 异常脚本url
    line, // 异常行号
    column, // 异常列号
    stack // 异常堆栈信息
  } = err;

  console.error(`vue捕获到错误:${message}`);

  // vm为抛出异常的 Vue 实例
  // info为 Vue 特定的错误信息，比如错误所在的生命周期钩子
};

// 捕获未捕获的promise,IE不支持（兼容性：https://developer.mozilla.org/zh-CN/docs/Web/Events/unhandledrejection）
window.onunhandledrejection = error => {
  console.error(`全局未被捕获到的promise:${error}`);
};
new Vue({
  router,
  store,
  render: h => h(App),
  // 添加到这里,这里的render-event和vue.config.js里面的renderAfterDocumentEvent配置名称一致
  mounted() {
    document.dispatchEvent(new Event('render-event'));
  }
}).$mount('#app');
