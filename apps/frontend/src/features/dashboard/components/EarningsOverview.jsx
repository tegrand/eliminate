import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', earnings: 0 },
  { name: 'Feb', earnings: 0 },
  { name: 'Mar', earnings: 0 },
  { name: 'Apr', earnings: 0 },
  { name: 'May', earnings: 0 },
  { name: 'Jun', earnings: 0 },
  { name: 'Jul', earnings: 0 },
  { name: 'Aug', earnings: 0 },
  { name: 'Sep', earnings: 0 },
  { name: 'Oct', earnings: 0 },
  { name: 'Nov', earnings: 0 },
  { name: 'Dec', earnings: 0 },
];

export default function EarningsOverview() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm col-span-1 lg:col-span-2">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Platform Revenue</h3>
        <p className="text-sm text-gray-500">Monthly platform revenue overview</p>
      </div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6b7280' }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => `₹${value}k`}
              domain={[0, 1]}
              ticks={[0, 0.25, 0.5, 0.75, 1]}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="earnings" 
              stroke="#f97316" 
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 4 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
