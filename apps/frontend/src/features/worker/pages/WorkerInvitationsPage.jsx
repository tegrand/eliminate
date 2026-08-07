import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, CheckCircle2, XCircle, Building2, Briefcase, Eye, Calendar, DollarSign, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { workerApi } from "../api/worker.api";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal/Modal";

export default function WorkerInvitationsPage() {
  const queryClient = useQueryClient();
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsTab, setDetailsTab] = useState("overview");

  const openDetails = (invite) => {
    setSelectedInvite(invite);
    setDetailsTab("overview");
    setIsDetailsModalOpen(true);
  };

  // Fetch Job Invitations
  const { data: jobInvitesData, isLoading } = useQuery({
    queryKey: ["workerJobInvitations"],
    queryFn: async () => {
      const res = await workerApi.getMyJobInvitations();
      return res.data ?? res;
    }
  });

  const jobInvitations = Array.isArray(jobInvitesData) ? jobInvitesData : [];

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

  return (
    <div className="w-full max-w-5xl mx-auto py-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Invitations</h1>
        <p className="text-sm text-slate-500 mt-1">Review and respond to job requests</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
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
                          {invite.client ? invite.client.clientCode : "Direct Invite"}
                        </span>
                        {invite.proposedRate && (
                          <span className="flex items-center gap-1 shrink-0">
                            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                            ?{invite.proposedRate}
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
      )}

      {/* Details Modal */}
      <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Invitation Details" className="sm:max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        {selectedInvite && (
          <div className="p-4 overflow-y-auto max-h-full scrollbar-hide">
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedInvite.title}</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                  <p className="text-sm font-medium text-indigo-600 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    {selectedInvite.client?.companyName || selectedInvite.client?.clientCode ? `Client: ${selectedInvite.client?.companyName || selectedInvite.client?.clientCode}` : "Direct Invite"}
                  </p>
                  <span className="hidden sm:inline text-slate-300">•</span>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Invited: {new Date(selectedInvite.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex border-b border-slate-200">
                <button 
                  onClick={() => setDetailsTab("overview")}
                  className="px-4 py-2 text-xs font-semibold"
                >
                  Overview
                </button>
                <button 
                  onClick={() => setDetailsTab("details")}
                  className="px-4 py-2 text-xs font-semibold"
                >
                  Description & Notes
                </button>
              </div>

              {detailsTab === "overview" && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(selectedInvite.proposedRate || selectedInvite.jobRequirement?.salaryAmount) && (
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Proposed Rate</p>
                        <p className="font-bold text-slate-900 flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-emerald-500" /> ?{selectedInvite.proposedRate || selectedInvite.jobRequirement?.salaryAmount}</p>
                      </div>
                    )}
                    {(selectedInvite.startDate || selectedInvite.jobRequirement?.startDate) && (
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Start Date</p>
                        <p className="font-bold text-slate-900 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-indigo-400" /> {new Date(selectedInvite.startDate || selectedInvite.jobRequirement.startDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {(selectedInvite.endDate || selectedInvite.jobRequirement?.endDate) && (
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">End Date</p>
                        <p className="font-bold text-slate-900 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-red-400" /> {new Date(selectedInvite.endDate || selectedInvite.jobRequirement.endDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {(selectedInvite.phoneNumber || selectedInvite.client?.phone) && (
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Contact Phone</p>
                        <p className="font-bold text-slate-900">{selectedInvite.phoneNumber || selectedInvite.client?.phone}</p>
                      </div>
                    )}
                    {selectedInvite.client?.contactPerson && (
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Contact Person</p>
                        <p className="font-bold text-slate-900">{selectedInvite.client.contactPerson}</p>
                      </div>
                    )}
                    {(selectedInvite.location || selectedInvite.jobRequirement?.locationId || selectedInvite.jobRequirement?.location) && (() => {
                      const loc = selectedInvite.location || selectedInvite.jobRequirement?.locationId || selectedInvite.jobRequirement?.location;
                      const isLink = loc.startsWith('http://') || loc.startsWith('https://');
                      return (
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 sm:col-span-2">
                          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Work Location</p>
                          {isLink ? (
                            <a href={loc} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 rounded-md text-xs font-semibold transition-colors w-fit">
                              <MapPin className="w-3.5 h-3.5" />
                              Open in Google Maps
                            </a>
                          ) : (
                            <p className="font-bold text-slate-900 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-rose-500" /> {loc}</p>
                          )}
                        </div>
                      );
                    })()}
                    {selectedInvite.jobRequirement?.requiredWorkers && (
                      <>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Required Workers</p>
                          <p className="font-bold text-slate-900">{selectedInvite.jobRequirement.requiredWorkers}</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Assigned Workers</p>
                          <p className="font-bold text-slate-900">{selectedInvite.jobRequirement.assignedCount || 0}</p>
                        </div>
                      </>
                    )}
                    {selectedInvite.jobRequirement?.shift && (
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Shift</p>
                        <p className="font-bold text-slate-900">{selectedInvite.jobRequirement.shift}</p>
                      </div>
                    )}
                    {(selectedInvite.jobRequirement?.startTime || selectedInvite.jobRequirement?.endTime) && (
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Timings</p>
                        <p className="font-bold text-slate-900">{selectedInvite.jobRequirement?.startTime || '-'} to {selectedInvite.jobRequirement?.endTime || '-'}</p>
                      </div>
                    )}
                    {selectedInvite.jobRequirement?.experienceRequired && (
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Experience Reqd</p>
                        <p className="font-bold text-slate-900">{selectedInvite.jobRequirement.experienceRequired}</p>
                      </div>
                    )}
                    {selectedInvite.jobRequirement?.duration && (
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Duration</p>
                        <p className="font-bold text-slate-900">{selectedInvite.jobRequirement.duration}</p>
                      </div>
                    )}
                    {selectedInvite.jobRequirement?.genderPreference && (
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Gender Pref.</p>
                        <p className="font-bold text-slate-900">{selectedInvite.jobRequirement.genderPreference}</p>
                      </div>
                    )}
                  </div>

                  {selectedInvite.jobRequirement && (selectedInvite.jobRequirement.accommodation || selectedInvite.jobRequirement.food || selectedInvite.jobRequirement.transport) && (
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Facilities Provided</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedInvite.jobRequirement.accommodation && <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">Accommodation</span>}
                        {selectedInvite.jobRequirement.food && <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-medium border border-amber-100">Food</span>}
                        {selectedInvite.jobRequirement.transport && <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium border border-emerald-100">Transport</span>}
                      </div>
                    </div>
                  )}
                </>
              )}

              {detailsTab === "details" && (
                <div className="space-y-4">
                  {(selectedInvite.description || selectedInvite.jobRequirement?.description) && (
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Description</p>
                      <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100 whitespace-pre-wrap">
                        {selectedInvite.description || selectedInvite.jobRequirement?.description}
                      </div>
                    </div>
                  )}
                  
                  {selectedInvite.notes && (
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Additional Notes</p>
                      <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100 whitespace-pre-wrap">{selectedInvite.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

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
