import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { X, Briefcase, Calendar, DollarSign, Loader2 } from "lucide-react";
import api from "../../../api/axios";

export default function ClientHiringModal({ isOpen, onClose, targetId, targetType, targetName }) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      proposedRate: "",
      startDate: "",
      endDate: "",
      notes: ""
    }
  });

  const createRequestMutation = useMutation({
    mutationFn: (data) => api.post("/hiring-requests", data),
    onSuccess: () => {
      toast.success(`Hiring request sent to ${targetName} successfully!`);
      queryClient.invalidateQueries(["clientHiringRequests"]);
      reset();
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  });

  const onSubmit = (data) => {
    const payload = {
      title: data.title,
      description: data.description,
      proposedRate: data.proposedRate ? parseFloat(data.proposedRate) : null,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
      notes: data.notes
    };

    if (targetType === "WORKER") {
      payload.targetWorkerId = targetId;
    } else if (targetType === "AGENCY") {
      payload.targetAgencyId = targetId;
    }

    createRequestMutation.mutate(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Hire {targetName}</h2>
              <p className="text-xs text-gray-500">Send a direct hiring request and proposed terms.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <form id="hiring-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Project / Job Title *</label>
              <input 
                type="text" 
                {...register("title", { required: "Title is required" })}
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                placeholder="e.g. Electrical Wiring for New Office"
              />
              {errors.title && <span className="text-red-500 text-xs mt-1 block">{errors.title.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Brief Description</label>
              <textarea 
                {...register("description")}
                rows="3"
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none outline-none"
                placeholder="Describe what needs to be done..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" /> Start Date
                </label>
                <input 
                  type="date" 
                  {...register("startDate")}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" /> End Date (Optional)
                </label>
                <input 
                  type="date" 
                  {...register("endDate")}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" /> Proposed Total Rate (₹)
              </label>
              <input 
                type="number" 
                min="0"
                {...register("proposedRate")}
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none"
                placeholder="e.g. 5000"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Additional Notes / Terms</label>
              <textarea 
                {...register("notes")}
                rows="2"
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none outline-none"
                placeholder="Any special terms or conditions..."
              ></textarea>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            form="hiring-form"
            disabled={createRequestMutation.isPending}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {createRequestMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Send Hiring Request
          </button>
        </div>

      </div>
    </div>
  );
}
