import { useState } from "react";
import { Save, Loader2, MapPin, X } from "lucide-react";

export default function AgencyOperationsForm({ data, onSave, saving, hideHeader }) {
  const [formData, setFormData] = useState({
    street: data?.address?.street || "",
    city: data?.address?.city || "",
    state: data?.address?.state || "",
    pincode: data?.address?.pincode || "",
    serviceAreas: data?.serviceAreas || [],
    workingDays: data?.businessHours?.workingDays || "",
    open: data?.businessHours?.open || "",
    close: data?.businessHours?.close || "",
  });

  const [newArea, setNewArea] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddArea = (e) => {
    if (e.key === 'Enter' && newArea.trim() !== "") {
      e.preventDefault();
      if (!formData.serviceAreas.includes(newArea.trim())) {
        setFormData({
          ...formData,
          serviceAreas: [...formData.serviceAreas, newArea.trim()]
        });
      }
      setNewArea("");
    }
  };

  const handleRemoveArea = (areaToRemove) => {
    setFormData({
      ...formData,
      serviceAreas: formData.serviceAreas.filter(area => area !== areaToRemove)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...data,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      serviceAreas: formData.serviceAreas,
      businessHours: {
        workingDays: formData.workingDays,
        open: formData.open,
        close: formData.close,
      }
    });
  };

  const inputClass = "w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400 text-sm";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";
  const sectionClass = "space-y-6";

  return (
    <div className="animate-fade-in">
      {!hideHeader && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Operational Details</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your office address, service areas, and business hours.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className={sectionClass}>
          
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <MapPin className="w-4 h-4 text-slate-400" /> Office Address
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input type="text" name="street" placeholder="Street" value={formData.street} onChange={handleChange} className={inputClass} />
              </div>
              <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className={inputClass} />
              <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} className={inputClass} />
              <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <label className={labelClass}>Service Areas</label>
            <div className="flex flex-wrap gap-2 items-center">
              {formData.serviceAreas.map((area, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-[11px] font-bold tracking-wide">
                  {area}
                  <button type="button" onClick={() => handleRemoveArea(area)} className="text-indigo-400 hover:text-indigo-800 transition-colors ml-1 focus:outline-none">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                onKeyDown={handleAddArea}
                placeholder="Type area & press Enter..."
                className="w-48 text-sm outline-none bg-transparent border-b border-slate-200 focus:border-indigo-500 py-1 px-1 transition-colors"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <label className={labelClass}>Business Hours</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Working Days</p>
                <input type="text" name="workingDays" value={formData.workingDays} onChange={handleChange} placeholder="e.g. Monday - Saturday" className={inputClass} />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Opening Time</p>
                <input type="time" name="open" value={formData.open} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Closing Time</p>
                <input type="time" name="close" value={formData.close} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
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
