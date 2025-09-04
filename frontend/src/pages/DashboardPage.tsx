import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const sampleData = [
  {date:'Mon', sent:20, opens:10},
  {date:'Tue', sent:40, opens:22},
  {date:'Wed', sent:35, opens:18},
  {date:'Thu', sent:50, opens:30},
  {date:'Fri', sent:65, opens:40},
  {date:'Sat', sent:15, opens:6},
  {date:'Sun', sent:10, opens:4}
];

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Weekly Performance</h2>
        <div className="h-60 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="date" stroke="currentColor" />
              <YAxis stroke="currentColor" />
              <Tooltip contentStyle={{background:'#111827', border:'1px solid #1f2937', color:'#fff'}} />
              <Line type="monotone" dataKey="sent" stroke="#0baeea" strokeWidth={2} />
              <Line type="monotone" dataKey="opens" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
