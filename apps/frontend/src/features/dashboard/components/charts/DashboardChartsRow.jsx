import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ["#2dd4bf", "#818cf8", "#f43f5e", "#f59e0b"]; // Teal, Indigo, Rose, Amber

export default function DashboardChartsRow({
  lineTitle,
  lineSubtitle,
  lineData = [],
  donutTitle,
  donutSubtitle,
  donutData = [],
  donutTotal
}) {
  const isLineEmpty = lineData.every(d => d.value === 0);
  const isEmptyDonut = donutData.length === 0 || donutData.every(d => d.value === 0);
  
  const renderDonutData = isEmptyDonut 
    ? [{ name: 'No Data', value: 1 }] 
    : donutData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 mb-6">
      {/* Line Chart */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <div>
          <h3 className="text-sm font-bold text-slate-900">{lineTitle}</h3>
          <p className="text-[11px] text-slate-500 mb-6">{lineSubtitle}</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#64748b' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#64748b' }} 
                width={50}
                tickFormatter={(val) => `₹${val}k`}
                domain={[0, dataMax => (dataMax === 0 ? 1 : dataMax)]}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#f97316" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: '#f97316' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col">
        <div>
          <h3 className="text-sm font-bold text-slate-900">{donutTitle}</h3>
          <p className="text-[11px] text-slate-500 mb-4">{donutSubtitle}</p>
        </div>
        <div className="flex-1 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={renderDonutData}
                innerRadius={65}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {renderDonutData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={isEmptyDonut ? '#f1f5f9' : COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-slate-900">{donutTotal}</span>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Total</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          {donutData.map((entry, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-[11px] font-medium text-slate-600">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
