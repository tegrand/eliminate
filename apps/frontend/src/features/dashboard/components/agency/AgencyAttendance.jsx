import { Users, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AgencyAttendance({ attendance = [] }) {
  const { t } = useTranslation();
  
  const displayAttendance = attendance || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 animate-fade-in flex flex-col h-full" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" />
          {t('agencyDashboard.attendanceToday') || "Attendance Today"}
        </h2>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          {t('agencyDashboard.viewAll') || "View All"}
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {displayAttendance.length > 0 ? displayAttendance.map((record) => (
          <div key={record.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${record.status === 'PRESENT' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <div>
                <h4 className="text-sm font-medium text-gray-900">{record.name}</h4>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> {record.timeIn}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${record.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {record.status === 'PRESENT' ? (t('agencyDashboard.present') || 'Present') : (t('agencyDashboard.absent') || 'Absent')}
              </span>
            </div>
          </div>
        )) : (
          <div className="text-sm text-gray-500 py-4 text-center">No attendance records found.</div>
        )}
      </div>
    </div>
  );
}
