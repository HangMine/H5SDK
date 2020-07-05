import axios from 'axios';
import qs from 'qs';
import { getSignedParams, getPhpNow } from '@/utils';
import { Dialog } from 'vant';
import store from '@/store';

// 这里不能直接引入mixServer和channelServer，循环引用问题！（暂时获取app_key通过config文件）
import { mixServerConfig, channelServerConfig } from '../config';

// 全局的post请求设置为表单格式
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

// 默认axios，如果调了default走单独实例

// const http = option => {
//   handleOption(option);
//   return _axios(option);
// };

// const handleOption = option => {
//   if (option.method === 'post') {
//     option.data = option.params;
//     delete option.params;
//   }
// };

const http = {
  create(option = {}) {
    const isMixServer = option.serverType === 'mix';
    const _axios = axios.create(option);
    // 为实例添加请求拦截器
    _axios.interceptors.request.use(
      config => {
        const { url, method, params = {}, noMode, noTimeAndAccess, noSign } = config;
        let newParams;
        if (method === 'post') {
          // post参数也通过params传递
          config.data = params;
          config.params = '';
          newParams = config.data;
        } else if (method === 'get') {
          newParams = config.params;
        }
        // 增加time和access_token参数
        if (!noTimeAndAccess) {
          // 需要返回新的对象，否则会改到原本的params
          newParams = {
            ...newParams,
            time: getPhpNow(),
            access_token: isMixServer ? mixServerConfig.access_token : channelServerConfig.access_token
          };
        }

        // 增加sign参数
        if (!noSign) {
          const app_key = isMixServer ? mixServerConfig.api_app_key : channelServerConfig.api_app_key;
          const signedParams = getSignedParams(app_key, newParams);
          newParams = signedParams;
        }

        console.log(`请求:${url}`);
        console.log(newParams);

        // 拼上mode:0,数据通过JSON.stringfy转换
        if (!noMode) {
          newParams = { mode: 0, data: JSON.stringify(newParams) };
        }
        if (method === 'post') {
          config.data = qs.stringify(newParams);
        }
        return config;
      },
      error => {
        // 对请求错误做些什么
        return Promise.reject(error);
      }
    );
    // 为实例添加响应拦截器
    _axios.interceptors.response.use(
      response => {
        const { url, isConfirm, isInitCheck } = response.config;
        // 将返回的JSON转成对象
        const apiData = response.data || {};
        apiData.data = JSON.parse(apiData.data) || {};
        let { msg, ret } = apiData.data;
        console.warn(`响应:${url}`);
        console.warn(apiData.data);

        // if (isInitCheck) {
        //   if (ret != 0) {
        //     Dialog({
        //       title: '初始化失败',
        //       confirmButtonText: '刷新',
        //       message: `${msg}\n请联系管理员，并刷新页面重试`
        //     }).then(res => {
        //       location.reload();
        //     });
        //     store.commit('SET_LOADING', false);
        //     return Promise.reject(msg);
        //   }
        // }
        if (isConfirm) {
          Dialog.alert({
            message: msg
          });
        }
        // 只返回接口数据
        return apiData.data || {};
      },
      error => {
        return Promise.reject(error);
      }
    );
    return _axios;
  }
};

export default http;
