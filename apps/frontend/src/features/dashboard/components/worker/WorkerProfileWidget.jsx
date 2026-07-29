import { useState } from "react";
import { User, Activity, Building, MoreVertical, LogOut, Loader2, Star, CheckCircle, MessageSquare } from "lucide-react";
import { Modal } from "../../../../components/ui/modal/Modal";
import Button from "../../../../components/ui/button/Button";
import { toast } from "sonner";
import { workerApi } from "../../../../features/worker/api/worker.api";

export default function WorkerProfileWidget({ profile, onStatusChange }) {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(profile.status);

  const handleStatusChange = async () => {
    setIsUpdating(true);
    await onStatusChange(pendingStatus);
    setIsUpdating(false);
    setConfirmModalOpen(false);
  };

  const statusColors = {
    ACTIVE: 'bg-emerald-500',
    BUSY: 'bg-amber-500',
    ON_LEAVE: 'bg-orange-500',
    INACTIVE: 'bg-gray-500' // Offline
  };

  const statusLabels = {
    ACTIVE: 'Available',
    BUSY: 'Busy',
    ON_LEAVE: 'On Leave',
    INACTIVE: 'Offline'
  };

  const verificationColors = {
    VERIFIED: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    PENDING: 'bg-amber-50 text-amber-600 border-amber-200',
    REJECTED: 'bg-red-50 text-red-600 border-red-200'
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
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-lg font-black text-slate-900 flex items-center gap-1">
              {profile.averageRating > 0 ? profile.averageRating : "-"}
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Rating</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center border-l border-gray-100">
            <span className="text-lg font-black text-slate-900">{profile.totalReviews}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Reviews</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center border-l border-gray-100">
            <span className="text-lg font-black text-slate-900">{profile.completedJobs}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Jobs</span>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="space-y-4">
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
          
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="text-xs font-semibold text-gray-600">Verification Status</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${verificationColors[profile.verificationStatus] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
              {profile.verificationStatus || 'PENDING'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          {/* Status */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 mb-2">
              <span className={`w-2 h-2 rounded-full ${statusColors[profile.status] || 'bg-gray-500'}`} />
              Current Status
            </div>
            <select
              value={profile.status}
              onChange={(e) => {
                setPendingStatus(e.target.value);
                setConfirmModalOpen(true);
              }}
              className="w-full font-bold text-slate-900 text-[12px] bg-transparent outline-none cursor-pointer focus:ring-2 focus:ring-indigo-100 rounded"
            >
              <option value="ACTIVE">Available</option>
              <option value="BUSY">Busy</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="INACTIVE">Offline</option>
            </select>
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
            {profile.currentAgencyId && (
              <button
                onClick={async () => {
                  if (window.confirm("Are you sure you want to request to leave this agency?")) {
                    setIsLeaving(true);
                    try {
                      await workerApi.leaveAgency(profile.currentAgencyId);
                      toast.success("Leave request sent to agency");
                    } catch (error) {
                      toast.error("Failed to request leave");
                    } finally {
                      setIsLeaving(false);
                    }
                  }
                }}
                disabled={isLeaving}
                className="mt-2 text-[10px] flex items-center justify-center gap-1 w-full py-1.5 bg-red-50 text-red-600 rounded font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {isLeaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <LogOut className="w-3 h-3" />}
                Leave Agency
              </button>
            )}
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
            <span className="font-bold text-slate-900"> {statusLabels[pendingStatus]}</span>?
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setConfirmModalOpen(false)} className="w-full">Cancel</Button>
            <Button onClick={handleStatusChange} isLoading={isUpdating} className="w-full">
              Confirm Change
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
