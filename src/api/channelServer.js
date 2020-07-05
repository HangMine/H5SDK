import _http from './http';

const isDev = process.env.NODE_ENV === 'development';
const devBaseUrl = '/channelServer';
const prodBaseUrl = location.host === 'apisdk.lnqwe.com' ? ' https://apisdk.lnqwe.com' : 'http://api.sdk.leniugame.com';
const http = _http.create({
  serverType: 'channel',
  baseURL: isDev ? devBaseUrl : prodBaseUrl
});

// 获取微信支付链接
export const getWxPayUrl = params => {
  return http({
    url: '/api/config/auth',
    method: 'get',
    params,
    // 不要处理成{mode:0,data:data}的格式
    noMode: true,
    // 不要增加time和access_token参数
    noTimeAndAccess: true
  });
};
// 获取配置
export const getConfig = params => {
  return http({
    url: '/api/config/get',
    method: 'post',
    params,
    // 不要处理成{mode:0,data:data}的格式
    noMode: true,
    // 不要增加time和access_token参数
    noTimeAndAccess: true,
    // 不要增加sign参数
    noSign: true,
    // 检查ret，不等于0抛出异常
    isInitCheck: true
  });
};

// 初始化
export const init = params => {
  return http({
    url: '/v4/app/initialize',
    method: 'post',
    params,
    // 不要增加time和access_token参数
    noTimeAndAccess: true,
    // 不要增加sign参数
    noSign: true,
    // 检查ret，不等于0抛出异常
    isInitCheck: true
  });
};

// 帐号/手机登录
export const login = params => {
  return http({
    url: '/v4/user/login',
    method: 'post',
    params
  });
};

// 游客登录
export const guestLogin = params => {
  return http({
    url: '/v4/user/guest',
    method: 'post',
    params
  });
};

// 自动登录
export const autoLogin = params => {
  return http({
    url: '/v4/user/autologin',
    method: 'post',
    params
  });
};

// 账号注册
export const accountRegister = params => {
  return http({
    url: '/v4/user/register_account',
    method: 'post',
    params
  });
};

// 邮箱帐号注册
export const emailRegister = params => {
  return http({
    url: '/v4/user/register_email',
    method: 'post',
    params
  });
};

// 手机号注册
export const phoneRegister = params => {
  return http({
    url: '/v4/user/register_mobile',
    method: 'post',
    params
  });
};

// 手机验证码发送
export const sendCode = params => {
  return http({
    url: '/v4/sms/send',
    method: 'post',
    isConfirm: true,
    params
  });
};

// 绑定手机
export const bindPhone = params => {
  return http({
    url: '/v4/user/bind/mobile',
    method: 'post',
    isConfirm: true,
    params
  });
};

// 找回密码
export const forgetPassword = params => {
  return http({
    url: '/v4/user/forget',
    method: 'post',
    isConfirm: true,
    params
  });
};

// 角色上报
export const role = params => {
  return http({
    url: '/v4/role/collect',
    method: 'post',
    params
  });
};

// 实名认证
export const certification = params => {
  return http({
    url: '/v4/user/certification',
    method: 'post',
    params
  });
};
