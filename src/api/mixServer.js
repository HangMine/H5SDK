import _http from './http';

const isDev = process.env.NODE_ENV === 'development';
const devBaseUrl = '/mixServer';
const prodBaseUrl =
  location.host === 'apisdk.lnqwe.com' ? 'https://apisdk2.lnqwe.com' : 'http://api.sdk2.leniugame.com';
const http = _http.create({
  serverType: 'mix',
  baseURL: isDev ? devBaseUrl : prodBaseUrl
});

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

export const init = params => {
  return http({
    url: '/sdk/app/initialize',
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

// 登录
export const login = params => {
  return http({
    url: '/sdk/user/login',
    method: 'post',
    params
  });
};

// 融合乐牛同时下单（研发下单）
export const pay = params => {
  return http({
    url: '/sdk/pay/request',
    method: 'post',
    params
  });
};

// 角色上报
export const role = params => {
  return http({
    url: '/sdk/role/collect',
    method: 'post',
    params
  });
};

// 在线时长
export const online = params => {
  return http({
    url: '/sdk/user/online',
    method: 'post',
    params
  });
};
