import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@components/atoms/Card';
import { Button } from '@components/atoms/Button';
import { Input } from '@components/atoms/Input';
import { Badge } from '@components/atoms/Badge';
import { useAuth } from '@contexts/AuthContext';
import { 
  User, 
  Mail, 
  Bell, 
  Shield, 
  CreditCard, 
  Zap,
  Settings as SettingsIcon,
  Save,
  Crown,
  Sparkles
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display font-bold text-3xl text-neutral-900 dark:text-neutral-100 mb-2">
            Settings
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage your account preferences and configuration
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="gradient" className="hidden sm:flex">
            <Crown className="w-3 h-3 mr-1" />
            Free Plan
          </Badge>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card variant="gradient" padding="sm">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white shadow-glow'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </motion.div>

        {/* Main content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'profile' && (
              <Card variant="gradient">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-glow">
                    {user?.firstName?.[0] || 'U'}
                  </div>
                  <div>
                    <h2 className="font-semibold text-xl text-neutral-900 dark:text-neutral-100">
                      Profile Settings
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Update your personal information
                    </p>
                  </div>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      defaultValue={user?.firstName || ''}
                      variant="floating"
                    />
                    <Input
                      label="Last Name"
                      defaultValue={user?.lastName || ''}
                      variant="floating"
                    />
                  </div>
                  <Input
                    label="Email Address"
                    type="email"
                    defaultValue={user?.email || ''}
                    variant="floating"
                    icon={<Mail className="w-4 h-4" />}
                  />
                  <Input
                    label="Company"
                    placeholder="Your company name"
                    variant="floating"
                  />
                  <div className="flex justify-end">
                    <Button icon={<Save className="w-4 h-4" />}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {activeTab === 'billing' && (
              <Card variant="gradient">
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-secondary-100 to-accent-100 dark:from-secondary-900/20 dark:to-accent-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Crown className="w-10 h-10 text-secondary-500" />
                  </div>
                  <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-neutral-100 mb-2">
                    Upgrade to Pro
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
                    Unlock advanced features, unlimited templates, and priority support
                  </p>
                  
                  <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto mb-8">
                    <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                      <h3 className="font-semibold text-lg mb-2">Free Plan</h3>
                      <p className="text-3xl font-bold mb-4">$0<span className="text-sm font-normal">/month</span></p>
                      <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <li>• 5 templates</li>
                        <li>• 1,000 emails/month</li>
                        <li>• Basic analytics</li>
                      </ul>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl text-white relative overflow-hidden">
                      <div className="absolute top-2 right-2">
                        <Sparkles className="w-5 h-5 opacity-50" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Pro Plan</h3>
                      <p className="text-3xl font-bold mb-4">$29<span className="text-sm font-normal">/month</span></p>
                      <ul className="space-y-2 text-sm">
                        <li>• Unlimited templates</li>
                        <li>• 50,000 emails/month</li>
                        <li>• Advanced analytics</li>
                        <li>• A/B testing</li>
                        <li>• Priority support</li>
                      </ul>
                    </div>
                  </div>

                  <Button variant="secondary" size="lg" icon={<Zap className="w-4 h-4" />}>
                    Upgrade to Pro
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card variant="gradient">
                <h2 className="font-semibold text-xl text-neutral-900 dark:text-neutral-100 mb-6">
                  Notification Preferences
                </h2>
                <div className="space-y-6">
                  {[
                    { label: 'Campaign notifications', description: 'Get notified when campaigns are sent or completed' },
                    { label: 'Performance alerts', description: 'Receive alerts for unusual performance metrics' },
                    { label: 'Weekly reports', description: 'Get weekly summary reports via email' },
                    { label: 'Product updates', description: 'Stay informed about new features and improvements' }
                  ].map((setting, index) => (
                    <div key={setting.label} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">
                          {setting.label}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {setting.description}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={index < 2} />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card variant="gradient">
                <h2 className="font-semibold text-xl text-neutral-900 dark:text-neutral-100 mb-6">
                  Security Settings
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      <Input
                        label="Current Password"
                        type="password"
                        variant="floating"
                      />
                      <Input
                        label="New Password"
                        type="password"
                        variant="floating"
                      />
                      <Input
                        label="Confirm New Password"
                        type="password"
                        variant="floating"
                      />
                      <Button icon={<Save className="w-4 h-4" />}>
                        Update Password
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
                    <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                      Two-Factor Authentication
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">
                          Enable 2FA
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;