import { Briefcase, MapPin, Clock, CalendarDays, ArrowRight, MoreVertical } from "lucide-react";

export default function WorkerJobsWidget({ activeJob, upcomingJobs }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col h-full">
      <div className="flex justify-between items-start mb-8">
        <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Briefcase className="w-5 h-5" />
          </div>
          Job Assignments
        </h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Active Job */}
      <div className="mb-8">
        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Current Active Job</h4>
        {activeJob ? (
          <div className="bg-blue-50/50 p-5 rounded-2xl relative overflow-hidden group hover:bg-blue-50/80 transition-colors cursor-pointer border border-blue-50/50">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600 rounded-l-2xl" />
            <div className="pl-2">
              <h5 className="font-bold text-slate-900 text-lg mb-1">{activeJob.title}</h5>
              <p className="text-[13px] text-blue-600 font-semibold mb-4">{activeJob.client}</p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {activeJob.location}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {activeJob.shift}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-200 p-4 rounded-xl text-center text-sm text-gray-500">
            No active job right now. You are marked as available.
          </div>
        )}
      </div>

      {/* Upcoming Jobs */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Upcoming Shifts</h4>
          <button className="text-[13px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        
        {upcomingJobs && upcomingJobs.length > 0 ? (
          <div className="space-y-3">
            {upcomingJobs.map((job) => (
              <div key={job.id} className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_8px_-4px_rgba(0,0,0,0.02)] hover:border-blue-100 transition-colors group cursor-pointer">
                <div className="bg-indigo-50/50 text-indigo-600 rounded-xl p-3 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h6 className="font-bold text-slate-900 text-[13px] mb-0.5">{job.title}</h6>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                    <span className="text-slate-700">{job.date}</span>
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
