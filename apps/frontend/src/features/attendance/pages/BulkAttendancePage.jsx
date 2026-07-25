import { useState } from "react";
import { toast } from "sonner";
import AttendanceHeader from "../components/AttendanceHeader";
import AttendanceWorkerTable from "../components/AttendanceWorkerTable";
import AttendanceSummaryCard from "../components/AttendanceSummaryCard";

const MOCK_WORKERS = [
  { id: "W-101", name: "Ravi Kumar", status: "PRESENT", checkIn: "08:00", checkOut: "17:00", remarks: "" },
  { id: "W-102", name: "Sunil Singh", status: "PRESENT", checkIn: "08:15", checkOut: "17:00", remarks: "Traffic delay" },
  { id: "W-103", name: "Arjun M", status: "ABSENT", checkIn: "", checkOut: "", remarks: "Sick leave" },
  { id: "W-104", name: "Mohammed Ali", status: "HALF_DAY", checkIn: "08:00", checkOut: "12:30", remarks: "Family emergency" },
  { id: "W-105", name: "David John", status: "PRESENT", checkIn: "08:00", checkOut: "17:00", remarks: "" },
];

export default function BulkAttendancePage() {
  const [workers, setWorkers] = useState(MOCK_WORKERS);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateWorker = (id, updates) => {
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    // Simulate API bulk save
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Successfully saved bulk attendance for 5 workers.");
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <AttendanceHeader 
        assignmentId="ASM-1001" 
        date={new Date().toISOString().split('T')[0]} 
        onSave={handleSaveAll}
        isSaving={isSaving}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <AttendanceWorkerTable 
          workers={workers} 
          onUpdateWorker={handleUpdateWorker} 
        />
        <div className="lg:col-span-1">
          <AttendanceSummaryCard workers={workers} />
        </div>
      </div>
    </div>
  );
}
