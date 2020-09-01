import axios from 'axios';
import qs from 'qs';
import { Message } from 'element-ui';

const service = axios.create({
  baseURL:process.env.VUE_APP_BASE_URL,
  timeout: 50000,
});

service.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
service.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';//设置请求为异步
service.defaults.paramsSerializer = (params) => qs.stringify(params, {
  indices: false,
});

// 请求拦截，携带token
service.interceptors.request.use((config) => {
  return config;
}, (error) => {
  Promise.reject(error);
});

// 响应拦截
service.interceptors.response.use(
  (response) => {
    const contentType = response.headers['content-type'];
    const isStream = contentType.indexOf('application/octet-stream') > -1;
    if (isStream) return response.data;
    if(response.status !== 200){
        Message.error('系统错误');
    }else{
        return response.data;
    }
    
  },
  (error) => Promise.reject(error.message),
);
export default service;
