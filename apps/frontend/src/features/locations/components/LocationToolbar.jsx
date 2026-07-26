import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";

export default function LocationToolbar({ total, onAdd }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Locations</h2>
        <p className="text-sm text-gray-500 mt-1">{total !== undefined ? `Total ${total} found` : "Loading..."}</p>
      </div>
      <Button onClick={onAdd}>
        <Plus className="mr-2 h-4 w-4" /> Add Location
      </Button>
    </div>
  );
}
