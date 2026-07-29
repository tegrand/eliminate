import { Briefcase, MapPin, Clock, CalendarDays, ArrowRight, MoreVertical } from "lucide-react";

export default function WorkerJobsWidget({ activeJob, upcomingJobs }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col h-full">
      <div className="flex justify-between items-start mb-5">
        <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Briefcase className="w-3.5 h-3.5" />
          </div>
          Job Assignments
        </h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreVertical className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Active Job */}
      <div className="mb-5">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Current Active Job</h4>
        {activeJob ? (
          <div className="bg-blue-50/50 p-3.5 rounded-xl relative overflow-hidden group hover:bg-blue-50/80 transition-colors cursor-pointer border border-blue-50/50">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 rounded-l-xl" />
            <div className="pl-1">
              <h5 className="font-bold text-slate-900 text-[13px] mb-1">{activeJob.title}</h5>
              <p className="text-[11px] text-blue-600 font-semibold mb-2.5">{activeJob.client}</p>
              
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-5 text-[10px] text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {activeJob.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {new Date(activeJob.date).toLocaleDateString()} ({activeJob.duration})
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-200 p-3.5 rounded-xl text-center text-xs text-gray-500">
            No active job right now. You are marked as available.
          </div>
        )}
      </div>

      {/* Upcoming Jobs */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Upcoming Shifts</h4>
          <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        
        {upcomingJobs && upcomingJobs.length > 0 ? (
          <div className="space-y-2">
            {upcomingJobs.map((job) => (
              <div key={job.id} className="flex items-center gap-3 p-2 bg-white border border-slate-100 rounded-xl shadow-[0_2px_8px_-4px_rgba(0,0,0,0.02)] hover:border-blue-100 transition-colors group cursor-pointer">
                <div className="bg-indigo-50/50 text-indigo-600 rounded-lg p-2 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h6 className="font-bold text-slate-900 text-[11px] mb-0.5">{job.title}</h6>
                  <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-500">
                    <span className="text-slate-700">{new Date(job.date).toLocaleDateString()}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>{job.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No upcoming shifts scheduled.</p>
        )}
      </div>
    </div>
  );
}
