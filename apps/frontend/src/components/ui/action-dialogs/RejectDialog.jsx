import { Modal } from "../modal/Modal";
import { Button } from "../button";
import { XCircle } from "lucide-react";
import { useState } from "react";

export default function RejectDialog({ isOpen, onClose, onConfirm, entityName, title = "Reject Account" }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("A rejection reason is required.");
      return;
    }
    onConfirm(reason);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { setReason(""); setError(""); onClose(); }} title={title}>
      <div className="py-4">
        <div className="flex items-center gap-4 mb-4 text-red-600 bg-red-50 p-4 rounded-lg">
          <XCircle className="h-8 w-8" />
          <p className="font-medium">You are about to reject {entityName}.</p>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Please provide a reason for rejection. This reason will be recorded in the audit log.
        </p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Required)</label>
          <textarea 
            className={`w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
            rows={3}
            placeholder="Enter reason for rejection..."
            value={reason}
            onChange={(e) => { setReason(e.target.value); setError(""); }}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => { setReason(""); setError(""); onClose(); }}>Cancel</Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleConfirm}>Reject Account</Button>
        </div>
      </div>
    </Modal>
  );
}
