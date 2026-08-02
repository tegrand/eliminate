import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersApi } from "../../../api/users.api";
import { Lock, Eye, EyeOff, Loader2, BarChart2, CheckCircle2, FileText, Upload, MapPin, Briefcase, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { calculateWorkerProfileCompletion } from "../../../utils/profileCompletion";
import { documentsApi } from "../../../api/documents.api";

export default function WorkerSettingsPage() {
  const { user } = useAuth();
  const percent = calculateWorkerProfileCompletion(user);
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [docType, setDocType] = useState("AADHAAR");
  const [docFile, setDocFile] = useState(null);
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  
  const { mutate: uploadDoc, isPending: isUploadingDoc } = useMutation({
    mutationFn: (data) => documentsApi.uploadDocument(data),
    onSuccess: () => { toast.success("Document uploaded successfully!"); setDocFile(null); },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to upload document"),
  });
  
  const handleDocumentSubmit = (e) => {
    e.preventDefault();
    if (!docFile) return toast.error("Please select a file to upload");
    const formData = new FormData();
    formData.append("documentType", docType);
    formData.append("file", docFile);
    uploadDoc(formData);
  };
  
  const { mutate: change, isPending } = useMutation({
    mutationFn: (d) => usersApi.changePassword({ currentPassword: d.currentPassword, newPassword: d.newPassword }),
    onSuccess: () => { toast.success("Password changed!"); reset(); },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to change password"),
  });

  const toggle = (field) => setShow(s => ({ ...s, [field]: !s[field] }));

  return (
    <div className="py-6 w-full animate-fade-in space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Profile Completion Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-sm font-bold text-gray-900">Profile Completion</h2>
          </div>
          <button 
            onClick={() => navigate("/worker/profile")}
            className="px-3 py-1.5 border border-gray-200 rounded-md text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            View Details
          </button>
        </div>

        <div className="p-3 md:p-4 flex flex-col md:flex-row items-center gap-4">
          {/* Circular Progress */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background track */}
              <circle cx="50" cy="50" r="40" stroke="#F3F4F6" strokeWidth="12" fill="none" />
              {/* Progress track */}
              <circle cx="50" cy="50" r="40" stroke="#4F46E5" strokeWidth="12" fill="none" 
                strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (percent/100))} className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-black text-gray-900 leading-none">{percent}%</span>
              <span className="text-[8px] font-medium text-gray-500 uppercase mt-0.5">Complete</span>
            </div>
          </div>

          {/* Checklist */}
          <div className="flex-1 w-full">
            <p className="text-[11px] text-gray-500 mb-2 font-medium">Complete your profile to get better matches and opportunities.</p>
            <div className="space-y-1">
              {[
                "Basic Information",
                "Work Preferences",
                "Location Preferences",
                "Documents"
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{item}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-400">Complete</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Theme Settings Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">App Theme</h3>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Theme applied successfully!"); }} className="flex flex-col h-full">
            <div className="p-3 space-y-2 flex-1 flex flex-col justify-center">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700 mb-1.5">Select Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {/* Light Theme */}
                  <label className="cursor-pointer group">
                    <input type="radio" name="theme" value="light" defaultChecked className="sr-only peer" />
                    <div className="border border-gray-200 rounded-lg p-2 flex flex-col items-center gap-1.5 transition-all peer-checked:border-blue-600 peer-checked:bg-blue-50/50 hover:bg-gray-50">
                      <div className="w-full h-6 bg-white border border-gray-200 rounded shadow-sm"></div>
                      <span className="text-[10px] font-semibold text-gray-700">Light</span>
                    </div>
                  </label>
                  {/* Dark Theme */}
                  <label className="cursor-pointer group">
                    <input type="radio" name="theme" value="dark" className="sr-only peer" />
                    <div className="border border-gray-200 rounded-lg p-2 flex flex-col items-center gap-1.5 transition-all peer-checked:border-blue-600 peer-checked:bg-blue-50/50 hover:bg-gray-50">
                      <div className="w-full h-6 bg-slate-900 border border-slate-700 rounded shadow-sm"></div>
                      <span className="text-[10px] font-semibold text-gray-700">Dark</span>
                    </div>
                  </label>
                  {/* System Theme */}
                  <label className="cursor-pointer group">
                    <input type="radio" name="theme" value="system" className="sr-only peer" />
                    <div className="border border-gray-200 rounded-lg p-2 flex flex-col items-center gap-1.5 transition-all peer-checked:border-blue-600 peer-checked:bg-blue-50/50 hover:bg-gray-50">
                      <div className="w-full h-6 bg-gradient-to-r from-white to-slate-900 border border-gray-200 rounded shadow-sm"></div>
                      <span className="text-[10px] font-semibold text-gray-700">System</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 flex justify-end mt-auto">
              <button type="submit"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Apply Theme
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Document Upload Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Documents</h3>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <form onSubmit={handleDocumentSubmit} className="flex flex-col h-full">
            <div className="p-4 space-y-3 flex-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Document Type</label>
                <select value={docType} onChange={e => setDocType(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all">
                  <option value="AADHAAR">Aadhaar Card</option>
                  <option value="PAN">PAN Card</option>
                  <option value="DRIVING_LICENSE">Driving License</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Upload File</label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-5 flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer">
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setDocFile(e.target.files[0])} accept=".jpg,.jpeg,.png,.pdf" />
                  <Upload className="w-6 h-6 text-gray-400" />
                  <p className="text-xs text-gray-500 text-center">
                    {docFile ? (
                      <span className="font-medium text-blue-600">{docFile.name}</span>
                    ) : (
                      <><span className="font-medium text-blue-600">Click to upload</span> or drag and drop<br/>SVG, PNG, JPG or PDF (max. 5MB)</>
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end mt-auto">
              <button type="submit" disabled={isUploadingDoc}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
                {isUploadingDoc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload Document
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Work Preferences Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Work Preferences</h3>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Work preferences updated!"); }} className="flex flex-col h-full">
            <div className="p-4 space-y-3 flex-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Preferred Work Type</label>
                <div className="flex flex-wrap gap-2">
                  {["Daily Wage", "Contract", "Monthly Salary", "Part-Time"].map(type => (
                    <label key={type} className="cursor-pointer relative">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="px-3 py-1.5 border-2 border-gray-100 rounded-lg text-xs font-semibold text-gray-600 transition-all peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 peer-checked:shadow-sm hover:border-blue-200 hover:bg-blue-50/50">
                        {type}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end mt-auto">
              <button type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                <CheckCircle2 className="w-4 h-4" />
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Location Preferences Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Location Preferences</h3>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Location preferences updated!"); }} className="flex flex-col h-full">
            <div className="p-4 space-y-3 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Preferred District</label>
                  <input type="text" placeholder="e.g. Ernakulam" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Preferred State</label>
                  <input type="text" placeholder="e.g. Kerala" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Max Travel Distance (km)</label>
                <input type="number" placeholder="e.g. 50" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
              </div>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" />
                  <div className="block w-10 h-5 bg-slate-300 rounded-full transition-colors peer-checked:bg-blue-600"></div>
                  <div className="absolute left-[2px] top-[2px] bg-white w-4 h-4 rounded-full transition-transform"></div>
                </div>
                <span className="text-sm font-semibold text-gray-700">Willing to Relocate</span>
              </label>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end mt-auto">
              <button type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                <CheckCircle2 className="w-4 h-4" />
                Save Location
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Change Password</h3>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <form onSubmit={handleSubmit(change)} className="flex flex-col h-full">
            <div className="p-4 space-y-3 flex-1">
              {[
                { id: "currentPassword", label: "Current Password", placeholder: "Enter current password", field: "current" },
                { id: "newPassword",     label: "New Password",     placeholder: "Enter new password",     field: "new",
                  validate: v => v.length >= 8 || "Minimum 8 characters" },
                { id: "confirmPassword", label: "Confirm Password", placeholder: "Re-enter new password",  field: "confirm",
                  validate: v => v === watch("newPassword") || "Passwords do not match" },
              ].map(({ id, label, placeholder, field, validate }) => (
                <div key={id} className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">{label}</label>
                  <div className="relative">
                    <input
                      {...register(id, { required: `${label} is required`, validate })}
                      type={show[field] ? "text" : "password"}
                      placeholder={placeholder}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all pr-10"
                    />
                    <button type="button" onClick={() => toggle(field)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {show[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors[id] && <p className="text-xs text-red-500">{errors[id].message}</p>}
                </div>
              ))}
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end mt-auto">
              <button type="submit" disabled={isPending}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {isPending ? "Changing…" : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      </div>


      </div>
    </div>
  );
}
