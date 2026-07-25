import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AssignmentFilters from "../components/AssignmentFilters";
import AvailableWorkersTable from "../components/AvailableWorkersTable";
import SelectedWorkersPanel from "../components/SelectedWorkersPanel";
import { toast } from "sonner";

// Dummy data
const MOCK_WORKERS = [
  { id: "W-101", name: "Ravi Kumar", skill: "Electrical", agency: "Alpha Staffing", availabilityDate: "Available Now", status: "AVAILABLE" },
  { id: "W-102", name: "Sunil Singh", skill: "Plumbing", agency: "Alpha Staffing", availabilityDate: "2026-08-01", status: "ASSIGNED SOON" },
  { id: "W-103", name: "Arjun M", skill: "Electrical", agency: "Global Temp", availabilityDate: "Available Now", status: "AVAILABLE" },
  { id: "W-104", name: "Mohammed Ali", skill: "Construction", agency: "Direct", availabilityDate: "Available Now", status: "AVAILABLE" },
  { id: "W-105", name: "David John", skill: "Electrical", agency: "Beta Staffing", availabilityDate: "2026-07-28", status: "AVAILABLE" },
];

export default function AssignWorkersPage() {
  const { requirementId } = useParams();
  const [selectedIds, setSelectedIds] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(MOCK_WORKERS.map(w => w.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleRemoveSelected = (id) => {
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
  };

  const handleAssign = async () => {
    setIsAssigning(true);
    // Simulate API call
    setTimeout(() => {
      setIsAssigning(false);
      toast.success(\`Successfully assigned \${selectedIds.length} workers to requirement.\`);
      setSelectedIds([]);
    }, 1200);
  };

  const selectedWorkers = MOCK_WORKERS.filter(w => selectedIds.includes(w.id));

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-6">
        <Link 
          to="/job-requirements" 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Requirements
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Assign Workers</h1>
        <p className="mt-2 text-sm text-gray-500">
          Search and allocate available workers to requirement <span className="font-semibold text-gray-700">{requirementId || "JR-1001"}</span>.
        </p>
      </div>

      <AssignmentFilters />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <AvailableWorkersTable 
            workers={MOCK_WORKERS} 
            selectedWorkerIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
          />
        </div>
        <div className="lg:col-span-1 sticky top-6">
          <SelectedWorkersPanel 
            selectedWorkers={selectedWorkers}
            onRemove={handleRemoveSelected}
            onAssign={handleAssign}
            loading={isAssigning}
          />
        </div>
      </div>
    </div>
  );
}
