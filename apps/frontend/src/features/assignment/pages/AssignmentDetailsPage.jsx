import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Users, UserRound, Clock3, CalendarCheck, CalendarDays, Activity, UserPlus, Loader2, Building2, CheckCircle, Star, CreditCard, UserCheck, UserX, Clock } from "lucide-react";
import api from "../../../api/axios";
import { useAuth } from "../../../hooks/useAuth";
import { paymentApi } from "../../../api/payment.api";
import { assignmentApi } from "../api/assignment.api";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import AssignWorkerModal from "../components/AssignWorkerModal";
import ReviewModal from "../components/ReviewModal";

export default function AssignmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isClient = user?.profileType === "CLIENT";

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [markingAttendance, setMarkingAttendance] = useState({});
  const [activeAttendancePopup, setActiveAttendancePopup] = useState(null);
  // selectedDate MUST be here before any early returns to avoid hook order errors
  const [selectedDate, setSelectedDate] = useState(() => new Date().toDateString());
  const queryClient = useQueryClient();

  // Close popup when clicking outside
  useEffect(() => {
    if (!activeAttendancePopup) return;
    const handler = () => setActiveAttendancePopup(null);
    const timer = setTimeout(() => document.addEventListener('click', handler), 0);
    return () => { clearTimeout(timer); document.removeEventListener('click', handler); };
  }, [activeAttendancePopup]);

  const { data: assignment, isLoading, error } = useQuery({
    queryKey: ["assignment", id],
    queryFn: async () => {
      const res = await api.get(`/assignments/${id}`);
      return res.data?.data || res.data;
    }
  });

  const { data: attendanceData } = useQuery({
    queryKey: ["assignmentAttendance", id],
    queryFn: async () => {
      const res = await api.get(`/assignments/${id}/attendance`);
      return res.data?.data || res.data || [];
    },
    enabled: !!assignment
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-[calc(100vh-4rem)]"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  if (error || !assignment) {
    return <div className="flex justify-center items-center h-[calc(100vh-4rem)] text-red-600 font-medium">Failed to load assignment details.</div>;
  }

  const assignedWorkers = assignment.assignedWorkers || [];

  // Calculate Progress
  let progress = 0;
  if (assignment.startDate && assignment.endDate) {
    const start = new Date(assignment.startDate).getTime();
    const end = new Date(assignment.endDate).getTime();
    const now = new Date().getTime();
    
    if (now >= end) {
      progress = 100;
    } else if (now <= start) {
      progress = 0;
    } else {
      progress = Math.round(((now - start) / (end - start)) * 100);
    }
  } else if (assignment.status === 'COMPLETED') {
    progress = 100;
  } else if (assignment.status === 'ACTIVE') {
    progress = 50;
  }

  const handleOpenReview = (workerId, agencyId, name) => {
    setReviewTarget({ workerId, agencyId, name });
    setIsReviewModalOpen(true);
  };

  const handleMarkAttendance = async (workerId, status, date) => {
    const dateStr = date ? date.toDateString() : new Date().toDateString();
    const key = `${workerId}_${dateStr}`;
    setMarkingAttendance(prev => ({ ...prev, [key]: status }));
    try {
      const datePayload = date || new Date();
      await assignmentApi.markAttendance(id, { workerId, status, date: datePayload.toISOString() });
      toast.success(`Marked ${status.toLowerCase().replace('_', ' ')}`);
      queryClient.invalidateQueries({ queryKey: ["assignmentAttendance", id] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark attendance");
    } finally {
      setMarkingAttendance(prev => ({ ...prev, [key]: null }));
    }
  };

  const handlePayBalance = async () => {
    if (!assignment?.hiringRequestId) return;
    try {
      setIsPaying(true);
      if (!window.Razorpay) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          document.body.appendChild(script);
        });
      }

      const { data: orderData } = await paymentApi.createOrder(assignment.hiringRequestId);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Tegrand Eliminate",
        description: "Final Balance Payment",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            await paymentApi.verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            toast.success("Final payment successful!");
            queryClient.invalidateQueries({ queryKey: ["assignment", id] });
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error(response.error.description);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment initiation failed");
    } finally {
      setIsPaying(false);
    }
  };

  const successfulPayments = assignment.hiringRequest?.payments?.filter(p => p.status === 'SUCCESS')?.length || 0;
  const isBalancePaid = successfulPayments >= 2;

  // Calculate days for Work Schedule — show ALL days from start to end
  const todayDateStr = new Date().toDateString();
  const scheduleDays = [];
  if (assignment?.startDate) {
    const start = new Date(assignment.startDate);
    const end = assignment.endDate ? new Date(assignment.endDate) : new Date();
    
    const cursor = new Date(start);
    cursor.setHours(0, 0, 0, 0);
    let dayNum = 1;
    while (cursor <= end && dayNum <= 90) {
      scheduleDays.push({ date: new Date(cursor), dayNum });
      cursor.setDate(cursor.getDate() + 1);
      dayNum++;
    }
  }

  // selectedDate already declared at top of component

  const selectedDayObj = scheduleDays.find(d => d.date.toDateString() === selectedDate) || scheduleDays[0];

  return (
    <div className="max-w-[1400px] mx-auto py-3 px-3 sm:px-4 animate-fade-in space-y-4 min-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide bg-[#f8f9fa]">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div>
          <Link
            to="/assignments"
            className="inline-flex items-center text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors mb-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assignments
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-[26px] font-bold text-gray-900 tracking-tight">{assignment.title}</h1>
              <span className={`px-2.5 py-1 rounded-full text-[10px] tracking-wider uppercase font-bold ${
                assignment.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' :
                assignment.status === 'COMPLETED' ? 'bg-blue-50 text-blue-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {assignment.status}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-gray-500 font-medium uppercase tracking-wider">
              {assignment.assignmentCode}
            </p>
          </div>
        </div>
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        
        {/* Card 1: Assignment Tracking (col-span-5) */}
        <section className="rounded-[16px] border border-gray-100 bg-white p-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col lg:col-span-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Assignment Tracking</h2>
                <p className="text-[10px] text-gray-500">Current progress and timeline.</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-3">
            <div className="p-2 bg-[#fbfbfc] rounded-lg border border-gray-50 flex flex-col justify-between">
              <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-1.5"><CalendarDays className="w-3 h-3" /> Start</span>
              <span className="text-xs font-bold text-gray-900">{assignment.startDate ? new Date(assignment.startDate).toLocaleDateString('en-US') : 'N/A'}</span>
            </div>
            <div className="p-2 bg-[#fbfbfc] rounded-lg border border-gray-50 flex flex-col justify-between">
              <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-1.5"><CalendarCheck className="w-3 h-3" /> End</span>
              <span className="text-xs font-bold text-gray-900">{assignment.endDate ? new Date(assignment.endDate).toLocaleDateString('en-US') : 'N/A'}</span>
            </div>
            <div className="p-2 bg-[#fbfbfc] rounded-lg border border-gray-50 flex flex-col justify-between">
              <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-1.5"><Users className="w-3 h-3" /> Workers</span>
              <span className="text-xs font-bold text-gray-900">{assignedWorkers.length} Assigned</span>
            </div>
            <div className="p-2 bg-[#fbfbfc] rounded-lg border border-gray-50 flex flex-col justify-between">
              <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-1.5"><Activity className="w-3 h-3" /> Status</span>
              <span className={`text-xs font-bold uppercase tracking-wider ${assignment.status === 'ACTIVE' ? 'text-emerald-500' : 'text-gray-900'}`}>{assignment.status}</span>
            </div>
          </div>

          <div className="mt-auto pt-2">
             <div className="flex justify-between items-center mb-1.5">
               <span className="text-[11px] font-semibold text-gray-800">Overall Progress</span>
               <span className="text-[11px] font-bold text-blue-600">{progress}%</span>
             </div>
             <div className="h-[7px] w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
             </div>
          </div>
        </section>

        {/* Card 2: Overview (col-span-3) */}
        <section className="rounded-[16px] border border-gray-100 bg-white p-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col lg:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Overview</h2>
            </div>
          </div>

          <div className="space-y-2 mt-auto">
            <div className="p-3 bg-[#fbfbfc] rounded-lg border border-gray-50 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-gray-800 block mb-0.5">Client</span>
                <span className="text-xs font-medium text-gray-500">{assignment.client?.companyName || '-'}</span>
              </div>
              <div className="w-7 h-7 rounded-full border border-blue-100 text-blue-400 flex items-center justify-center bg-white shadow-sm">
                <UserRound className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="p-3 bg-[#fbfbfc] rounded-lg border border-gray-50 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-gray-800">Agreed Rate</span>
              <span className="text-[13px] font-bold text-emerald-500">{assignment.agreedRate ? `₹${assignment.agreedRate}` : '-'}</span>
            </div>
          </div>
        </section>

        {/* Card 3: Work Schedule (col-span-4) */}
        <section className="rounded-[16px] border border-gray-100 bg-white p-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] flex flex-col lg:col-span-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Work Schedule</h2>
              <p className="text-[10px] text-gray-500">Total {scheduleDays.length} Days</p>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3">
             {scheduleDays.map(d => {
               const isToday = d.date.toDateString() === todayDateStr;
               const isPast = d.date < new Date() && !isToday;
               return (
                 <div key={d.dayNum} className="relative flex-shrink-0">
                   <button 
                     onClick={isToday ? () => setActiveAttendancePopup(isToday ? `day_${d.dayNum}` : null) : undefined}
                     disabled={!isToday}
                     className={`flex flex-col items-center justify-center w-[58px] h-[58px] rounded-xl border transition-all ${
                       isToday
                        ? 'border-blue-400 bg-blue-600 shadow-[0_4px_14px_-4px_rgba(59,130,246,0.5)] cursor-pointer hover:bg-blue-700 active:scale-[0.97]'
                        : isPast
                        ? 'border-gray-100 bg-[#fbfbfc] cursor-default opacity-60'
                        : 'border-dashed border-gray-200 bg-white cursor-default opacity-40'
                     }`}
                   >
                      <span className={`text-[11px] font-bold mb-1 ${isToday ? 'text-white' : 'text-gray-400'}`}>Day {d.dayNum}</span>
                      <span className={`text-[10px] font-semibold ${isToday ? 'text-blue-100' : 'text-gray-400'}`}>{d.date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}</span>
                   </button>

                   {/* Dropdown on today's day click */}
                   {isToday && activeAttendancePopup === `day_${d.dayNum}` && assignedWorkers.length > 0 && (
                     <div className="absolute left-0 top-full mt-2 z-50 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-3 min-w-[200px]" onClick={e => e.stopPropagation()}>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Mark Attendance — Day {d.dayNum}</p>
                       {assignedWorkers.map(aw => {
                         const w = aw.worker;
                         const record = attendanceData?.find(a => a.workerId === w.id && new Date(a.date).toDateString() === todayDateStr);
                         const isMarkingThis = markingAttendance[`${w.id}_${todayDateStr}`];
                         return (
                           <div key={w.id} className="mb-3 last:mb-0">
                             <p className="text-[12px] font-semibold text-gray-700 mb-1.5">{w.user?.firstName} {w.user?.lastName}</p>
                             <div className="flex gap-1.5">
                               {[
                                 { status: 'PRESENT', label: 'Present', color: record?.status === 'PRESENT' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white' },
                                 { status: 'HALF_DAY', label: 'Half', color: record?.status === 'HALF_DAY' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white' },
                                 { status: 'ABSENT', label: 'Absent', color: record?.status === 'ABSENT' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white' },
                               ].map(opt => (
                                 <button
                                   key={opt.status}
                                   disabled={!!isMarkingThis}
                                   onClick={() => {
                                     setActiveAttendancePopup(null);
                                     handleMarkAttendance(w.id, opt.status, new Date(todayDateStr));
                                   }}
                                   className={`flex-1 text-[10px] font-bold px-2 py-1.5 rounded-lg transition-colors ${opt.color} ${isMarkingThis ? 'opacity-50 cursor-not-allowed' : ''}`}
                                 >
                                   {isMarkingThis === opt.status ? '...' : opt.label}
                                 </button>
                               ))}
                             </div>
                           </div>
                         );
                       })}
                       <button onClick={() => setActiveAttendancePopup(null)} className="w-full text-[10px] font-bold text-gray-400 hover:text-gray-600 pt-1.5 text-center border-t border-gray-100 mt-1">Close</button>
                     </div>
                   )}
                 </div>
               )
             })}
          </div>

          <div className="mt-auto pt-3 relative">
             <div className="w-full h-[3px] bg-gray-100 rounded-full overflow-hidden absolute top-0 left-0">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(selectedDayObj?.dayNum / scheduleDays.length) * 100}%` }} />
             </div>
             <div className="bg-[#fbfbfc] rounded-lg p-2.5 flex items-center gap-2 border border-gray-50 mt-3">
                <div className="w-[14px] h-[14px] rounded-full border border-blue-200 flex items-center justify-center flex-shrink-0 text-blue-500 bg-white">
                  <span className="text-[8px] font-bold">i</span>
                </div>
                 <p className="text-[11px] text-gray-600 font-medium">
                   {selectedDayObj?.date.toDateString() === todayDateStr
                     ? `Day ${selectedDayObj?.dayNum} — Today (Active)`
                     : selectedDayObj?.date > new Date(todayDateStr)
                     ? `Day ${selectedDayObj?.dayNum} is upcoming.`
                     : `Day ${selectedDayObj?.dayNum} — ${selectedDayObj?.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                   }
                 </p>
             </div>
          </div>
        </section>
      </div>

      {/* Attendance Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6">
        <section className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] lg:col-span-8">
           <div className="flex items-center gap-3 mb-8">
             <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
               <Clock className="h-5 w-5" />
             </div>
             <div>
               <h2 className="text-base font-bold text-gray-900">Attendance Tracker</h2>
               <p className="text-[11px] text-gray-500 mt-0.5">Track attendance and working hours.</p>
             </div>
           </div>

           <div className="flex flex-col md:flex-row gap-5 mb-8">
              {/* Selected Date Box */}
              <div className="w-full md:w-[150px] h-[105px] bg-indigo-50/50 rounded-2xl flex flex-col items-center justify-center text-indigo-700 shrink-0 border border-indigo-50">
                 <span className="text-[15px] font-bold mb-1.5">Day {selectedDayObj?.dayNum}</span>
                 <span className="text-[13px] font-semibold text-indigo-600">{selectedDayObj?.date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
              </div>

              {/* Workers list for that day */}
              <div className="flex-1 space-y-3">
                 {assignedWorkers.length === 0 ? (
                   <div className="h-[105px] bg-[#fbfbfc] rounded-2xl border border-gray-50 flex items-center justify-center p-4">
                     <p className="text-sm text-gray-400 font-medium">No workers assigned.</p>
                   </div>
                 ) : (
                   assignedWorkers.map(aw => {
                     const w = aw.worker;
                     const record = attendanceData?.find(a => a.workerId === w.id && new Date(a.date).toDateString() === selectedDate);
                     const isMarkingThis = markingAttendance[`${w.id}_${selectedDate}`];
                     
                     return (
                       <div key={w.id} className="bg-[#fbfbfc] rounded-[16px] border border-gray-50 p-4 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                             <UserRound className="w-[22px] h-[22px]" />
                           </div>
                           <div>
                             <p className="text-[15px] font-bold text-gray-900">{w.user?.firstName} {w.user?.lastName}</p>
                             <p className="text-[12px] text-gray-500 font-medium mt-0.5">Worker ID: {w.workerCode}</p>
                           </div>
                         </div>

                         <div className="relative">
                            <button 
                              disabled={!isClient || isMarkingThis}
                              onClick={() => { if(isClient) setActiveAttendancePopup(`${w.id}_${selectedDate}`) }}
                              className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
                                record ? 
                                  record.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600' :
                                  record.status === 'ABSENT' ? 'bg-red-50 text-red-600' :
                                  'bg-amber-50 text-amber-600'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm'
                              } ${!isClient ? 'cursor-default' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                            >
                              {isMarkingThis ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : record ? (
                                 <>
                                   <div className={`w-2 h-2 rounded-full ${record.status === 'PRESENT' ? 'bg-emerald-500' : record.status === 'ABSENT' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                   {record.status === 'HALF_DAY' ? 'Half Day' : record.status === 'PRESENT' ? 'Present' : 'Absent'}
                                 </>
                              ) : (
                                 <>
                                   <div className="w-2 h-2 rounded-full bg-gray-300" />
                                   Mark Status
                                 </>
                              )}
                            </button>

                            {/* Popup menu for marking */}
                            {isClient && activeAttendancePopup === `${w.id}_${selectedDate}` && (
                              <div className="absolute right-0 top-full mt-2 z-50 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 min-w-[140px]">
                                {[
                                  { status: 'PRESENT', label: 'Present', color: 'bg-emerald-500 hover:bg-emerald-600' },
                                  { status: 'HALF_DAY', label: 'Half Day', color: 'bg-amber-500 hover:bg-amber-600' },
                                  { status: 'ABSENT', label: 'Absent', color: 'bg-red-500 hover:bg-red-600' },
                                ].map(opt => (
                                  <button
                                    key={opt.status}
                                    onClick={() => {
                                      setActiveAttendancePopup(null);
                                      handleMarkAttendance(w.id, opt.status, new Date(selectedDate));
                                    }}
                                    className={`w-full text-left text-[11px] font-bold text-white px-3 py-2 rounded-xl mb-1 transition-colors flex items-center gap-2 ${opt.color}`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                                <button
                                  onClick={() => setActiveAttendancePopup(null)}
                                  className="w-full text-[11px] font-bold text-gray-400 hover:text-gray-600 px-3 py-1.5 text-center mt-1"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                         </div>
                       </div>
                     )
                   })
                 )}
              </div>
           </div>

           {/* ATTENDANCE LOG table */}
           <div className="mt-8">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4 pl-1">ATTENDANCE LOG</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#fbfbfc] text-gray-700 text-[12px] font-semibold border-y border-gray-100">
                    <tr>
                      <th className="px-4 py-3.5 font-semibold">Date</th>
                      <th className="px-4 py-3.5 font-semibold">Worker</th>
                      <th className="px-4 py-3.5 font-semibold">Status</th>
                      <th className="px-4 py-3.5 font-semibold">Marked At</th>
                      <th className="px-4 py-3.5 font-semibold">Check Out</th>
                      <th className="px-4 py-3.5 font-semibold">Hours Worked</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {attendanceData && attendanceData.length > 0 ? (
                      attendanceData.map((att) => {
                        const workerName = `${att.worker?.user?.firstName || ''} ${att.worker?.user?.lastName || ''}`.trim();
                        return (
                          <tr key={att.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-4 text-gray-900 text-[13px]">{new Date(att.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</td>
                            <td className="px-4 py-4 text-gray-900 text-[13px]">{workerName}</td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold ${
                                att.status === 'PRESENT' ? 'text-emerald-600' :
                                att.status === 'ABSENT' ? 'text-red-600' :
                                att.status === 'HALF_DAY' ? 'text-amber-600' :
                                'text-gray-600'
                              }`}>
                                <div className={`w-[7px] h-[7px] rounded-full ${att.status === 'PRESENT' ? 'bg-emerald-500' : att.status === 'ABSENT' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                {att.status === 'HALF_DAY' ? 'Half Day' : att.status === 'PRESENT' ? 'Present' : 'Absent'}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-gray-900 font-medium text-[13px]">
                              {att.checkInTime ? new Date(att.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : <span className="text-gray-300">—</span>}
                            </td>
                            <td className="px-4 py-4 text-gray-900 font-medium text-[13px]">
                              {att.checkOutTime ? new Date(att.checkOutTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : <span className="text-gray-400">—</span>}
                            </td>
                            <td className="px-4 py-4 text-[13px] font-bold text-gray-900">
                              {att.totalHours ? `${att.totalHours}h` : '0h 0m'}
                              {att.overtimeHours > 0 && <span className="ml-1 text-[10px] text-purple-500">+{att.overtimeHours}h OT</span>}
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-xs font-bold">
                          No attendance records yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="p-4 border-t border-gray-100 flex justify-center">
                   <button className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                      View Full Attendance History
                   </button>
                </div>
              </div>
           </div>
        </section>
      </div>
      
      {!isClient && (
        <AssignWorkerModal 
          isOpen={isAssignModalOpen} 
          onClose={() => setIsAssignModalOpen(false)} 
          assignmentId={id} 
        />
      )}

      {isReviewModalOpen && (
        <ReviewModal 
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          target={reviewTarget}
          assignmentId={id}
        />
      )}
    </div>
  );
}
