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
        // Format: FirstName, LastName, Phone, Wage, Skill, District, City
        const parts = row.split(',').map(p => p.trim());
        return {
          firstName: parts[0] || "",
          lastName: parts[1] || "",
          phone: parts[2] || "",
          expectedDailyWage: parts[3] || "",
          skill: parts[4] || "",
          district: parts[5] || "",
          city: parts[6] || "",
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-slide-up-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Bulk Add Workers</h2>
              <p className="text-xs text-gray-500">Quickly add multiple managed workers at once.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-blue-500 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">How to use:</p>
              <p>Paste your worker details below. Each row must be a new worker. Separate details with commas in this exact order:</p>
              <code className="block mt-2 bg-blue-100/50 px-3 py-2 rounded-lg font-mono text-xs text-blue-700">
                FirstName, LastName, Phone, DailyWage, JobType/Skill, District, City
              </code>
              <p className="mt-2 text-xs opacity-80">Example: John, Doe, 9876543210, 850, Plumber, Ernakulam, Kochi</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-gray-400" /> Worker Data (Comma Separated)
            </label>
            <textarea 
              required
              rows={8}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono whitespace-pre"
              placeholder="John, Doe, 9876543210, 850, Plumber, Ernakulam, Kochi&#10;Jane, Smith, 9123456780, 900, Electrician, Thrissur, Chalakudy"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition-all flex items-center gap-2">
              <Upload className="w-4 h-4" />
              {loading ? "Processing..." : "Upload & Add Workers"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
