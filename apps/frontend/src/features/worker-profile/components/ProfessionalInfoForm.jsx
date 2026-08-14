import { useState, useEffect, useRef } from "react";
import { Save, X, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../../api/axios";

// Tag badge component (inside input)
function Pill({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-md text-[11px] font-bold tracking-wide mt-1 mb-1 ml-1.5">
      {label}
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); onRemove(); }}
        className="text-indigo-400 hover:text-indigo-800 transition-colors focus:outline-none ml-1"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

// Modern Tag Input component
function TagInput({ placeholder, selectedItems, onAdd, onRemove, options, loading }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const filtered = options.filter(o =>
    o.name.toLowerCase().includes(query.toLowerCase()) && 
    !selectedItems.find(s => (s.skill?.id || s.language?.id) === o.id)
  ).slice(0, 10);

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && query === "" && selectedItems.length > 0) {
      // Remove last item on backspace if input is empty
      const lastItem = selectedItems[selectedItems.length - 1];
      onRemove(lastItem.skill?.id || lastItem.language?.id || lastItem);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered.length > 0) {
        onAdd(filtered[0]);
        setQuery("");
      }
    }
  };

  return (
    <div className="relative w-full">
      <div 
        className="flex flex-wrap items-center w-full min-h-[46px] bg-white border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all cursor-text overflow-hidden pl-1 pr-2 py-0.5"
        onClick={() => inputRef.current?.focus()}
      >
        {selectedItems.map((item, idx) => (
          <Pill 
            key={idx} 
            label={item.skill?.name || item.language?.name || item} 
            onRemove={() => onRemove(item.skill?.id || item.language?.id || item)} 
          />
        ))}
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder={selectedItems.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] outline-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 py-2.5 px-2"
        />
        {loading && <Loader2 className="w-4 h-4 animate-spin text-indigo-500 ml-2 shrink-0" />}
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
          {filtered.map(opt => (
            <button
              key={opt.id}
              type="button"
              className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors focus:bg-indigo-50 focus:outline-none"
              onMouseDown={(e) => { 
                e.preventDefault(); 
                onAdd(opt); 
                setQuery(""); 
                inputRef.current?.focus(); 
              }}
            >
              {opt.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProfessionalInfoForm({ data, onSave, saving, hideHeader }) {
  const workerId = data?.id;

  const [formData, setFormData] = useState({
    totalExperienceYears: data?.totalExperienceYears ?? "",
    expectedDailyWage: data?.expectedDailyWage || "",
    preferredLocations: Array.isArray(data?.preferredLocations) ? data.preferredLocations : [],
  });

  const [locationInput, setLocationInput] = useState("");

  // Skills state
  const [workerSkills, setWorkerSkills] = useState(data?.skills || []);
  const [allSkills, setAllSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [addingSkill, setAddingSkill] = useState(false);

  // Languages state
  const [workerLanguages, setWorkerLanguages] = useState(data?.languages || []);
  const [allLanguages, setAllLanguages] = useState([]);
  const [langsLoading, setLangsLoading] = useState(false);
  const [addingLang, setAddingLang] = useState(false);

  // Fetch available skills and languages on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setSkillsLoading(true);
        setLangsLoading(true);
        const [skillsRes, langsRes] = await Promise.all([
          api.get("/skills"),
          api.get("/languages"),
        ]);
        setAllSkills(skillsRes.data?.data?.items || skillsRes.data?.data || []);
        setAllLanguages(langsRes.data?.data?.items || langsRes.data?.data || []);
      } catch {
        // silently fail - degraded mode
      } finally {
        setSkillsLoading(false);
        setLangsLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Skills ---
  const handleAddSkill = async (skill) => {
    if (!workerId) return;
    if (workerSkills.find(s => s.skill.id === skill.id)) return;
    try {
      setAddingSkill(true);
      await api.post(`/workers/${workerId}/skills`, {
        workerId,
        skillId: skill.id,
        proficiencyLevel: "INTERMEDIATE",
        isPrimary: workerSkills.length === 0,
      });
      setWorkerSkills(prev => [...prev, { id: skill.id, skill, proficiencyLevel: "INTERMEDIATE", isPrimary: prev.length === 0 }]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add skill");
    } finally {
      setAddingSkill(false);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    if (!workerId) return;
    try {
      await api.delete(`/workers/${workerId}/skills/${skillId}`);
      setWorkerSkills(prev => prev.filter(s => s.skill.id !== skillId));
    } catch {
      toast.error("Failed to remove skill");
    }
  };

  // --- Languages ---
  const handleAddLanguage = async (lang) => {
    if (!workerId) return;
    if (workerLanguages.find(l => l.language.id === lang.id)) return;
    try {
      setAddingLang(true);
      await api.post(`/workers/${workerId}/languages`, {
        workerId,
        languageId: lang.id,
        proficiencyLevel: "CONVERSATIONAL",
        canSpeak: true,
        canRead: true,
        canWrite: false,
        isPrimary: workerLanguages.length === 0,
      });
      setWorkerLanguages(prev => [...prev, { id: lang.id, language: lang, proficiencyLevel: "CONVERSATIONAL" }]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add language");
    } finally {
      setAddingLang(false);
    }
  };

  const handleRemoveLanguage = async (languageId) => {
    if (!workerId) return;
    try {
      await api.delete(`/workers/${workerId}/languages/${languageId}`);
      setWorkerLanguages(prev => prev.filter(l => l.language.id !== languageId));
    } catch {
      toast.error("Failed to remove language");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      totalExperienceYears: formData.totalExperienceYears !== "" ? parseInt(formData.totalExperienceYears) : null,
      expectedDailyWage: formData.expectedDailyWage || undefined,
      preferredLocations: formData.preferredLocations,
    };
    onSave(payload);
  };

  const inputClass = "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400 text-sm";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";
  const sectionClass = "space-y-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0";

  return (
    <div className="animate-fade-in">
      {!hideHeader && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Professional Details</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your experience, skills, languages and preferences.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Experience & Salary */}
        <div className={sectionClass}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Total Experience (Years)</label>
              <input
                type="number"
                name="totalExperienceYears"
                value={formData.totalExperienceYears}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 5"
                min="0"
                max="50"
              />
            </div>
            <div>
              <label className={labelClass}>Expected Daily Wage (Optional)</label>
              <input
                type="text"
                name="expectedDailyWage"
                value={formData.expectedDailyWage}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. ₹1000/day"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className={sectionClass}>
          <label className={labelClass}>Skills</label>
          <TagInput 
            placeholder="Type and press Enter to add skills..."
            selectedItems={workerSkills}
            options={allSkills}
            onAdd={handleAddSkill}
            onRemove={handleRemoveSkill}
            loading={skillsLoading || addingSkill}
          />
          <p className="text-[11px] text-slate-400 mt-1.5">Add skills relevant to the jobs you want to get hired for.</p>
        </div>

        {/* Languages */}
        <div className={sectionClass}>
          <label className={labelClass}>Languages Known</label>
          <TagInput 
            placeholder="Type and press Enter to add languages..."
            selectedItems={workerLanguages}
            options={allLanguages}
            onAdd={handleAddLanguage}
            onRemove={handleRemoveLanguage}
            loading={langsLoading || addingLang}
          />
        </div>

        <div className="pt-5 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-70"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
