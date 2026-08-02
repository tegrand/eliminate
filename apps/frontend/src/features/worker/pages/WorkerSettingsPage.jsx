import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersApi } from "../../../api/users.api";
import { Lock, Eye, EyeOff, Loader2, BarChart2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WorkerSettingsPage() {
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  
  const { mutate: change, isPending } = useMutation({
    mutationFn: (d) => usersApi.changePassword({ currentPassword: d.currentPassword, newPassword: d.newPassword }),
    onSuccess: () => { toast.success("Password changed!"); reset(); },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to change password"),
  });

  const toggle = (field) => setShow(s => ({ ...s, [field]: !s[field] }));

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      
      {/* Profile Completion Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Profile Completion</h2>
          </div>
          <button 
            onClick={() => navigate("/worker/profile")}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            View Details
          </button>
        </div>

        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Circular Progress */}
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background track */}
              <circle cx="50" cy="50" r="40" stroke="#F3F4F6" strokeWidth="12" fill="none" />
              {/* Progress track */}
              <circle cx="50" cy="50" r="40" stroke="#4F46E5" strokeWidth="12" fill="none" 
                strokeDasharray="251.2" strokeDashoffset="0" className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-gray-900 leading-none">100%</span>
              <span className="text-[10px] font-medium text-gray-500 uppercase mt-1">Complete</span>
            </div>
          </div>

          {/* Checklist */}
          <div className="flex-1 w-full">
            <p className="text-sm text-gray-500 mb-5 font-medium">Complete your profile to get better matches and opportunities.</p>
            <div className="space-y-4">
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Change Password</h3>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <form onSubmit={handleSubmit(change)} className="flex flex-col h-full">
            <div className="p-5 space-y-5 flex-1">
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
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex justify-end mt-auto">
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
  );
}
