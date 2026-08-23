import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardCard({ title, count, colorClass, link, description }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all group relative overflow-hidden flex flex-col justify-end h-[110px]">
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colorClass} opacity-10 rounded-bl-[100%] transition-transform group-hover:scale-110`} />
      
      <div className="absolute top-4 right-4 z-10">
        {link ? (
          <Link to={link} className="text-slate-400 hover:text-indigo-600 transition-colors block">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        )}
      </div>

      <div className="relative z-10 mt-6">
        <h3 className="text-3xl font-bold text-slate-900 mb-1">{count}</h3>
        <p className="text-sm font-medium text-slate-700">{title}</p>
      </div>
    </div>
  );
}
