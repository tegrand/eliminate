import { useState } from "react";
import { Save } from "lucide-react";

export default function ContactInfoForm({ data, onSave, saving, hideHeader }) {
  const [formData, setFormData] = useState({
    phone: data?.phone || "",
    email: data?.user?.email || "",
    addressLine1: data?.addressLine1 || "",
    addressLine2: data?.addressLine2 || "",
    city: data?.city || "",
    state: data?.state || "",
    country: data?.country || "",
    postalCode: data?.postalCode || "",
    emergencyContactName: data?.emergencyContactName || "",
    emergencyContactPhone: data?.emergencyContactPhone || "",
    emergencyContactRelation: data?.emergencyContactRelation || "",
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
      {!hideHeader && (
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">Contact Details</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your contact information and emergency contacts.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Basic Contact */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3">Basic Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Mobile Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              placeholder="Enter mobile number"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-3 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 text-slate-400 rounded-xl cursor-not-allowed text-sm"
            />
            <p className="text-[11px] text-slate-400 mt-1">Email cannot be changed here. Contact support.</p>
          </div>
        </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3">Address Information</h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-medium text-slate-700">Address Line 1</label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                placeholder="House/Flat No., Building Name, Street"
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-medium text-slate-700">Address Line 2 (Optional)</label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                placeholder="Area, Landmark"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Postal/PIN Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3">Emergency Contact</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50">
            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <label className="text-sm font-medium text-slate-700">Contact Name</label>
              <input
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                placeholder="Name"
              />
            </div>
            <div className="space-y-1.5 col-span-1">
              <label className="text-sm font-medium text-slate-700">Contact Number</label>
              <input
                type="text"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                placeholder="Phone Number"
              />
            </div>
            <div className="space-y-1.5 col-span-1">
              <label className="text-sm font-medium text-slate-700">Relationship</label>
              <input
                type="text"
                name="emergencyContactRelation"
                value={formData.emergencyContactRelation}
                onChange={handleChange}
                className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                placeholder="e.g., Brother, Spouse"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
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
