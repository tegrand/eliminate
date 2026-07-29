import { useState, useEffect, useCallback } from "react";
import { Save, X, Plus, Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import api from "../../../api/axios";

// Tag badge component
function Tag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="text-indigo-400 hover:text-indigo-700 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

// Searchable dropdown for selecting skills/languages
function SearchableSelect({ placeholder, options, onSelect, loading }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = options.filter(o =>
    o.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10);

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400 text-sm"
        />
        {loading && <Loader2 className="w-4 h-4 animate-spin text-slate-400 mt-3 mr-2" />}
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          {filtered.map(opt => (
            <button
              key={opt.id}
              type="button"
              className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              onMouseDown={() => { onSelect(opt); setQuery(""); setOpen(false); }}
            >
              {opt.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProfessionalInfoForm({ data, onSave, saving }) {
  const workerId = data?.id;

  const [formData, setFormData] = useState({
    experienceYears: data?.experienceYears ?? "",
    expectedSalary: data?.expectedSalary || "",
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
    if (workerSkills.find(s => s.skill.id === skill.id)) {
      toast.error("Skill already added");
      return;
    }
    try {
      setAddingSkill(true);
      await api.post(`/workers/${workerId}/skills`, {
        workerId,
        skillId: skill.id,
        proficiencyLevel: "INTERMEDIATE",
        isPrimary: workerSkills.length === 0,
      });
      setWorkerSkills(prev => [...prev, { id: skill.id, skill, proficiencyLevel: "INTERMEDIATE", isPrimary: prev.length === 0 }]);
      toast.success(`${skill.name} added`);
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
      toast.success("Skill removed");
    } catch {
      toast.error("Failed to remove skill");
    }
  };

  // --- Languages ---
  const handleAddLanguage = async (lang) => {
    if (!workerId) return;
    if (workerLanguages.find(l => l.language.id === lang.id)) {
      toast.error("Language already added");
      return;
    }
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
      toast.success(`${lang.name} added`);
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
      toast.success("Language removed");
    } catch {
      toast.error("Failed to remove language");
    }
  };

  // --- Preferred Locations ---
  const handleAddLocation = () => {
    const val = locationInput.trim();
    if (!val) return;
    if (formData.preferredLocations.includes(val)) return;
    setFormData(prev => ({ ...prev, preferredLocations: [...prev.preferredLocations, val] }));
    setLocationInput("");
  };

  const handleRemoveLocation = (loc) => {
    setFormData(prev => ({ ...prev, preferredLocations: prev.preferredLocations.filter(l => l !== loc) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      experienceYears: formData.experienceYears !== "" ? parseInt(formData.experienceYears) : null,
      expectedSalary: formData.expectedSalary || undefined,
      preferredLocations: formData.preferredLocations,
    };
    onSave(payload);
  };

  const inputClass = "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400 text-sm";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";
  const sectionClass = "space-y-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0";

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Professional Details</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your experience, skills, languages and preferences.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Experience & Salary */}
        <div className={sectionClass}>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Experience & Expected Wage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Total Experience (Years)</label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 5"
                min="0"
                max="50"
              />
            </div>
            <div>
              <label className={labelClass}>Expected Daily Wage</label>
              <input
                type="text"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. ₹1000/day"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className={sectionClass}>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Skills</h3>
          <SearchableSelect
            placeholder="Search and add a skill..."
            options={allSkills.filter(s => !workerSkills.find(ws => ws.skill?.id === s.id))}
            onSelect={handleAddSkill}
            loading={skillsLoading || addingSkill}
          />
          {workerSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-3">
              {workerSkills.map((ws) => (
                <Tag
                  key={ws.skill?.id}
                  label={ws.skill?.name}
                  onRemove={() => handleRemoveSkill(ws.skill?.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic mt-2">No skills added yet. Search above to add your skills.</p>
          )}
        </div>

        {/* Languages */}
        <div className={sectionClass}>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Languages Known</h3>
          <SearchableSelect
            placeholder="Search and add a language..."
            options={allLanguages.filter(l => !workerLanguages.find(wl => wl.language?.id === l.id))}
            onSelect={handleAddLanguage}
            loading={langsLoading || addingLang}
          />
          {workerLanguages.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-3">
              {workerLanguages.map((wl) => (
                <Tag
                  key={wl.language?.id}
                  label={wl.language?.name}
                  onRemove={() => handleRemoveLanguage(wl.language?.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic mt-2">No languages added yet. Search above to add your languages.</p>
          )}
        </div>

        {/* Preferred Work Locations */}
        <div className={sectionClass}>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Preferred Work Locations</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddLocation(); } }}
              className={`${inputClass} flex-1`}
              placeholder="e.g. Kochi, Trivandrum, Kozhikode (press Enter)"
            />
            <button
              type="button"
              onClick={handleAddLocation}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {formData.preferredLocations.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.preferredLocations.map((loc) => (
                <Tag key={loc} label={loc} onRemove={() => handleRemoveLocation(loc)} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic mt-2">No preferred locations added yet.</p>
          )}
        </div>

        <div className="pt-5 flex justify-end">
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
