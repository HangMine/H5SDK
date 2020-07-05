import store from '../store';
import { getUrlParams, setQueryUrl, getModel, getSys, getScreen, getSign, getPhpNow } from '@/utils';
import mixServer from './mixServer';
import channelServer from './channelServer';
import pay from './pay';
import cookies from '@/cookies';
import { platform } from '@/check';
const isDev = process.env.NODE_ENV === 'development';

const server = {
  ver: getUrlParams('ver'),
  appid: getUrlParams('appid'),
  campaign_id: getUrlParams('campaign_id'),
  // 微信支付参数
  code: getUrlParams('code'),
  shareParams: {},
  // 在线上报需要的参数
  onlineParams: {},
  // 计时器
  timer: null,
  // 需要提前获取游戏链接
  mixConfigPromise: null,
  init() {
    const isContinue = this.wxHandle();
    if (!isContinue) return;
    if (isDev) setQueryUrl();
    // const isUrlPass = this.checkUrl();
    // if (!isUrlPass) {
    //   document.body.innerHTML = '验签错误，请联系管理员';
    //   return;
    // }

    this.removePayPreloadTrasition();
    this.acceptMessage();
    this.setShareParams();

    this.getMixConfigPromise().then(() => {
      this.setGameFrame();
    });

    // 接口不在这里初始化，在收到登录信息时初始化
    // this.apiInit();
  },
  setGameFrame() {
    const url = isDev ? process.env.VUE_APP_CLIENT_URL : mixServer.game_link;
    if (url) {
      let gameFrame = document.querySelector('#gameFrame');
      gameFrame.src = `${url}?v=${new Date().getTime()}`;
    }
  },
  getMixConfigPromise() {
    if (this.mixConfigPromise) {
      return this.mixConfigPromise;
    } else {
      return (this.mixConfigPromise = mixServer.getConfig());
    }
  },
  apiInit() {
    return new Promise((resolve, reject) => {
      if (this.hasInit) {
        resolve();
        return;
      }
      // 融合配置+初始化
      this.getMixConfigPromise().then(() => {
        mixServer.init().then(() => {
          // 乐牛配置+初始化
          channelServer.getConfig().then(() => {
            channelServer.init().then(() => {
              this.hasInit = true;
              store.commit('SET_LOADING', false);
              resolve();
            });
          });
        });
      });
    });
  },
  checkUrl() {
    const params = {
      appid: this.appid,
      campaign_id: this.campaign_id,
      ver: this.ver
    };
    const sign = getSign('', params);
    const urlSign = getUrlParams('sign');
    const isPass = sign === urlSign;
    return isPass;
  },
  // 微信浏览器特殊处理
  wxHandle() {
    if (platform.isWeiXin) {
      if (!this.code) {
        const params = {
          redirect_uri: encodeURIComponent(location.href),
          time: getPhpNow()
        };
        channelServer.getWxPayUrl(params).then(({ data = {} }) => {
          const { url } = data;
          location.href = url;
        });
        return false;
      }
    }
    return true;
  },
  // 去除一开始的支付页面动画
  removePayPreloadTrasition() {
    window.onload = () => {
      document.querySelector('.preload').classList.remove('preload');
    };
  },
  // 接受游戏窗口传递的信息
  acceptMessage() {
    window.addEventListener('message', e => {
      const payload = typeof e.data === 'string' ? { action: e.data } : e.data || {};
      const { action, params } = payload;
      // console.log('SDK窗口收到信息:', payload);
      const token = this.getToken();

      switch (action) {
        // 弹出登录框
        case 'LOGIN':
          this.apiInit().then(() => {
            if (token) {
              // 有token，自动登录
              this.autoLogin();
            } else {
              // 没有token，不需自动登录，拉起登录窗口
              this.showModal();
            }
          });
          break;
        case 'LOGOUT':
          this.logout();
          break;
        // 下单，拉起支付
        case 'PAY':
          this.handlePay(params);
          break;
        // 支付页面传递过来的，关闭支付页面
        case 'PAY_CLOSE':
          pay.close();
          break;
        // 支付页面传递过来的，在微信浏览器调起支付
        case 'PAY_WEIXIN':
          pay.weixin(params);
          break;
        case 'ROLE_REPORT':
          this.handleRoleReport(params);
          break;
        default:
          break;
      }
    });
  },
  showModal() {
    store.commit('SHOW');
  },
  closeModal() {
    store.commit('CLOSE');
  },
  logout() {
    // 清除token
    // thic.clearToken();
    // 重起游戏
    this.reloadGameFrame();
    // 上报时长
    this.online(this.onlineParams);
    sendMsg('LOGOUT_SUCCESS');
  },
  clearToken() {
    cookies.removeItem('ln_h5sdk_user_token');
    cookies.removeItem('ln_h5sdk_guest_token');
  },
  reloadGameFrame() {
    const gameFrame = document.querySelector('#gameFrame');
    gameFrame.src = `${gameFrame.src}?v=${new Date().getTime()}`;
  },
  handlePay(clientParams) {
    const {
      orderId,
      orderName,
      amount,
      total_fee,
      serverId,
      roleName,
      roleId,
      roleLevel,
      ext,
      flag,
      pay_callback
    } = clientParams;
    const params = {
      order_id: orderId,
      order_name: orderName,
      is_lnpay: 1,
      amount: amount,
      total_fee: total_fee || amount || '',
      server: serverId,
      role: roleName,
      roleid: roleId,
      level: roleLevel,
      ext: ext || '',
      flag: flag || '',
      pay_callback: pay_callback || '',
      ln_pay_req: 1,
      ver: this.ver,
      // 微信支付参数
      weixin_code: this.code || ''
    };
    // 下单成功拉起支付
    mixServer.pay(params).then(data => {
      const { url = '' } = data;
      if (platform.isSafari) {
        // safari无法iframe拉起支付，需要通过用户触发，跳转到新页面
        store.commit('SHOW_OPENCONFIRM', url);
      } else {
        pay.show(url);
      }
    });
  },
  handleRoleReport(clientParams) {
    const {
      type,
      roleInfo: { roleId, roleName, roleLevel, sex, serverId, serverName, roleTime }
    } = clientParams;
    const roleParams = {
      type,
      roleid: roleId,
      rolename: roleName,
      level: roleLevel,
      sex: sex || 0,
      server_id: serverId
    };
    // 角色上报
    this.role(roleParams);

    this.onlineParams = {
      ver: this.ver,
      roleid: roleId,
      server_id: serverId
    };
    switch (type) {
      case 1:
        // 创角时，顺便上报入服，并走时长上报流程（现在由游戏上报）
        // this.role({ ...roleParams, type: 3 });
        this.online(this.onlineParams);
        break;
      case 3:
        // 入服，调在线时长接口，并设置后续上报在线时长
        this.online(this.onlineParams);
        break;

      default:
        break;
    }
  },
  // 在线时长上报(包括首次和后续)
  online(onlineParams) {
    // 首次上报
    mixServer.online({ ...onlineParams, seconds: 0, type: 1 }).then(data => {
      // 弹出实名登记
      const toCert = data => {
        store.commit('SHOW', {
          name: 'Certification',
          // 在线时长弹出，一定是强制
          params: { ...data, isForceCert: true }
        });
      };

      // 需要弹出实名认证
      if (data.is_allow_online == 0) {
        if (store.state.user.cert_type != 1) {
          // 如果登录时没有弹出实名认证，则在这里弹出
          toCert(data);
        }

        // 如果不允许在线，强制重启游戏,不后续上报
        this.reloadGameFrame();
        return;
      }

      // 后续上报
      const alive = mixServer.initData.alive;
      if (alive) {
        this.timer = setInterval(() => {
          mixServer.online({ ...onlineParams, seconds: alive, type: 2 }).then(data => {
            if (data.is_allow_online == 0) {
              // 如果不允许在线，强制重启游戏,不后续上报
              toCert(data);
              this.reloadGameFrame();
              clearInterval(this.timer);
            }
          });
        }, +mixServer.initData.alive * 1000);
      }
    });
  },
  // 设置共用参数
  setShareParams() {
    this.shareParams = {
      sdkver: 'h5',
      adver: '1.0',
      device: 7,
      idfa: '',
      idfv: 'idfv',
      imei: 'imei',
      imsi: 'imsi',
      version: '1.0',
      channel_version: '1.0',
      sysname: getSys(),
      screen: getScreen(),
      model: getModel()
    };
  },
  // 登录（融合+渠道）
  login(params) {
    // 正常登录
    return channelServer.login(params).then(mixParams => {
      return mixServer.login(mixParams);
    });
  },
  // 获取token
  getToken() {
    const userToken = cookies.getItem('ln_h5sdk_user_token');
    const guestToken = cookies.getItem('ln_h5sdk_guest_token');
    const token = userToken || guestToken;
    return token;
  },
  // 当检测到有token时自动登录
  autoLogin() {
    const userToken = cookies.getItem('ln_h5sdk_user_token');
    const guestToken = cookies.getItem('ln_h5sdk_guest_token');
    const token = userToken || guestToken;
    if (token) {
      channelServer.autoLogin({ token });
    }
  },
  // 角色上报（融合+渠道）
  role(params) {
    mixServer.role(params);
    channelServer.role(params);
  }
};

// 发送信息给游戏窗口
export const sendMsg = (msg = {}, params = {}) => {
  const gameFrame = document.querySelector('#gameFrame');
  const gameWin = gameFrame.contentWindow;
  // 传进来的params为对象，需转换为原本SDK的参数形式，即[param1,param2,...]这种
  const payload = { action: msg, params: Object.values(params) };
  gameWin.postMessage(payload, '*');
};

export default server;
