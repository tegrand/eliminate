import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import AttendanceSummary from "../components/AttendanceSummary";
import AttendanceDifferenceCard from "../components/AttendanceDifferenceCard";
import VerificationActions from "../components/VerificationActions";

// Dummy data removed as requested
const MOCK_RECORD = null;
const MOCK_SYSTEM_LOG = null;
const MOCK_MANUAL_LOG = null;

export default function AttendanceVerificationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Attendance record approved successfully.");
      navigate("/attendance");
    }, 1000);
  };

  const handleReject = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Attendance record rejected.");
      navigate("/attendance");
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-6">
        <Link 
          to="/attendance" 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Attendance
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Verify Attendance</h1>
        <p className="mt-2 text-sm text-gray-500">
          Review discrepancies between system logs and manual entries for record <span className="font-semibold text-gray-700">{id}</span>.
        </p>
      </div>

      <AttendanceSummary record={MOCK_RECORD} />
      
      <AttendanceDifferenceCard 
        systemLog={MOCK_SYSTEM_LOG} 
        manualLog={MOCK_MANUAL_LOG} 
      />
      
      <VerificationActions 
        onApprove={handleApprove}
        onReject={handleReject}
        loading={isProcessing}
      />
    </div>
  );
}
