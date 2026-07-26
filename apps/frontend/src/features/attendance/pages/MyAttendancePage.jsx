import { useState, useEffect } from "react";
import { CalendarCheck, Clock, CheckCircle, FileText, Loader2, Calendar, Coffee, XCircle, FilePlus, Filter } from "lucide-react";
import { toast } from "sonner";
import api from "../../../api/axios";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal/Modal";
import Input from "../../../components/ui/input/Input";
import { format, parseISO } from "date-fns";

export default function MyAttendancePage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [leaves, setLeaves] = useState([]);
  
  const [todayRecord, setTodayRecord] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveData, setLeaveData] = useState({
    startDate: "",
    endDate: "",
    leaveType: "SICK",
    reason: ""
  });
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [summaryRes, historyRes, leavesRes] = await Promise.all([
        api.get("/my-attendance/summary", { params: { month, year } }),
        api.get("/my-attendance/history", { params: { month, year } }),
        api.get("/my-attendance/leaves")
      ]);
      
      setSummary(summaryRes.data.data);
      setHistory(historyRes.data.data);
      setLeaves(leavesRes.data.data);
      
      // Determine today's record
      const today = new Date().toISOString().split("T")[0];
      const todayRec = historyRes.data.data.find(r => r.date.startsWith(today));
      setTodayRecord(todayRec);
      
    } catch (error) {
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const handleCheckIn = async () => {
    try {
      await api.post("/my-attendance/check-in");
      toast.success("Checked in successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to check in");
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.post("/my-attendance/check-out");
      toast.success("Checked out successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to check out");
    }
  };
  
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await api.post("/my-attendance/leaves", leaveData);
      toast.success("Leave applied successfully");
      setLeaveModalOpen(false);
      setLeaveData({ startDate: "", endDate: "", leaveType: "SICK", reason: "" });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply leave");
    }
  };

  const isCheckedIn = todayRecord?.checkInTime && !todayRecord?.checkOutTime;
  const isCheckedOut = todayRecord?.checkOutTime;

  return (
    <div className="w-full max-w-6xl mx-auto py-8 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Attendance</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your daily attendance and leaves</p>
        </div>
        
        {activeTab === "dashboard" && (
          <div className="flex gap-2 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <select 
              value={month} 
              onChange={(e) => setMonth(Number(e.target.value))}
              className="px-3 py-1.5 bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('en-US', { month: 'short' })}</option>
              ))}
            </select>
            <div className="w-px bg-slate-200 my-1" />
            <select 
              value={year} 
              onChange={(e) => setYear(Number(e.target.value))}
              className="px-3 py-1.5 bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
            >
              {[year-1, year, year+1].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-4 shrink-0">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap md:whitespace-normal
                ${activeTab === "dashboard" 
                  ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                }`}
            >
              <CalendarCheck className={`w-5 h-5 ${activeTab === "dashboard" ? "text-indigo-600" : "text-slate-400"}`} />
              Dashboard & History
            </button>
            <button
              onClick={() => setActiveTab("leaves")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap md:whitespace-normal
                ${activeTab === "leaves" 
                  ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                }`}
            >
              <Coffee className={`w-5 h-5 ${activeTab === "leaves" ? "text-indigo-600" : "text-slate-400"}`} />
              My Leaves
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <div className="space-y-8">
                  
                  {/* Daily Action Widget */}
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                      <h2 className="text-lg font-bold text-indigo-950">Today's Attendance</h2>
                      <p className="text-indigo-700/80 text-sm mt-1">{format(new Date(), 'EEEE, MMMM do yyyy')}</p>
                      
                      <div className="flex gap-6 mt-4">
                        <div>
                          <p className="text-xs text-indigo-500 uppercase font-bold tracking-wider mb-1">Check In</p>
                          <p className="font-semibold text-slate-800">
                            {todayRecord?.checkInTime ? format(parseISO(todayRecord.checkInTime), 'hh:mm a') : '--:--'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-indigo-500 uppercase font-bold tracking-wider mb-1">Check Out</p>
                          <p className="font-semibold text-slate-800">
                            {todayRecord?.checkOutTime ? format(parseISO(todayRecord.checkOutTime), 'hh:mm a') : '--:--'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 min-w-[140px]">
                      {!isCheckedIn && !isCheckedOut ? (
                        <Button variant="primary" onClick={handleCheckIn} className="w-full">
                          <CheckCircle className="w-4 h-4 mr-2" /> Check In
                        </Button>
                      ) : isCheckedIn ? (
                        <Button variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50 w-full" onClick={handleCheckOut}>
                          <Clock className="w-4 h-4 mr-2" /> Check Out
                        </Button>
                      ) : (
                        <div className="bg-emerald-100 text-emerald-800 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4" /> Completed
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-center">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Present Days</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">{summary?.present || 0}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-center">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Leaves/Absent</p>
                      <p className="text-2xl font-bold text-red-600 mt-1">{(summary?.absent || 0) + (summary?.onLeave || 0)}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-center">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Hours</p>
                      <p className="text-2xl font-bold text-blue-600 mt-1">{summary?.totalWorkingHours?.toFixed(1) || 0}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-center">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Overtime Hrs</p>
                      <p className="text-2xl font-bold text-amber-600 mt-1">{summary?.totalOvertimeHours?.toFixed(1) || 0}</p>
                    </div>
                  </div>

                  {/* History Table */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Monthly History</h3>
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                          <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Check In</th>
                            <th className="px-4 py-3">Check Out</th>
                            <th className="px-4 py-3">Total Hrs</th>
                            <th className="px-4 py-3">Overtime</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {history.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="px-4 py-8 text-center text-slate-400">No records found for this month</td>
                            </tr>
                          ) : (
                            history.map(record => (
                              <tr key={record.id} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-medium text-slate-900">
                                  {format(parseISO(record.date), 'MMM dd, yyyy')}
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider
                                    ${record.status === 'PRESENT' ? 'bg-green-100 text-green-700' :
                                      record.status === 'ABSENT' ? 'bg-red-100 text-red-700' :
                                      record.status === 'HALF_DAY' ? 'bg-amber-100 text-amber-700' :
                                      'bg-slate-100 text-slate-700'
                                    }`}>
                                    {record.status.replace('_', ' ')}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  {record.checkInTime ? format(parseISO(record.checkInTime), 'hh:mm a') : '-'}
                                </td>
                                <td className="px-4 py-3">
                                  {record.checkOutTime ? format(parseISO(record.checkOutTime), 'hh:mm a') : '-'}
                                </td>
                                <td className="px-4 py-3 font-medium">
                                  {record.totalHours ? record.totalHours.toFixed(2) : '-'}
                                </td>
                                <td className="px-4 py-3 text-amber-600 font-medium">
                                  {record.overtimeHours ? record.overtimeHours.toFixed(2) : '-'}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "leaves" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-900">Leave History</h2>
                    <Button variant="primary" onClick={() => setLeaveModalOpen(true)}>
                      <FilePlus className="w-4 h-4 mr-2" /> Apply Leave
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {leaves.length === 0 ? (
                      <div className="col-span-full text-center py-12 border border-slate-200 border-dashed rounded-xl">
                        <Coffee className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h3 className="font-semibold text-slate-800">No leaves found</h3>
                        <p className="text-sm text-slate-500 mt-1">You haven't applied for any leaves yet.</p>
                      </div>
                    ) : (
                      leaves.map(leave => (
                        <div key={leave.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider
                              ${leave.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                leave.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                              {leave.status}
                            </span>
                            <span className="text-xs text-slate-400">Applied on {format(parseISO(leave.createdAt), 'MMM dd')}</span>
                          </div>
                          
                          <h3 className="font-bold text-slate-900 mb-1">{leave.leaveType} LEAVE</h3>
                          <p className="text-sm text-slate-600 mb-3">{format(parseISO(leave.startDate), 'MMM dd, yyyy')} - {format(parseISO(leave.endDate), 'MMM dd, yyyy')}</p>
                          
                          <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 italic border border-slate-100">
                            "{leave.reason}"
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        title="Apply for Leave"
      >
        <form onSubmit={handleApplyLeave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Start Date" 
              type="date" 
              required
              value={leaveData.startDate}
              onChange={(e) => setLeaveData({ ...leaveData, startDate: e.target.value })}
            />
            <Input 
              label="End Date" 
              type="date" 
              required
              value={leaveData.endDate}
              onChange={(e) => setLeaveData({ ...leaveData, endDate: e.target.value })}
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Leave Type</label>
            <select 
              className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={leaveData.leaveType}
              onChange={(e) => setLeaveData({ ...leaveData, leaveType: e.target.value })}
            >
              <option value="SICK">Sick Leave</option>
              <option value="CASUAL">Casual Leave</option>
              <option value="EARNED">Earned Leave</option>
              <option value="UNPAID">Unpaid Leave</option>
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Reason</label>
            <textarea
              required
              className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Reason for your leave..."
              value={leaveData.reason}
              onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setLeaveModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Application</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
