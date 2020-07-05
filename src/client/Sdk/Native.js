/**
 * 定义SDK内核内部接口
 * 与Native SDK内部接口对接
 * @author wenjingmin@gmail.com
 */
var $interface = require('./Base.js');
var nativeSdk = {};
nativeSdk.__proto__ = $interface;

nativeSdk.trigger = function(func, params, callbackName) {
  var isAndroid = typeof leniuJS !== 'undefined' && typeof leniuJS.onNativeMethods !== 'undefined';

  var iosMessageHandlers = !isAndroid && window.webkit && window.webkit.messageHandlers;

  var data = { funcName: func };

  if (callbackName) {
    data.callbackFunc = callbackName;
  }

  if (params) {
    data.params = params;
  }

  if (isAndroid) {
    // 安卓
    return leniuJS.onNativeMethods(JSON.stringify(data));
  } else if (iosMessageHandlers) {
    // 苹果
    try {
      return iosMessageHandlers[func].postMessage(data || { type: '123' });
    } catch (error) {
      throw new Error("执行该语句报错: 【iosMessageHandlers[func].postMessage(data || { type: '123' })】 \n" + error);
    }
  } else {
    throw new Error('leniuJS.onNativeMethods && (window.webkit || window.webkit.messageHandlers) not found');
  }
};

nativeSdk.login = function(callbackName) {
  nativeSdk.trigger('doLogin', undefined, callbackName);
};

nativeSdk.logout = function() {
  nativeSdk.trigger('logout');
};

// ["商品id","商品名","1000","区服id","角色名","角色等级","透传参数"]
nativeSdk.pay = function(info, callbackName) {
  var params = [info.orderId, info.orderName, info.amount, info.serverId, info.roleName, info.roleLevel, info.ext];
  console.log(params, callbackName);
  nativeSdk.trigger('doPay', params, callbackName);
};

nativeSdk.role = {
  // "类型 传(1，2，3) 1 创角/2 升级/3 进入服务器","区服id","区服名称","角色id","角色名","角色等级","vip等级","扩展参数"
  report: function(type, info) {
    var params = [
      type,
      info.serverId,
      info.serverName,
      info.roleId,
      info.roleName,
      info.roleLevel,
      info.vipLevel || 0,
      info.roleTime
    ];
    nativeSdk.trigger('setRoleData', params);
  }
};

module.exports = nativeSdk;
