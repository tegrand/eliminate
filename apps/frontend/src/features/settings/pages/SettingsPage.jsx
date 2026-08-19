import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, Loader2, Palette } from "lucide-react";

export default function SettingsPage() {
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [isPending, setIsPending] = useState(false);
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

  const change = async (d) => {
    setIsPending(true);
    try {
      const module = await import('../../../features/auth/api/auth.api.js');
      await module.authApi.changePassword({ oldPassword: d.currentPassword, newPassword: d.newPassword });
      toast.success("Password changed successfully!");
      reset();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to change password");
    } finally {
      setIsPending(false);
    }
  };

  const toggle = (field) => setShow(s => ({ ...s, [field]: !s[field] }));

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    toast.success("Theme updated successfully!");
  };

  return (
    <div className="py-6 w-full animate-fade-in space-y-5 max-w-2xl mx-auto px-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 text-xs mt-1">Manage visual theme preferences and global account configurations.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-5">
        
        {/* Theme Preferences Card */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <Palette className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Theme Preferences</h2>
          </div>
          <div className="flex flex-col gap-1.5 max-w-sm">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">App Theme</label>
            <select 
              value={theme} 
              onChange={handleThemeChange} 
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl focus:outline-none focus:border-blue-500 transition-all"
            >
              <option value="light">Light Theme</option>
              <option value="dark">Dark Theme</option>
              <option value="system">System Default</option>
            </select>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <Lock className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Change Password</h2>
          </div>

          <form onSubmit={handleSubmit(change)} className="space-y-4">
            {[
              { id: "currentPassword", label: "Current Password", placeholder: "Enter current password", field: "current" },
              { id: "newPassword",     label: "New Password",     placeholder: "Enter new password",     field: "new",
                validate: v => v.length >= 8 || "Minimum 8 characters" },
              { id: "confirmPassword", label: "Confirm Password", placeholder: "Re-enter new password",  field: "confirm",
                validate: v => v === watch("newPassword") || "Passwords do not match" },
            ].map(({ id, label, placeholder, field, validate }) => (
              <div key={id} className="flex flex-col gap-1.5 max-w-sm">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</label>
                <div className="relative">
                  <input
                    {...register(id, { required: `${label} is required`, validate })}
                    type={show[field] ? "text" : "password"}
                    placeholder={placeholder}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl focus:outline-none focus:border-blue-500 transition-all pr-10"
                  />
                  <button type="button" onClick={() => toggle(field)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655 cursor-pointer">
                    {show[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors[id] && <p className="text-xs text-red-500 font-medium">{errors[id].message}</p>}
              </div>
            ))}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                disabled={isPending}
                className="inline-flex items-center gap-1.5 py-2.5 px-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/10 transition-colors cursor-pointer"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>{isPending ? "Changing…" : "Change Password"}</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
