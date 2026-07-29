import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Briefcase, CheckCircle, XCircle, Clock, Calendar, DollarSign, Loader2, ArrowRight } from "lucide-react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";

export default function HiringRequestsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isClient = user?.profileType === "CLIENT";
  
  const [activeTab, setActiveTab] = useState("PENDING");
  const tabs = ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED", "COMPLETED"];

  const { data, isLoading, error } = useQuery({
    queryKey: ["hiringRequests", activeTab],
    queryFn: async () => {
      const res = await api.get("/hiring-requests", { params: { status: activeTab } });
      return res.data?.data || res.data || [];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/hiring-requests/${id}/status`, { status }),
    onSuccess: (data, variables) => {
      toast.success(`Request ${variables.status.toLowerCase()} successfully!`);
      queryClient.invalidateQueries(["hiringRequests"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update request");
    }
  });

  const handleUpdateStatus = (id, status) => {
    if (window.confirm(`Are you sure you want to ${status.toLowerCase()} this hiring request?`)) {
      updateStatusMutation.mutate({ id, status });
    }
  };

  const requests = data || [];

  return (
    <div className="w-full flex flex-col animate-fade-in h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
          <Briefcase className="w-6 h-6 text-indigo-600" />
          {isClient ? "My Job Requests" : "Hiring Requests"}
        </h1>
        <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
          {isClient 
            ? "Track the direct hiring requests you've sent to agencies and independent workers."
            : "Manage direct hiring requests from clients. Accept requests to start an assignment."
          }
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium border border-red-100">
          Failed to load hiring requests.
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No requests found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            You don't have any {activeTab.toLowerCase()} requests at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {requests.map(req => {
            const targetName = req.targetAgencyId 
              ? (req.agency?.agencyName || req.agency?.user?.firstName + " " + req.agency?.user?.lastName) 
              : (req.worker?.user?.firstName + " " + req.worker?.user?.lastName);

            return (
              <div key={req.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative group overflow-hidden flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{req.title}</h3>
                    {isClient ? (
                      <p className="text-sm text-gray-500 mt-1">To: <span className="font-semibold text-indigo-700">{targetName}</span></p>
                    ) : (
                      <p className="text-sm text-gray-500 mt-1">From: <span className="font-semibold text-gray-700">{req.client?.companyName || req.client?.user?.firstName + " " + req.client?.user?.lastName}</span></p>
                    )}
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${
                    req.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                    req.status === 'ACCEPTED' || req.status === 'COMPLETED' ? 'bg-green-50 text-green-600 border-green-200' :
                    'bg-red-50 text-red-600 border-red-200'
                  }`}>
                    {req.status}
                  </div>
                </div>

                {req.description && (
                  <p className="text-sm text-gray-600 mb-5 line-clamp-2">{req.description}</p>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 flex-1">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Proposed Rate</span>
                    <span className="text-sm font-bold text-gray-900 mt-1">{req.proposedRate ? `₹${req.proposedRate}` : 'Not specified'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Start Date</span>
                    <span className="text-sm font-bold text-gray-900 mt-1">{req.startDate ? new Date(req.startDate).toLocaleDateString() : 'Flexible'}</span>
                  </div>
                </div>

                {req.status === 'PENDING' && (
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-auto">
                    {isClient ? (
                      <button 
                        onClick={() => handleUpdateStatus(req.id, 'CANCELLED')}
                        disabled={updateStatusMutation.isPending}
                        className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-50 hover:text-red-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Cancel Request
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                          disabled={updateStatusMutation.isPending}
                          className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold text-sm rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(req.id, 'ACCEPTED')}
                          disabled={updateStatusMutation.isPending}
                          className="flex-1 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" /> Accept
                        </button>
                      </>
                    )}
                  </div>
                )}

                {req.status === 'ACCEPTED' && (
                  <div className="flex items-center justify-end pt-4 border-t border-gray-100 mt-auto">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center gap-1.5 transition-colors">
                      View Assignment <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
