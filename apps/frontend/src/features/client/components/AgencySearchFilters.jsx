import { Search, Filter, CheckSquare, Square } from "lucide-react";
import { useState } from "react";

const MOCK_SKILLS = ["Electrician", "Plumber", "Carpenter", "Mason", "Painter", "Welder", "General Helper"];
const MOCK_LOCATIONS = ["Ernakulam", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Malappuram"];

export default function AgencySearchFilters({ filters, setFilters, onClear }) {
  const handleCheckboxChange = (field) => {
    setFilters(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const CheckboxField = ({ label, field }) => (
    <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group">
      <div className={`flex items-center justify-center w-5 h-5 rounded border ${filters[field] ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-transparent group-hover:border-blue-400'}`}>
        <CheckSquare className={`w-4 h-4 ${filters[field] ? 'opacity-100' : 'opacity-0'}`} />
      </div>
      <span className="text-sm font-medium text-gray-700 select-none">{label}</span>
    </label>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-4 flex flex-col max-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          Filter Agencies
        </h3>
        <button 
          onClick={onClear}
          className="text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="p-5 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        
        {/* Search */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Search</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              name="search"
              value={filters.search || ""}
              onChange={handleChange}
              placeholder="Agency name..." 
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Dropdowns */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location</label>
            <select name="location" value={filters.location || ""} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none">
              <option value="">Any Location</option>
              {MOCK_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Skills Provided</label>
            <select name="skill" value={filters.skill || ""} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none">
              <option value="">All Skills</option>
              {MOCK_SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Preferences Toggles */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Preferences</label>
          <div className="-mx-2">
            <div onClick={() => handleCheckboxChange('verifiedOnly')}>
              <CheckboxField label="Verified Agencies Only" field="verifiedOnly" />
            </div>
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
