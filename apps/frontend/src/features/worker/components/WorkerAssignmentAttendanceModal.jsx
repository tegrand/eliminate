import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { X, Loader2, Calendar, Clock, CheckCircle } from "lucide-react";
import { workerApi } from "../api/worker.api";

export default function WorkerAssignmentAttendanceModal({ isOpen, onClose, assignmentId, title }) {
  const { data: attendanceData, isLoading, error } = useQuery({
    queryKey: ["assignmentAttendance", assignmentId],
    queryFn: async () => {
      const res = await workerApi.getAssignmentAttendance(assignmentId);
      return res.data ?? res;
    },
    enabled: isOpen && !!assignmentId,
  });

  if (!isOpen) return null;

  const records = Array.isArray(attendanceData) ? attendanceData : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/80">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Attendance Details</h2>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{title}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm text-gray-500">Loading attendance data...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm text-center">
              Failed to load attendance. Please try again.
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium text-sm">No attendance records found</p>
              <p className="text-gray-400 text-xs mt-1">The client has not marked your attendance for this assignment yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <div key={record.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:border-indigo-100 transition-colors">
                  <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      <span className="text-sm font-bold text-gray-800">
                        {format(new Date(record.date), "EEE, MMM dd, yyyy")}
                      </span>
                    </div>
                    {record.status === "PRESENT" ? (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 uppercase tracking-widest border border-emerald-100">
                        <CheckCircle className="w-3 h-3" />
                        Present
                      </span>
                    ) : (
                      <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border border-red-100">
                        {record.status}
                      </span>
                    )}
                  </div>
                  
                  {record.status === "PRESENT" && (
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className="bg-gray-50/80 rounded-lg p-2.5 border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Check-in
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {record.checkInTime ? format(new Date(record.checkInTime), "hh:mm a") : "--:--"}
                        </p>
                      </div>
                      <div className="bg-gray-50/80 rounded-lg p-2.5 border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Check-out
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {record.checkOutTime ? format(new Date(record.checkOutTime), "hh:mm a") : "--:--"}
                        </p>
                      </div>
                    </div>
                  )}

                  {record.totalHours != null && (
                    <div className="mt-3 pt-2.5 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Hours</span>
                      <span className="text-sm font-black text-indigo-700">{record.totalHours} hrs</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
