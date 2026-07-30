import { useState, useRef, useEffect } from "react";
import { ChevronDown, Calendar, Loader2, CheckCircle2, LogOut, Coffee, XCircle } from "lucide-react";
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        await api.post("/worker-attendance/check-in");
      } else if (selectedOption.id === "CHECK_OUT") {
        await api.post("/worker-attendance/check-out");
      } else {
        await api.post("/worker-attendance/mark-status", { status: selectedOption.id });
      }
      
      toast.success(`Successfully marked as ${selectedOption.label}`);
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
      >
        <Calendar className="w-4 h-4 text-gray-500" />
        <span>Today's Attendance</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
              className={selectedOption?.id === 'ABSENT' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : ''}
              leftIcon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            >
              {loading ? "Confirming..." : "Confirm"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
