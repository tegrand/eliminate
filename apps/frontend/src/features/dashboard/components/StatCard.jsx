import { ArrowRight } from "lucide-react";

export default function StatCard({ icon: Icon, title, value, bgColor, iconColor, description }) {
  // We use bgColor (e.g. 'bg-blue-100') for the top-right arc.
  // If iconColor is provided (e.g. 'text-blue-600'), use it for the arrow.
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all group relative overflow-hidden flex flex-col justify-end min-h-[110px] h-full">
      <div className={`absolute top-0 right-0 w-16 h-16 ${bgColor || 'bg-blue-50'} opacity-70 rounded-bl-[100%] transition-transform group-hover:scale-110`} />
      
      <div className="absolute top-3 right-3 z-10">
        <ArrowRight className={`w-3.5 h-3.5 ${iconColor || 'text-slate-400'} group-hover:translate-x-1 transition-transform`} />
      </div>

      <div className="relative z-10 mt-4">
        <h3 className="text-2xl font-bold text-slate-900 mb-0.5">{value}</h3>
        <p className="text-xs font-medium text-slate-700">{title}</p>
        {description && <p className="text-[10px] text-slate-500 mt-1">{description}</p>}
      </div>
    </div>
  );
}
