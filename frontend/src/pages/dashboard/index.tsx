import { useDashboardData, statusVariant } from '@hooks/useDashboardData';
import { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import DashboardStats from '@components/DashboardStats';
import ChartWidget from '@components/ChartWidget';
import { Badge } from '@components/atoms/Badge';
import { Button } from '@components/atoms/Button';

const DashboardPage: React.FC = () => {
	const { stats, campaigns, weekly, lists, engagement, alerts, loading } = useDashboardData();
	const [isDark,setIsDark] = useState<boolean>(false);
	// Watch for theme changes dynamically
	useEffect(()=>{ const mql = window.matchMedia('(prefers-color-scheme: dark)'); const update=()=>setIsDark(document.documentElement.classList.contains('dark') || mql.matches); update(); mql.addEventListener('change',update); const obs = new MutationObserver(update); obs.observe(document.documentElement,{attributes:true, attributeFilter:['class']}); return ()=>{ mql.removeEventListener('change',update); obs.disconnect(); }; },[]);
	const colors = useMemo(()=>({
		primary: isDark ? '#40c8ff' : '#0baeea',
		secondary: isDark ? '#818cf8' : '#6366f1',
		bar: isDark ? '#0baeea' : '#0baeea',
		pie: ['#0baeea','#6366f1','#ef4444','#f59e0b','#64748b']
	}),[isDark]);
	return (
		<div className="space-y-8" data-testid="dashboard-page">
			<DashboardStats stats={stats} loading={loading} />
			<div className="grid gap-4 md:grid-cols-3">
				<div className="md:col-span-2 space-y-4">
					<div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
						<div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold tracking-wide">Recent Campaigns</h3><Button onClick={()=>{}}>View All</Button></div>
						<div className="overflow-x-auto">
							<table className="min-w-full text-xs md:text-sm">
								<thead className="text-left bg-gray-100 dark:bg-gray-800"><tr><th className="px-3 py-2 font-medium">Name</th><th className="px-3 py-2 font-medium">Status</th><th className="px-3 py-2 font-medium whitespace-nowrap">Sent</th><th className="px-3 py-2 font-medium whitespace-nowrap">Open %</th><th className="px-3 py-2 font-medium whitespace-nowrap">Click %</th></tr></thead>
								<tbody>{campaigns.map(c=> <tr key={c.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"><td className="px-3 py-2 font-medium">{c.name}</td><td className="px-3 py-2"><Badge variant={statusVariant(c.status)}>{c.status}</Badge></td><td className="px-3 py-2">{c.sent || '-'}</td><td className="px-3 py-2">{c.openRate? c.openRate+'%':'-'}</td><td className="px-3 py-2">{c.clickRate? c.clickRate+'%':'-'}</td></tr>)}</tbody>
							</table>
						</div>
					</div>
					<div className="grid gap-4 md:grid-cols-2">
						<ChartWidget title="Weekly Sends vs Opens" loading={loading}>{!loading && <ResponsiveContainer width="100%" height={220}><LineChart data={weekly}><CartesianGrid strokeDasharray="3 3" stroke="#9ca3af33" /><XAxis dataKey="date" stroke="currentColor" fontSize={12} /><YAxis stroke="currentColor" fontSize={12} /><Tooltip /><Line type="monotone" dataKey="sent" stroke={colors.primary} strokeWidth={2} /><Line type="monotone" dataKey="opens" stroke={colors.secondary} strokeWidth={2} /></LineChart></ResponsiveContainer>}</ChartWidget>
						<ChartWidget title="Top Lists by Contacts" loading={loading}>{!loading && <ResponsiveContainer width="100%" height={220}><BarChart data={lists}><CartesianGrid strokeDasharray="3 3" stroke="#9ca3af33" /><XAxis dataKey="name" stroke="currentColor" fontSize={12} /><YAxis stroke="currentColor" fontSize={12} /><Tooltip /><Bar dataKey="contacts" fill={colors.bar} radius={[4,4,0,0]} /></BarChart></ResponsiveContainer>}</ChartWidget>
					</div>
				</div>
				<div className="space-y-4">
					<ChartWidget title="Engagement Mix" loading={loading}>{!loading && <ResponsiveContainer width="100%" height={260}><PieChart><Pie data={engagement} dataKey="value" nameKey="name" outerRadius={90} innerRadius={40} stroke="none" label>{engagement.map((e,i)=><Cell key={e.name} fill={colors.pie[i % colors.pie.length]} />)}</Pie><Legend wrapperStyle={{fontSize:12}} /></PieChart></ResponsiveContainer>}</ChartWidget>
					<div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4" aria-labelledby="alerts-heading">
						<h3 id="alerts-heading" className="text-sm font-semibold tracking-wide mb-2">Notifications</h3>
						<div aria-live="polite" aria-atomic="true">
							{loading && <div className="space-y-2" role="status"><div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /><div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></div>}
							{!loading && alerts.length === 0 && <p className="text-xs text-gray-500">No alerts 🎉</p>}
							{!loading && alerts.length > 0 && <ul className="space-y-2 text-xs list-disc pl-4">{alerts.map((a,i)=><li key={i}>{a}</li>)}</ul>}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default DashboardPage;