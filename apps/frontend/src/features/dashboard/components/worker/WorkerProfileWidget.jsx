import { UserCircle2, Building, ShieldCheck, Activity } from "lucide-react";

export default function WorkerProfileWidget({ profile }) {
  const isAvailable = profile.status === "ACTIVE";

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <UserCircle2 className="w-24 h-24 text-blue-600" />
      </div>
      
      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-5 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-blue-500" />
        Worker Profile
      </h3>

      <div className="space-y-6">
        {/* Profile Completion */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-gray-600">Profile Completion</span>
            <span className="text-xl font-bold text-gray-900">{profile.completion}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${profile.completion}%` }}
            >
              <div className="absolute top-0 left-0 bottom-0 right-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Status */}
          <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100/50">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Activity className="w-3.5 h-3.5" />
              Current Status
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="font-semibold text-gray-900 capitalize">
                {profile.status === "ACTIVE" ? "Available" : profile.status.replace("_", " ").toLowerCase()}
              </span>
            </div>
          </div>

          {/* Agency */}
          <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100/50">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Building className="w-3.5 h-3.5" />
              Current Agency
            </div>
            <div className="font-semibold text-gray-900 truncate" title={profile.currentAgency}>
              {profile.currentAgency}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
