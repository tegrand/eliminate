import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workerFilterSchema } from "../schemas/workerFilter.schema";
import { Select } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

import { Filter } from "lucide-react";

export default function WorkerFilters() {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-end gap-4 mt-6">
      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
        <select {...register("status")} className="block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg text-gray-600 border bg-white h-10">
          <option value="">Select status</option>
          <option value="ACTIVE">Active</option>
          <option value="ON_LEAVE">On Leave</option>
          <option value="INACTIVE">Inactive</option>
          <option value="PENDING">Pending</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>
      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Agency</label>
        <select {...register("agency")} className="block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg text-gray-600 border bg-white h-10">
          <option value="">Select agency</option>
          <option value="Alpha Staffing">Alpha Staffing</option>
          <option value="Beta Temp">Beta Temp</option>
          <option value="Direct Hire">Direct Hire</option>
        </select>
      </div>
      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Skill</label>
        <select {...register("skill")} className="block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg text-gray-600 border bg-white h-10">
          <option value="">Select skill</option>
          <option value="Forklift Operator">Forklift Operator</option>
          <option value="Warehouse Associate">Warehouse Associate</option>
          <option value="Security Guard">Security Guard</option>
        </select>
      </div>
      <div className="flex gap-3 w-full sm:w-auto">
        <button type="button" onClick={handleReset} className="h-10 px-5 inline-flex items-center justify-center border border-gray-300 shadow-sm text-sm font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto">
          Reset
        </button>
        <button type="submit" className="h-10 px-5 inline-flex items-center justify-center border border-transparent shadow-sm text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto gap-2">
          <Filter className="w-4 h-4" />
          Apply
        </button>
      </div>
    </form>
  );
}
