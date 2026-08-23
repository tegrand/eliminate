import ClientFilters from "./ClientFilters";

export default function ClientToolbar({ totalClients, availableStatuses, availableDistricts }) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 mb-3">
      <div className="pb-1">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Clients</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage and monitor your clients
        </p>
      </div>
      <div className="w-full xl:w-auto">
        <ClientFilters availableStatuses={availableStatuses} availableDistricts={availableDistricts} />
      </div>
    </div>
  );
}
