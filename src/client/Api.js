/**
 * 乐牛H5SDK API（对外）
 * 接口将提供给CP调用
 * @author wenjingmin@gmail.com
 */
var $sdkProxy = require('./SdkProxy.js');
var $config = require('./Config.js');
var $callback = require('./Callback.js');
var $lang = require('./Lang.js');
var $debug = require('./Debug.js');
var _userInfo = {};
var _roleInfo = {};

var self = {
  /**
   * 获取当前JSSDK版本号
   * @return {[type]} [description]
   */
  version: function() {
    return $config.version.api;
  },
  /**
   * 调起登录
   * @param  {Function} callback(status, userInfo)
   * @return {[type]}            [description]
   */
  login: function(callback) {
    var fn = function(status, account, uid, loginToken) {
      _userInfo = {
        uid: uid || 0,
        account: account || '',
        token: loginToken || ''
      };
      callback.call(null, status, _userInfo);
      $debug.log($lang.login + $lang.callback, JSON.stringify(_userInfo));
    };

    $callback.bind(fn, false, arguments.callee.name);
    $debug.log($lang.call + $lang.login);

    return $sdkProxy.login(fn);
  },
  /**
   * 调起退出登录
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  logout: function(callback) {
    var fn = function() {
      var user = {};
      var u = self.getUserInfo();
      var status = 0;
      for (var i in u) {
        user[i] = u[i];
      }
      callback.call(null, status, user);
      _userInfo = {};

      $debug.log($lang.logout + $lang.callback, JSON.stringify(user));
    };

    var funcName = arguments.callee.name;
    $callback.bind(fn, false, funcName);
    $debug.log($lang.login + $lang.call + $lang.logout);

    return $sdkProxy.logout(fn, funcName);
  },
  /**
   * 切换帐号
   * @return {[type]} [description]
   */
  switch: function() {
    $debug.log($lang.switch);
    self.logout($callback.get('logout'));
    self.login($callback.get('login'));
  },
  /**
   * 注册
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  register: function() {
    $debug.log($lang.call + $lang.register);
    return $sdkProxy.register();
  },
  /**
   * 支付
   * @param  {[type]}   info     [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  pay: function(info, callback) {
    var fn = function(status, message) {
      callback.call(null, status, message);
      $debug.log($lang.pay + $lang.callback);
    };

    $callback.bind(fn, false, arguments.callee.name);
    $debug.log($lang.call + $lang.pay, info);

    return $sdkProxy.pay(info, fn);
  },
  /**
   * 角色相关
   * @type {Object}
   */
  role: {
    /* 创角 */
    create: function(serverId, serverName, roleId, roleName, roleLevel, roleTime, vipLevel) {
      var type = $sdkProxy.ROLE_CREATE;
      _roleInfo[type] = {
        serverId: serverId,
        serverName: serverName,
        roleId: roleId,
        roleName: roleName,
        roleLevel: roleLevel,
        roleTime: roleTime
      };
      $debug.log($lang.roleCreate, _roleInfo[type]);
      $sdkProxy.role.report(type, _roleInfo[type]);
    },
    /* 入服 */
    enter: function(serverId, serverName, roleId, roleName, roleLevel, roleTime, vipLevel) {
      var type = $sdkProxy.ROLE_ENTER;
      _roleInfo[type] = {
        serverId: serverId,
        serverName: serverName,
        roleId: roleId,
        roleName: roleName,
        roleLevel: roleLevel,
        roleTime: roleTime
      };
      $debug.log($lang.roleEnter, _roleInfo[type]);
      $sdkProxy.role.report(type, _roleInfo[type]);
    },
    /* 升级 */
    upgrade: function(serverId, serverName, roleId, roleName, roleLevel, roleTime, vipLevel) {
      var type = $sdkProxy.ROLE_UPGRATE;
      _roleInfo[type] = {
        serverId: serverId,
        serverName: serverName,
        roleId: roleId,
        roleName: roleName,
        roleLevel: roleLevel,
        roleTime: roleTime
      };
      $debug.log($lang.roleUpgrate, _roleInfo[type]);
      $sdkProxy.role.report(type, _roleInfo[type]);
    }
  },
  /**
   * 当前用户信息
   * @return {[type]} [description]
   */
  getUserInfo: function() {
    return _userInfo;
  },
  /**
   * 当前用户角色信息（默认入服信息）
   * @return {[type]} [description]
   */
  getRoleInfo: function(type) {
    type = type || $sdkProxy.ROLE_ENTER;
    return _roleInfo[type];
  },
  /**
   * Native调用js通用方法
   * @return {Function} [description]
   */
  callback: function(json) {
    $debug.log($lang.callback, json);
    return $sdkProxy.callback(json);
  }
};

module.exports = self;
