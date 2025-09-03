import { apiCall } from '../utils/api';

export interface CreateOrderRequest { planType: string; billingPeriod?: 'MONTHLY'|'YEARLY'; }
export interface CreateOrderResponse { orderId: string; key: string; amount: number; currency: string; planType: string; billingPeriod: string; }

export const createSubscriptionOrder = (req: CreateOrderRequest) => apiCall<CreateOrderResponse>('POST', '/payment/order', req);
