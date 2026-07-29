import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock, Calendar, CheckCircle, XCircle, LogOut, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { workerApi } from "../api/worker.api";
import { format, parseISO } from "date-fns";
import Button from "../../../components/ui/button/Button";

export default function WorkerAttendancePage() {
  const queryClient = useQueryClient();
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const { data: historyData, isLoading: loadingHistory } = useQuery({
    queryKey: ["workerAttendanceHistory"],
    queryFn: async () => {
      const res = await workerApi.getAttendanceHistory();
      return res.data ?? res;
    }
  });

  const history = Array.isArray(historyData) ? historyData : [];
  
  // Find today's attendance record
  const todayAttendance = history.find(record => {
    if (!record.date) return false;
    const recordDate = record.date.split("T")[0]; // handle Date string
    return recordDate === todayStr;
  });

  const isCheckedIn = !!todayAttendance?.checkInTime;
  const isCheckedOut = !!todayAttendance?.checkOutTime;

  const checkInMutation = useMutation({
    mutationFn: () => workerApi.checkIn(),
    onSuccess: () => {
      toast.success("Checked in successfully!");
      queryClient.invalidateQueries(["workerAttendanceHistory"]);
      queryClient.invalidateQueries(["dashboard"]); // update dashboard stats
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to check in")
  });

  const checkOutMutation = useMutation({
    mutationFn: () => workerApi.checkOut(),
    onSuccess: () => {
      toast.success("Checked out successfully!");
      queryClient.invalidateQueries(["workerAttendanceHistory"]);
      queryClient.invalidateQueries(["dashboard"]);
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to check out")
  });

  return (
    <div className="w-full max-w-5xl mx-auto py-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
        <p className="text-sm text-slate-500 mt-1">Log your daily working hours and view history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Actions Panel */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
              Today: {format(new Date(), "MMM dd, yyyy")}
            </h2>
            
            <div className="space-y-4">
              {!isCheckedIn ? (
                <Button 
                  className="w-full py-4 text-lg bg-indigo-600 hover:bg-indigo-700" 
                  onClick={() => checkInMutation.mutate()}
                  loading={checkInMutation.isPending}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Check In Now
                </Button>
              ) : !isCheckedOut ? (
                <>
                  <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex flex-col items-center justify-center mb-4">
                    <span className="text-xs uppercase font-bold tracking-wide">Checked In At</span>
                    <span className="text-xl font-bold mt-1">
                      {format(new Date(todayAttendance.checkInTime), "hh:mm a")}
                    </span>
                  </div>
                  <Button 
                    variant="outline"
                    className="w-full py-4 text-lg border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    onClick={() => checkOutMutation.mutate()}
                    loading={checkOutMutation.isPending}
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Check Out
                  </Button>
                </>
              ) : (
                <div className="p-4 bg-slate-50 text-slate-600 rounded-xl border border-slate-200 text-center">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-slate-900">Shift Completed</p>
                  <p className="text-sm mt-1">
                    {format(new Date(todayAttendance.checkInTime), "hh:mm a")} - {format(new Date(todayAttendance.checkOutTime), "hh:mm a")}
                  </p>
                  {todayAttendance.totalHours && (
                    <p className="text-xs font-bold text-indigo-600 uppercase mt-2">
                      Total: {todayAttendance.totalHours} hrs
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-indigo-500" />
                Recent History
              </h2>
            </div>
            
            <div className="flex-1 overflow-x-auto">
              {loadingHistory ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                  <Calendar className="w-10 h-10 mb-3 opacity-20" />
                  <p>No attendance history found.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-4 w-1/3">Date</th>
                      <th className="p-4">Time Log</th>
                      <th className="p-4 text-right">Total Hrs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <span className="font-semibold text-slate-900">
                            {format(new Date(record.date), "MMM dd, yyyy")}
                          </span>
                        </td>
                        <td className="p-4">
                          {record.checkInTime ? (
                            <div className="flex items-center text-sm text-slate-600 gap-2">
                              <span>{format(new Date(record.checkInTime), "hh:mm a")}</span>
                              {record.checkOutTime && (
                                <>
                                  <ArrowRight className="w-3 h-3 text-slate-300" />
                                  <span>{format(new Date(record.checkOutTime), "hh:mm a")}</span>
                                </>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400 italic">No time logged</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                            record.totalHours ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-500"
                          }`}>
                            {record.totalHours ? `${record.totalHours}h` : "-"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
