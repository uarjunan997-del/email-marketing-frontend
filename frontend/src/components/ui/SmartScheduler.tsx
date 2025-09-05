import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Zap, TrendingUp, Users } from 'lucide-react';
import { format, addDays, addHours, startOfHour } from 'date-fns';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';

interface SmartSchedulerProps {
  onSchedule: (date: Date) => void;
  onSendNow: () => void;
}

const smartSuggestions = [
  {
    id: 'optimal',
    title: 'Optimal Time',
    description: 'Based on your audience engagement',
    time: addHours(startOfHour(new Date()), 2),
    icon: <TrendingUp className="w-4 h-4" />,
    badge: 'Recommended',
    color: 'from-accent-500 to-accent-600',
    engagement: '42% higher open rate'
  },
  {
    id: 'morning',
    title: 'Tomorrow Morning',
    description: 'Peak engagement window',
    time: addHours(startOfHour(addDays(new Date(), 1)), 9),
    icon: <Clock className="w-4 h-4" />,
    badge: 'Popular',
    color: 'from-primary-500 to-primary-600',
    engagement: '38% higher open rate'
  },
  {
    id: 'weekend',
    title: 'Weekend Send',
    description: 'Less competition in inbox',
    time: addHours(startOfHour(addDays(new Date(), 6)), 10),
    icon: <Users className="w-4 h-4" />,
    badge: 'Strategic',
    color: 'from-secondary-500 to-secondary-600',
    engagement: '25% higher click rate'
  }
];

export const SmartScheduler: React.FC<SmartSchedulerProps> = ({
  onSchedule,
  onSendNow
}) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');

  const handleSuggestionSelect = (suggestion: typeof smartSuggestions[0]) => {
    setSelectedSuggestion(suggestion.id);
    onSchedule(suggestion.time);
  };

  const handleCustomSchedule = () => {
    if (customDate && customTime) {
      const scheduledDate = new Date(`${customDate}T${customTime}`);
      onSchedule(scheduledDate);
    }
  };

  return (
    <div className="space-y-6">
      {/* Send Now Option */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card variant="gradient" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-200/20 to-transparent rounded-full transform translate-x-12 -translate-y-12" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-glow">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
                  Send Immediately
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Campaign will be delivered right away
                </p>
              </div>
            </div>
            <Button
              onClick={onSendNow}
              size="lg"
              icon={<Zap className="w-4 h-4" />}
            >
              Send Now
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Smart Suggestions */}
      <div>
        <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-500" />
          Smart Scheduling Suggestions
        </h3>
        
        <div className="grid gap-4">
          {smartSuggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card
                hover
                className={`cursor-pointer transition-all duration-300 ${
                  selectedSuggestion === suggestion.id
                    ? 'ring-2 ring-primary-500 shadow-glow'
                    : ''
                }`}
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 bg-gradient-to-br ${suggestion.color} rounded-lg flex items-center justify-center text-white shadow-lg`}>
                      {suggestion.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                          {suggestion.title}
                        </h4>
                        <Badge variant="gradient" size="sm">
                          {suggestion.badge}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {suggestion.description}
                      </p>
                      <p className="text-xs text-accent-600 dark:text-accent-400 mt-1 font-medium">
                        {suggestion.engagement}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      {format(suggestion.time, 'MMM d')}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {format(suggestion.time, 'h:mm a')}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Custom Scheduling */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card variant="glass">
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-4">
            Custom Schedule
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-sm focus-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Time
              </label>
              <input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-sm focus-ring"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleCustomSchedule}
                disabled={!customDate || !customTime}
                variant="outline"
                className="w-full"
              >
                Schedule
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SmartScheduler;