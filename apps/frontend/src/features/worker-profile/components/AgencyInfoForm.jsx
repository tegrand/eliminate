import { useState, useEffect } from "react";
import { Building, CheckCircle, XCircle, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../../api/axios";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal/Modal";

export default function AgencyInfoForm({ data, hideHeader }) {
  const [agenciesData, setAgenciesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: "", agencyId: null, agencyName: "" });

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const res = await api.get("/workers/my-profile/agencies");
      setAgenciesData(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch agency information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  const handleAction = async () => {
    const { type, agencyId } = confirmModal;
    try {
      setActionLoading(true);
      if (type === "ACCEPT") {
        await api.post(`/workers/my-profile/agencies/${agencyId}/accept`);
        toast.success("Agency invitation accepted");
      } else if (type === "REJECT") {
        await api.post(`/workers/my-profile/agencies/${agencyId}/reject`);
        toast.success("Agency invitation rejected");
      } else if (type === "LEAVE") {
        await api.post(`/workers/my-profile/agencies/${agencyId}/leave`);
        toast.success("Left agency successfully");
      }
      setConfirmModal({ isOpen: false, type: "", agencyId: null, agencyName: "" });
      await fetchAgencies();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${type.toLowerCase()} agency`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const { activeAgency, invitations } = agenciesData || {};

  return (
    <div className="space-y-8 animate-fade-in">
      {!hideHeader && (
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Agency Relationship</h2>
            <p className="text-sm text-slate-500 mt-1">Manage your agency associations and invitations</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Active Agency Section */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-500" />
            Current Agency
          </h3>
          
          {activeAgency ? (
            <div className="bg-white border border-indigo-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 opacity-50" />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{activeAgency.agencyName}</h4>
                  <p className="text-sm text-slate-500 font-medium">{activeAgency.agencyCode}</p>
                  
                  <div className="mt-4 space-y-1">
                    <p className="text-sm text-slate-600"><span className="font-medium">Contact:</span> {activeAgency.contactPerson || "N/A"}</p>
                    <p className="text-sm text-slate-600"><span className="font-medium">Email:</span> {activeAgency.email || "N/A"}</p>
                    <p className="text-sm text-slate-600"><span className="font-medium">Phone:</span> {activeAgency.phone || "N/A"}</p>
                    <p className="text-sm text-slate-600"><span className="font-medium">Joined:</span> {new Date(activeAgency.joinedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                  onClick={() => setConfirmModal({ isOpen: true, type: "LEAVE", agencyId: activeAgency.agencyId, agencyName: activeAgency.agencyName })}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Leave Agency
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 text-center">
              <Building className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">No Active Agency</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                You are currently working as an independent worker. If you have been invited by an agency, you can accept their invitation below.
              </p>
            </div>
          )}
        </div>

        {/* Invitations Section */}
        {invitations && invitations.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Pending Invitations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {invitations.map(inv => (
                <div key={inv.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-indigo-200 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900">{inv.agencyName}</h4>
                      <p className="text-xs text-slate-500 font-medium">Code: {inv.agencyCode}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded uppercase tracking-wider">
                      Pending
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">Invited on {new Date(inv.invitedAt).toLocaleDateString()}</p>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="primary" 
                      className="flex-1"
                      onClick={() => setConfirmModal({ isOpen: true, type: "ACCEPT", agencyId: inv.agencyId, agencyName: inv.agencyName })}
                    >
                      <CheckCircle className="w-4 h-4 mr-1.5" /> Accept
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 text-slate-600"
                      onClick={() => setConfirmModal({ isOpen: true, type: "REJECT", agencyId: inv.agencyId, agencyName: inv.agencyName })}
                    >
                      <XCircle className="w-4 h-4 mr-1.5" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={confirmModal.isOpen} 
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        title={
          confirmModal.type === "ACCEPT" ? "Accept Invitation" : 
          confirmModal.type === "REJECT" ? "Reject Invitation" : "Leave Agency"
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            {confirmModal.type === "ACCEPT" && (
              <>Are you sure you want to accept the invitation from <span className="font-bold text-slate-900">{confirmModal.agencyName}</span>? By accepting, you will become part of this agency.</>
            )}
            {confirmModal.type === "REJECT" && (
              <>Are you sure you want to reject the invitation from <span className="font-bold text-slate-900">{confirmModal.agencyName}</span>?</>
            )}
            {confirmModal.type === "LEAVE" && (
              <>Are you sure you want to leave <span className="font-bold text-slate-900">{confirmModal.agencyName}</span>? You will revert to being an independent worker.</>
            )}
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}>Cancel</Button>
            <Button 
              variant={confirmModal.type === "LEAVE" || confirmModal.type === "REJECT" ? "outline" : "primary"}
              className={confirmModal.type === "LEAVE" ? "text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300" : ""}
              loading={actionLoading}
              onClick={handleAction}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
