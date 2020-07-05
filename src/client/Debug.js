var $config = require('./Config.js');
var self = {
  /**
   * 输出调试信息
   * @param  {[type]} name [description]
   * @param  {[type]} info [description]
   * @return {[type]}      [description]
   */
  log: function(name, info) {
    if ($config.debug) {
      if (typeof info === 'undefined') {
        info = ' ';
      }

      console && console.log(self.now(), name, info);

      if (typeof info === 'object') {
        info = JSON.stringify(info);
      }
      self.html(name + '<br />' + info);
    }
  },
  /**
   * 生成HTML信息，置顶显示
   * @param  {[type]} info [description]
   * @return {[type]}      [description]
   */
  html: function(info) {
    var css =
      'position:absolute;top:0;left:0;width:100%;display:block;text-align:center;background:green;color:#FFF;font-size:14px';
    var p = document.createElement('p');
    p.style = css;
    p.id = 'debugTips' + parseInt(Math.random() * Math.pow(10, 8));
    p.innerHTML = info;

    var s = document.getElementsByTagName('body')[0];
    s.insertBefore(p, s.lastChild);

    var d = document.getElementById(p.id);
    setTimeout(function() {
      d.parentNode.removeChild(d);
    }, 5000);
  },
  /**
   * 获取当前时间
   * @return {[type]} [description]
   */
  now: function() {
    var date = new Date();
    var seperator1 = '-';
    var seperator2 = ':';
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = '0' + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate;
    }
    var currentdate =
      date.getFullYear() +
      seperator1 +
      month +
      seperator1 +
      strDate +
      ' ' +
      date.getHours() +
      seperator2 +
      date.getMinutes() +
      seperator2 +
      date.getSeconds();
    return currentdate;
  }
};

module.exports = self;
