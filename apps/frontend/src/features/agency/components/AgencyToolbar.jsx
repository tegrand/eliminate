import { Filter } from "lucide-react";
import toast from "react-hot-toast";
import AgencyFilters from "./AgencyFilters";

export default function AgencyToolbar({ totalAgencies, availableStatuses, availableDistricts }) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 mb-3">
      <div className="pb-1">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Agencies</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage and monitor your agencies
        </p>
      </div>
      <div className="flex items-center gap-2 w-full xl:w-auto">
        <div className="flex-grow xl:flex-grow-0">
          <AgencyFilters availableStatuses={availableStatuses} availableDistricts={availableDistricts} />
        </div>
      </div>
    </div>
  );
}
