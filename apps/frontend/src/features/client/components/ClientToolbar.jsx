import { Input } from "../../../components/ui/input";

export default function ClientToolbar({ totalClients }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Clients</h2>
        <p className="text-sm text-gray-500 mt-1">
          {totalClients !== undefined ? `Total ${totalClients} clients found` : "Loading clients..."}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-64">
          <Input 
            placeholder="Search clients..." 
            aria-label="Search clients"
          />
        </div>
      </div>
    </div>
  );
}
