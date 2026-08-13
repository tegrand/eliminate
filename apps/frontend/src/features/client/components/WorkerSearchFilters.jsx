import { Search, Filter, CheckSquare } from "lucide-react";
import { useState, useMemo } from "react";

export default function WorkerSearchFilters({ filters, setFilters, onClear, workers = [] }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCheckboxChange = (field) => {
    setFilters(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const uniqueSkills = useMemo(() => {
    if (!workers) return [];
    const skills = workers.map(w => w.primarySkill?.name || (typeof w.primarySkill === 'string' ? w.primarySkill : "") || w.skills?.[0]?.name || "").filter(Boolean);
    return [...new Set(skills)].sort();
  }, [workers]);

  const uniqueLocations = useMemo(() => {
    if (!workers) return [];
    const locs = workers.map(w => {
      if (w.city && w.state) return `${w.city}, ${w.state}`;
      if (w.city) return w.city;
      if (w.state) return w.state;
      return "";
    }).filter(Boolean);
    return [...new Set(locs)].sort();
  }, [workers]);

  const CheckboxField = ({ label, field }) => (
    <label 
      className="flex items-center gap-3 p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
      onClick={() => handleCheckboxChange(field)}
    >
      <div className={`flex items-center justify-center w-5 h-5 rounded border ${filters[field] ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-transparent group-hover:border-blue-400'}`}>
        <CheckSquare className={`w-4 h-4 ${filters[field] ? 'opacity-100' : 'opacity-0'}`} />
      </div>
      <span className="text-sm font-medium text-gray-700 select-none">{label}</span>
    </label>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-4 flex flex-col max-h-[calc(100vh-6rem)] 2xl:max-h-[700px]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          Filter Workers
        </h3>
        <button 
          onClick={onClear}
          className="text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
        
        {/* Search */}
        <div className="space-y-1">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search by name..." 
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Dropdowns */}
        <div className="space-y-2">
          <div className="space-y-1">
            <select name="skill" value={filters.skill} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none">
              <option value="">All Skills</option>
              {uniqueSkills.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <select name="location" value={filters.location} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none">
              <option value="">Any Location</option>
              {uniqueLocations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Experience (Years)</label>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              name="minExperience"
              value={filters.minExperience}
              onChange={handleChange}
              placeholder="Min" 
              min="0"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
            />
            <span className="text-gray-400">-</span>
            <input 
              type="number" 
              name="maxExperience"
              value={filters.maxExperience}
              onChange={handleChange}
              placeholder="Max" 
              min="0"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Preferences Toggles */}
        <div className="space-y-1 pt-1 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Preferences</label>
          <div className="-mx-2">
            <CheckboxField label="Verified Workers Only" field="verifiedOnly" />
            <CheckboxField label="Currently Available" field="availableOnly" />
          </div>
        </div>



      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #d1d5db; }
      `}</style>
    </div>
  );
}
