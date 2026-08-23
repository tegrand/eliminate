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
        // Format: FirstName, LastName, Phone, Skill, District, City, Gender, DateOfBirth, Address, ExperienceYears, JoiningDate
        const parts = row.split(',').map(p => p.trim());
        return {
          firstName: parts[0] || "",
          lastName: parts[1] || "",
          phone: parts[2] || "",
          skill: parts[3] || "",
          district: parts[4] || "",
          city: parts[5] || "",
          gender: parts[6] || "",
          dateOfBirth: parts[7] || "",
          addressLine1: parts[8] || "",
          totalExperienceYears: parts[9] ? Number(parts[9]) : undefined,
          joiningDate: parts[10] || "",
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
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-md animate-fade-in"
      style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-2xl overflow-hidden animate-slide-up-sm border border-slate-100 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 text-violet-700 rounded-xl shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Bulk Add Workers</h2>
              <p className="text-xs text-gray-500">Quickly add multiple managed workers via CSV format.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 flex flex-col flex-1 overflow-y-auto space-y-4">
          {/* Formatting Guide Banner */}
          <div className="bg-violet-50/80 border border-violet-100 rounded-xl p-3.5 text-xs text-violet-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-violet-900">
              <AlertCircle className="w-4 h-4 text-violet-600 shrink-0" />
              <span>CSV Order & Format:</span>
            </div>
            <div className="bg-white/90 border border-violet-100 rounded-lg p-2 font-mono text-[11px] font-semibold text-violet-700 overflow-x-auto">
              FirstName, LastName, Phone, JobType, District, City, Gender, DoB, Address, ExpYears, JoiningDate
            </div>
            <p className="text-[11px] text-violet-700/80">
              <span className="font-semibold text-violet-900">Example: </span>
              <span className="font-mono">John, Doe, 9876543210, Plumber, Ernakulam, Kochi, Male, 1990-05-15, Main St, 5, 2023-01-01</span>
            </p>
          </div>

          {/* Data Textarea Input */}
          <div className="flex flex-col flex-1">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-violet-500" /> Worker Data (CSV Lines)
            </label>
            <textarea 
              required
              rows={8}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              className="w-full p-3.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all font-mono whitespace-pre bg-slate-50/50 hover:bg-white"
              placeholder="Paste CSV rows here (one worker per line)..."
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex justify-end gap-3 border-t border-gray-100 shrink-0">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 text-xs font-bold text-white bg-violet-500 hover:bg-violet-600 active:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{loading ? "Processing Data..." : "Upload & Save Workers"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
