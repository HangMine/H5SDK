/**
 * 乐牛H5SDK API
 * 回调管理
 * @author wenjingmin@gmail.com
 */
var $config = require('./Config.js');
var $callbackHandler = require('./CallbackHandler.js');
var _private = {};
var _context = $config.callbackName;
var _pre = 'callback_';
var self = {
  /**
   * 回调名称管理
   * @type {Object}
   */
  name: {
    getType: function(name, isPublic) {
      var access = isPublic ? 'public' : 'private';
      var method = [_context, access, name].join('.');
      return method;
    },
    getPublic: function(name) {
      return self.name.getType(name, true);
    },
    getPrivate: function(name) {
      return self.name.getType(name, false);
    },
    getRandom: function() {
      var name = _pre + parseInt(Math.random() * Math.pow(10, 8));
      return name;
    }
  },
  /**
   * 移除回调
   * @param  {[type]}  name     [description]
   * @param  {Boolean} isPublic [description]
   * @return {[type]}           [description]
   */
  remove: function(name, isPublic) {
    if (isPublic) {
      delete $callbackHandler[name];
    } else {
      delete _private[name];
    }
  },
  /**
   * 添加回调
   * @param {Function} callback 回调函数
   * @param {Boolean}  isPublic 默认false, 是否为公共，全局函数，注册到window.leniuH5Callback，否则注册到_private
   * @param {[type]}   name     指定回调函数名称，不指定则自动生成
   */
  bind: function(callback, isPublic, name) {
    name = name || self.name.getRandom();
    if (isPublic === true) {
      $callbackHandler[name] = function() {
        callback.apply(null, arguments);
        delete $callbackHandler[name];
      };
    } else {
      _private[name] = function() {
        callback.apply(null, arguments);
        // delete _private[name];
      };
    }
    return name;
  },
  get: function(name, isPublic) {
    var _callbacks = isPublic ? $callbackHandler : _private;
    return _callbacks[name];
  },
  isExists: function(name, isPublic) {
    var _callbacks = isPublic ? $callbackHandler : _private;
    return typeof _callbacks[name] !== 'undefined';
  },
  /**
   * 触发回调
   * @param  {[type]} name [description]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  trigger: function(name, data, isPublic) {
    var _callbacks = isPublic ? $callbackHandler : _private;

    if (self.isExists(name, isPublic)) {
      _callbacks[name].apply(self, data);
    } else {
      throw new Error('Callback Not Found:' + name);
    }
  }
};

module.exports = self;
