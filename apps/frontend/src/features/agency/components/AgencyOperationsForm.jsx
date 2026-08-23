import { useState } from "react";
import { Save, Loader2, MapPin, X, Plus } from "lucide-react";

export default function AgencyOperationsForm({ data, onSave, saving, hideHeader, isOpen, onClose }) {
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

  if (isOpen === false) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddArea = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && newArea.trim() !== "") {
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
    if (onClose) onClose();
  };

  const inputClass = "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-slate-800 placeholder:text-slate-400 text-sm font-medium outline-none";
  const labelClass = "block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide";

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5 text-violet-600" /> Office Address
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="sm:col-span-2">
            <input type="text" name="street" placeholder="Street / Address Line 1" value={formData.street} onChange={handleChange} className={inputClass} />
          </div>
          <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className={inputClass} />
          <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} className={inputClass} />
          <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <label className={labelClass}>Service Areas</label>
        <div className="flex flex-wrap gap-1.5 items-center mb-2">
          {formData.serviceAreas.map((area, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-700 rounded-lg text-xs font-bold border border-violet-100">
              {area}
              <button type="button" onClick={() => handleRemoveArea(area)} className="text-violet-400 hover:text-violet-800 transition-colors ml-0.5 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newArea}
            onChange={(e) => setNewArea(e.target.value)}
            onKeyDown={handleAddArea}
            placeholder="Add new service area..."
            className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-violet-500 font-medium"
          />
          <button type="button" onClick={handleAddArea} className="px-3 py-1.5 bg-violet-100 hover:bg-violet-200 text-violet-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <label className={labelClass}>Business Hours</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <p className="text-[10px] font-bold text-slate-500 mb-1">Working Days</p>
            <input type="text" name="workingDays" value={formData.workingDays} onChange={handleChange} placeholder="e.g. Mon - Sat" className={inputClass} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 mb-1">Opening Time</p>
            <input type="time" name="open" value={formData.open} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 mb-1">Closing Time</p>
            <input type="time" name="close" value={formData.close} onChange={handleChange} className={inputClass} />
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex justify-end gap-3 shrink-0">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-70 cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );

  if (isOpen) {
    return (
      <div 
        className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-md animate-fade-in"
        style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg overflow-hidden animate-slide-up-sm border border-slate-100 max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 shrink-0">
            <h2 className="text-base font-bold text-slate-900">Edit Operational Details</h2>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-5 overflow-y-auto flex-1">
            {formContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {!hideHeader && (
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">Operational Details</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage office address, service areas, and hours.</p>
        </div>
      )}
      {formContent}
    </div>
  );
}
