import { apiCall } from '../utils/api';

export interface Campaign {
  id: number;
  userId: number;
  name: string;
  segment?: string | null;
  templateId?: number | null;
  subject?: string | null;
  preheader?: string | null;
  status: 'DRAFT' | 'REVIEW' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'CANCELLED';
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
  scheduledAt?: string | null;
  totalRecipients?: number;
  sentCount?: number;
  openCount?: number;
  clickCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCampaignInput {
  name: string;
  segment?: string;
  templateId?: number;
  subject?: string;
  preheader?: string;
  scheduledAt?: string;
}

export interface ScheduleInput {
  scheduledAt: string;
  timezone?: string;
  windowStart?: string;
  windowEnd?: string;
  optimizationStrategy?: string;
}

export interface CampaignProgress {
  status: string;
  total: number;
  sent: number;
  opens: number;
  clicks: number;
}

export interface CampaignAnalytics {
  status: string;
  sent: number;
  opens: number;
  clicks: number;
  revenue?: number | null;
  orders?: number | null;
  ctr: number;
  openRate: number;
  roi?: number | null;
}

export interface ABTestVariant {
  code: string;
  subject: string;
  templateId: number;
  splitPercent?: number;
}

export interface ABTestRequest {
  variants: ABTestVariant[];
  samplePercent?: number;
}

// API Functions
export const listCampaigns = () => apiCall<Campaign[]>('GET', '/api/campaigns');
export const getCampaign = (id: number) => apiCall<Campaign>('GET', `/api/campaigns/${id}`);
export const createCampaign = (body: CreateCampaignInput) => apiCall<Campaign>('POST', '/api/campaigns', body);
export const updateCampaign = (id: number, body: CreateCampaignInput) => apiCall<Campaign>('PUT', `/api/campaigns/${id}`, body);
export const scheduleCampaign = (id: number, body: ScheduleInput) => apiCall<Campaign>('POST', `/api/campaigns/${id}/schedule`, body);
export const sendNow = (id: number) => apiCall<Campaign>('POST', `/api/campaigns/${id}/send-now`, {});
export const cancelCampaign = (id: number) => apiCall<Campaign>('POST', `/api/campaigns/${id}/cancel`, {});
export const getPreview = (id: number) => apiCall<string>('GET', `/api/campaigns/${id}/preview`);
export const setupAbTest = (id: number, body: ABTestRequest) => apiCall('POST', `/api/campaigns/${id}/ab-test`, body);
export const getProgress = (id: number) => apiCall<CampaignProgress>('GET', `/api/campaigns/${id}/progress`);
export const getAnalytics = (id: number) => apiCall<CampaignAnalytics>('GET', `/api/campaigns/${id}/analytics`);
export const runAnalysis = (id: number) => apiCall('POST', `/api/campaigns/${id}/analyze`, {});
export const requestApproval = (id: number) => apiCall('POST', `/api/campaigns/${id}/request-approval`, {});
export const approveCampaign = (id: number) => apiCall('POST', `/api/campaigns/${id}/approve`, {});
export const rejectCampaign = (id: number, notes?: string) => apiCall('POST', `/api/campaigns/${id}/reject`, notes ? { notes } : {});