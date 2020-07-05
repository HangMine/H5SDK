import Fingerprint2 from 'fingerprintjs2';
import { config } from './config';
import md5 from 'js-md5';
import MobileDetect from 'mobile-detect';
import IphoneDevice from './IphoneDevice';

// 通过浏览器获取设备唯一标识
export const getUdid = () => {
  const promise = new Promise(resolve => {
    Fingerprint2.get(function(components) {
      const values = components.map(function(component, index) {
        if (index === 0) {
          // 把微信浏览器里UA的wifi或4G等网络替换成空,不然切换网络会ID不一样
          return component.value.replace(/\bNetType\/\w+\b/, '');
        }
        return component.value;
      });
      // 生成最终id murmur
      const murmur = Fingerprint2.x64hash128(values.join(''), 31);
      resolve(murmur);
    });
  });
  return promise;
};

// 获取URL的单个参数
const getUrlSingleParams = (name, url = window.location.search) => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return '';
};

// 获取URL的参数，兼容单个或多个
export const getUrlParams = (arg1, url) => {
  if (typeof arg1 === 'string') {
    return getUrlSingleParams(arg1, url);
  } else if (Array.isArray(arg1)) {
    let obj;
    for (const key of arg1) {
      obj[key] = getUrlSingleParams(key, url);
    }
    return obj;
  }
};

// 获取ascii排序后的查询字符串
const getSortAsciiQuery = obj => {
  const arr = [];
  let num = 0;
  for (const i in obj) {
    arr[num] = i;
    num++;
  }
  const sortArr = arr.sort();
  // let sortObj = {};    //完成排序值
  let str = ''; // 自定义排序字符串
  for (const i in sortArr) {
    str += sortArr[i] + '=' + obj[sortArr[i]] + '&';
    // sortObj[sortArr[i]] = obj[sortArr[i]];
  }
  // 去除两侧字符串
  const char = '&';
  str = str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');

  return str;
};

// 获取加密后的sign值
export const getSign = (app_key = '', params = {}) => {
  const sortedParamsQuery = getSortAsciiQuery(params);
  const app_key_params = app_key ? `&${app_key}` : '';
  const resultQuery = `${sortedParamsQuery}${app_key_params}`;
  const sign = md5(resultQuery);
  // console.log('明文:', resultQuery);
  // console.log('MD5加密后:', sign);
  return sign;
};

// 获取增加sign值后的params
export const getSignedParams = (app_key, params = {}) => {
  const sign = getSign(app_key, params);
  params.sign = sign;
  return params;
};

// 设置参数到URL
export const setQueryUrl = () => {
  if (location.search) {
    return;
  }
  const query = config.queryUrl();
  location.search = query;
};

// 获取PHP时间戳
export const getPhpNow = () => {
  const now = new Date().getTime();
  return +`${now}`.slice(0, -3);
};

// 获取机型
export const getModel = () => {
  var device_type = navigator.userAgent;
  var md = new MobileDetect(device_type);
  var os = md.os();
  var model = '';
  if (os === 'iOS') {
    os = md.os() + md.version('iPhone');
    // 再通过iphone-device.js获取具体的苹果手机型号
    const ihponeModel = IphoneDevice.getModels().join(' or ');
    if (ihponeModel !== 'unknown') {
      model = '';
    }
  } else if (os === 'AndroidOS') {
    os = md.os() + md.version('Android');
    var sss = device_type.split(';');
    var i = sss.findIndex(item => item.includes('Build/'));
    if (i > -1) {
      model = sss[i].substring(0, sss[i].indexOf('Build/'));
    }
  }
  return model.trim();
};

// 获取平台
export const getSys = () => {
  const device_type = navigator.userAgent;
  const md = new MobileDetect(device_type);
  const sys = md.is('iPhone') ? 'iphone' : '安卓';
  return sys;
};

// 获取分辨率
export const getScreen = () => {
  const { width, height } = screen;
  return `${width}*${height}`;
};

// 打开新窗口
export const openUrl = url => {
  var a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  document.body.appendChild(a);
  var e = document.createEvent('MouseEvents');
  e.initEvent('click', true, true);
  a.dispatchEvent(e);
};

/**
 * @description: 捕获异常统一处理
 * @param {Function} fn
 * @param {Function} onError
 * @return {Function}
 */

export const withTryCatch = (fn, ...args) => {
  return new Promise((resolve, reject) => {
    try {
      const result = fn.apply(this, args);
      resolve(result);
    } catch (error) {
      console.error(`withTryCatch捕获到错误:${error}`);
      reject(error);
    }
  });
};
