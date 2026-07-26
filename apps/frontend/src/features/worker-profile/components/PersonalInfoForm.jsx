import { useState } from "react";
import { Save, UserCircle2 } from "lucide-react";

export default function PersonalInfoForm({ data, onSave, saving }) {
  const [formData, setFormData] = useState({
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    dateOfBirth: data?.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : "",
    gender: data?.gender || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
        <p className="text-sm text-slate-500 mt-1">Update your basic profile details and profile picture.</p>
      </div>

      <div className="flex items-start gap-6 mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="w-24 h-24 rounded-full bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center shrink-0 overflow-hidden relative group cursor-pointer">
          {data?.profilePhoto ? (
            <img src={data.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <UserCircle2 className="w-12 h-12 text-slate-400" />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-semibold">Change</span>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base">Profile Photo</h3>
          <p className="text-xs text-slate-500 mt-1 mb-3 max-w-sm">
            Upload a clear, professional photo. We support PNG, JPG, or JPEG up to 5MB.
          </p>
          <button className="px-4 py-2 bg-white border border-slate-200 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            Upload Photo
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              placeholder="Enter first name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              placeholder="Enter last name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
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
