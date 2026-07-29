import { Link } from "react-router-dom";
import { Plus, FileSearch, Users, BarChart2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const actions = (t) => [
  {
    label: t('clientDashboard.newRequirement'),
    description: t('clientDashboard.postNewJob'),
    icon: Plus,
    to: "/job-requirements",
    gradient: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-200",
  },
  {
    label: t('clientDashboard.viewRequirements'),
    description: t('clientDashboard.browseAllJobs'),
    icon: FileSearch,
    to: "/job-requirements",
    gradient: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-200",
  },
  {
    label: t('clientDashboard.browseWorkers'),
    description: t('clientDashboard.findWorkers'),
    icon: Users,
    to: "/workers",
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-200",
  },
  {
    label: t('clientDashboard.viewPayroll'),
    description: t('clientDashboard.checkPaymentStatus'),
    icon: BarChart2,
    to: "/payrolls",
    gradient: "from-orange-500 to-rose-500",
    shadow: "shadow-orange-200",
  },
];

export default function ClientQuickActions() {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span className="inline-block w-4 h-px bg-gray-300" />
        {t('clientDashboard.quickActions')}
        <span className="inline-block flex-1 h-px bg-gray-100" />
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions(t).map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              to={action.to}
              className={`group flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} ${action.shadow} shadow-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">{action.label}</p>
                <p className="text-[11px] text-gray-400 font-medium truncate">{action.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
