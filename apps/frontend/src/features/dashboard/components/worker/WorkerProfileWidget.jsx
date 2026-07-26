import { User, Activity, Building, MoreVertical } from "lucide-react";

export default function WorkerProfileWidget({ profile }) {
  const isAvailable = profile.status === "ACTIVE";

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <User className="w-4 h-4" />
          </div>
          Worker Profile
        </h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-6 flex-1">
        {/* Profile Completion */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-slate-700">Profile Completion</span>
            <span className="text-base font-bold text-slate-900">{profile.completion}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${profile.completion}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-auto">
          {/* Status */}
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mb-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              Current Status
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="font-bold text-slate-900 capitalize text-[13px]">
                {profile.status === "ACTIVE" ? "Available" : profile.status.replace("_", " ").toLowerCase()}
              </span>
            </div>
          </div>

          {/* Agency */}
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mb-1.5">
              <Building className="w-3.5 h-3.5 text-blue-500" />
              Current Agency
            </div>
            <div className="font-bold text-slate-900 text-[13px] truncate" title={profile.currentAgency}>
              {profile.currentAgency}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
