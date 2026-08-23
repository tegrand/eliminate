import { toast } from "sonner";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function WorkerSettingsPage() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
    toast.success("Language preference updated successfully!");
  };

  return (
    <div className="py-6 w-full animate-fade-in space-y-5 max-w-2xl mx-auto px-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-slate-500 text-xs mt-1">Manage your language preferences.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-5">
        
        {/* Language Preferences Card */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <Globe className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Language Settings</h2>
          </div>
          <div className="flex flex-col gap-1.5 max-w-sm">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Display Language</label>
            <select 
              value={i18n.language || "en"} 
              onChange={handleLanguageChange} 
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
            >
              <option value="en">English</option>
              <option value="ml">മലയാളം (Malayalam)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}
