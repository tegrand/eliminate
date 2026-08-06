import { CheckCircle2, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../routes/routePaths";

export default function ClientCompletedJobs({ jobs = [] }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          {t('clientDashboard.completedJobs') || "Completed Jobs"}
        </h2>
        <Link to={ROUTES.CLIENT_JOBS} className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          {t('clientDashboard.viewAll') || "View All"}
        </Link>
      </div>

      <div className="space-y-4">
        {jobs.length > 0 ? jobs.map((job) => (
          <div key={job.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition-colors group">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(job.endDate || job.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">
                    <span>{job._count?.assignedWorkers || 0} Workers</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Completed</span>
                {job.agreedRate > 0 && <p className="text-sm font-bold text-slate-900 mt-1">₹{job.agreedRate}</p>}
              </div>
            </div>
          </div>
        )) : (
          <div className="text-sm text-gray-500 py-6 text-center bg-slate-50 rounded-xl border border-slate-100 border-dashed">
            No completed jobs yet.
          </div>
        )}
      </div>
    </div>
  );
}
