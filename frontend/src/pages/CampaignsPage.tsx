import React from 'react';
import { Button } from '@components/atoms/Button';
import { Link } from 'react-router-dom';

export const CampaignsPage: React.FC = () => {
  // Placeholder list
  const campaigns = [
    {id:'1', name:'Welcome Series', status:'Draft', sent:0},
    {id:'2', name:'September Promo', status:'Scheduled', sent:0}
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Campaigns</h2>
        <Button as-child="true"><Link to="/campaigns/new">New Campaign</Link></Button>
      </div>
      <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Sent</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(c=>
              <tr key={c.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-3 py-2"><Link to={`/campaigns/${c.id}`} className="text-primary-600 dark:text-primary-400 hover:underline">{c.name}</Link></td>
                <td className="px-3 py-2">{c.status}</td>
                <td className="px-3 py-2">{c.sent}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignsPage;
