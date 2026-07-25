import { Modal } from "../modal/Modal";
import { Button } from "../button";
import { PlayCircle } from "lucide-react";
import { useState } from "react";

export default function ReactivateDialog({ isOpen, onClose, onConfirm, entityName, title = "Reactivate Account" }) {
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    onConfirm(note);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { setNote(""); onClose(); }} title={title}>
      <div className="py-4">
        <div className="flex items-center gap-4 mb-4 text-blue-600 bg-blue-50 p-4 rounded-lg">
          <PlayCircle className="h-8 w-8" />
          <p className="font-medium">You are about to reactivate {entityName}.</p>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          This will restore their access to the platform and set their status back to APPROVED/ACTIVE.
        </p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
          <textarea 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={2}
            placeholder="Enter an optional note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => { setNote(""); onClose(); }}>Cancel</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleConfirm}>Reactivate Account</Button>
        </div>
      </div>
    </Modal>
  );
}
