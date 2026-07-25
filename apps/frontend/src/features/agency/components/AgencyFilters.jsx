import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agencyFilterSchema } from "../schemas/agencyFilter.schema";
import { Select } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

import { Filter, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function AgencyFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { register, handleSubmit, reset, setValue } = useForm({
    resolver: zodResolver(agencyFilterSchema),
    defaultValues: {
      status: searchParams.get("status") || "",
      district: searchParams.get("district") || "",
    },
  });

  useEffect(() => {
    setValue("status", searchParams.get("status") || "");
    setValue("district", searchParams.get("district") || "");
  }, [searchParams, setValue]);

  const onSubmit = (data) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (data.status) newParams.set("status", data.status);
    else newParams.delete("status");
    
    if (data.district) newParams.set("district", data.district);
    else newParams.delete("district");
    
    setSearchParams(newParams);
  };

  const handleReset = () => {
    reset({ status: "", district: "" });
    setSearchParams(new URLSearchParams());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-end gap-4 mt-6">
      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
        <select {...register("status")} className="block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg text-gray-600 border bg-white h-10">
          <option value="">Select status</option>
          <option value="ACTIVE">Active</option>
          <option value="ONBOARDING">Onboarding</option>
          <option value="INACTIVE">Inactive</option>
          <option value="PENDING">Pending</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>
      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">District</label>
        <select {...register("district")} className="block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg text-gray-600 border bg-white h-10">
          <option value="">Select district</option>
          <option value="North District">North District</option>
          <option value="South District">South District</option>
          <option value="Central">Central</option>
        </select>
      </div>
      <div className="flex gap-3 w-full sm:w-auto">
        <button type="button" onClick={handleReset} className="h-10 px-5 inline-flex items-center justify-center border border-gray-300 shadow-sm text-sm font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <button type="submit" className="h-10 px-5 inline-flex items-center justify-center border border-transparent shadow-sm text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto gap-2">
          <Filter className="w-4 h-4" />
          Apply
        </button>
      </div>
    </form>
  );
}
