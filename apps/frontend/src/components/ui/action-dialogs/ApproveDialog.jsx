import Modal from "../modal/Modal";
import { Button } from "../button";
import { CheckCircle } from "lucide-react";

export default function ApproveDialog({ isOpen, onClose, onConfirm, entityName, title = "Approve Account" }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="py-4">
        <div className="flex items-center gap-4 mb-4 text-green-600 bg-green-50 p-4 rounded-lg">
          <CheckCircle className="h-8 w-8" />
          <p className="font-medium">You are about to approve {entityName}.</p>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          This will grant them full access to the platform and their account status will be set to APPROVED.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={onConfirm}>Confirm Approval</Button>
        </div>
      </div>
    </Modal>
  );
}
