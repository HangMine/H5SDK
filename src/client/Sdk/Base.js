/**
 * SDK接口基类
 * @author wenjingmin@gmail.com
 */
var sdkBase = {
  /**
   * 统一接口调用
   * @param  string func         函数名称
   * @param  array  params       变量数据，按参数顺序
   * @param  string callbackName 回调名称
   */
  trigger: function(func, params, callbackName) {}
};

module.exports = sdkBase;
