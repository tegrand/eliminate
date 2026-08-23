import { Plus, ChevronDown, UserPlus, Users } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useState, useRef, useEffect } from "react";

import WorkerFilters from "./WorkerFilters";
import AgencySingleWorkerModal from "./AgencySingleWorkerModal";
import AgencyBulkWorkerModal from "./AgencyBulkWorkerModal";

export default function WorkerToolbar({ totalWorkers, availableStatuses, availableAgencies, availableSkills }) {
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
    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 mb-3">
      <div className="pb-1">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Workers</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage and monitor your workforce
        </p>
      </div>

      <div className="flex items-center gap-2 w-full xl:w-auto">
        <div className="flex-grow xl:flex-grow-0">
          <WorkerFilters 
            availableStatuses={availableStatuses} 
            availableAgencies={availableAgencies} 
            availableSkills={availableSkills} 
          />
        </div>

        {user?.profileType === "AGENCY" && (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex-shrink-0 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2 text-sm font-medium h-9"
            >
              <Plus className="w-4 h-4" />
              <span>Add Worker</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 animate-fade-in-up">
                <button 
                  onClick={() => { setIsDropdownOpen(false); setIsSingleModalOpen(true); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-indigo-600" />
                  <span>Add Single Worker</span>
                </button>
                <button 
                  onClick={() => { setIsDropdownOpen(false); setIsBulkModalOpen(true); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Bulk Add Workers</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

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
