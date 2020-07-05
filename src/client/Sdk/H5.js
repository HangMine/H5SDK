/**
 * 定义SDK内核所有接口
 * 纯H5 JsSdk实现
 * @author wenjingmin@gmail.com
 */
var $interface = require('./Base.js');

// 用原生的方式去调用（理论上JS可以更灵活，暂时方便维护，就这样调用）
var _callback = leniuH5Sdk.callback;
var h5Sdk = {
  callbackName: {
    login: '',
    logout: '',
    pay: ''
  },
  init() {
    this.acceptMessage();
  },
  login(callbackName) {
    this.callbackName.login = callbackName;
    sendMsg('LOGIN');
  },
  // 登出只是弹出登录窗口
  logout(callbackName) {
    this.callbackName.logout = callbackName;
    sendMsg('LOGOUT');
  },
  pay(info, callbackName) {
    this.callbackName.pay = callbackName;

    sendMsg('PAY', info);
  },
  role: {
    report(type, roleInfo) {
      const params = {
        type,
        roleInfo
      };
      sendMsg('ROLE_REPORT', params);
    }
  },
  // 接受父窗口传递的信息
  acceptMessage() {
    var callbackName = this.callbackName;
    window.addEventListener('message', function(e) {
      const payload = typeof e.data === 'string' ? { action: e.data } : e.data || {};
      const { action, params = [] } = payload;
      // !!原本的sdk规定了传参为以下格式：[param1, param2 , ...]
      switch (action) {
        case 'LOGIN_SUCCESS':
          // 执行游戏端的回调函数,参数：[account, uid, loginToken]
          _callback({
            funcName: callbackName.login,
            status: 0,
            params
          });
          break;
        case 'LOGOUT_SUCCESS':
          // 执行游戏端的回调函数,参数：[account, uid, loginToken]
          _callback({
            funcName: callbackName.logout,
            status: 0,
            params
          });
          break;
        case 'PAY_SUCCESS':
          // 执行游戏端的回调函数,参数：[message]
          _callback({
            funcName: callbackName.pay,
            status: 0,
            params
          });
          break;
        default:
          break;
      }
    });
  }
};

// 发送信息给SDK窗口
var sendMsg = function(msg, params) {
  msg = msg || '';
  var payload = { action: msg, params };
  window.parent.postMessage(payload, '*');
};

h5Sdk.__proto__ = $interface;

h5Sdk.init();
module.exports = h5Sdk;
