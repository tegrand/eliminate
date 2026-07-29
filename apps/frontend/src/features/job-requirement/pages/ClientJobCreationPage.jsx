import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { jobRequirementApi } from "../../job-requirement/api/jobRequirement.api";
import { Briefcase, MapPin, Calendar, Users, DollarSign, ListChecks, CheckCircle2 } from "lucide-react";

export default function ClientJobCreationPage() {
  const navigate = useNavigate();
  
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      categoryId: "",
      requiredSkillIds: [],
      requiredWorkers: 1,
      genderPreference: "Any",
      experienceRequired: "",
      duration: "", // Daily / Contract
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
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to post job");
    }
  });

  const onSubmit = (data) => {
    // Transform formatting
    const payload = {
      ...data,
      requiredWorkers: parseInt(data.requiredWorkers, 10),
      salaryAmount: data.salaryAmount ? parseFloat(data.salaryAmount) : null,
      requiredSkillIds: data.requiredSkillIds.filter(Boolean),
      startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
    };

    // Remove empty optional relations if not selected
    if (!payload.categoryId) delete payload.categoryId;
    if (!payload.locationId) delete payload.locationId;

    createJobMutation.mutate(payload);
  };

  return (
    <div className="w-full flex flex-col animate-fade-in">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-blue-600" />
            Post a New Job
          </h1>
          <p className="text-sm text-gray-500 mt-1.5">Fill out the requirements to find the perfect workers for your project.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* 1. Basic Details */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-5">
              <ListChecks className="w-4 h-4 text-indigo-500" /> Basic Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
          </div>

          {/* 2. Job Specifics */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-5">
              <DollarSign className="w-4 h-4 text-emerald-500" /> Job Specifics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience Required</label>
                <input 
                  type="text" 
                  {...register("experienceRequired")}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                  placeholder="e.g. 2-5 Years"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Work Type</label>
                <select 
                  {...register("duration")}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 bg-white"
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
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 bg-white"
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
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                  placeholder="e.g. 800"
                />
              </div>
            </div>
          </div>

          {/* 3. Location & Schedule */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-5">
              <Calendar className="w-4 h-4 text-orange-500" /> Location & Schedule
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" /> Location
                </label>
                <select 
                  {...register("locationId")}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 bg-white"
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
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Date</label>
                <input 
                  type="date" 
                  {...register("endDate")}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* 4. Facilities */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-5">
              <CheckCircle2 className="w-4 h-4 text-pink-500" /> Provided Facilities
            </h2>
            
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

          {/* 5. Notes */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
            <label className="block text-sm font-bold text-gray-900 mb-2.5">Additional Notes</label>
            <textarea 
              {...register("notes")}
              rows="3"
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none outline-none"
              placeholder="Any specific instructions, working hours, or additional requirements..."
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pb-8">
            <button 
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={createJobMutation.isPending}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {createJobMutation.isPending ? "Posting..." : "Post Job Requirement"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
