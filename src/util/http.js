import axios from "axios"
import store from '@/store'
import router from '../router/index.js'
import { Toast } from 'vant';
import i18n from '@/lang';

Toast.setDefaultOptions({ closeOnClick: true });

const translate = (key, fallback) => {
  const result = i18n.t(key);
  return result === key ? fallback : result;
};

/**
 * 环境切换
 */
let apiUrl = ''
let HOST = process.env.HOST;

if (HOST.indexOf('prerelease') > -1) {                //npm run build -- prerelease 外网测试
  apiUrl = '/api'
  store.state.WS_URL = 'wss://ws.lasttime.xyz/ws'
}
if (HOST.indexOf('test') > -1) {                      //npm run build -- test 内网测试
  apiUrl = '/api'
}
if (HOST.indexOf('prod') > -1) {
  apiUrl = '/api'
  store.state.WS_URL = 'wss://ws.qyhyin6.com/ws'
}
if (HOST === 'dev') {
  let u = window.location.port == '8081'?'https://119330.xyz':''
  // apiUrl = u+'/api'
  apiUrl = 'http://192.168.10.100:8082/'
  store.state.WS_URL = 'ws://192.168.254.121:8088/ws'
}
console.log('当前环境：' + HOST, apiUrl)
axios.defaults.baseURL = apiUrl;//请求地址的域名
//返回数据设置
// axios.defaults.responseType = "json";

// 创建axios实例
const http = axios.create({
  baseURL: '/apiUrl',
  headers: {
    // Authorization: '',
    get: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    post: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  },
  validateStatus(status) {
    // 设置默认的合法状态
    return status >= 200 && status < 504
  },
  timeout: 15000
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  let sessionId = sessionStorage.getItem('sessionId')
  if (sessionId !== null && sessionId !== '' && (config.url.indexOf('.json') == -1 && config.url.indexOf('getVersion') == -1)) {
    //  让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['Authorization'] = sessionId;
  }
  // 添加请求日志，方便调试
  console.log('📤 请求接口:', (config.method && config.method.toUpperCase()) || 'GET', config.url, config.baseURL || axios.defaults.baseURL);
  return config
}, function (error) {
  // 对请求错误做些什么
  console.error('❌ 请求错误:', error);
  return Promise.reject(error)
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 添加响应日志，方便调试
  const method = (response.config && response.config.method && response.config.method.toUpperCase()) || 'GET';
  const url = (response.config && response.config.url) || '未知';
  const code = (response.data && response.data.code) || '未知';
  console.log('📥 响应接口:', method, url, '状态码:', response.status, '返回码:', code);
  // 对响应数据做点什么
  if (!response.data.version&&response.data && response.data.code != "200") {
    if (response.data.code == "510") {
      Toast('该彩种当前已停盘，不可投注');
      router.push({ path: '/' })
      return
    } else if (response.data.code == "401") {
      store.state.loginOpen = true;
      sessionStorage.removeItem('sessionId')
      sessionStorage.removeItem('state')
      return Promise.reject(response.data.msg)
    } else if (response.data.code == "402") {
      // Toast('您的账号已在别处登录！');
      sessionStorage.removeItem('sessionId')
      sessionStorage.removeItem('state')
      router.push({ path: 'login' })
      return
    } else if (response.data.code == "403") {
      Toast('您的IP已被限制访问！');
      sessionStorage.removeItem('sessionId')
      sessionStorage.removeItem('state')
      router.push({ path: 'login' })
      return
    } else if (response.data.code == "400") {
      if( response.data.msg === '操作太频繁' ) {
        return Promise.reject()
      }
      // 添加详细的错误日志
      console.error('❌ 接口返回 400 错误:', response.config.url, '错误信息:', response.data.msg);
      Toast(response.data.msg);
      return Promise.reject(response.data.msg)
    } else {
      // 添加详细的错误日志
      console.error('❌ 接口返回非 200 错误码:', response.config.url, '错误码:', response.data.code, '错误信息:', response.data.msg);
      const message = response.data.msg || translate("new2['连接失败，请检查您的网络']", "连接失败，请检查您的网络");
      Toast(message);
      return Promise.reject(message)
    }
  }else{
    return response.data || {}
  }
}, function (error) {
  // 添加详细的错误日志
  const requestUrl = (error.config && error.config.url) || '未知接口';
  const requestMethod = (error.config && error.config.method && error.config.method.toUpperCase()) || '未知方法';
  const errorMessage = error.message || '未知错误';
  console.error('❌ 接口请求失败:', requestMethod, requestUrl);
  console.error('❌ 错误详情:', errorMessage);
  console.error('❌ 完整错误对象:', error);
  
  const message = translate("new2['连接失败，请检查您的网络']", "连接失败，请检查您的网络");
  Toast(message);
  return Promise.reject(message)
});
