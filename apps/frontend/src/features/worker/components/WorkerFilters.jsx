import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workerFilterSchema } from "../schemas/workerFilter.schema";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { Filter, RotateCcw, ChevronDown } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";

export default function WorkerFilters({ availableStatuses = [], availableAgencies = [], availableSkills = [] }) {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

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

  const onSubmit = (data) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (data.status) newParams.set("status", data.status);
    else newParams.delete("status");
    
    if (data.agency) newParams.set("agency", data.agency);
    else newParams.delete("agency");
    
    if (data.skill) newParams.set("skill", data.skill);
    else newParams.delete("skill");
    
    setSearchParams(newParams);
  };

  const handleReset = () => {
    reset({ status: "", agency: "", skill: "" });
    setSearchParams(new URLSearchParams());
  };

  const selectContainerClass = "relative w-full";
  const selectClass = "w-full bg-white border border-slate-200/90 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm appearance-none outline-none focus:border-indigo-500 transition-all pr-10 cursor-pointer";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 w-full mb-3">
      {/* Row 1: Dropdowns */}
      <div className="grid grid-cols-2 gap-3">
        <div className={selectContainerClass}>
          <select {...register("status")} className={selectClass}>
            <option value="">Status (All)</option>
            {availableStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className={selectContainerClass}>
          <select {...register("skill")} className={selectClass}>
            <option value="">Skill (All)</option>
            {availableSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Row 2: Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 text-sm hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-600" />
          <span>Reset</span>
        </button>

        <button
          type="submit"
          className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold py-3 px-4 rounded-2xl shadow-md flex items-center justify-center gap-2 text-sm active:scale-[0.98] transition-all cursor-pointer"
        >
          <Filter className="w-4 h-4 text-white" />
          <span>Apply</span>
        </button>
      </div>
    </form>
  );
}
