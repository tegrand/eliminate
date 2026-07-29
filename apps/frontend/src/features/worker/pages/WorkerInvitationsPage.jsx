import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, CheckCircle2, XCircle, Building2, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { workerApi } from "../api/worker.api";
import Button from "../../../components/ui/button/Button";

export default function WorkerInvitationsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("jobs"); // 'jobs' or 'agencies'

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
              <div key={invite.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{invite.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                    <span className="font-medium text-indigo-600">
                      {invite.client ? `Client: ${invite.client.clientCode}` : invite.agency ? `Agency: ${invite.agency.agencyName}` : "Direct Invite"}
                    </span>
                    {invite.proposedRate && <span>• ₹{invite.proposedRate}</span>}
                  </div>
                  {invite.description && <p className="mt-2 text-sm text-slate-600">{invite.description}</p>}
                </div>
                
                <div className="flex gap-2 shrink-0">
                  <Button 
                    variant="outline"
                    className="text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300"
                    onClick={() => rejectJobMutation.mutate(invite.id)}
                    isLoading={rejectJobMutation.isPending && rejectJobMutation.variables === invite.id}
                    disabled={acceptJobMutation.isPending || rejectJobMutation.isPending}
                  >
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Reject
                  </Button>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                    onClick={() => acceptJobMutation.mutate(invite.id)}
                    isLoading={acceptJobMutation.isPending && acceptJobMutation.variables === invite.id}
                    disabled={acceptJobMutation.isPending || rejectJobMutation.isPending}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Accept
                  </Button>
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
              <div key={invite.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{invite.agency?.agencyName}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                    <span>Contact: {invite.agency?.contactPerson || "N/A"}</span>
                    <span>• {invite.agency?.phone || "No phone"}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 shrink-0">
                  <Button 
                    variant="outline"
                    className="text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300"
                    onClick={() => rejectAgencyMutation.mutate(invite.agencyId)}
                    isLoading={rejectAgencyMutation.isPending && rejectAgencyMutation.variables === invite.agencyId}
                    disabled={acceptAgencyMutation.isPending || rejectAgencyMutation.isPending}
                  >
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Reject
                  </Button>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                    onClick={() => acceptAgencyMutation.mutate(invite.agencyId)}
                    isLoading={acceptAgencyMutation.isPending && acceptAgencyMutation.variables === invite.agencyId}
                    disabled={acceptAgencyMutation.isPending || rejectAgencyMutation.isPending}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Accept
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
