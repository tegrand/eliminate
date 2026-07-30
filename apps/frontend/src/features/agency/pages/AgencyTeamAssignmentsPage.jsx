import { useState } from "react";
import { Users, Plus, Building2, ChevronRight, UserCheck, Calendar } from "lucide-react";
import clsx from "clsx";
import TeamAssignmentBuilder from "../components/TeamAssignmentBuilder";

export default function AgencyTeamAssignmentsPage() {
  const [builderOpen, setBuilderOpen] = useState(false);
  const [assignments, setAssignments] = useState([
    {
      id: "TA-001",
      project: "Project A",
      client: "BuildRight Construction",
      date: "Jul 30, 2026",
      status: "Active",
      roles: [
        { name: "Mason", count: 5, assigned: 5 },
        { name: "Helper", count: 3, assigned: 3 },
        { name: "Painter", count: 2, assigned: 0 },
      ]
    }
  ]);

  const handleCreateTeam = (newTeamData) => {
    setAssignments([{
      id: `TA-00${assignments.length + 1}`,
      project: newTeamData.project,
      client: newTeamData.client || "Unknown Client",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: "Active",
      roles: newTeamData.roles
    }, ...assignments]);
    setBuilderOpen(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-600" />
            Team Assignments
          </h1>
          <p className="text-sm text-gray-500 mt-1">Group multiple workers and roles into single project teams.</p>
        </div>
        
        <button 
          onClick={() => setBuilderOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-[0_2px_10px_-3px_rgba(79,70,229,0.4)] transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Team Assignment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {assignments.map(team => {
          const totalRequired = team.roles.reduce((sum, r) => sum + r.count, 0);
          const totalAssigned = team.roles.reduce((sum, r) => sum + (r.assigned || 0), 0);
          const progress = Math.round((totalAssigned / totalRequired) * 100) || 0;

          return (
            <div key={team.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_20px_-6px_rgba(6,81,237,0.15)] transition-all duration-300 flex flex-col">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1">{team.project}</h3>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-indigo-600">
                    <Building2 className="w-4 h-4" />
                    {team.client}
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md shrink-0">
                  {team.id}
                </span>
              </div>
              
              <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5" />
                  Team Composition
                </h4>
                <div className="space-y-2.5">
                  {team.roles.map((role, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{role.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">{role.assigned} / {role.count}</span>
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={clsx("h-full rounded-full", role.assigned >= role.count ? "bg-emerald-500" : "bg-indigo-500")}
                            style={{ width: `${Math.min((role.assigned / role.count) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6 mt-auto">
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-gray-500">Overall Progress</span>
                  <span className={clsx(
                    progress >= 100 ? "text-emerald-600" : "text-indigo-600"
                  )}>{progress}% Complete</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={clsx("h-full rounded-full transition-all duration-500", progress >= 100 ? "bg-emerald-500" : "bg-indigo-500")} 
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  Created {team.date}
                </div>
                <button className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                  Manage Team <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <TeamAssignmentBuilder 
        isOpen={builderOpen} 
        onClose={() => setBuilderOpen(false)} 
        onCreate={handleCreateTeam}
      />
    </div>
  );
}
