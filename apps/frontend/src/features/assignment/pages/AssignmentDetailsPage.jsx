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

  return (
    <div className="max-w-6xl mx-auto py-5 px-4 sm:px-6 lg:px-8 animate-fade-in space-y-5 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/assignments"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors mb-4 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assignments
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
              assignment.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              assignment.status === 'COMPLETED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              'bg-gray-50 text-gray-600 border-gray-200'
            }`}>
              {assignment.status}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500 font-mono">
            {assignment.assignmentCode}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isClient && (
            <>
              <button 
                onClick={() => setIsAssignModalOpen(true)}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Assign Worker
              </button>
              <button 
                onClick={() => navigate("/attendance/bulk")} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm shadow-indigo-200 transition-colors flex items-center gap-2"
              >
                <Clock3 className="w-4 h-4" /> Mark Attendance
              </button>
            </>
          )}
          {isClient && assignment.status === 'COMPLETED' && (
            <>
              {!isBalancePaid && (
                <button 
                  onClick={handlePayBalance}
                  disabled={isPaying}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm shadow-emerald-200 transition-colors flex items-center gap-2"
                >
                  {isPaying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                  Pay Balance
                </button>
              )}
              <button 
                onClick={() => handleOpenReview(null, assignment.agencyId, assignment.agency?.agencyName || 'Agency')}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm shadow-amber-200 transition-colors flex items-center gap-2"
              >
                <Star className="w-4 h-4 fill-current" /> Rate Project
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Assignment Tracking & Progress (Spans 2 columns on lg) */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Assignment Tracking</h2>
              <p className="text-sm text-gray-500">Current progress and timeline.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5 mb-1"><CalendarDays className="w-3.5 h-3.5" /> Start Date</span>
              <span className="text-sm font-bold text-gray-900">{assignment.startDate ? new Date(assignment.startDate).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5 mb-1"><CalendarCheck className="w-3.5 h-3.5" /> End Date</span>
              <span className="text-sm font-bold text-gray-900">{assignment.endDate ? new Date(assignment.endDate).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5 mb-1"><Users className="w-3.5 h-3.5" /> Workers</span>
              <span className="text-sm font-bold text-gray-900">{assignedWorkers.length} Assigned</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5 mb-1"><Activity className="w-3.5 h-3.5" /> Status</span>
              <span className={`text-sm font-bold ${assignment.status === 'ACTIVE' ? 'text-emerald-600' : 'text-gray-900'}`}>{assignment.status}</span>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
              <span className="text-sm font-bold text-indigo-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </section>

        {/* Overview (Spans 1 column on lg) */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-3">Overview</h2>
          <div className="space-y-3">
            {assignment.client && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-semibold text-gray-500 flex items-center gap-2"><Building2 className="w-4 h-4" /> Client</span>
                <span className="text-sm font-bold text-gray-900">{assignment.client.companyName || assignment.client.user?.firstName}</span>
              </div>
            )}
            {assignment.agency && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-semibold text-gray-500 flex items-center gap-2"><Users className="w-4 h-4" /> Agency</span>
                <span className="text-sm font-bold text-gray-900">{assignment.agency.agencyName || assignment.agency.user?.firstName}</span>
              </div>
            )}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm font-semibold text-gray-500">Agreed Rate</span>
              <span className="text-sm font-bold text-emerald-600">{assignment.agreedRate ? `₹${assignment.agreedRate}` : 'TBD'}</span>
            </div>
          </div>
        </section>

        {/* Attendance (Full width) */}
        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:col-span-3">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Clock3 className="h-3.5 w-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Attendance Tracker</h2>
              <p className="text-[11px] text-gray-400">{isClient ? "Click each day to mark attendance. Next day unlocks after previous is marked." : "Your daily attendance for this assignment."}</p>
            </div>
          </div>

          {assignedWorkers.length > 0 && assignment.startDate ? (
            <div className="space-y-2">
              {assignedWorkers.map((aw) => {
                const w = aw.worker;
                const wName = `${w?.user?.firstName || ''} ${w?.user?.lastName || ''}`.trim();
                const workerRecords = attendanceData?.filter(a => a.workerId === w?.id) || [];

                // Build days up to today only
                const startDate = new Date(assignment.startDate);
                startDate.setHours(0, 0, 0, 0);
                const endDate = assignment.endDate ? new Date(assignment.endDate) : new Date();
                const today = new Date();
                today.setHours(23, 59, 59, 999);
                const clampedEnd = endDate > today ? today : endDate;

                const days = [];
                const cursor = new Date(startDate);
                let dayNum = 1;
                while (cursor <= clampedEnd && dayNum <= 90) {
                  days.push({ date: new Date(cursor), dayNum });
                  cursor.setDate(cursor.getDate() + 1);
                  dayNum++;
                }

                // Progressive unlock: day N is visible only if day N-1 is marked (or it's day 1)
                const getRecord = (date) => workerRecords.find(
                  a => new Date(a.date).toDateString() === date.toDateString()
                );

                const visibleDays = days.filter(({ date, dayNum }) => {
                  if (dayNum === 1) return true;
                  const prevDay = days[dayNum - 2];
                  return !!getRecord(prevDay.date);
                });

                return (
                  <div key={aw.id} className="border border-gray-100 rounded-xl overflow-hidden">
                    {/* Worker row with inline day boxes */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50">
                      {/* Worker name — fixed width */}
                      <div className="flex items-center gap-1.5 min-w-[120px] max-w-[120px]">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <UserRound className="w-3 h-3 text-indigo-500" />
                        </div>
                        <span className="text-[11px] font-bold text-gray-700 truncate">{wName}</span>
                      </div>

                      {/* Day boxes */}
                      <div className="flex items-center gap-1 flex-wrap">
                        {visibleDays.map(({ date, dayNum }) => {
                          const dateStr = date.toDateString();
                          const record = getRecord(date);
                          const isMarkingThis = markingAttendance[`${w?.id}_${dateStr}`];
                          const isToday = date.toDateString() === new Date().toDateString();

                          const boxStyle = record
                            ? record.status === 'PRESENT' ? 'bg-emerald-500 text-white border-emerald-500'
                            : record.status === 'ABSENT' ? 'bg-red-400 text-white border-red-400'
                            : 'bg-amber-400 text-white border-amber-400'
                            : isToday
                              ? 'bg-indigo-50 text-indigo-600 border-indigo-300 border-dashed'
                              : 'bg-white text-gray-400 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50';

                          return (
                            <div key={dayNum} className="relative">
                              <button
                                disabled={!!isMarkingThis || !isClient}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isClient) return;
                                  setActiveAttendancePopup(prev =>
                                    prev === `${w.id}_${dateStr}` ? null : `${w.id}_${dateStr}`
                                  );
                                }}
                                title={`Day ${dayNum} — ${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}${record ? ` • ${record.status.replace('_', ' ')}` : ''}`}
                                className={`w-8 h-8 rounded-md border text-[9px] font-bold flex flex-col items-center justify-center transition-all ${boxStyle} ${isClient ? 'cursor-pointer' : 'cursor-default'}`}
                              >
                                {isMarkingThis ? (
                                  <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                ) : (
                                  <>
                                    <span className="leading-none text-[10px]">{dayNum}</span>
                                    {record && (
                                      <span className="text-[7px] leading-none opacity-90">
                                        {record.status === 'PRESENT' ? 'P' : record.status === 'ABSENT' ? 'A' : 'H'}
                                      </span>
                                    )}
                                  </>
                                )}
                              </button>

                              {/* Status popup */}
                              {isClient && activeAttendancePopup === `${w.id}_${dateStr}` && (
                                <div
                                  className="absolute z-50 top-10 left-0 bg-white border border-gray-200 rounded-xl shadow-xl p-2 min-w-[130px]"
                                  onClick={e => e.stopPropagation()}
                                >
                                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider px-1 mb-1.5">
                                    Day {dayNum} · {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                  </p>
                                  {[
                                    { status: 'PRESENT', label: '✓ Present', color: 'bg-emerald-500 hover:bg-emerald-600' },
                                    { status: 'HALF_DAY', label: '½ Half Day', color: 'bg-amber-500 hover:bg-amber-600' },
                                    { status: 'ABSENT', label: '✕ Absent', color: 'bg-red-500 hover:bg-red-600' },
                                  ].map(opt => (
                                    <button
                                      key={opt.status}
                                      onClick={() => {
                                        setActiveAttendancePopup(null);
                                        handleMarkAttendance(w.id, opt.status, date);
                                      }}
                                      className={`w-full text-left text-[11px] font-bold text-white px-2.5 py-1.5 rounded-lg mb-1 last:mb-0 transition-colors ${opt.color}`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Locked upcoming days indicator */}
                        {days.length > visibleDays.length && (
                          <span className="text-[10px] text-gray-300 font-medium px-1">
                            +{days.length - visibleDays.length} locked
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Attendance results — directly below this worker's row */}
                    {workerRecords.length > 0 && (
                      <div className="px-3 py-2 bg-white border-t border-gray-50">
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          {workerRecords
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .map((rec) => {
                              const dNum = Math.round((new Date(rec.date) - new Date(assignment.startDate)) / (1000 * 60 * 60 * 24)) + 1;
                              return (
                                <span key={rec.id} className="flex items-center gap-1 text-[10px]">
                                  <span className={`font-bold px-1.5 py-0.5 rounded ${
                                    rec.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-700' :
                                    rec.status === 'ABSENT' ? 'bg-red-100 text-red-700' :
                                    'bg-amber-100 text-amber-700'
                                  }`}>Day {dNum}</span>
                                  <span className="text-gray-400">{rec.status.replace('_', ' ')}</span>
                                  {rec.checkInTime && (
                                    <span className="text-gray-300 font-mono">
                                      {new Date(rec.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  )}
                                </span>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-xs text-gray-400 py-4">No workers assigned yet.</p>
          )}
        </section>

        {/* Assigned Workers */}

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Assigned Workers</h2>
                <p className="text-xs text-gray-500">Workers attached to this assignment.</p>
              </div>
            </div>
            <span className="bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-lg text-sm">{assignedWorkers.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedWorkers.length === 0 ? (
              <div className="col-span-full text-center p-8 bg-gray-50 rounded-xl border border-gray-100 border-dashed text-gray-500 text-sm">
                No workers assigned yet. Click 'Assign Worker' to add someone to this assignment.
              </div>
            ) : (
              assignedWorkers.map((aw) => {
                const w = aw.worker;
                const name = `${w?.user?.firstName || w?.firstName} ${w?.user?.lastName || w?.lastName || ''}`.trim();
                return (
                  <div key={aw.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-4 hover:border-emerald-100 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <UserRound className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">{name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${aw.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{aw.status}</span>
                          <span className="text-xs text-gray-500 truncate">{w?.workerCode || w?.id.substring(0,8)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isClient && (
                        <Link to={`/workers/${w.id}`} className="text-sm font-semibold text-emerald-600 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          View
                        </Link>
                      )}
                      {isClient && assignment.status === 'COMPLETED' && (
                        <button 
                          onClick={() => handleOpenReview(w.id, null, name)}
                          className="text-amber-500 hover:text-amber-600 bg-amber-50 px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-bold"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" /> Rate
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
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
