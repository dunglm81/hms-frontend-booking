import axios from 'axios';
import authService from '../services/auth.service';
import { BE_URL, BE_URL_ADMIN, REFRESH_TOKEN_URL } from './constants';
import { logFn } from './util';

const api_instance = axios.create({
  baseURL: BE_URL
});

api_instance.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    const isExpire = authService.isExpire();
    const isRefresh = authService.isRefresh();
    const orgCode = authService.getOrgCode();

    logFn("isRefresh", isRefresh);

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

export default api_instance;
