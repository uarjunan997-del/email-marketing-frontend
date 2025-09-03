import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const api = axios.create({ baseURL });
api.interceptors.request.use(async cfg => { const t = await SecureStore.getItemAsync('token'); if(t) cfg.headers.Authorization = `Bearer ${t}`; return cfg; });

export interface CreateOrderRequest { planType: string; billingPeriod?: 'MONTHLY'|'YEARLY'; }
export interface CreateOrderResponse { orderId: string; key: string; amount: number; currency: string; planType: string; billingPeriod: string; }

export const createSubscriptionOrder = async (req: CreateOrderRequest) => {
  const res = await api.post<CreateOrderResponse>('/payment/order', req);
  return res.data;
};
