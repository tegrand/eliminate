import Modal from "../modal/Modal";
import { Button } from "../button";
import { Ban } from "lucide-react";
import { useState } from "react";

export default function SuspendDialog({ isOpen, onClose, onConfirm, entityName, title = "Suspend Account" }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("A suspension reason is required.");
      return;
    }
    onConfirm(reason);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { setReason(""); setError(""); onClose(); }} title={title}>
      <div className="py-4">
        <div className="flex items-center gap-4 mb-4 text-orange-600 bg-orange-50 p-4 rounded-lg">
          <Ban className="h-8 w-8" />
          <p className="font-medium">You are about to suspend {entityName}.</p>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          This account will no longer be able to log in or access the platform. Please provide a reason.
        </p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Required)</label>
          <textarea 
            className={`w-full p-2 border rounded-md focus:ring-orange-500 focus:border-orange-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
            rows={3}
            placeholder="Enter reason for suspension..."
            value={reason}
            onChange={(e) => { setReason(e.target.value); setError(""); }}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => { setReason(""); setError(""); onClose(); }}>Cancel</Button>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleConfirm}>Suspend Account</Button>
        </div>
      </div>
    </Modal>
  );
}
