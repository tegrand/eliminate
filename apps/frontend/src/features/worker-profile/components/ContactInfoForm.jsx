import { useState } from "react";
import { Save } from "lucide-react";

export default function ContactInfoForm({ data, onSave, saving, hideHeader, isActive, onDirty }) {
  const [formData, setFormData] = useState({
    phone: data?.phone || "",
    email: data?.user?.email || "",
    addressLine1: data?.addressLine1 || "",
    city: data?.city || "",
    state: data?.state || "",
    country: data?.country || "",
    postalCode: data?.postalCode || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (onDirty) onDirty();
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

      <form id={isActive ? "profile-form" : undefined} onSubmit={handleSubmit} className="space-y-5">
        
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
              onChange={handleChange}
              className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3">Address Information</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Address Line 1</label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                placeholder="House/Flat No., Building Name, Street"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Postal/PIN Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              />
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
