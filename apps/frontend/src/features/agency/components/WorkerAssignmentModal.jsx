import { useState } from "react";
import { Search, Filter, X, Check, Users, UserPlus, RefreshCw, UserMinus, ShieldAlert, BadgeCheck } from "lucide-react";
import clsx from "clsx";
import { Modal } from "../../../components/ui/modal";
import { useWorkers } from "../../../features/worker/hooks/useWorkers";

export default function WorkerAssignmentModal({ isOpen, onClose, requirement, onAssign }) {
  const [activeTab, setActiveTab] = useState("assign");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  
  const { data, isLoading } = useWorkers({ page: 1, limit: 100 });
  const workersData = data?.data?.data || [];

  const tabs = [
    { id: "assign", label: "Assign Workers", icon: UserPlus },
    { id: "manage", label: "Manage Assignment", icon: Users },
  ];

  const filteredWorkers = workersData.filter(w => 
    w?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    w?.primarySkill?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleWorker = (id) => {
    setSelectedWorkers(prev => 
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

  const handleAction = (action, workerId) => {
    // Mock action handler
    onAssign({ action, workerId, requirementId: requirement?.id });
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Worker Assignment" className="max-w-4xl w-full">
      <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-xl mb-6 w-fit">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive ? "bg-white text-indigo-700 shadow-sm ring-1 ring-black/5" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              )}
            >
              <Icon className={clsx("w-4 h-4", isActive ? "text-indigo-600" : "text-gray-400")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mb-6 flex justify-between items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search workers by name or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {activeTab === "assign" ? (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                <tr>
                  <th className="px-6 py-3 w-12">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      onChange={(e) => setSelectedWorkers(e.target.checked ? filteredWorkers.map(w => w.id) : [])}
                      checked={selectedWorkers.length > 0 && selectedWorkers.length === filteredWorkers.length}
                    />
                  </th>
                  <th className="px-6 py-3">Worker Name</th>
                  <th className="px-6 py-3">Skill</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredWorkers.map(worker => (
                  <tr key={worker.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox"
                        checked={selectedWorkers.includes(worker.id)}
                        onChange={() => toggleWorker(worker.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{worker.user?.name || "Unknown"}</td>
                    <td className="px-6 py-4 text-gray-600">{worker.primarySkill?.name || "No Skill"}</td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "px-2.5 py-1 rounded-full text-xs font-medium",
                        worker.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-700"
                      )}>
                        {worker.status || "UNKNOWN"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 flex items-center gap-1">
                      <BadgeCheck className="w-4 h-4 text-gray-300" />
                      N/A
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button 
              onClick={() => handleAction('BULK_ASSIGN', selectedWorkers)}
              disabled={selectedWorkers.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
            >
              Assign {selectedWorkers.length > 0 ? `(${selectedWorkers.length})` : ''} Workers
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                <tr>
                  <th className="px-6 py-3">Assigned Worker</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Displaying the currently assigned workers, mocked from currently selected req for now as backend might not support fetching assigned workers by req id directly yet */}
                {requirement?.applications?.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{app.worker?.user?.name || "Unknown Worker"}</td>
                    <td className="px-6 py-4 text-gray-600">{app.worker?.primarySkill?.name || "No Skill"}</td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button 
                        onClick={() => handleAction('REPLACE', app.worker?.id)}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Replace Worker"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleAction('REASSIGN', app.worker?.id)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Reassign Worker"
                      >
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleAction('REMOVE', app.worker?.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove Worker"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Modal>
  );
}
