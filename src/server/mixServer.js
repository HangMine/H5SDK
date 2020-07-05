import { getUrlParams, getSignedParams, getPhpNow, getUdid } from '@/utils';
import { getConfig, init, login, pay, role, online } from '@/api/mixServer';
import { mixServerConfig } from '@/config';
import server, { sendMsg } from './index';
import store from '@/store';
import { Dialog } from 'vant';

const mixServer = {
  appid: getUrlParams('appid'),
  // 配置接口返回结果
  configData: {},
  // 初始化返回结果
  initData: {
    // 在线时长上报间隔
    alive: ''
  },
  // 乐牛应用ID
  ln_appid: '',
  // 融合SDK的秘钥
  app_key: '',
  // 游戏链接
  game_link: '',
  // 融合access_token
  access_token: '',
  getConfig() {
    const params = {
      appid: this.appid,
      time: getPhpNow()
    };
    const signedParams = getSignedParams(mixServerConfig.app_key, params);
    return getConfig(signedParams).then(res => {
      const { data = {} } = res;
      this.configData = data;
      this.ln_appid = data.ln_appid || '';
      const app_key = data.app_key || '';
      this.app_key = app_key;
      mixServerConfig.api_app_key = app_key;
      this.game_link = data.game_link || '';
      return res;
    });
  },
  init() {
    // 获取浏览器唯一标识
    return new Promise((resolve, reject) => {
      getUdid()
        .then(udid => {
          const params = {
            appid: this.appid,
            time: getPhpNow(),
            ver: server.ver,
            udid: udid,
            uuid: udid,
            ...server.shareParams
          };
          const signedParams = getSignedParams(this.app_key, params);
          init(signedParams)
            .then(res => {
              const { data = {} } = res;
              this.initData = data;
              const access_token = data.access_token || '';
              this.access_token = access_token;
              mixServerConfig.access_token = access_token;
              resolve(res);
            })
            .catch(error => {
              console.error('融合SDK初始化失败:', error);
              reject(error);
            });
        })
        .catch(error => {
          console.error('获取浏览器唯一标识错误:', error);
          reject(error);
        });
    });
  },
  login(params) {
    return new Promise((resolve, reject) => {
      login(params).then(({ ret, msg, data }) => {
        if (ret == 0) {
          // 登录成功
          if (store.state.user.cert_type == 1) {
            // 需要登录后弹出实名登记
            store.commit('SHOW', {
              name: 'Certification',
              params: { cert_msg: '根据国家政策规定,请先进行实名认证' }
            });
          } else {
            // 不需要弹出实名登记，直接关闭
            store.commit('CLOSE');
          }
          sendMsg('LOGIN_SUCCESS', { account: data.account, uid: data.union_uid, token: data.login_token });
          resolve(data);
        } else {
          Dialog({ message: msg });
        }
      });
    });
  },
  pay(params) {
    return new Promise((resolve, reject) => {
      pay(params).then(({ ret, msg, data }) => {
        if (ret == 0) {
          // 支付成功
          sendMsg('PAY_SUCCESS', { message: msg });
          resolve(data);
        } else if (ret == 81023) {
          // 实名验证
          store.commit('SHOW', { name: 'Certification', params: { isPay: true, payMsg: msg, payParams: params } });
        } else {
          Dialog({ message: msg });
        }
      });
    });
  },
  role(params) {
    return new Promise((resolve, reject) => {
      role(params).then(({ ret, msg, data }) => {
        if (ret == 0) {
          // 角色上报成功,不需反馈给游戏端
          // sendMsg('ROLE_REPORT_SUCCESS');
          resolve(data);
        } else {
          console.error('角色上报失败:' + msg);
        }
      });
    });
  },
  online(params) {
    return new Promise((resolve, reject) => {
      online(params).then(({ ret, msg, data }) => {
        if (ret == 0) {
          // 在线时长上报成功,不需反馈给游戏端
          resolve(data);
        } else {
          console.error('在线时长上报失败:' + msg);
        }
      });
    });
  }
};

export default mixServer;
