import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, CheckCircle2, XCircle, Building2, Briefcase, Eye, Calendar, DollarSign, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { workerApi } from "../api/worker.api";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal/Modal";

export default function WorkerInvitationsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("jobs"); // 'jobs' or 'agencies'
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const openDetails = (invite) => {
    setSelectedInvite(invite);
    setIsDetailsModalOpen(true);
  };

  // Fetch Job Invitations
  const { data: jobInvitesData, isLoading: loadingJobs } = useQuery({
    queryKey: ["workerJobInvitations"],
    queryFn: async () => {
      const res = await workerApi.getMyJobInvitations();
      return res.data ?? res;
    }
  });

  // Fetch Agency Invitations
  const { data: agencyInvitesData, isLoading: loadingAgencies } = useQuery({
    queryKey: ["workerAgencyInvitations"],
    queryFn: async () => {
      const res = await workerApi.getMyAgencies();
      return res.data ?? res;
    }
  });

  const jobInvitations = Array.isArray(jobInvitesData) ? jobInvitesData : [];
  
  // Filter for pending agency invitations
  const agencyInvitations = Array.isArray(agencyInvitesData) 
    ? agencyInvitesData.filter(a => a.status === "INVITED") 
    : [];

  // Mutations for Jobs
  const acceptJobMutation = useMutation({
    mutationFn: (id) => workerApi.acceptJobInvitation(id),
    onSuccess: () => {
      toast.success("Job invitation accepted!");
      queryClient.invalidateQueries(["workerJobInvitations"]);
    },
    onError: () => toast.error("Failed to accept job invitation")
  });

  const rejectJobMutation = useMutation({
    mutationFn: (id) => workerApi.rejectJobInvitation(id),
    onSuccess: () => {
      toast.success("Job invitation rejected");
      queryClient.invalidateQueries(["workerJobInvitations"]);
    },
    onError: () => toast.error("Failed to reject job invitation")
  });

  // Mutations for Agencies
  const acceptAgencyMutation = useMutation({
    mutationFn: (agencyId) => workerApi.acceptAgencyInvitation(agencyId),
    onSuccess: () => {
      toast.success("Agency invitation accepted!");
      queryClient.invalidateQueries(["workerAgencyInvitations"]);
      queryClient.invalidateQueries(["dashboard"]); // update dashboard profile agency
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to accept agency invitation")
  });

  const rejectAgencyMutation = useMutation({
    mutationFn: (agencyId) => workerApi.rejectAgencyInvitation(agencyId),
    onSuccess: () => {
      toast.success("Agency invitation rejected");
      queryClient.invalidateQueries(["workerAgencyInvitations"]);
    },
    onError: () => toast.error("Failed to reject agency invitation")
  });

  const isLoading = loadingJobs || loadingAgencies;

  return (
    <div className="w-full max-w-5xl mx-auto py-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Invitations</h1>
        <p className="text-sm text-slate-500 mt-1">Review and respond to job and agency requests</p>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("jobs")}
          className={`py-3 px-6 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "jobs" 
              ? "border-indigo-600 text-indigo-600" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Job Invitations
          {jobInvitations.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">
              {jobInvitations.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("agencies")}
          className={`py-3 px-6 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "agencies" 
              ? "border-indigo-600 text-indigo-600" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Agency Invitations
          {agencyInvitations.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">
              {agencyInvitations.length}
            </span>
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : activeTab === "jobs" ? (
        // Job Invitations Tab
        <div className="space-y-4">
          {jobInvitations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Job Invitations</h3>
              <p className="text-slate-500">You don't have any pending job invitations right now.</p>
            </div>
          ) : (
            jobInvitations.map(invite => (
              <div key={invite.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-tight">{invite.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-1.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5 font-medium text-slate-700">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          {invite.client ? invite.client.clientCode : invite.agency ? invite.agency.agencyName : "Direct Invite"}
                        </span>
                        {invite.proposedRate && (
                          <span className="flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4 text-slate-400" />
                            ₹{invite.proposedRate}
                          </span>
                        )}
                        {invite.startDate && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {new Date(invite.startDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {invite.description && <p className="mt-3 text-sm text-slate-600 line-clamp-2">{invite.description}</p>}
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4 mt-4 md:mt-0">
                    <Button 
                      size="sm"
                      variant="outline"
                      className="text-slate-600 border-slate-200 hover:bg-slate-50 w-full md:w-auto flex justify-center"
                      onClick={() => openDetails(invite)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      Details
                    </Button>
                    <div className="flex gap-2 w-full md:w-auto">
                      <Button 
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300 flex-1 md:flex-none justify-center"
                        onClick={() => rejectJobMutation.mutate(invite.id)}
                        loading={rejectJobMutation.isPending && rejectJobMutation.variables === invite.id}
                        disabled={acceptJobMutation.isPending || rejectJobMutation.isPending}
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1.5 md:mr-0 lg:mr-1.5" />
                        <span className="md:hidden lg:inline">Reject</span>
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 flex-1 md:flex-none justify-center"
                        onClick={() => acceptJobMutation.mutate(invite.id)}
                        loading={acceptJobMutation.isPending && acceptJobMutation.variables === invite.id}
                        disabled={acceptJobMutation.isPending || rejectJobMutation.isPending}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 md:mr-0 lg:mr-1.5" />
                        <span className="md:hidden lg:inline">Accept</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        // Agency Invitations Tab
        <div className="space-y-4">
          {agencyInvitations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Agency Invitations</h3>
              <p className="text-slate-500">Agencies can invite you to join their workforce. You'll see them here.</p>
            </div>
          ) : (
            agencyInvitations.map(invite => (
              <div key={invite.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-tight">{invite.agency?.agencyName}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-1.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5 font-medium text-slate-700">
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          Agency Invite
                        </span>
                        <span className="flex items-center gap-1.5">
                          Contact: {invite.agency?.contactPerson || "N/A"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          {invite.agency?.phone || "No phone"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4 mt-4 md:mt-0">
                    <Button 
                      size="sm"
                      variant="outline"
                      className="text-slate-600 border-slate-200 hover:bg-slate-50 w-full md:w-auto flex justify-center"
                      onClick={() => openDetails({ ...invite, isAgencyInvite: true })}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      Details
                    </Button>
                    <div className="flex gap-2 w-full md:w-auto">
                      <Button 
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300 flex-1 md:flex-none justify-center"
                        onClick={() => rejectAgencyMutation.mutate(invite.agencyId)}
                        loading={rejectAgencyMutation.isPending && rejectAgencyMutation.variables === invite.agencyId}
                        disabled={acceptAgencyMutation.isPending || rejectAgencyMutation.isPending}
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1.5 md:mr-0 lg:mr-1.5" />
                        <span className="md:hidden lg:inline">Reject</span>
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 flex-1 md:flex-none justify-center"
                        onClick={() => acceptAgencyMutation.mutate(invite.agencyId)}
                        loading={acceptAgencyMutation.isPending && acceptAgencyMutation.variables === invite.agencyId}
                        disabled={acceptAgencyMutation.isPending || rejectAgencyMutation.isPending}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 md:mr-0 lg:mr-1.5" />
                        <span className="md:hidden lg:inline">Accept</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Details Modal */}
      <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Invitation Details" className="sm:max-w-xl">
        {selectedInvite && (
          <div className="p-6">
            {!selectedInvite.isAgencyInvite ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedInvite.title}</h3>
                  <p className="text-sm font-medium text-indigo-600 mt-1">
                    {selectedInvite.client ? `Client: ${selectedInvite.client.clientCode}` : selectedInvite.agency ? `Agency: ${selectedInvite.agency.agencyName}` : "Direct Invite"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {selectedInvite.proposedRate && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Proposed Rate</p>
                      <p className="font-bold text-slate-900 flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-slate-400" /> ₹{selectedInvite.proposedRate}</p>
                    </div>
                  )}
                  {selectedInvite.startDate && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Start Date</p>
                      <p className="font-bold text-slate-900 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> {new Date(selectedInvite.startDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                {selectedInvite.description && (
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</p>
                    <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-wrap">
                      {selectedInvite.description}
                    </div>
                  </div>
                )}
                
                {selectedInvite.notes && (
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Additional Notes</p>
                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-wrap">{selectedInvite.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedInvite.agency?.agencyName}</h3>
                  <p className="text-sm font-medium text-indigo-600 mt-1 flex items-center gap-1.5"><Building2 className="w-4 h-4" /> Agency Invitation</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Contact Person</p>
                    <p className="font-bold text-slate-900">{selectedInvite.agency?.contactPerson || "N/A"}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone Number</p>
                    <p className="font-bold text-slate-900">{selectedInvite.agency?.phone || "N/A"}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-4 flex justify-end gap-3 border-t border-slate-100">
              <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
