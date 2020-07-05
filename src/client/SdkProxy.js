/**
 * 乐牛H5SDK（内部）
 * 接口用于对接内核SDK接口，并提供给H5Api调用
 * 代理Native或JsSDK
 * @author wenjingmin@gmail.com
 */
var SdkProxy = (function() {
  var $callback = require('./Callback.js');
  var $config = require('./Config.js');
  // var $lang = require('./Lang.js');

  var self = {
    ROLE_CREATE: 1,
    ROLE_UPGRATE: 2,
    ROLE_ENTER: 3,

    sdk: function() {
      var $sdk = {};
      switch ($config.sdk) {
        case 'native':
          $sdk = require('./Sdk/Native.js');
          break;
        case 'h5':
          $sdk = require('./Sdk/H5.js');
          break;
      }

      return $sdk;
    },
    debug: function(isEnable) {
      $config.debug = isEnable;
    },

    /**
     * 获取当前JSSDK版本号
     * @return {[type]} [description]
     */
    version: function() {
      return $config.version.core;
    },
    /**
     * 调起登录
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    login: function(callbackFunc, funcName) {
      try {
        self.sdk().login($callback.bind(callbackFunc, false, funcName));
      } catch (error) {
        console.error(error);
      }
    },
    /**
     * 调起退出登录
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    logout: function(callbackFunc, funcName) {
      self.sdk().logout($callback.bind(callbackFunc, false, funcName));
    },
    /**
     * 调起注册
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    register: function(callbackFunc, funcName) {
      self.sdk().register($callback.bind(callbackFunc, false, funcName));
    },
    /**
     * 调起支付
     * @param  {[type]}   info     [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    pay: function(info, callback) {
      self.sdk().pay(info, $callback.bind(callback));
    },
    role: {
      /**
			 * 角色信息上报
			 * @param  {[type]}   type     上报类型，如ROLE_CREATE
			 * @param  {[type]}   roleInfo 数据格式
			 *  roleInfo = {
					serverId:serverId,
					serverName:serverName,
					roleId:roleId,
					roleName:roleName,
					roleLevel:roleLevel,
					roleCreateTime:roleCreateTime
				};
			 */
      report: function(type, roleInfo) {
        self.sdk().role.report(type, roleInfo);
      }
    },
    /**
     * Native回调Js方法
     * @return {Function} [description]
     */
    callback: function(json) {
      var funcName = json.funcName || '';
      var status = json.status;
      var params = json.params || [];
      params.unshift(status);

      return $callback.trigger(funcName, params);
    }
  };

  return self;
})();

module.exports = SdkProxy;
