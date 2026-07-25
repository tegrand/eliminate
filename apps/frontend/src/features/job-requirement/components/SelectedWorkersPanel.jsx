import { Button } from "../../../components/ui/button";
import { X, Users } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";

export default function SelectedWorkersPanel({ selectedWorkers, onRemove, onAssign, loading }) {
  if (selectedWorkers.length === 0) {
    return (
      <Card className="h-full bg-gray-50 border-dashed border-2 border-gray-300">
        <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900">No Workers Selected</h3>
          <p className="mt-1 text-sm text-gray-500">
            Select workers from the list to assign them to this job requirement.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-blue-200 shadow-sm flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 bg-blue-50/50 flex justify-between items-center rounded-t-xl">
        <h3 className="font-semibold text-gray-900">
          Selected Workers ({selectedWorkers.length})
        </h3>
        <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
          Draft Allocation
        </span>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto max-h-[500px]">
        <ul className="space-y-3">
          {selectedWorkers.map(worker => (
            <li key={worker.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-300 transition-colors">
              <div>
                <p className="text-sm font-medium text-gray-900">{worker.name}</p>
                <p className="text-xs text-gray-500">{worker.skill} • {worker.agency}</p>
              </div>
              <button 
                onClick={() => onRemove(worker.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                aria-label="Remove worker"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50 mt-auto rounded-b-xl">
        <Button 
          className="w-full" 
          onClick={onAssign}
          loading={loading}
        >
          Assign {selectedWorkers.length} Worker{selectedWorkers.length > 1 ? 's' : ''}
        </Button>
      </div>
    </Card>
  );
}
