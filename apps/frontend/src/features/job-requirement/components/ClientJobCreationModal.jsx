import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { X, Briefcase, MapPin, Calendar, DollarSign, ListChecks, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import api from "../../../api/axios";
import { jobRequirementApi } from "../../job-requirement/api/jobRequirement.api";

export default function ClientJobCreationModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, reset, trigger } = useForm({
    defaultValues: {
      title: "",
      categoryId: "",
      requiredSkillIds: [],
      requiredWorkers: 1,
      genderPreference: "Any",
      experienceRequired: "",
      duration: "",
      salaryType: "DAILY",
      salaryAmount: "",
      locationId: "",
      startDate: "",
      endDate: "",
      accommodation: false,
      food: false,
      transport: false,
      notes: ""
    }
  });

  const { data: categoriesData } = useQuery({ queryKey: ["categories"], queryFn: async () => (await api.get("/categories")).data });
  const { data: skillsData } = useQuery({ queryKey: ["skills"], queryFn: async () => (await api.get("/skills")).data });
  const { data: locationsData } = useQuery({ queryKey: ["locations"], queryFn: async () => (await api.get("/locations")).data });

  const categories = categoriesData?.data || [];
  const skills = skillsData?.data || [];
  const locations = locationsData?.data || [];

  const createJobMutation = useMutation({
    mutationFn: (data) => jobRequirementApi.createJobRequirement(data),
    onSuccess: () => {
      toast.success("Job Requirement posted successfully!");
      queryClient.invalidateQueries(["clientJobs"]);
      reset();
      setActiveTab(0);
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to post job");
    }
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      requiredWorkers: parseInt(data.requiredWorkers, 10),
      salaryAmount: data.salaryAmount ? parseFloat(data.salaryAmount) : null,
      requiredSkillIds: data.requiredSkillIds.filter(Boolean),
      startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
    };

    if (!payload.categoryId) delete payload.categoryId;
    if (!payload.locationId) delete payload.locationId;

    createJobMutation.mutate(payload);
  };

  const handleNext = async () => {
    // Basic validation before proceeding (could be expanded)
    const isStepValid = await trigger();
    if (isStepValid && activeTab < 3) {
      setActiveTab((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeTab > 0) setActiveTab((prev) => prev - 1);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 0, title: "Basic Details", icon: ListChecks },
    { id: 1, title: "Job Specifics", icon: DollarSign },
    { id: 2, title: "Location", icon: Calendar },
    { id: 3, title: "Facilities", icon: CheckCircle2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Post a New Job</h2>
              <p className="text-xs text-gray-500">Find the perfect workers for your project.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 px-6 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isCompleted = activeTab > tab.id;
            
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-4 border-b-2 font-semibold text-sm transition-colors whitespace-nowrap ${
                  isActive 
                    ? "border-blue-600 text-blue-600" 
                    : isCompleted 
                      ? "border-transparent text-gray-700 hover:text-gray-900" 
                      : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : isCompleted ? "text-green-500" : ""}`} />
                {tab.title}
              </button>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <form id="job-creation-form" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Tab 1: Basic Details */}
            {activeTab === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Job Title *</label>
                  <input 
                    type="text" 
                    {...register("title", { required: "Job title is required" })}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                    placeholder="e.g. Senior Electrician Needed"
                  />
                  {errors.title && <span className="text-red-500 text-xs mt-1 block">{errors.title.message}</span>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                  <select 
                    {...register("categoryId")}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Required Skills</label>
                  <select 
                    {...register("requiredSkillIds")}
                    multiple
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white min-h-[50px]"
                  >
                    {skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Worker Count *</label>
                  <input 
                    type="number" 
                    min="1"
                    {...register("requiredWorkers", { required: "Worker count is required", min: 1 })}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender Preference</label>
                  <select 
                    {...register("genderPreference")}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white"
                  >
                    <option value="Any">Any</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            )}

            {/* Tab 2: Job Specifics */}
            {activeTab === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience Required</label>
                  <input 
                    type="text" 
                    {...register("experienceRequired")}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    placeholder="e.g. 2-5 Years"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Work Type</label>
                  <select 
                    {...register("duration")}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white"
                  >
                    <option value="">Select Work Type</option>
                    <option value="Daily">Daily</option>
                    <option value="Contract">Contract</option>
                    <option value="Permanent">Permanent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Salary Type</label>
                  <select 
                    {...register("salaryType")}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white"
                  >
                    <option value="DAILY">Daily Wage</option>
                    <option value="MONTHLY">Monthly Salary</option>
                    <option value="FIXED">Fixed Contract</option>
                    <option value="HOURLY">Hourly Rate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Salary / Wage Amount (₹)</label>
                  <input 
                    type="number" 
                    min="0"
                    {...register("salaryAmount")}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    placeholder="e.g. 800"
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Location & Schedule */}
            {activeTab === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" /> Location
                  </label>
                  <select 
                    {...register("locationId")}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white"
                  >
                    <option value="">Select Location</option>
                    {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Date</label>
                  <input 
                    type="date" 
                    {...register("startDate")}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Date</label>
                  <input 
                    type="date" 
                    {...register("endDate")}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Tab 4: Facilities & Notes */}
            {activeTab === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Provided Facilities</label>
                  <div className="flex flex-wrap gap-5">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="checkbox" {...register("accommodation")} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Accommodation Provided</span>
                    </label>
                    
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="checkbox" {...register("food")} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Food Provided</span>
                    </label>
                    
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="checkbox" {...register("transport")} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Transport Provided</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2.5">Additional Notes</label>
                  <textarea 
                    {...register("notes")}
                    rows="4"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none outline-none"
                    placeholder="Any specific instructions, working hours, or additional requirements..."
                  ></textarea>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeTab === 0}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 disabled:opacity-30 flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          
          <div className="flex items-center gap-3">
            {activeTab < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                form="job-creation-form"
                disabled={createJobMutation.isPending}
                className="px-6 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 shadow-sm shadow-green-200 transition-colors disabled:opacity-50"
              >
                {createJobMutation.isPending ? "Posting..." : "Post Job Requirement"}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
