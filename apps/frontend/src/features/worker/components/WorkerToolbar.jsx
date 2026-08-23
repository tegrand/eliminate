import { Plus, ChevronDown, UserPlus, Users, LayoutGrid, List } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useState, useRef, useEffect } from "react";

import WorkerFilters from "./WorkerFilters";
import AgencySingleWorkerModal from "./AgencySingleWorkerModal";
import AgencyBulkWorkerModal from "./AgencyBulkWorkerModal";

export default function WorkerToolbar({ totalWorkers, availableStatuses, availableAgencies, availableSkills, viewMode = "grid", onViewModeChange }) {
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Modals state
  const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-3 mb-3 w-full">
      
      {/* ── Title & View Mode Toggle Row ── */}
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workers</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Manage and monitor your workforce
          </p>
        </div>

        {/* View Mode Toggle Buttons (Grid vs List) */}
        {onViewModeChange && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-[#4f46e5] text-white shadow-md border border-[#4338ca]"
                  : "bg-white border border-slate-200 text-slate-500 shadow-sm hover:bg-slate-50"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange("table")}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-[#4f46e5] text-white shadow-md border border-[#4338ca]"
                  : "bg-white border border-slate-200 text-slate-500 shadow-sm hover:bg-slate-50"
              }`}
              title="Table View"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* ── Filter Controls Grid ── */}
      <WorkerFilters 
        availableStatuses={availableStatuses} 
        availableAgencies={availableAgencies} 
        availableSkills={availableSkills} 
      />

      {/* ── Add Worker Action Button (Full Width Pill Button) ── */}
      {user?.profileType === "AGENCY" && (
        <div className="relative w-full" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold py-3.5 px-5 rounded-2xl shadow-md flex items-center justify-between text-sm transition-all cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span>Add Worker</span>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-fade-in-up">
              <button 
                onClick={() => { setIsDropdownOpen(false); setIsSingleModalOpen(true); }}
                className="w-full text-left px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
              >
                <UserPlus className="w-4 h-4 text-indigo-600" />
                <span>Add Single Worker</span>
              </button>
              <button 
                onClick={() => { setIsDropdownOpen(false); setIsBulkModalOpen(true); }}
                className="w-full text-left px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
              >
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Bulk Add Workers</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AgencySingleWorkerModal 
        isOpen={isSingleModalOpen} 
        onClose={() => setIsSingleModalOpen(false)} 
        onSuccess={() => window.location.reload()} 
      />
      <AgencyBulkWorkerModal 
        isOpen={isBulkModalOpen} 
        onClose={() => setIsBulkModalOpen(false)} 
        onSuccess={() => window.location.reload()} 
      />
    </div>
  );
}
