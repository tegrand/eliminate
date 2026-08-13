import { useState, useRef, useEffect } from "react";
import { ChevronDown, Calendar, Loader2, CheckCircle2, LogOut, Coffee, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api/axios";
import { Modal } from "../../../../components/ui/modal/Modal";
import Button from "../../../../components/ui/button/Button";

const ATTENDANCE_OPTIONS = [
  { id: "PRESENT", label: "Check In", icon: CheckCircle2, color: "text-emerald-600", desc: "Mark yourself present for today" },
  { id: "CHECK_OUT", label: "Check Out", icon: LogOut, color: "text-blue-600", desc: "End your shift for today" },
  { id: "ON_LEAVE", label: "On Leave", icon: Coffee, color: "text-amber-600", desc: "Mark today as a leave day" },
  { id: "ABSENT", label: "Absent", icon: XCircle, color: "text-red-600", desc: "Mark yourself absent today" }
];

export default function WorkerAttendanceDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const [currentStatus, setCurrentStatus] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCurrentStatus = async () => {
    try {
      const res = await api.get("/my-attendance/history");
      const records = res.data.data;
      if (records && records.length > 0) {
        const today = new Date().toLocaleDateString();
        const latestRecordDate = new Date(records[0].createdAt || records[0].date).toLocaleDateString();
        if (today === latestRecordDate) {
          let matchedOption;
          if (records[0].status === "PRESENT" && records[0].checkOutTime) {
            matchedOption = ATTENDANCE_OPTIONS.find(opt => opt.id === "CHECK_OUT");
          } else {
            matchedOption = ATTENDANCE_OPTIONS.find(opt => opt.id === records[0].status);
          }
          if (matchedOption) setCurrentStatus(matchedOption);
        }
      }
    } catch (error) {
      console.error("Failed to fetch attendance status", error);
    }
  };

  useEffect(() => {
    fetchCurrentStatus();
  }, []);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedOption) return;
    
    setLoading(true);
    try {
      if (selectedOption.id === "PRESENT") {
        await api.post("/my-attendance/check-in");
      } else if (selectedOption.id === "CHECK_OUT") {
        await api.post("/my-attendance/check-out");
      } else {
        await api.post("/my-attendance/mark-status", { status: selectedOption.id });
      }
      
      toast.success(`Successfully marked as ${selectedOption.label}`);
      setIsModalOpen(false);
      fetchCurrentStatus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <div className={`flex-1 flex justify-center px-2 sm:px-3 py-2.5 rounded-lg border text-[11px] sm:text-[13px] font-bold items-center gap-1 sm:gap-1.5 shadow-sm transition-colors ${
        currentStatus 
          ? `${currentStatus.color.replace('text', 'bg').replace('600', '50')} ${currentStatus.color} border-${currentStatus.color.split('-')[1]}-200`
          : 'bg-white text-slate-700 border-gray-200'
      }`}>
        {currentStatus ? <currentStatus.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" /> : <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />}
        <span className="truncate">
        {currentStatus ? (
          currentStatus.id === "PRESENT" ? "Checked In" : 
          currentStatus.id === "CHECK_OUT" ? "Checked Out" : 
          currentStatus.label
        ) : "Not Marked"}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5 sm:ml-1 flex-shrink-0" />
      </div>

      <div className="relative flex-1 min-w-0" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2.5 border border-transparent rounded-lg text-[11px] sm:text-[13px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm"
        >
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-100 flex-shrink-0" />
          <span className="truncate">Today's Attendance</span>
          <ChevronDown className={`w-3.5 h-3.5 text-indigo-100 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 animate-fade-in-up origin-top-right">
          <div className="px-4 py-2 border-b border-gray-50 mb-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mark Attendance</p>
          </div>
          
          {ATTENDANCE_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-start gap-3 transition-colors"
            >
              <div className={`mt-0.5 ${option.color}`}>
                <option.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{option.label}</p>
                <p className="text-xs text-gray-500">{option.desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !loading && setIsModalOpen(false)}
        title="Confirm Attendance"
        className="sm:max-w-sm"
      >
        <div className="p-6">
          <div className="mb-6 flex flex-col items-center text-center">
            {selectedOption && (
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${selectedOption.color.replace('text', 'bg').replace('600', '100')} ${selectedOption.color}`}>
                <selectedOption.icon className="w-6 h-6" />
              </div>
            )}
            <h3 className="text-lg font-bold text-gray-900">Are you sure?</h3>
            <p className="text-sm text-gray-500 mt-2">
              You are about to mark your attendance as <span className="font-semibold text-gray-900">{selectedOption?.label}</span> for today.
            </p>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={loading}
              className={
                selectedOption?.id === 'PRESENT' ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500' :
                selectedOption?.id === 'CHECK_OUT' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' :
                selectedOption?.id === 'ON_LEAVE' ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500' :
                selectedOption?.id === 'ABSENT' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : ''
              }
              leftIcon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            >
              {loading ? "Confirming..." : "Confirm"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
    </div>
  );
}
