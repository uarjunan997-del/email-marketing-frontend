import React from 'react';
import { motion } from 'framer-motion';
import { useDashboardData, statusVariant } from '@hooks/useDashboardData';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import DashboardStats from '@components/DashboardStats';
import { Card } from '@components/atoms/Card';
import { Badge } from '@components/atoms/Badge';
import { Button } from '@components/atoms/Button';
import { 
  Mail, 
  Users, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  AlertTriangle,
  Plus,
  ExternalLink
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { stats, campaigns, weekly, lists, engagement, alerts, loading } = useDashboardData();

  // Enhanced stats with icons
  const enhancedStats = stats.map(stat => ({
    ...stat,
    icon: stat.id === 'sent' ? <Mail className="w-5 h-5" /> :
          stat.id === 'open' ? <Eye className="w-5 h-5" /> :
          stat.id === 'click' ? <MousePointer className="w-5 h-5" /> :
          stat.id === 'contacts' ? <Users className="w-5 h-5" /> :
          <TrendingUp className="w-5 h-5" />
  }));

  const chartColors = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444'
  };

  const pieColors = [chartColors.primary, chartColors.secondary, chartColors.danger, chartColors.warning, '#64748b'];

  return (
    <div className="space-y-8" data-testid="dashboard-page">
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-3xl text-neutral-900 dark:text-neutral-100 mb-2">
              Good morning! 👋
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Here's what's happening with your campaigns today
            </p>
          </div>
          <Button
            variant="secondary"
            icon={<Plus className="w-4 h-4" />}
            className="hidden sm:flex"
          >
            New Campaign
          </Button>
        </div>
      </motion.div>

      {/* Stats grid */}
      <DashboardStats stats={enhancedStats} loading={loading} />

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly performance chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card variant="gradient" className="relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
                    Weekly Performance
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Emails sent vs opens over the last 7 days
                  </p>
                </div>
                <Button variant="ghost" size="sm" icon={<ExternalLink className="w-4 h-4" />}>
                  View Details
                </Button>
              </div>
              
              <div className="h-64">
                {loading ? (
                  <div className="h-full shimmer rounded-xl bg-neutral-100 dark:bg-neutral-800" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weekly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        stroke="currentColor" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="currentColor" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sent" 
                        stroke={chartColors.primary}
                        strokeWidth={3}
                        dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: chartColors.primary, strokeWidth: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="opens" 
                        stroke={chartColors.secondary}
                        strokeWidth={3}
                        dot={{ fill: chartColors.secondary, strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: chartColors.secondary, strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Recent campaigns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Card variant="gradient">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
                  Recent Campaigns
                </h3>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              
              <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                <table className="min-w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Campaign
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Sent
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Open Rate
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Click Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800">
                    {campaigns.map((campaign, index) => (
                      <motion.tr
                        key={campaign.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-neutral-900 dark:text-neutral-100">
                            {campaign.name}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={statusVariant(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                          {campaign.sent.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                          {campaign.openRate}%
                        </td>
                        <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                          {campaign.clickRate}%
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right column - Sidebar widgets */}
        <div className="space-y-6">
          {/* Engagement pie chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card variant="gradient">
              <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 mb-4">
                Engagement Mix
              </h3>
              <div className="h-64">
                {loading ? (
                  <div className="h-full shimmer rounded-xl bg-neutral-100 dark:bg-neutral-800" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={engagement}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        innerRadius={40}
                        stroke="none"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {engagement.map((entry, index) => (
                          <Cell 
                            key={entry.name} 
                            fill={pieColors[index % pieColors.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card variant="gradient">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
                  Notifications
                </h3>
              </div>
              
              <div className="space-y-3">
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded shimmer" />
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded shimmer w-3/4" />
                  </div>
                ) : alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🎉</span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      All systems running smoothly!
                    </p>
                  </div>
                ) : (
                  alerts.map((alert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl"
                    >
                      <p className="text-xs text-amber-800 dark:text-amber-200">
                        {alert}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Card variant="gradient">
              <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" icon={<Mail className="w-4 h-4" />}>
                  Create Campaign
                </Button>
                <Button variant="outline" className="w-full justify-start" icon={<Users className="w-4 h-4" />}>
                  Import Contacts
                </Button>
                <Button variant="outline" className="w-full justify-start" icon={<TrendingUp className="w-4 h-4" />}>
                  View Analytics
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;