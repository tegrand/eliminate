import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { X, Briefcase, DollarSign, Loader2, Link, Edit3 } from "lucide-react";
import SlotCalendarPicker from "./SlotCalendarPicker";
import api from "../../../api/axios";
import { jobRequirementApi } from "../../job-requirement/api/jobRequirement.api";

export default function ClientHiringModal({ isOpen, onClose, targetId, targetType, targetName, targetRate, targetBaseRate, targetPlatformFee }) {
  const [hiringMode, setHiringMode] = useState("custom"); // "custom" or "existing"
  const [selectedJobId, setSelectedJobId] = useState("");
  const queryClient = useQueryClient();

  const { data: jobsData, isLoading: isLoadingJobs } = useQuery({
    queryKey: ["clientJobs", "open"],
    queryFn: async () => {
      const res = await jobRequirementApi.getJobRequirements({ limit: 100 });
      const raw = res.data?.items || res.data?.data || res.data || [];
      let allJobs = Array.isArray(raw) ? raw : (raw.data || []);
      if (!Array.isArray(allJobs)) allJobs = [];
      return allJobs.filter(job => job.status === "OPEN" || job.status === "DRAFT");
    },
    enabled: isOpen
  });

  const openJobs = jobsData || [];

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      description: "",
      proposedRate: "",
      startDate: "",
      endDate: "",
      notes: ""
    }
  });

  const startDateStr = watch("startDate");
  const endDateStr = watch("endDate");

  const numberOfDays = (() => {
    let s, e;
    if (hiringMode === "custom") {
      s = startDateStr;
      e = endDateStr;
    } else if (hiringMode === "existing" && selectedJobId) {
      const selectedJob = openJobs.find(job => job.id === selectedJobId);
      if (selectedJob) {
        s = selectedJob.startDate;
        e = selectedJob.endDate;
      }
    }
    
    if (!s || !e) return 1;
    const sDate = new Date(s);
    const eDate = new Date(e);
    if (isNaN(sDate.getTime()) || isNaN(eDate.getTime())) return 1;
    sDate.setHours(0, 0, 0, 0);
    eDate.setHours(0, 0, 0, 0);
    const diffTime = eDate.getTime() - sDate.getTime();
    if (diffTime < 0) return 1;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  })();

  // Update proposedRate whenever targetRate or numberOfDays changes
  useEffect(() => {
    if (targetRate) {
      setValue("proposedRate", targetRate * numberOfDays);
    }
  }, [targetRate, numberOfDays, setValue]);

  // Pre-fill rate whenever modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        title: "",
        description: "",
        proposedRate: targetRate ? targetRate * numberOfDays : "",
        startDate: "",
        endDate: "",
        notes: ""
      });
      setHiringMode("custom");
      setSelectedJobId("");
    }
  }, [isOpen, targetRate, reset]);

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
    let payload = {};

    if (hiringMode === "existing" && selectedJobId) {
      const selectedJob = openJobs.find(job => job.id === selectedJobId);
      payload = {
        jobRequirementId: selectedJobId,
        title: selectedJob ? selectedJob.title : "Job Hiring Request",
        proposedRate: data.proposedRate ? parseFloat(data.proposedRate) : undefined,
        notes: data.notes
      };
    } else {
      payload = {
        title: data.title,
        description: data.description,
        proposedRate: data.proposedRate ? parseFloat(data.proposedRate) : (targetRate ? parseFloat(targetRate) : undefined),
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
        notes: data.notes
      };
    }

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
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Hire {targetName}</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex px-5 py-3 border-b border-gray-100 bg-white gap-3">
          <button
            type="button"
            onClick={() => setHiringMode("custom")}
            className={`flex-1 py-2 px-3 rounded-xl border-2 flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
              hiringMode === "custom" 
                ? "border-blue-600 bg-blue-50 text-blue-700" 
                : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
            }`}
          >
            <Edit3 className="w-4 h-4" /> Create Custom Request
          </button>
          <button
            type="button"
            onClick={() => setHiringMode("existing")}
            className={`flex-1 py-2 px-3 rounded-xl border-2 flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
              hiringMode === "existing" 
                ? "border-blue-600 bg-blue-50 text-blue-700" 
                : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
            }`}
          >
            <Link className="w-4 h-4" /> Hire for Existing Job
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
          <form id="hiring-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {hiringMode === "existing" ? (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select an Active Job Requirement</label>
                {isLoadingJobs ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading your jobs...
                  </div>
                ) : openJobs.length === 0 ? (
                  <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                    You don't have any open jobs. Please create one first or use a custom request.
                  </p>
                ) : (
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    required={hiringMode === "existing"}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white outline-none"
                  >
                    <option value="">-- Choose a job --</option>
                    {openJobs.map(job => (
                      <option key={job.id} value={job.id}>{job.title} ({job.requirementCode})</option>
                    ))}
                  </select>
                )}
                <p className="text-xs text-gray-500 mt-1.5">
                  The candidate will receive a request to join this specific job posting.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Project / Job Title *</label>
                  <input 
                    type="text" 
                    {...register("title", { required: hiringMode === "custom" ? "Title is required" : false })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                    placeholder="e.g. Electrical Wiring for New Office"
                  />
                  {errors.title && <span className="text-red-500 text-xs mt-1 block">{errors.title.message}</span>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Brief Description</label>
                  <textarea 
                    {...register("description")}
                    rows="1"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none outline-none"
                    placeholder="Describe what needs to be done..."
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <SlotCalendarPicker 
                    workerId={targetType === "WORKER" ? targetId : null}
                    startDate={watch("startDate")}
                    endDate={watch("endDate")}
                    onChange={(start, end) => {
                      setValue("startDate", start, { shouldValidate: true });
                      setValue("endDate", end, { shouldValidate: true });
                    }}
                  />
                  {!watch("startDate") && <p className="text-xs text-orange-500 mt-1">Please select a valid date slot.</p>}
                </div>
              </div>
            )}

            {/* Common fields (Rate & Notes) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Proposed Rate (₹)
                </label>
                <input 
                  type="number" 
                  min="0"
                  readOnly={!!targetRate}
                  {...register("proposedRate")}
                  className={`w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none ${!!targetRate ? 'bg-gray-100 text-gray-600 font-bold cursor-not-allowed' : 'bg-white'}`}
                  placeholder="e.g. 5000"
                />
                {targetRate && targetBaseRate && targetPlatformFee && (
                  <div className="mt-2 text-[11px] font-medium p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span>Days:</span>
                      <span>{numberOfDays} Day{numberOfDays > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Base Wage ({numberOfDays} days):</span>
                      <span>₹{targetBaseRate * numberOfDays}</span>
                    </div>
                    <div className="flex justify-between text-indigo-600">
                      <span>Platform Fee ({numberOfDays} days):</span>
                      <span>+ ₹{targetPlatformFee * numberOfDays}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1 mt-1">
                      <span>Total You Pay:</span>
                      <span>₹{targetRate * numberOfDays}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Notes</label>
                <textarea 
                  {...register("notes")}
                  rows="1"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none outline-none"
                  placeholder="Any special terms or conditions..."
                ></textarea>
              </div>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
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
