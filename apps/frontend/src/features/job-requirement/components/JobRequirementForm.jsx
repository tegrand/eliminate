import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function JobRequirementForm({ mode = "create", initialValues, onSubmit, onCancel, isLoading }) {
  const defaultValues = {
    title: "",
    categoryId: "",
    requiredSkills: "",
    requiredWorkers: 1,
    genderPreference: "ANY",
    experienceRequired: "",
    locationId: "",
    startDate: "",
    shift: "FLEXIBLE",
    duration: "",
    salaryAmount: "",
    notes: "",
  };

  // Convert requiredSkills to string for the form if it comes as array
  let preparedInitialValues = initialValues;
  if (initialValues) {
    preparedInitialValues = {
      ...initialValues,
      requiredSkills: Array.isArray(initialValues.requiredSkills) 
        ? initialValues.requiredSkills.map(rs => rs.skill?.name || rs.skillId).join(", ") 
        : initialValues.requiredSkills || "",
      startDate: initialValues.startDate ? new Date(initialValues.startDate).toISOString().split('T')[0] : "",
    };
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: preparedInitialValues || defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-8 animate-fade-in">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Requirement Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Job Title"
            placeholder="e.g. Senior Plumber"
            {...register("title", { required: "Job Title is required" })}
            error={errors.title?.message}
          />
          
          <Input
            label="Category"
            placeholder="e.g. Construction"
            {...register("categoryId")}
          />

          <div className="md:col-span-2">
            <Input
              label="Skills Required"
              placeholder="e.g. Pipe fitting, Welding (comma separated)"
              {...register("requiredSkills")}
            />
          </div>

          <Input
            label="Number of Workers"
            type="number"
            min="1"
            {...register("requiredWorkers", { required: "Number of workers is required" })}
            error={errors.requiredWorkers?.message}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Gender Preference (Optional)</label>
            <select
              {...register("genderPreference")}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
            >
              <option value="ANY">Any</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <Input
            label="Experience Required"
            placeholder="e.g. 1-3 years"
            {...register("experienceRequired")}
          />

          <Input
            label="Work Location"
            placeholder="e.g. Ernakulam"
            {...register("locationId")}
          />

          <Input
            label="Date"
            type="date"
            {...register("startDate")}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Shift</label>
            <select
              {...register("shift")}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
            >
              <option value="MORNING">Morning</option>
              <option value="EVENING">Evening</option>
              <option value="NIGHT">Night</option>
              <option value="FLEXIBLE">Flexible</option>
            </select>
          </div>

          <Input
            label="Duration"
            placeholder="e.g. 6 months"
            {...register("duration")}
          />

          <Input
            label="Budget"
            type="number"
            placeholder="e.g. 15000"
            {...register("salaryAmount")}
          />

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Notes</label>
            <textarea
              {...register("notes")}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm min-h-[100px]"
              placeholder="Any additional details..."
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="min-w-[140px]">
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {mode === "create" ? "Create Requirement" : "Update Requirement"}
          </Button>
        </div>
      </div>
    </form>
  );
}
