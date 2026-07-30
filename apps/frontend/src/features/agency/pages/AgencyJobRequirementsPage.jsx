import { useState } from "react";
import { Briefcase, Clock, CheckCircle, XCircle, PlayCircle, Plus, Search, Filter, Calendar, MapPin, Users, ChevronRight, UserPlus } from "lucide-react";
import clsx from "clsx";
import WorkerAssignmentModal from "../components/WorkerAssignmentModal";

const MOCK_REQUIREMENTS = [
  { id: "REQ-001", title: "Senior Plumbers for Commercial Site", client: "BuildRight Construction", location: "Austin, TX", date: "Aug 15, 2026", required: 5, assigned: 0, status: "New" },
  { id: "REQ-002", title: "Warehouse Logistics Team", client: "Global Logistics Corp", location: "Chicago, IL", date: "Aug 10, 2026", required: 20, assigned: 20, status: "Assigned" },
  { id: "REQ-003", title: "Registered Nurses - ER", client: "Healthcare Partners", location: "Boston, MA", date: "Aug 01, 2026", required: 10, assigned: 10, status: "Ongoing" },
  { id: "REQ-004", title: "Event Staff for Tech Summit", client: "Nexus Tech Solutions", location: "New York, NY", date: "Jul 20, 2026", required: 15, assigned: 15, status: "Completed" },
  { id: "REQ-005", title: "Temporary Cooks", client: "Starlight Hospitality", location: "Miami, FL", date: "Jul 25, 2026", required: 3, assigned: 0, status: "Cancelled" },
];

export default function AgencyJobRequirementsPage() {
  const [activeTab, setActiveTab] = useState("New");
  const [searchQuery, setSearchQuery] = useState("");
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);

  const tabs = [
    { id: "New", label: "New Requirements", icon: Plus },
    { id: "Assigned", label: "Assigned", icon: Users },
    { id: "Ongoing", label: "Ongoing", icon: PlayCircle },
    { id: "Completed", label: "Completed", icon: CheckCircle },
    { id: "Cancelled", label: "Cancelled", icon: XCircle },
  ];

  const filteredReqs = MOCK_REQUIREMENTS.filter(req => 
    req.status === activeTab && 
    (req.title.toLowerCase().includes(searchQuery.toLowerCase()) || req.client.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openAssignmentModal = (req) => {
    setSelectedReq(req);
    setAssignmentModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-indigo-600" />
            Job Requirements
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage client requests and assign your workers effectively.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search requirements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-indigo-600 shadow-sm transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-xl mb-6 overflow-x-auto border border-gray-200/50 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                isActive 
                  ? "bg-white text-indigo-700 shadow-sm ring-1 ring-black/5" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              )}
            >
              <Icon className={clsx("w-4 h-4", isActive ? "text-indigo-600" : "text-gray-400")} />
              {tab.label}
              <span className={clsx(
                "ml-1.5 px-2 py-0.5 rounded-full text-xs",
                isActive ? "bg-indigo-100 text-indigo-700" : "bg-gray-200 text-gray-600"
              )}>
                {MOCK_REQUIREMENTS.filter(r => r.status === tab.id).length}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReqs.map((req) => (
          <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_20px_-6px_rgba(6,81,237,0.15)] transition-all duration-300 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 leading-tight mb-1">{req.title}</h3>
                <p className="text-sm text-indigo-600 font-medium">{req.client}</p>
              </div>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md shrink-0">
                {req.id}
              </span>
            </div>
            
            <div className="space-y-2 mb-6 flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                {req.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                Start: {req.date}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-gray-400" />
                Workers: {req.assigned} / {req.required}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-5">
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-gray-500">Assignment Progress</span>
                <span className={clsx(
                  req.assigned === req.required ? "text-emerald-600" : "text-indigo-600"
                )}>{Math.round((req.assigned / req.required) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={clsx("h-full rounded-full transition-all duration-500", req.assigned === req.required ? "bg-emerald-500" : "bg-indigo-500")} 
                  style={{ width: `${(req.assigned / req.required) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100 mt-auto">
              {(activeTab === "New" || activeTab === "Assigned" || activeTab === "Ongoing") && (
                <button 
                  onClick={() => openAssignmentModal(req)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Manage Assignment
                </button>
              )}
              {(activeTab === "Completed" || activeTab === "Cancelled") && (
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium rounded-lg transition-colors">
                  View Details <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        
        {filteredReqs.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No {activeTab.toLowerCase()} requirements</h3>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>

      <WorkerAssignmentModal 
        isOpen={assignmentModalOpen}
        onClose={() => setAssignmentModalOpen(false)}
        requirement={selectedReq}
        onAssign={(data) => {
          console.log("Action performed:", data);
          setAssignmentModalOpen(false);
        }}
      />
    </div>
  );
}
