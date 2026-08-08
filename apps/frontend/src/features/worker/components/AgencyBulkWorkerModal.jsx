import { useState } from "react";
import { X, Users, Upload, AlertCircle, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { workerApi } from "../api/worker.api";

export default function AgencyBulkWorkerModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [bulkText, setBulkText] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bulkText.trim()) {
      toast.error("Please enter worker details");
      return;
    }

    setLoading(true);
    try {
      // Parse CSV-like text
      const rows = bulkText.split('\n').filter(row => row.trim());
      const workers = rows.map(row => {
        // Format: FirstName, LastName, Phone, Wage, Skill, District, City, Gender, DateOfBirth, Address, ExperienceYears, JoiningDate
        const parts = row.split(',').map(p => p.trim());
        return {
          firstName: parts[0] || "",
          lastName: parts[1] || "",
          phone: parts[2] || "",
          expectedDailyWage: parts[3] || "",
          skill: parts[4] || "",
          district: parts[5] || "",
          city: parts[6] || "",
          gender: parts[7] || "",
          dateOfBirth: parts[8] || "",
          addressLine1: parts[9] || "",
          totalExperienceYears: parts[10] ? Number(parts[10]) : undefined,
          joiningDate: parts[11] || "",
          state: "Kerala"
        };
      });

      // Filter invalid rows
      const validWorkers = workers.filter(w => w.firstName);

      if (validWorkers.length === 0) {
        toast.error("No valid workers found. Please check format.");
        setLoading(false);
        return;
      }

      await workerApi.addAgencyWorkerBulk({ workers: validWorkers });
      toast.success(`${validWorkers.length} workers added successfully!`);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add workers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-slide-up-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-indigo-100/80 text-indigo-700 rounded-xl shadow-sm border border-indigo-200/50">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Bulk Add Workers</h2>
              <p className="text-sm text-gray-500">Quickly add multiple managed workers via CSV format.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-gray-200 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left side: Instructions */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 border border-indigo-100 rounded-2xl p-5 text-sm text-indigo-900 h-full">
                <div className="flex items-center gap-2.5 mb-3">
                  <AlertCircle className="w-5 h-5 text-indigo-600" />
                  <span className="font-bold text-indigo-950 text-base">Formatting Guide</span>
                </div>
                <p className="text-indigo-800/80 leading-relaxed mb-4">
                  Each row must be a new worker. Separate details with commas in this exact order:
                </p>
                <div className="bg-white/80 border border-indigo-100/80 rounded-xl p-3 mb-4 shadow-sm">
                  <code className="font-mono text-[11px] font-semibold text-indigo-700 leading-relaxed">
                    FirstName, LastName, Phone, DailyWage, JobType, District, City, Gender, DoB, Address, ExpYears, JoiningDate
                  </code>
                </div>
                <div className="text-xs text-indigo-700/70 border-t border-indigo-100/60 pt-3">
                  <span className="font-semibold block mb-1 text-indigo-900">Example Row:</span>
                  <span className="font-mono">John, Doe, 9876543210, 850, Plumber, Ernakulam, Kochi, Male, 1990-05-15, 123 Main St, 5, 2023-01-01</span>
                </div>
              </div>
            </div>

            {/* Right side: Input */}
            <div className="lg:col-span-7 flex flex-col">
              <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-400" /> Worker Data CSV
              </label>
              <textarea 
                required
                rows={9}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                className="w-full flex-1 p-4 border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-mono whitespace-pre shadow-sm bg-gray-50/30 hover:bg-white"
                placeholder="Paste your CSV data here..."
              />
            </div>
            
          </div>

          <div className="pt-6 mt-6 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-xl shadow-sm transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2">
              <Upload className="w-4 h-4" />
              {loading ? "Processing Data..." : "Upload & Save Workers"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
