import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workerFilterSchema } from "../schemas/workerFilter.schema";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Filter, RotateCcw, X, Check } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";

export default function WorkerFilters({ availableStatuses = [], availableAgencies = [], availableSkills = [] }) {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm({
    resolver: zodResolver(workerFilterSchema),
    defaultValues: {
      status: searchParams.get("status") || "",
      agency: searchParams.get("agency") || "",
      skill: searchParams.get("skill") || "",
    },
  });

  useEffect(() => {
    setValue("status", searchParams.get("status") || "");
    setValue("agency", searchParams.get("agency") || "");
    setValue("skill", searchParams.get("skill") || "");
  }, [searchParams, setValue]);

  const activeCount = [
    searchParams.get("status"),
    searchParams.get("agency"),
    searchParams.get("skill"),
  ].filter(Boolean).length;

  const onSubmit = (data) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (data.status) newParams.set("status", data.status);
    else newParams.delete("status");
    
    if (data.agency) newParams.set("agency", data.agency);
    else newParams.delete("agency");
    
    if (data.skill) newParams.set("skill", data.skill);
    else newParams.delete("skill");
    
    setSearchParams(newParams);
    setIsOpen(false);
  };

  const handleReset = () => {
    reset({ status: "", agency: "", skill: "" });
    setSearchParams(new URLSearchParams());
    setIsOpen(false);
  };

  return (
    <>
      {/* Single Filter Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="h-9 px-3.5 bg-white border border-gray-200 hover:border-violet-300 text-slate-700 font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer relative"
      >
        <Filter className="w-4 h-4 text-violet-600" />
        <span>Filter</span>
        {activeCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-violet-600 text-white font-extrabold text-[10px] flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Backdrop-Blurred Full-Screen Filter Popup Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-[1000] flex items-center justify-center p-4 animate-fade-in"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md p-5 sm:p-6 space-y-5 animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-violet-600" />
                <h3 className="text-base font-bold text-slate-900">Filter Workers</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Status Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Worker Status</label>
                <select 
                  {...register("status")} 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl focus:outline-none focus:border-violet-500 transition-all cursor-pointer"
                >
                  <option value="">Status (All)</option>
                  {availableStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Skill Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Primary Skill</label>
                <select 
                  {...register("skill")} 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl focus:outline-none focus:border-violet-500 transition-all cursor-pointer"
                >
                  <option value="">Skill (All)</option>
                  {availableSkills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              {/* Agency Filter */}
              {user?.profileType !== "AGENCY" && user?.profileType !== "SUPER_ADMIN" && availableAgencies.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Agency</label>
                  <select 
                    {...register("agency")} 
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl focus:outline-none focus:border-violet-500 transition-all cursor-pointer"
                  >
                    <option value="">Agency (All)</option>
                    {availableAgencies.map(agency => (
                      <option key={agency} value={agency}>{agency}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center whitespace-nowrap"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply Filters</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
