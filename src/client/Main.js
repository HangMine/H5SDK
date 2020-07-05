var $config = require('./Config.js');
var $lang = require('./Lang.js');

try {
  window[$config.apiSdkName] = require('./Api.js');
  window[$config.callbackName] = require('./CallbackHandler.js');
} catch (err) {
  if ($config.debug) {
    console && console.log($lang.exception, err); // 异常上报
    alert(err);
  }
}
