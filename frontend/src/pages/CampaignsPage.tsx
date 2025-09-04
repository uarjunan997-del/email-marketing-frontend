import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '@components/atoms/Card';
import { Button } from '@components/atoms/Button';
import { Badge } from '@components/atoms/Badge';
import { Input } from '@components/atoms/Input';
import { 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Users, 
  Calendar,
  TrendingUp,
  Play,
  Pause,
  MoreHorizontal,
  Eye,
  Copy,
  Trash2
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: 'Draft' | 'Scheduled' | 'Sending' | 'Sent' | 'Paused' | 'Error';
  sent: number;
  opens: number;
  clicks: number;
  openRate: number;
  clickRate: number;
  scheduledAt?: string;
  createdAt: string;
  template: string;
  audience: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Welcome Series - Part 1',
    status: 'Sent',
    sent: 3200,
    opens: 1312,
    clicks: 289,
    openRate: 41,
    clickRate: 9,
    createdAt: '2024-01-15',
    template: 'Welcome Template',
    audience: 'New Subscribers'
  },
  {
    id: '2',
    name: 'September Product Launch',
    status: 'Sending',
    sent: 1800,
    opens: 990,
    clicks: 252,
    openRate: 55,
    clickRate: 14,
    createdAt: '2024-01-14',
    template: 'Product Launch',
    audience: 'All Subscribers'
  },
  {
    id: '3',
    name: 'Abandoned Cart Recovery',
    status: 'Scheduled',
    sent: 0,
    opens: 0,
    clicks: 0,
    openRate: 0,
    clickRate: 0,
    scheduledAt: '2024-01-20T10:00:00Z',
    createdAt: '2024-01-13',
    template: 'Cart Recovery',
    audience: 'Cart Abandoners'
  },
  {
    id: '4',
    name: 'Monthly Newsletter',
    status: 'Draft',
    sent: 0,
    opens: 0,
    clicks: 0,
    openRate: 0,
    clickRate: 0,
    createdAt: '2024-01-12',
    template: 'Newsletter Template',
    audience: 'Newsletter Subscribers'
  }
];

const statusConfig = {
  Draft: { variant: 'default' as const, color: 'text-neutral-600' },
  Scheduled: { variant: 'warning' as const, color: 'text-amber-600' },
  Sending: { variant: 'info' as const, color: 'text-blue-600' },
  Sent: { variant: 'success' as const, color: 'text-accent-600' },
  Paused: { variant: 'warning' as const, color: 'text-amber-600' },
  Error: { variant: 'danger' as const, color: 'text-red-600' }
};

export const CampaignsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.template.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.audience.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-display font-bold text-3xl text-neutral-900 dark:text-neutral-100 mb-2">
            Campaigns
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage and track your email campaigns
          </p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          size="lg"
        >
          New Campaign
        </Button>
      </motion.div>

      {/* Quick stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: 'Total Campaigns', value: mockCampaigns.length, icon: <Mail className="w-5 h-5" /> },
          { label: 'Active', value: mockCampaigns.filter(c => c.status === 'Sending').length, icon: <Play className="w-5 h-5" /> },
          { label: 'Scheduled', value: mockCampaigns.filter(c => c.status === 'Scheduled').length, icon: <Calendar className="w-5 h-5" /> },
          { label: 'Avg Open Rate', value: '48%', icon: <TrendingUp className="w-5 h-5" /> }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
          >
            <Card variant="gradient" className="text-center">
              <div className="flex items-center justify-center mb-2 text-primary-500">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                {stat.label}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Card variant="glass" padding="md">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search campaigns..."
                icon={<Search className="w-4 h-4" />}
                variant="floating"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus-ring"
              >
                <option value="">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Sending">Sending</option>
                <option value="Sent">Sent</option>
                <option value="Paused">Paused</option>
                <option value="Error">Error</option>
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Campaigns list */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filteredCampaigns.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          {filteredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card hover variant="gradient" className="group">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 truncate">
                        {campaign.name}
                      </h3>
                      <Badge variant={statusConfig[campaign.status].variant}>
                        {campaign.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-neutral-500 dark:text-neutral-400">Template</p>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">
                          {campaign.template}
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-500 dark:text-neutral-400">Audience</p>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">
                          {campaign.audience}
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-500 dark:text-neutral-400">Sent</p>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">
                          {campaign.sent.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-500 dark:text-neutral-400">Open Rate</p>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">
                          {campaign.openRate}%
                        </p>
                      </div>
                    </div>

                    {campaign.scheduledAt && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                        <Calendar className="w-3 h-3" />
                        Scheduled for {new Date(campaign.scheduledAt).toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
                      View
                    </Button>
                    <Button variant="ghost" size="sm" icon={<Copy className="w-4 h-4" />}>
                      Clone
                    </Button>
                    <Button variant="ghost" size="sm" icon={<MoreHorizontal className="w-4 h-4" />}>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredCampaigns.length === 0 && !searchQuery && !statusFilter && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-12 h-12 text-primary-500" />
          </div>
          <h3 className="font-display font-semibold text-xl text-neutral-900 dark:text-neutral-100 mb-2">
            No campaigns yet
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
            Ready to reach your audience? Create your first email campaign and start engaging with your subscribers.
          </p>
          <Button icon={<Plus className="w-4 h-4" />} size="lg">
            Create Your First Campaign
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default CampaignsPage;