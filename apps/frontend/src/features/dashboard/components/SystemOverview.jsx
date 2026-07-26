import { Card, CardContent } from "../../../components/ui/card";
import { ChevronDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "May 1", value: 120 },
  { name: "May 6", value: 800 },
  { name: "May 11", value: 280 },
  { name: "May 16", value: 650 },
  { name: "May 21", value: 850 },
];

export default function SystemOverview() {
  return (
    <Card className="h-full border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col">
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">System Overview</h3>
          <button className="flex items-center gap-2 px-2.5 py-1 border border-gray-200 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <span>This Month</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#64748b", fontSize: 11 }} 
                dy={5} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#64748b", fontSize: 11 }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                activeDot={{ r: 5, strokeWidth: 0, fill: "#3b82f6" }}
                dot={{ r: 3, strokeWidth: 2, fill: "white", stroke: "#3b82f6" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-[11px] font-medium text-gray-600 mb-0.5">Total Applications</p>
            <h4 className="text-lg font-bold text-gray-900">1,348</h4>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-[11px] font-medium text-gray-600 mb-0.5">Approvals</p>
            <h4 className="text-lg font-bold text-gray-900">1,028</h4>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-[11px] font-medium text-gray-600 mb-0.5">Rejections</p>
            <h4 className="text-lg font-bold text-gray-900">320</h4>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
