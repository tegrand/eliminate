import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function JobRequirementForm({ mode = "create", initialValues, onSubmit, onCancel, isLoading }) {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
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

  // Parse initial skills
  useEffect(() => {
    if (initialValues?.requiredSkills) {
      if (Array.isArray(initialValues.requiredSkills)) {
        setSkills(initialValues.requiredSkills.map(rs => rs.skill?.name || rs.skillId || rs));
      } else if (typeof initialValues.requiredSkills === 'string') {
        setSkills(initialValues.requiredSkills.split(",").map(s => s.trim()).filter(Boolean));
      }
    }
  }, [initialValues]);

  // Convert fields for the form
  let preparedInitialValues = initialValues;
  if (initialValues) {
    preparedInitialValues = {
      ...initialValues,
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

  const handleAddSkill = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (skillInput.trim() && !skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleFormSubmit = (data) => {
    // Ensure title and requiredWorkers are present at minimum before submission
    onSubmit({ ...data, requiredSkills: skills.join(", ") });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 pb-8 animate-fade-in">
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

          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Skills Required</label>
            <div className="w-full p-2 bg-white border border-gray-200 rounded-lg min-h-[42px] flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
              {skills.map(skill => (
                <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-blue-900 focus:outline-none">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder={skills.length === 0 ? "Type a skill and press Enter..." : ""}
                className="flex-1 min-w-[120px] outline-none text-sm bg-transparent placeholder-gray-400"
              />
            </div>
            <p className="text-xs text-gray-500">Press Enter to add multiple skills</p>
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
            <label className="text-sm font-medium text-slate-700">Job Description & Notes</label>
            <textarea
              {...register("notes")}
              className="w-full px-3 py-3 bg-white border border-gray-200 rounded-lg text-sm min-h-[200px] leading-relaxed resize-y focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              placeholder={"• Minimum 2 years of experience\n• Ability to work flexible hours\n• Certification required\n\nWrite detailed paragraphs or use bullet points..."}
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
