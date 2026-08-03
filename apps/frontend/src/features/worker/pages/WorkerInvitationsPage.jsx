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
      queryClient.invalidateQueries(["workerAssignments"]);
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
              <div key={invite.id} className="group bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-200 p-3.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50/80 flex items-center justify-center shrink-0 text-indigo-600 border border-indigo-100/50">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">{invite.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-[13px] text-slate-500">
                        <span className="flex items-center gap-1.5 truncate">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {invite.client ? invite.client.clientCode : invite.agency ? invite.agency.agencyName : "Direct Invite"}
                        </span>
                        {invite.proposedRate && (
                          <span className="flex items-center gap-1 shrink-0">
                            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                            ₹{invite.proposedRate}
                          </span>
                        )}
                        {invite.startDate && (
                          <span className="flex items-center gap-1 shrink-0">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(invite.startDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <Button 
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-xs font-medium text-slate-600 bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm w-full sm:w-auto"
                      onClick={() => openDetails(invite)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      Details
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-xs font-medium text-red-600 bg-white border-red-200 hover:bg-red-50 hover:border-red-300 shadow-sm w-full sm:w-auto"
                      onClick={() => rejectJobMutation.mutate(invite.id)}
                      loading={rejectJobMutation.isPending && rejectJobMutation.variables === invite.id}
                      disabled={acceptJobMutation.isPending || rejectJobMutation.isPending}
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1.5" />
                      Reject
                    </Button>
                    <Button 
                      size="sm"
                      className="h-8 px-3 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border-transparent w-full sm:w-auto"
                      onClick={() => acceptJobMutation.mutate(invite.id)}
                      loading={acceptJobMutation.isPending && acceptJobMutation.variables === invite.id}
                      disabled={acceptJobMutation.isPending || rejectJobMutation.isPending}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      Accept
                    </Button>
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
              <div key={invite.id} className="group bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-200 p-3.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-blue-50/80 flex items-center justify-center shrink-0 text-blue-600 border border-blue-100/50">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">{invite.agency?.agencyName}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-[13px] text-slate-500">
                        <span className="flex items-center gap-1.5 shrink-0">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          Agency Invite
                        </span>
                        <span className="flex items-center gap-1.5 truncate">
                          Contact: {invite.agency?.contactPerson || "N/A"}
                        </span>
                        <span className="flex items-center gap-1.5 shrink-0">
                          {invite.agency?.phone || "No phone"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <Button 
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-xs font-medium text-slate-600 bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm w-full sm:w-auto"
                      onClick={() => openDetails({ ...invite, isAgencyInvite: true })}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      Details
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-xs font-medium text-red-600 bg-white border-red-200 hover:bg-red-50 hover:border-red-300 shadow-sm w-full sm:w-auto"
                      onClick={() => rejectAgencyMutation.mutate(invite.agencyId)}
                      loading={rejectAgencyMutation.isPending && rejectAgencyMutation.variables === invite.agencyId}
                      disabled={acceptAgencyMutation.isPending || rejectAgencyMutation.isPending}
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1.5" />
                      Reject
                    </Button>
                    <Button 
                      size="sm"
                      className="h-8 px-3 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border-transparent w-full sm:w-auto"
                      onClick={() => acceptAgencyMutation.mutate(invite.agencyId)}
                      loading={acceptAgencyMutation.isPending && acceptAgencyMutation.variables === invite.agencyId}
                      disabled={acceptAgencyMutation.isPending || rejectAgencyMutation.isPending}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      Accept
                    </Button>
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
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                    <p className="text-sm font-medium text-indigo-600 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      {selectedInvite.client?.companyName || selectedInvite.client?.clientCode ? `Client: ${selectedInvite.client.companyName || selectedInvite.client.clientCode}` : selectedInvite.agency ? `Agency: ${selectedInvite.agency.agencyName}` : "Direct Invite"}
                    </p>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <p className="text-sm text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      Invited: {new Date(selectedInvite.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {selectedInvite.proposedRate && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Proposed Rate</p>
                      <p className="font-bold text-slate-900 flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-emerald-500" /> ₹{selectedInvite.proposedRate}</p>
                    </div>
                  )}
                  {selectedInvite.startDate && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Start Date</p>
                      <p className="font-bold text-slate-900 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-indigo-400" /> {new Date(selectedInvite.startDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedInvite.endDate && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">End Date</p>
                      <p className="font-bold text-slate-900 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-red-400" /> {new Date(selectedInvite.endDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedInvite.jobRequirement?.requiredWorkers && (
                    <>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Required Workers</p>
                        <p className="font-bold text-slate-900">{selectedInvite.jobRequirement.requiredWorkers}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Assigned Workers</p>
                        <p className="font-bold text-slate-900">{selectedInvite.jobRequirement.assignedCount || 0}</p>
                      </div>
                    </>
                  )}
                  {selectedInvite.jobRequirement?.shift && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Shift</p>
                      <p className="font-bold text-slate-900">{selectedInvite.jobRequirement.shift}</p>
                    </div>
                  )}
                  {(selectedInvite.jobRequirement?.startTime || selectedInvite.jobRequirement?.endTime) && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Timings</p>
                      <p className="font-bold text-slate-900">{selectedInvite.jobRequirement?.startTime || '-'} to {selectedInvite.jobRequirement?.endTime || '-'}</p>
                    </div>
                  )}
                  {selectedInvite.jobRequirement?.experienceRequired && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Experience Reqd</p>
                      <p className="font-bold text-slate-900">{selectedInvite.jobRequirement.experienceRequired}</p>
                    </div>
                  )}
                  {selectedInvite.jobRequirement?.duration && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Duration</p>
                      <p className="font-bold text-slate-900">{selectedInvite.jobRequirement.duration}</p>
                    </div>
                  )}
                  {selectedInvite.jobRequirement?.genderPreference && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Gender Pref.</p>
                      <p className="font-bold text-slate-900">{selectedInvite.jobRequirement.genderPreference}</p>
                    </div>
                  )}
                </div>

                {selectedInvite.jobRequirement && (selectedInvite.jobRequirement.accommodation || selectedInvite.jobRequirement.food || selectedInvite.jobRequirement.transport) && (
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Facilities Provided</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedInvite.jobRequirement.accommodation && <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">Accommodation</span>}
                      {selectedInvite.jobRequirement.food && <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-medium border border-amber-100">Food</span>}
                      {selectedInvite.jobRequirement.transport && <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium border border-emerald-100">Transport</span>}
                    </div>
                  </div>
                )}

                {(selectedInvite.description || selectedInvite.jobRequirement?.description) && (
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</p>
                    <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-wrap">
                      {selectedInvite.description || selectedInvite.jobRequirement?.description}
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
                  <h3 className="text-xl font-bold text-slate-900">{selectedInvite.agency?.agencyName || selectedInvite.agencyName}</h3>
                  <p className="text-sm font-medium text-indigo-600 mt-1 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" /> 
                    Agency Invitation {selectedInvite.agencyCode || selectedInvite.agency?.agencyCode ? `(${selectedInvite.agencyCode || selectedInvite.agency?.agencyCode})` : ""}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Contact Person</p>
                    <p className="font-bold text-slate-900">{selectedInvite.agency?.contactPerson || selectedInvite.contactPerson || "Not provided"}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone Number</p>
                    <p className="font-bold text-slate-900">{selectedInvite.agency?.phone || selectedInvite.phone || "Not provided"}</p>
                  </div>
                  {(selectedInvite.agency?.email || selectedInvite.email) && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</p>
                      <p className="font-bold text-slate-900">{selectedInvite.agency?.email || selectedInvite.email}</p>
                    </div>
                  )}
                  {(selectedInvite.invitedAt || selectedInvite.createdAt) && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Invited On</p>
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(selectedInvite.invitedAt || selectedInvite.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
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
