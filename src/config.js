const qs = require('qs');
export const config = {
  appid: 57520,
  campaign_id: 'd821f19cbb',
  ver: 'd821f19cbb',
  sign: '841ba05e7a9d6c0d9ef804ce682cd358',
  queryUrl() {
    const params = {
      appid: this.appid,
      campaign_id: this.campaign_id,
      ver: this.ver,
      sign: this.sign,
      time: new Date().getTime()
    };
    const query = qs.stringify(params);
    return query;
  }
};

export const mixServerConfig = {
  // 获取配置的秘钥
  app_key: '6c18d6359290b17f12e85b7b77d7e009',
  // 通过配置接口设置
  api_app_key: '',
  // 通过初始化接口设置
  access_token: ''
};

export const channelServerConfig = {
  // 获取配置的秘钥
  app_key: 'ln18d6359290b17f12e85b7b77d7e009',
  // 通过配置接口设置
  api_app_key: '',
  // 通过初始化接口设置
  access_token: ''
};
