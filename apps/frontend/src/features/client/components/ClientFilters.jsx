import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientFilterSchema } from "../schemas/clientFilter.schema";
import { Select } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

import { Filter, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function ClientFilters({ availableStatuses = [], availableDistricts = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const { register, handleSubmit, reset, setValue } = useForm({
    resolver: zodResolver(clientFilterSchema),
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-center gap-2 mt-0">
      <div className="w-full sm:w-[160px]">
        <select {...register("status")} className="block w-full pl-3 pr-8 py-1.5 text-sm border-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg text-gray-600 border bg-white h-9">
          <option value="">Status (All)</option>
          {availableStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      <div className="w-full sm:w-[160px]">
        <select {...register("district")} className="block w-full pl-3 pr-8 py-1.5 text-sm border-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg text-gray-600 border bg-white h-9">
          <option value="">District (All)</option>
          {availableDistricts.map(district => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <button type="button" onClick={handleReset} className="h-9 px-3 inline-flex items-center justify-center border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
        <button type="submit" className="h-9 px-3 inline-flex items-center justify-center border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto gap-1.5">
          <Filter className="w-3.5 h-3.5" />
          Apply
        </button>
      </div>
    </form>
  );
}
