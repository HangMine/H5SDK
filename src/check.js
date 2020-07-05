const _userAgent = navigator.userAgent;
const platform = {
  isWeiXin: /MicroMessenger/i.test(_userAgent),
  isMobile: /iphone|ipod|ipad|ipad|Android|nokia|blackberry|webos|webos|webmate|bada|lg|ucweb/i.test(_userAgent),
  isIos: /iPhone|iPad|iPod|iOS/i.test(_userAgent),
  isIphone: /iPhone/i.test(_userAgent),
  isXX: /xxAssistant/i.test(_userAgent),
  isXXipa: /xxipa/gi.test(_userAgent) && /(iPhone|iPod|iPad|ios)/gi.test(_userAgent),
  isSafari:
    /safari/gi.test(_userAgent) &&
    !/(crios|chrome|fxios|qqbrowser|sogou|baidu|ucbrowser|qhbrowser|opera|micromessenger|weibo)/gi.test(_userAgent)
};

const _toString = Object.prototype.toString;

const isFalsy = val => !val && val !== 0;

const isInt = val => /^([1-9]\d*|0)$/.test(val);

const isNumber = val => /^\d+(\.\d+)?$/.test(val);

const isRange = (val, min, max) => val >= min && val <= max;

// JS的多行注释：\s\S\r\n 匹配包括换行符在内的任意字符
const isMoreLineNote = val => /\*[\s\S\r\n]*?\*/.test(val);

const isObject = obj => obj !== null && typeof obj === 'object';

const toRawType = value => _toString.call(value).slice(8, -1);

const isPlainObject = obj => _toString.call(obj) === '[object Object]';

export { platform, isFalsy, isInt, isNumber, isRange, isMoreLineNote, isObject, toRawType, isPlainObject };
