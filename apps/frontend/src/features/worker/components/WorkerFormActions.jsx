import { Button } from "../../../components/ui/button";

export default function WorkerFormActions({ onCancel, loading }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-gray-200">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={loading}
        className="w-full sm:w-auto"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        variant="secondary"
        disabled={loading}
        className="w-full sm:w-auto"
      >
        Save & New
      </Button>
      <Button 
        type="submit" 
        loading={loading}
        className="w-full sm:w-auto"
      >
        Save Worker
      </Button>
    </div>
  );
}
