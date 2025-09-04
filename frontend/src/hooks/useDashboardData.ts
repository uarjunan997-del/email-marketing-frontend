import { useEffect, useState } from 'react';

export interface DashboardStat { id:string; label:string; value:number|string; delta?:number; }
export interface CampaignRow { id:string; name:string; status:'Draft'|'Scheduled'|'Sending'|'Sent'|'Error'; sent:number; openRate:number; clickRate:number; }
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

  const load = () => {
    setLoading(true);
    setTimeout(()=>{
      setStats([
        {id:'sent', label:'Campaigns Sent', value:128, delta:12},
        {id:'open', label:'Avg Open Rate', value:'41%', delta:3},
        {id:'click', label:'Avg Click Rate', value:'9%', delta:1},
        {id:'contacts', label:'Total Contacts', value:'24,850', delta:5}
      ]);
      setCampaigns([
        {id:'1', name:'September Promo', status:'Sent', sent:3200, openRate:41, clickRate:9},
        {id:'2', name:'Onboarding Series 1', status:'Sending', sent:1800, openRate:55, clickRate:14},
        {id:'3', name:'Abandoned Cart', status:'Scheduled', sent:0, openRate:0, clickRate:0},
        {id:'4', name:'Winback Q3', status:'Draft', sent:0, openRate:0, clickRate:0},
        {id:'5', name:'VIP Offer', status:'Error', sent:0, openRate:0, clickRate:0}
      ]);
      setWeekly([
        {date:'Mon', sent:2000, opens:1200}, {date:'Tue', sent:2600, opens:1500}, {date:'Wed', sent:2400, opens:1400}, {date:'Thu', sent:3000, opens:1800}, {date:'Fri', sent:3200, opens:1900}, {date:'Sat', sent:800, opens:420}, {date:'Sun', sent:500, opens:300}
      ]);
      setLists([
        {name:'List A', contacts:12000}, {name:'List B', contacts:8500}, {name:'List C', contacts:4300}, {name:'List D', contacts:2100}
      ]);
      setEngagement([
        {name:'Opens', value:62}, {name:'Clicks', value:18}, {name:'Bounces', value:5}, {name:'Unsubs', value:3}, {name:'Other', value:12}
      ]);
      setAlerts([
        'Bounce rate slightly elevated yesterday (4.8%).',
        'Approaching monthly send quota (82% used).'
      ]);
      setLoading(false);
    },700);
  };

  useEffect(()=>{ load(); },[]);

  return { stats, campaigns, weekly, lists, engagement, alerts, loading, refresh: load };
};

export const statusVariant = (s:CampaignRow['status']) => {
  switch(s){
    case 'Sent': return 'success';
    case 'Sending': return 'info';
    case 'Scheduled': return 'warning';
    case 'Draft': return 'default';
    case 'Error': return 'danger';
  }
};
