import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function EarningsOverview({ data }) {
  const chartData = data?.lineData || [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 0 },
    { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 },
    { name: 'May', value: 0 },
    { name: 'Jun', value: 0 },
    { name: 'Jul', value: 0 },
    { name: 'Aug', value: 0 },
    { name: 'Sep', value: 0 },
    { name: 'Oct', value: 0 },
    { name: 'Nov', value: 0 },
    { name: 'Dec', value: 0 },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm col-span-1 lg:col-span-2">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">User Growth Overview</h3>
        <p className="text-sm text-gray-500">Monthly new user registrations across the platform</p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#4f46e5', fontWeight: 600 }}
              formatter={(value) => [`${value} Users`, 'Registrations']}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#4f46e5" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#fff', stroke: '#4f46e5', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
