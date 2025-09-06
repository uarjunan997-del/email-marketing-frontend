import { useEffect, useState } from 'react';
import { listCampaigns, Campaign } from '../api/campaigns';

export interface DashboardStat { id:string; label:string; value:number|string; delta?:number; }
export interface CampaignRow { id:number; name:string; status:'DRAFT'|'REVIEW'|'SCHEDULED'|'SENDING'|'SENT'|'CANCELLED'; sent:number; openRate:number; clickRate:number; }
export interface EngagementSlice { name:string; value:number; }
export interface ListSummary { name:string; contacts:number; }

export interface DashboardData {
  stats: DashboardStat[];
  campaigns: CampaignRow[];
  weekly: { date:string; sent:number; opens:number; }[];
  lists: ListSummary[];
  engagement: EngagementSlice[];
  alerts: string[];
  loading: boolean;
  refresh: () => void;
}

export const useDashboardData = (): DashboardData => {
  const [loading,setLoading] = useState(true);
  const [stats,setStats] = useState<DashboardStat[]>([]);
  const [campaigns,setCampaigns] = useState<CampaignRow[]>([]);
  const [weekly,setWeekly] = useState<{date:string;sent:number;opens:number;}[]>([]);
  const [lists,setLists] = useState<ListSummary[]>([]);
  const [engagement,setEngagement] = useState<EngagementSlice[]>([]);
  const [alerts,setAlerts] = useState<string[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      // Fetch real campaigns
      const realCampaigns = await listCampaigns();
      const campaignRows: CampaignRow[] = realCampaigns.slice(0, 5).map(c => ({
        id: c.id,
        name: c.name,
        status: c.status,
        sent: c.sentCount || 0,
        openRate: c.sentCount && c.openCount ? Math.round((c.openCount / c.sentCount) * 100) : 0,
        clickRate: c.sentCount && c.clickCount ? Math.round((c.clickCount / c.sentCount) * 100) : 0
      }));
      setCampaigns(campaignRows);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      // Fallback to mock data
      setCampaigns([
        {id:1, name:'September Promo', status:'SENT', sent:3200, openRate:41, clickRate:9},
        {id:2, name:'Onboarding Series 1', status:'SENDING', sent:1800, openRate:55, clickRate:14},
        {id:3, name:'Abandoned Cart', status:'SCHEDULED', sent:0, openRate:0, clickRate:0},
        {id:4, name:'Winback Q3', status:'DRAFT', sent:0, openRate:0, clickRate:0},
        {id:5, name:'VIP Offer', status:'CANCELLED', sent:0, openRate:0, clickRate:0}
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ load(); },[]);

  return { stats, campaigns, weekly, lists, engagement, alerts, loading, refresh: load };
};

export const statusVariant = (s:CampaignRow['status']) => {
  switch(s){
    case 'SENT': return 'success';
    case 'SENDING': return 'info';
    case 'SCHEDULED': return 'warning';
    case 'REVIEW': return 'warning';
    case 'DRAFT': return 'default';
    case 'CANCELLED': return 'danger';
  }
};
