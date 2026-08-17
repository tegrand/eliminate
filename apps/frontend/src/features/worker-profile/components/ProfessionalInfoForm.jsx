import { useState, useEffect, useRef } from "react";
import { Save, X, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../../api/axios";

import CreatableSelect from 'react-select/creatable';

function CustomTagSelect({ placeholder, selectedItems, options, onAdd, onRemove, loading, isLanguage, onCreate }) {
  // Map API items to react-select options
  const selectOptions = options.map(o => ({ value: o.id, label: o.name, raw: o }));
  
  // Map selected items back to react-select format
  const selectValue = selectedItems.map(item => {
    const data = isLanguage ? item.language : item.skill;
    return { value: data?.id, label: data?.name, raw: item };
  });

  const handleChange = (newValue, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      onAdd(actionMeta.option.raw);
    } else if (actionMeta.action === 'remove-value') {
      const removedId = actionMeta.removedValue.value;
      onRemove(removedId);
    } else if (actionMeta.action === 'create-option') {
      if (onCreate) onCreate(actionMeta.option.value);
    }
  };

  return (
    <CreatableSelect
      isMulti
      placeholder={placeholder}
      options={selectOptions}
      value={selectValue}
      onChange={handleChange}
      isLoading={loading}
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: '46px',
          borderColor: state.isFocused ? '#6366f1' : '#e2e8f0',
          borderRadius: '0.75rem',
          boxShadow: state.isFocused ? '0 0 0 2px rgba(99, 102, 241, 0.2)' : 'none',
          '&:hover': { borderColor: state.isFocused ? '#6366f1' : '#cbd5e1' },
          padding: '2px',
        }),
        multiValue: (base) => ({
          ...base,
          backgroundColor: '#e0e7ff',
          borderRadius: '0.375rem',
          padding: '2px',
          margin: '2px 4px 2px 0',
        }),
        multiValueLabel: (base) => ({
          ...base,
          color: '#4338ca',
          fontSize: '12px',
          fontWeight: '700',
        }),
        multiValueRemove: (base) => ({
          ...base,
          color: '#818cf8',
          ':hover': {
            backgroundColor: '#c7d2fe',
            color: '#3730a3',
          },
        }),
      }}
    />
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
  const handleCreateSkill = async (inputValue) => {
    if (!workerId) return;
    try {
      setAddingSkill(true);
      const slug = inputValue.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      // Create skill globally
      const res = await api.post("/skills", { name: inputValue, slug });
      const newSkill = res.data.data;
      
      setAllSkills(prev => [...prev, newSkill]);
      
      // Assign to worker
      await api.post(`/workers/${workerId}/skills`, {
        skillId: newSkill.id,
        proficiencyLevel: "INTERMEDIATE",
        isPrimary: workerSkills.length === 0,
      });
      setWorkerSkills(prev => [...prev, { id: newSkill.id, skill: newSkill, proficiencyLevel: "INTERMEDIATE", isPrimary: prev.length === 0 }]);
      toast.success(`Skill '${newSkill.name}' created and added`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create skill");
    } finally {
      setAddingSkill(false);
    }
  };

  const handleAddSkill = async (skill) => {
    if (!workerId) return;
    if (workerSkills.find(s => s.skill.id === skill.id)) return;
    try {
      setAddingSkill(true);
      await api.post(`/workers/${workerId}/skills`, {
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
  const handleCreateLanguage = async (inputValue) => {
    if (!workerId) return;
    try {
      setAddingLang(true);
      const code = inputValue.toUpperCase().replace(/[^A-Z0-9]+/g, '-').slice(0, 20);
      const res = await api.post("/languages", { name: inputValue, code });
      const newLang = res.data.data;
      
      setAllLanguages(prev => [...prev, newLang]);
      
      await api.post(`/workers/${workerId}/languages`, {
        languageId: newLang.id,
        proficiencyLevel: "CONVERSATIONAL",
        canSpeak: true,
        canRead: true,
        canWrite: false,
        isPrimary: workerLanguages.length === 0,
      });
      setWorkerLanguages(prev => [...prev, { id: newLang.id, language: newLang, proficiencyLevel: "CONVERSATIONAL" }]);
      toast.success(`Language '${newLang.name}' created and added`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create language");
    } finally {
      setAddingLang(false);
    }
  };

  const handleAddLanguage = async (lang) => {
    if (!workerId) return;
    if (workerLanguages.find(l => l.language.id === lang.id)) return;
    try {
      setAddingLang(true);
      await api.post(`/workers/${workerId}/languages`, {
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
    };
    onSave(payload);
  };

  const inputClass = "w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400 text-sm";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide";
  const sectionClass = "space-y-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0";

  return (
    <div className="animate-fade-in">
      {!hideHeader && (
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">Professional Details</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your experience, skills, languages and preferences.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Experience & Salary */}
        <div className={sectionClass}>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className={labelClass}>Experience (Yrs)</label>
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
              <label className={labelClass}>Expected Wage</label>
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
          <CustomTagSelect 
            placeholder="Search and select skills..."
            selectedItems={workerSkills}
            options={allSkills}
            onAdd={handleAddSkill}
            onRemove={handleRemoveSkill}
            onCreate={handleCreateSkill}
            loading={skillsLoading || addingSkill}
            isLanguage={false}
          />
          <p className="text-[11px] text-slate-400 mt-1.5">Add skills relevant to the jobs you want to get hired for.</p>
        </div>

        {/* Languages */}
        <div className={sectionClass}>
          <label className={labelClass}>Languages Known</label>
          <CustomTagSelect 
            placeholder="Search and select languages..."
            selectedItems={workerLanguages}
            options={allLanguages}
            onAdd={handleAddLanguage}
            onRemove={handleRemoveLanguage}
            onCreate={handleCreateLanguage}
            loading={langsLoading || addingLang}
            isLanguage={true}
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
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
