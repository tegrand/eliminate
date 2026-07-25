import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Link } from "react-router-dom";

export default function AgencyToolbar({ totalAgencies }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Agencies</h2>
        <p className="text-sm text-gray-500 mt-1">
          {totalAgencies !== undefined ? `Total ${totalAgencies} agencies found` : "Loading agencies..."}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-64">
          <Input 
            placeholder="Search agencies..." 
            aria-label="Search agencies"
          />
        </div>
        <Link to="/agencies/new" className="w-full sm:w-auto">
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Agency
          </Button>
        </Link>
      </div>
    </div>
  );
}
