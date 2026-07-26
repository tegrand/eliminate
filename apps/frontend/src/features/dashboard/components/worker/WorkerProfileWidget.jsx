import { useState } from "react";
import { User, Activity, Building, MoreVertical } from "lucide-react";
import Switch from "../../../../components/ui/switch/Switch";
import { Modal } from "../../../../components/ui/modal/Modal";
import Button from "../../../../components/ui/button/Button";

export default function WorkerProfileWidget({ profile, onStatusChange }) {
  const isAvailable = profile.status === "ACTIVE";
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async () => {
    setIsUpdating(true);
    await onStatusChange(isAvailable ? "ON_LEAVE" : "ACTIVE");
    setIsUpdating(false);
    setConfirmModalOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col h-full">
      <div className="flex justify-between items-start mb-5">
        <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <User className="w-3.5 h-3.5" />
          </div>
          Worker Profile
        </h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreVertical className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-5 flex-1">
        {/* Profile Completion */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-slate-700">Profile Completion</span>
            <span className="text-base font-bold text-slate-900">{profile.completion}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${profile.completion}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          {/* Status */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                Current Status
              </div>
              <Switch 
                size="sm"
                checked={isAvailable}
                onChange={() => setConfirmModalOpen(true)}
              />
            </div>
            <div className="font-bold text-slate-900 capitalize text-[13px]">
              {profile.status === "ACTIVE" ? "Available" : profile.status.replace("_", " ").toLowerCase()}
            </div>
          </div>

          {/* Agency */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 mb-1.5">
              <Building className="w-3.5 h-3.5 text-blue-500" />
              Current Agency
            </div>
            <div className="font-bold text-slate-900 text-[13px] truncate" title={profile.currentAgency}>
              {profile.currentAgency}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={confirmModalOpen} 
        onClose={() => setConfirmModalOpen(false)}
        title="Change Status"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to change your status to 
            <span className="font-bold text-slate-900"> {isAvailable ? "Not Available (On Leave)" : "Available"}</span>?
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={() => setConfirmModalOpen(false)}>Cancel</Button>
            <Button 
              variant="primary"
              loading={isUpdating} 
              onClick={handleStatusChange}
            >
              Yes, Change Status
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
