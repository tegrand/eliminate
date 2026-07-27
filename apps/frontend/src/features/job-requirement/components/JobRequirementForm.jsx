import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Loader2, Save, X, Briefcase, MapPin, DollarSign, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import api from "../../../api/axios";
import { useCategories } from "../../categories/hooks/useCategories";
import { useLocations } from "../../locations/hooks/useLocations";

const TABS = [
  { id: 1, label: "Basic Details", icon: Briefcase, desc: "Job title, category & skills" },
  { id: 2, label: "Work Details", icon: MapPin, desc: "Location, schedule & experience" },
  { id: 3, label: "Financials & Notes", icon: DollarSign, desc: "Budget & job description" },
];

const styledSelect =
  "w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all cursor-pointer appearance-none shadow-sm";

const fieldLabel = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

export default function JobRequirementForm({ mode = "create", initialValues, onSubmit, onCancel, isLoading }) {
  const [activeTab, setActiveTab] = useState(1);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const { data: categoriesData } = useCategories({ limit: 100 });
  const categories = categoriesData?.data?.items || [];
  const { data: locationsData } = useLocations({ limit: 100 });
  const locations = locationsData?.data?.items || [];
  const defaultValues = {
    title: "",
    categoryId: "",
    requiredSkills: "",
    requiredWorkers: 1,
    genderPreference: "ANY",
    experienceRequired: "",
    locationText: "",
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
      locationText: initialValues.location?.name || "",
      startDate: initialValues.startDate ? new Date(initialValues.startDate).toISOString().split('T')[0] : "",
    };
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    values: preparedInitialValues || defaultValues,
  });

  const handleCreateCategory = async () => {
    const name = window.prompt("Enter new category name:");
    if (!name) return;
    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const res = await api.post("/categories", { name, slug, isActive: true });
      setValue("categoryId", res.data.data.id);
      toast.success("Category created and selected!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create category");
    }
  };

  const handleCreateLocation = async () => {
    const name = window.prompt("Enter new location name (e.g. Ernakulam):");
    if (!name) return;
    try {
      const code = name.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 20);
      const res = await api.post("/locations", { name, code, isActive: true });
      setValue("locationId", res.data.data.id);
      toast.success("Location created and selected!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create location");
    }
  };

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

  const handleFormSubmit = async (data) => {
    let finalLocationId = data.locationId;
    
    if (data.locationText) {
      try {
        const searchRes = await api.get(`/locations?search=${encodeURIComponent(data.locationText)}`);
        const existing = searchRes.data.data.items.find(l => l.name.toLowerCase() === data.locationText.toLowerCase());
        
        if (existing) {
          finalLocationId = existing.id;
        } else {
          const code = data.locationText.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 20);
          const res = await api.post("/locations", { name: data.locationText, code, isActive: true });
          finalLocationId = res.data.data.id;
        }
      } catch (err) {
        console.error("Failed to process location", err);
        toast.error("Failed to save work location");
        return;
      }
    }
    
    const payload = { ...data, requiredSkills: skills.join(", ") };
    if (finalLocationId) payload.locationId = finalLocationId;
    else payload.locationId = null;
    delete payload.locationText;
    
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col h-full" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Stepper Tab Header */}
      <div className="relative flex items-stretch border-b border-gray-100 bg-gradient-to-r from-slate-50 to-violet-50/30 px-2 pt-2">
        {TABS.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isDone = activeTab > tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 group relative flex flex-col items-center gap-0.5 pt-3 pb-4 px-2 transition-all focus:outline-none"
              style={{ borderBottom: isActive ? "2.5px solid #7c3aed" : "2.5px solid transparent" }}
            >
              {/* Step indicator */}
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full mb-1 transition-all"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                    : isDone
                    ? "linear-gradient(135deg, #059669, #10b981)"
                    : "#e5e7eb",
                  boxShadow: isActive ? "0 2px 12px rgba(124,58,237,0.30)" : "none",
                }}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Icon className="w-3.5 h-3.5" style={{ color: isActive ? "#fff" : "#9ca3af" }} />
                )}
              </div>
              <span
                className="text-xs font-semibold tracking-wide transition-colors"
                style={{ color: isActive ? "#7c3aed" : isDone ? "#059669" : "#6b7280" }}
              >
                {tab.label}
              </span>
              <span
                className="text-[10px] font-normal hidden sm:block"
                style={{ color: isActive ? "#a78bfa" : "#9ca3af" }}
              >
                {tab.desc}
              </span>
              {/* Connector line */}
              {idx < TABS.length - 1 && (
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-8"
                  style={{ background: "#e5e7eb" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Form Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7" style={{ minHeight: 380 }}>

        {/* Tab 1: Basic Details */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
            {/* Job Title */}
            <div className="md:col-span-2">
              <Input
                label="Job Title"
                placeholder="e.g. Senior Plumber"
                {...register("title", { required: "Job Title is required" })}
                error={errors.title?.message}
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1">
              <label className={fieldLabel}>Category</label>
              <div className="relative">
                <select {...register("categoryId")} className={styledSelect}>
                  <option value="">Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
            </div>

            {/* Number of Workers */}
            <Input
              label="Number of Workers"
              type="number"
              min="1"
              {...register("requiredWorkers", { required: "Number of workers is required" })}
              error={errors.requiredWorkers?.message}
            />

            {/* Skills */}
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className={fieldLabel}>Skills Required</label>
              <div
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl min-h-[46px] flex flex-wrap gap-2 items-center transition-all shadow-sm"
                style={{ focusWithin: "ring-2 ring-violet-500/30 border-violet-500" }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#7c3aed"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
              >
                {skills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
                    style={{
                      background: "linear-gradient(135deg, #ede9fe, #f5f3ff)",
                      color: "#6d28d9",
                      borderColor: "#c4b5fd",
                    }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-violet-900 focus:outline-none ml-0.5 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder={skills.length === 0 ? "Type a skill and press Enter..." : "Add more..."}
                  className="flex-1 min-w-[140px] outline-none text-sm bg-transparent text-gray-700 placeholder-gray-400"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-[10px] font-mono">Enter</kbd>
                to add each skill
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Work Details */}
        {activeTab === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
            <Input
              label="Work Location"
              placeholder="e.g. Ernakulam"
              {...register("locationText")}
            />

            <Input
              label="Start Date"
              type="date"
              {...register("startDate")}
            />

            {/* Shift */}
            <div className="flex flex-col gap-1">
              <label className={fieldLabel}>Shift</label>
              <div className="relative">
                <select {...register("shift")} className={styledSelect}>
                  <option value="MORNING">🌅 Morning</option>
                  <option value="EVENING">🌇 Evening</option>
                  <option value="NIGHT">🌙 Night</option>
                  <option value="FLEXIBLE">🔄 Flexible</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <Input
              label="Duration"
              placeholder="e.g. 6 months"
              {...register("duration")}
            />

            {/* Gender Preference */}
            <div className="flex flex-col gap-1">
              <label className={fieldLabel}>Gender Preference <span className="normal-case font-normal text-gray-400">(Optional)</span></label>
              <div className="relative">
                <select {...register("genderPreference")} className={styledSelect}>
                  <option value="ANY">Any</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <Input
              label="Experience Required"
              placeholder="e.g. 1–3 years"
              {...register("experienceRequired")}
            />
          </div>
        )}

        {/* Tab 3: Financials & Notes */}
        {activeTab === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
            {/* Budget */}
            <div className="md:col-span-1">
              <Input
                label="Budget (₹)"
                type="number"
                placeholder="e.g. 15000"
                {...register("salaryAmount")}
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5 md:col-span-2 mt-1">
              <label className={fieldLabel}>Job Description & Notes</label>
              <textarea
                {...register("notes")}
                rows={9}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 leading-relaxed resize-y shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 placeholder-gray-400"
                placeholder={"• Minimum 2 years of experience\n• Ability to work flexible hours\n• Certification required\n\nWrite detailed paragraphs or use bullet points..."}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div
        className="flex justify-between items-center px-6 py-4 sm:px-8 border-t"
        style={{ borderColor: "#f1f5f9", background: "linear-gradient(to right, #f8fafc, #faf7ff)" }}
      >
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="min-w-[100px]"
        >
          Cancel
        </Button>

        <div className="flex items-center gap-2.5">
          {activeTab > 1 && (
            <button
              type="button"
              onClick={() => setActiveTab(prev => prev - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
          )}

          {activeTab < 3 ? (
            <button
              type="button"
              onClick={() => setActiveTab(prev => prev + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg active:scale-95"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                boxShadow: "0 4px 15px rgba(124,58,237,0.35)",
              }}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: isLoading
                  ? "#6b7280"
                  : "linear-gradient(135deg, #059669, #10b981)",
                boxShadow: isLoading ? "none" : "0 4px 15px rgba(5,150,105,0.35)",
              }}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {mode === "create" ? "Create Requirement" : "Update Requirement"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
