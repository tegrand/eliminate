import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersApi } from "../../../api/users.api";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function WorkerSettingsPage() {
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  
  const { mutate: change, isPending } = useMutation({
    mutationFn: (d) => usersApi.changePassword({ currentPassword: d.currentPassword, newPassword: d.newPassword }),
    onSuccess: () => { toast.success("Password changed!"); reset(); },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to change password"),
  });

  const toggle = (field) => setShow(s => ({ ...s, [field]: !s[field] }));

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
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
