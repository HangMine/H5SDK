/**
 * 定义SDK内配置
 */
var isAndroid = typeof leniuJS !== 'undefined' && typeof leniuJS.onNativeMethods !== 'undefined';
var webkitMessageHandlers = !isAndroid && window.webkit && window.webkit.messageHandlers;
var isIos = webkitMessageHandlers && Object.keys(window.webkit.messageHandlers).length;
if (webkitMessageHandlers && !Object.keys(window.webkit.messageHandlers).length) {
  console.warn('window.webkit.messageHandlers没有定义方法,判断为非IOS,sdk走h5类型');
}
var sdk = isAndroid || isIos ? 'native' : 'h5';
var self = {
  debug: false,
  sdk: sdk, // native,h5
  version: {
    api: '1.0.0',
    core: '1.0.0'
  },
  apiSdkName: 'leniuH5Sdk',
  coreSdkName: 'leniuH5Core',
  callbackName: 'leniuH5Callback'
};

module.exports = self;
