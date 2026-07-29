import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Plus, CheckCircle, Clock, XCircle, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { workerApi } from "../api/worker.api";
import { Modal } from "../../../components/ui/modal/Modal";
import Button from "../../../components/ui/button/Button";
import { format } from "date-fns";

export default function WorkerComplaintsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetClientId: "",
    targetAgencyId: ""
  });

  const { data: complaintsData, isLoading } = useQuery({
    queryKey: ["workerComplaints"],
    queryFn: async () => {
      const res = await workerApi.getMyComplaints();
      return res.data ?? res;
    }
  });

  const complaints = Array.isArray(complaintsData) ? complaintsData : [];

  const createMutation = useMutation({
    mutationFn: (data) => workerApi.createComplaint(data),
    onSuccess: () => {
      toast.success("Complaint submitted successfully");
      setIsModalOpen(false);
      setFormData({ title: "", description: "", targetClientId: "", targetAgencyId: "" });
      queryClient.invalidateQueries(["workerComplaints"]);
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to submit complaint")
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Please provide a title and description");
      return;
    }
    
    // Convert empty strings to undefined so backend doesn't complain about invalid uuids
    const payload = {
      title: formData.title,
      description: formData.description,
      ...(formData.targetClientId && { targetClientId: formData.targetClientId }),
      ...(formData.targetAgencyId && { targetAgencyId: formData.targetAgencyId })
    };
    
    createMutation.mutate(payload);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PENDING':
        return <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full"><Clock className="w-3 h-3"/> Pending</span>;
      case 'REVIEWING':
        return <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full"><Search className="w-3 h-3"/> Under Review</span>;
      case 'RESOLVED':
        return <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full"><CheckCircle className="w-3 h-3"/> Resolved</span>;
      case 'DISMISSED':
        return <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full"><XCircle className="w-3 h-3"/> Dismissed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Complaints & Issues</h1>
          <p className="text-sm text-slate-500 mt-1">Report issues against clients or agencies and track resolution status.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white">
          <Plus className="w-5 h-5 mr-1" />
          File New Complaint
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : complaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No complaints found</h3>
            <p className="text-slate-500">You haven't filed any complaints yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {complaints.map(complaint => (
              <div key={complaint.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{complaint.title}</h3>
                  {getStatusBadge(complaint.status)}
                </div>
                <p className="text-sm text-slate-600 mb-4 whitespace-pre-wrap">{complaint.description}</p>
                
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Filed on {format(new Date(complaint.createdAt), "MMM dd, yyyy")}
                  </div>
                  {complaint.targetClient && (
                    <div className="flex items-center gap-1.5 border-l border-slate-300 pl-4">
                      <span className="text-slate-400">Against Client:</span>
                      <span className="text-slate-700">{complaint.targetClient.user.firstName} {complaint.targetClient.user.lastName}</span>
                    </div>
                  )}
                  {complaint.targetAgency && (
                    <div className="flex items-center gap-1.5 border-l border-slate-300 pl-4">
                      <span className="text-slate-400">Against Agency:</span>
                      <span className="text-slate-700">{complaint.targetAgency.user.firstName} {complaint.targetAgency.user.lastName}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="File a Complaint">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-red-50 text-red-700 border border-red-100 rounded-lg text-xs font-medium flex gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <p>False or malicious complaints may result in suspension of your account. Please provide factual details.</p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Issue Title *</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Non-payment of agreed wage"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Detailed Description *</label>
            <textarea 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
              placeholder="Describe what happened in detail..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Target Client ID (Optional)</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Client ID if known"
                value={formData.targetClientId}
                onChange={e => setFormData({...formData, targetClientId: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Target Agency ID (Optional)</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Agency ID if known"
                value={formData.targetAgencyId}
                onChange={e => setFormData({...formData, targetAgencyId: e.target.value})}
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending} className="bg-red-600 hover:bg-red-700 text-white">
              Submit Complaint
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
