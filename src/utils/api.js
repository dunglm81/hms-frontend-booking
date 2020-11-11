import axios from 'axios';
import authService from '../services/auth.service';
import { BE_URL, REFRESH_TOKEN_URL } from './constants';

const api_instance = axios.create({
  baseURL: BE_URL
});

api_instance.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    const isExpire = authService.isExpire();
    const isRefresh = authService.isRefresh();
    const orgCode = authService.getOrgCode();

    if (token && !isExpire && orgCode) {
      config.headers.orgcode = orgCode;
      config.headers.authorization = `Bearer ${token}`;
      if (isRefresh && config.url !== REFRESH_TOKEN_URL) {
        authService.getRefreshToken();
      }
    } else {
      authService.logout();
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api_instance.interceptors.response.use(response => {
  return response;
}, err => {
  const resErr = err.response;
  if (resErr) {
    console.log(resErr);
    alert(`Mã lỗi: ${resErr.status}\nNội dung: ${resErr.data}\nXin Vui lòng thử lại!`);
  } else if (err.request) {
    console.log(err.request);
  } else {
    console.log('Error', err.mesage);
    alert(`Thông báo: ${err.message}`)
  }
  return Promise.reject(err);
})

export default api_instance;
