import { getSignedParams, getPhpNow, getUdid } from '@/utils';
import {
  getWxPayUrl,
  getConfig,
  init,
  login,
  guestLogin,
  autoLogin,
  phoneRegister,
  bindPhone,
  forgetPassword,
  role,
  certification
} from '@/api/channelServer';
import { channelServerConfig } from '@/config';
import server from './index';
import mixServer from './mixServer';
import cookies from '@/cookies';
import { Dialog } from 'vant';
import store from '../store';

const channelServer = {
  // 配置接口返回结果
  configData: {},
  // 初始化返回结果
  initData: {},
  // 乐牛SDK的秘钥
  app_key: '',
  // 乐牛access_token
  access_token: '',
  getWxPayUrl(params) {
    return new Promise(resolve => {
      getWxPayUrl(params).then(res => {
        resolve(res);
      });
    });
  },
  getConfig() {
    const params = {
      appid: mixServer.ln_appid,
      time: getPhpNow()
    };
    const signedParams = getSignedParams(channelServerConfig.app_key, params);
    return getConfig(signedParams).then(res => {
      const { data = {} } = res;
      this.configData = data;
      const app_key = data.app_key || '';
      this.app_key = app_key;
      channelServerConfig.api_app_key = app_key;
      return res;
    });
  },
  init() {
    return new Promise((resolve, reject) => {
      // 获取浏览器唯一标识
      getUdid()
        .then(udid => {
          const params = {
            appid: mixServer.ln_appid,
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
              channelServerConfig.access_token = access_token;
              resolve(res);
            })
            .catch(error => {
              console.error('乐牛SDK初始化失败:', error);
              reject(error);
            });
        })
        .catch(error => {
          console.error('获取浏览器唯一标识错误:', error);
          reject(error);
        });
    });
  },
  // 渠道登录
  login(params) {
    return new Promise((resolve, reject) => {
      login(params).then(({ ret, msg, data = {} }) => {
        if (ret == 0) {
          const passwd = atob(data.passwd || '');
          // token存到cookie(为了绑定账号的时候使用，区分于游客token)
          cookies.setItem('ln_h5sdk_user_token', data.token);
          cookies.setItem('ln_h5sdk_user_name', data.account);
          // 用户账密数据存到store
          store.commit('SET_USER', { ...data, passwd });
          const params = {
            version: '1.0',
            ver: server.ver,
            network: '',
            info: JSON.stringify({
              ...data,
              passwd
            })
          };
          resolve(params);
        } else {
          Dialog({ message: msg });
        }
      });
    });
  },
  // 游客登录
  guestLogin() {
    return new Promise((resolve, reject) => {
      const token = cookies.getItem('ln_h5sdk_guest_token');
      if (token) {
        // 本地有TOKEN,直接登录
        this.autoLogin({ token });
        return;
      }
      // 没有TOKEN，走登录接口
      guestLogin().then(({ ret, msg, data }) => {
        if (ret == 0) {
          // token存到cookie
          cookies.setItem('ln_h5sdk_guest_token', data.token);
          this.autoLogin({ token: data.token });
          resolve(data);
        } else {
          Dialog({ message: msg });
        }
      });
    });
  },
  // 自动登录
  autoLogin(params) {
    return new Promise((resolve, reject) => {
      autoLogin(params).then(({ ret, msg, data }) => {
        // 用户账密数据存到store
        const passwd = atob(data.passwd || '');
        store.commit('SET_USER', { ...data, passwd });
        if (ret == 0) {
          const params = {
            version: '1.0',
            ver: server.ver,
            network: '',
            info: JSON.stringify({
              ...data,
              passwd
            })
          };
          // 自动登录后调用融合登录
          const mixLogin = mixServer.login(params);
          resolve(mixLogin);
        } else {
          Dialog({ message: msg });
        }
      });
    });
  },
  // 手机注册
  phoneRegister(params) {
    return new Promise((resolve, reject) => {
      phoneRegister(params).then(({ ret, msg, data }) => {
        if (ret == 0) {
          resolve({ ret, msg, data });
        } else {
          // 注册失败
          Dialog({ message: msg });
        }
      });
    });
  },
  // 绑定手机
  bindPhone(params) {
    return new Promise((resolve, reject) => {
      bindPhone(params).then(({ ret, msg, data }) => {
        if (ret == 0) {
          resolve(data);
        } else {
          Dialog({ message: msg });
        }
      });
    });
  },
  // 忘记密码
  forgetPassword(params) {
    return new Promise((resolve, reject) => {
      forgetPassword(params).then(({ ret, msg, data }) => {
        if (ret == 0) {
          resolve(data);
        } else {
          Dialog({ message: msg });
        }
      });
    });
  },
  // 角色上报
  role(params) {
    return new Promise((resolve, reject) => {
      role(params).then(({ ret, msg, data }) => {
        if (ret == 0) {
          // 角色上报成功,不需反馈给游戏端
          resolve(data);
        } else {
          console.error('角色上报失败:' + msg);
        }
      });
    });
  },
  // 实名认证
  certification(params) {
    return new Promise((resolve, reject) => {
      certification(params).then(({ ret, msg, data }) => {
        if (ret == 0) {
          // 实名认证成功,不需反馈给游戏端
          resolve({ ret, msg, data });
        } else {
          Dialog({ message: msg });
        }
      });
    });
  }
};

export default channelServer;
