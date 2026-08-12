import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, Briefcase, Calendar, MapPin, DollarSign, 
  User, Building2, Phone, Mail, FileText, CheckCircle, 
  XCircle, Clock, Loader2, Hash, Users, AlertCircle,
  ClipboardList, CreditCard, Link as LinkIcon
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { useAuth } from "../../../hooks/useAuth";
import AssignWorkersPanel from "../components/AssignWorkersPanel";

const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-start justify-between py-2.5 border-b border-gray-100 last:border-0 gap-4">
    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium shrink-0">
      {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
      {label}
    </div>
    <span className="text-sm font-semibold text-gray-800 text-right">{value || <span className="text-gray-400 font-normal italic">Not specified</span>}</span>
  </div>
);

export default function HiringRequestDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const isClient = user?.profileType === "CLIENT";

  const { data: request, isLoading, error } = useQuery({
    queryKey: ["hiringRequest", id],
    queryFn: async () => {
      const res = await api.get(`/hiring-requests/${id}`);
      return res.data?.data || res.data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status }) => api.patch(`/hiring-requests/${id}/status`, { status }),
    onSuccess: (data, variables) => {
      toast.success(`Request ${variables.status.toLowerCase()} successfully!`);
      queryClient.invalidateQueries(["hiringRequest", id]);
      queryClient.invalidateQueries(["hiringRequests"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update request");
    }
  });

  const handleUpdateStatus = (status) => {
    if (window.confirm(`Are you sure you want to ${status.toLowerCase()} this request?`)) {
      updateStatusMutation.mutate({ status });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <XCircle className="w-14 h-14 text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Request Not Found</h2>
        <p className="text-gray-500 max-w-md mb-6 text-sm">The hiring request does not exist or you do not have permission to view it.</p>
        <button onClick={() => navigate(-1)} className="px-5 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-sm">
          Go Back
        </button>
      </div>
    );
  }

  const clientName = request.client?.companyName 
    || `${request.client?.user?.firstName || ''} ${request.client?.user?.lastName || ''}`.trim() 
    || 'Unknown Client';

  const targetName = request.targetAgencyId 
    ? (request.agency?.agencyName || `${request.agency?.user?.firstName || ''} ${request.agency?.user?.lastName || ''}`.trim())
    : (`${request.worker?.user?.firstName || ''} ${request.worker?.user?.lastName || ''}`.trim());

  const targetEmail = request.targetAgencyId 
    ? request.agency?.user?.email 
    : request.worker?.user?.email;

  const targetPhone = request.targetAgencyId
    ? request.agency?.phone
    : request.worker?.user?.phone;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'ACCEPTED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PAYMENT_PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'COMPLETED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'REJECTED': 
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const statusLabel = {
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    PAYMENT_PENDING: 'Payment Pending',
    COMPLETED: 'Completed',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled',
  }[request.status] || request.status;

  return (
    <div className="max-w-5xl mx-auto w-full animate-fade-in pb-10">
      
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Requests
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2">
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyle(request.status)}`}>
                {statusLabel}
              </span>
              {request.jobRequirement?.requirementCode && (
                <span className="text-xs text-gray-400 font-mono">#{request.jobRequirement.requirementCode}</span>
              )}
            </div>
            <h1 className="text-xl font-bold text-gray-900 truncate">{request.title}</h1>
            <p className="text-xs text-gray-400 mt-1">
              Requested on {new Date(request.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {request.status === 'PENDING' && !isClient && (
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => handleUpdateStatus('REJECTED')}
                disabled={updateStatusMutation.isPending}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold text-sm rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
              <button 
                onClick={() => handleUpdateStatus('ACCEPTED')}
                disabled={updateStatusMutation.isPending}
                className="px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" /> Accept
              </button>
            </div>
          )}

          {request.status === 'PENDING' && isClient && (
            <button 
              onClick={() => handleUpdateStatus('CANCELLED')}
              disabled={updateStatusMutation.isPending}
              className="px-4 py-2 bg-white border-2 border-red-100 text-red-600 font-semibold text-sm rounded-lg hover:bg-red-50 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" /> Cancel Request
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left - Main Details */}
        <div className="lg:col-span-2 space-y-5">

          {/* Job Details */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-indigo-500" /> Job Details
            </h2>

            {request.description ? (
              <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed mb-5">{request.description}</p>
            ) : (
              <p className="text-sm text-gray-400 italic mb-5">No description provided.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Start Date</p>
                <p className="text-sm font-semibold text-gray-900">{request.startDate ? new Date(request.startDate).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : 'Flexible'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> End Date</p>
                <p className="text-sm font-semibold text-gray-900">{request.endDate ? new Date(request.endDate).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : 'Not specified'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</p>
                <p className="text-sm font-semibold text-gray-900">{request.location || 'Not specified'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><Users className="w-3 h-3" /> Workers Required</p>
                <p className="text-sm font-semibold text-gray-900">{request.jobRequirement?.requiredWorkers || 1}</p>
              </div>
            </div>

            {request.notes && (
              <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                <p className="text-[10px] font-bold text-yellow-700 uppercase mb-1">Additional Notes</p>
                <p className="text-sm text-yellow-800">{request.notes}</p>
              </div>
            )}
          </div>

          {/* Participants */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-blue-500" /> Participants
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Client */}
              <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-3">Client (Requester)</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate">{clientName}</p>
                    <p className="text-xs text-gray-500 truncate">{request.client?.user?.email || '—'}</p>
                  </div>
                </div>
                {(request.status === 'ACCEPTED' || request.status === 'COMPLETED') && request.client?.user?.phone && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400" /> {request.client.user.phone}
                  </div>
                )}
              </div>

              {/* Agency / Worker */}
              <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-3">
                  {request.targetAgencyId ? 'Agency' : 'Worker'}
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate">{targetName || '—'}</p>
                    <p className="text-xs text-gray-500 truncate">{targetEmail || '—'}</p>
                  </div>
                </div>
                {(request.status === 'ACCEPTED' || request.status === 'COMPLETED') && targetPhone && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400" /> {targetPhone}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Assignment info if exists */}
          {request.assignment && (
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 mb-4">
                <ClipboardList className="w-4 h-4 text-emerald-500" /> Assignment
              </h2>
              <InfoRow label="Assignment Status" value={request.assignment.status} icon={AlertCircle} />
            </div>
          )}

          {/* Agency Worker Assignment Panel */}
          {!isClient && user?.profileType === "AGENCY" && request.assignment && (
            <AssignWorkersPanel 
              assignmentId={request.assignment.id} 
              requiredWorkers={request.jobRequirement?.requiredWorkers || 1} 
            />
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-5">

          {/* Financial */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 mb-4">
              <DollarSign className="w-4 h-4 text-emerald-500" /> Financials
            </h2>
            <InfoRow label="Proposed Rate" value={request.proposedRate ? `₹${Number(request.proposedRate).toLocaleString()}` : 'Negotiable'} icon={DollarSign} />
            <InfoRow label="Advance %" value={request.advancePercentage != null ? `${request.advancePercentage}%` : null} icon={DollarSign} />
            {request.proposedRate && request.advancePercentage != null && (
              <InfoRow
                label="Advance Amount"
                value={`₹${((request.proposedRate * request.advancePercentage) / 100).toLocaleString()}`}
                icon={CreditCard}
              />
            )}
            {request.payments?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Payments Received</p>
                {request.payments.map(p => (
                  <div key={p.id} className="flex justify-between text-xs text-gray-700 py-1">
                    <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                    <span className="font-semibold text-emerald-700">₹{Number(p.amount).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            {request.status === 'ACCEPTED' && isClient && !request.advancePaid && (
              <button className="w-full mt-4 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                Pay Advance to Start
              </button>
            )}
          </div>

          {/* Request Meta */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Hash className="w-4 h-4 text-gray-400" /> Request Info
            </h2>
            <InfoRow label="Request ID" value={`...${id?.slice(-8)}`} icon={Hash} />
            <InfoRow label="Status" value={statusLabel} icon={AlertCircle} />
            <InfoRow label="Type" value={request.targetAgencyId ? 'Agency Hire' : 'Worker Hire'} icon={Briefcase} />
            <InfoRow label="Created" value={new Date(request.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })} icon={Clock} />
            {request.updatedAt !== request.createdAt && (
              <InfoRow label="Last Updated" value={new Date(request.updatedAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })} icon={Clock} />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
