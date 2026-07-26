import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Check, X } from "lucide-react";

export default function VerificationActions({ onApprove, onReject, loading }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">Verification Decision</h3>
      
      <div className="mb-6">
        <Textarea 
          placeholder="Add verification comments (required for rejection)..." 
          rows={3} 
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 border-t border-gray-100 pt-6">
        <Button 
          variant="outline" 
          onClick={onReject} 
          disabled={loading}
          className="w-full sm:w-auto border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
        >
          <X className="mr-2 h-4 w-4" /> Reject Entry
        </Button>
        <Button 
          onClick={onApprove} 
          loading={loading}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
        >
          <Check className="mr-2 h-4 w-4" /> Approve Entry
        </Button>
      </div>
    </div>
  );
}
