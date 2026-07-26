import { Briefcase, MapPin, Clock, CalendarDays, ArrowRight } from "lucide-react";

export default function WorkerJobsWidget({ activeJob, upcomingJobs }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-5 flex items-center gap-2">
        <Briefcase className="w-4 h-4 text-indigo-500" />
        Job Assignments
      </h3>

      {/* Active Job */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold text-gray-500 mb-3">CURRENT ACTIVE JOB</h4>
        {activeJob ? (
          <div className="bg-indigo-50/50 border border-indigo-100/50 p-4 rounded-xl relative overflow-hidden group hover:border-indigo-200 transition-colors cursor-pointer">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
            <h5 className="font-bold text-gray-900 text-lg mb-1">{activeJob.title}</h5>
            <p className="text-sm text-indigo-700 font-medium mb-3">{activeJob.client}</p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gray-400" />
                {activeJob.location}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                {activeJob.shift}
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
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-gray-500">UPCOMING SHIFTS</h4>
          <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        
        {upcomingJobs && upcomingJobs.length > 0 ? (
          <div className="space-y-3">
            {upcomingJobs.map((job) => (
              <div key={job.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100 group">
                <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-2 text-center min-w-[3rem] group-hover:border-indigo-200 transition-colors">
                  <CalendarDays className="w-5 h-5 mx-auto text-indigo-500 mb-1" />
                </div>
                <div>
                  <h6 className="font-semibold text-gray-900 text-sm">{job.title}</h6>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span className="font-medium text-gray-700">{job.date}</span>
                    <span>•</span>
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
