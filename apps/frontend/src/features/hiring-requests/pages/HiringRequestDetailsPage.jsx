import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, Briefcase, Calendar, MapPin, DollarSign, 
  User, Building2, Phone, Mail, FileText, CheckCircle, 
  XCircle, Clock, Loader2 
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { useAuth } from "../../../hooks/useAuth";

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
    if (window.confirm(`Are you sure you want to ${status.toLowerCase()} this hiring request?`)) {
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
        <XCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Not Found</h2>
        <p className="text-gray-500 max-w-md mb-6">
          The hiring request you are looking for does not exist or you do not have permission to view it.
        </p>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const targetName = request.targetAgencyId 
    ? (request.agency?.agencyName || request.agency?.user?.firstName + " " + request.agency?.user?.lastName) 
    : (request.worker?.user?.firstName + " " + request.worker?.user?.lastName);

  const clientName = request.client?.companyName || (request.client?.user?.firstName + " " + request.client?.user?.lastName);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'ACCEPTED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'COMPLETED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'REJECTED': 
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full animate-fade-in pb-12">
      
      {/* Top Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Requests
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-70 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border mb-4 ${getStatusColor(request.status)}`}>
              {request.status}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">{request.title}</h1>
            <p className="text-gray-500 font-medium text-sm">
              Requested on {new Date(request.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {request.status === 'PENDING' && (
            <div className="flex items-center gap-3 w-full md:w-auto">
              {isClient ? (
                <button 
                  onClick={() => handleUpdateStatus('CANCELLED')}
                  disabled={updateStatusMutation.isPending}
                  className="w-full md:w-auto px-6 py-2.5 bg-white border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Cancel Request
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => handleUpdateStatus('REJECTED')}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 md:flex-none px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus('ACCEPTED')}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 md:flex-none px-6 py-2.5 bg-indigo-600 border-2 border-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:border-indigo-700 shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Accept Request
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Description */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-indigo-600" /> Job Details
            </h2>
            
            <div className="prose prose-sm max-w-none text-gray-600">
              {request.description ? (
                <p className="whitespace-pre-wrap leading-relaxed">{request.description}</p>
              ) : (
                <p className="italic text-gray-400">No detailed description provided.</p>
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 mt-0.5">
                  <Calendar className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Duration</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {request.startDate ? new Date(request.startDate).toLocaleDateString() : 'Flexible'} 
                    {request.endDate && ` - ${new Date(request.endDate).toLocaleDateString()}`}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 mt-0.5">
                  <MapPin className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {request.location || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {request.notes && (
              <div className="mt-6 bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
                <p className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-1">Additional Notes</p>
                <p className="text-sm text-yellow-800">{request.notes}</p>
              </div>
            )}
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Financial Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <DollarSign className="w-5 h-5 text-emerald-600" /> Financials
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500 font-medium">Proposed Rate</span>
                <span className="text-base font-bold text-gray-900">{request.proposedRate ? `₹${request.proposedRate}` : 'Negotiable'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500 font-medium">Advance Required</span>
                <span className="text-sm font-bold text-gray-700">{request.advancePercentage}%</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold text-gray-900">Advance Amount</span>
                <span className="text-lg font-black text-indigo-600">
                  {request.proposedRate ? `₹${(request.proposedRate * request.advancePercentage) / 100}` : 'TBD'}
                </span>
              </div>
            </div>
            
            {request.status === 'ACCEPTED' && isClient && !request.advancePaid && (
              <button className="w-full mt-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                Pay Advance to Start
              </button>
            )}
          </div>

          {/* Participant Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-blue-600" /> Participants
            </h2>

            <div className="space-y-6">
              {/* Client Info */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Client (Requester)</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate">{clientName}</p>
                    <p className="text-xs text-gray-500 truncate">{request.client?.user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Target Info */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Target ({request.targetAgencyId ? 'Agency' : 'Worker'})</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate">{targetName}</p>
                    {request.targetAgencyId ? (
                      <p className="text-xs text-gray-500 truncate">{request.agency?.user?.email}</p>
                    ) : (
                      <p className="text-xs text-gray-500 truncate">{request.worker?.user?.email}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Contact Info (if accepted) */}
              {(request.status === 'ACCEPTED' || request.status === 'COMPLETED') && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contact Details</p>
                  {request.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                      <Phone className="w-4 h-4 text-gray-400" /> {request.phoneNumber}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Mail className="w-4 h-4 text-gray-400" /> 
                    {isClient ? (request.agency?.user?.email || request.worker?.user?.email) : request.client?.user?.email}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
