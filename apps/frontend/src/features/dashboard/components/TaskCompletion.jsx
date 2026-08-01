import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Workers', value: 0, color: '#3b82f6' },
  { name: 'Agencies', value: 0, color: '#f59e0b' },
  { name: 'Clients', value: 0, color: '#10b981' },
];

export default function TaskCompletion() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm col-span-1">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">User Distribution</h3>
        <p className="text-sm text-gray-500">Platform users overview</p>
      </div>
      <div className="h-[180px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.every(d => d.value === 0) ? [{ value: 1, color: '#f3f4f6', name: 'No data' }] : data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {(data.every(d => d.value === 0) ? [{ value: 1, color: '#f3f4f6' }] : data).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-2">
          <span className="text-2xl font-bold text-gray-900">0</span>
          <span className="text-xs font-semibold text-gray-400">TOTAL</span>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-sm text-gray-600">Workers</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <span className="text-sm text-gray-600">Agencies</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-sm text-gray-600">Clients</span>
        </div>
      </div>
    </div>
  );
}
