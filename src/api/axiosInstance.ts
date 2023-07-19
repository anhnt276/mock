import axios from "axios";
import { store } from "../store";


export const axiosInstance = axios.create({
  baseURL: 'https://api.realworld.io/api',
  timeout: 10000,
  headers: {},
})

axiosInstance.interceptors.request.use(function (config) {
  const s = store.getState()
  const token = (s.user.currentUser as any)?.token;

  config.headers.set('Authorization', token ? 'Bearer ' + token : undefined)
  return config;
}, function (error) {
  return Promise.reject(error);
});