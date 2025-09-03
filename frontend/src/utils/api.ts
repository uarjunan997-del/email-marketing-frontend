import axios, { AxiosResponse } from 'axios';

export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080';

export const api = axios.create({ baseURL: API_BASE_URL, headers:{'Content-Type':'application/json'} });

api.interceptors.request.use(cfg => { const t = localStorage.getItem('token'); if(t) cfg.headers.Authorization = `Bearer ${t}`; return cfg; });

api.interceptors.response.use((r:AxiosResponse)=>r, (error)=>{
  const status = error.response?.status;
  if(status === 401 || status === 403){ localStorage.removeItem('token'); localStorage.removeItem('user'); setTimeout(()=>{ window.location.href='/login';}, 800); }
  return Promise.reject(error);
});

export const apiCall = async <T>(method: 'GET'|'POST'|'PUT'|'DELETE', url:string, data?:any): Promise<T> => {
  const res = await api.request({method,url,data});
  return res.data;
};

export const authApiCall = async <T>(method:'POST', url:string, data:any): Promise<T> => apiCall<T>(method,url,data);
