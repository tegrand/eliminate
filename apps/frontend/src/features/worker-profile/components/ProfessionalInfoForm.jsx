import { useState } from "react";
import { Save } from "lucide-react";

export default function ProfessionalInfoForm({ data, onSave, saving }) {
  const [formData, setFormData] = useState({
    experienceYears: data?.experienceYears || "",
    expectedSalary: data?.expectedSalary || "",
    preferredLocations: data?.preferredLocations ? data.preferredLocations.join(", ") : "",
    // We will keep skills, categories and languages as comma separated text for now
    // In a real scenario, these would use MultiSelect components and fetch data from APIs
    skills: "Plumbing, Electrical Work, Maintenance", // Mocked
    languages: "English, Malayalam, Hindi", // Mocked
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert comma separated preferredLocations to array before sending
    const payload = {
      ...formData,
      experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : null,
      preferredLocations: formData.preferredLocations 
        ? formData.preferredLocations.split(",").map(s => s.trim()).filter(Boolean) 
        : [],
    };
    onSave(payload);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Professional Details</h2>
        <p className="text-sm text-slate-500 mt-1">Update your experience, skills, and preferences.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Experience & Salary */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Experience & Salary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Total Experience (Years)</label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                placeholder="e.g., 5"
                min="0"
                max="50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Expected Salary (per day/month)</label>
              <input
                type="text"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                placeholder="e.g., ₹1000/day"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Preferences</h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Preferred Work Locations (Comma separated)</label>
              <input
                type="text"
                name="preferredLocations"
                value={formData.preferredLocations}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                placeholder="e.g., Kochi, Trivandrum, Kozhikode"
              />
            </div>
          </div>
        </div>

        {/* Skills & Languages (Mocked for now) */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Skills & Languages</h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Key Skills (Coming soon)</label>
              <input
                type="text"
                disabled
                value={formData.skills}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Languages Known (Coming soon)</label>
              <input
                type="text"
                disabled
                value={formData.languages}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
