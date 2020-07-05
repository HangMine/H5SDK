/**
 * 本地存储
 * @author wenjingmin@gmail.com
 */
module.exports = (function() {
  var self = {};
  var now = function() {
    return Date.parse(new Date()) / 1000;
  };

  self.del = function(key) {
    return localStorage.removeItem(key);
  };

  self.get = function(key) {
    var value;
    var data = localStorage.getItem(key);
    try {
      data = JSON.parse(data);
    } catch (err) {
      data = { e: 0, t: 0, v: undefined };
    }

    if (typeof data.v !== 'undefined' && typeof data.e !== 'undefined' && typeof data.t !== 'undefined') {
      if (data.e + data.t > now()) {
        value = data.v;
      } else {
        self.del(key);
      }
    }

    return value;
  };

  /**
   * 本地存储
   * @param {[type]} key    [description]
   * @param {[type]} value  [description]
   * @param {[type]} expire 秒
   */
  self.set = function(key, value, expire) {
    var data = {
      t: now(),
      e: expire,
      v: value
    };

    data = JSON.stringify(data);

    return localStorage.setItem(key, data);
  };

  /**
   * sessionStorage get
   * @param  {[type]} key [description]
   * @return {[type]}     [description]
   */
  self.sGet = function(key) {
    return sessionStorage.getItem(key);
  };

  self.sSet = function(key, value) {
    return sessionStorage.setItem(key, value);
  };

  self.sDel = function(key) {
    return sessionStorage.removeItem(key);
  };

  return self;
})();
