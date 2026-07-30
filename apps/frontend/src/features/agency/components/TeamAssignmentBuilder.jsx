import { useState } from "react";
import { Plus, X, Building2, Users, ArrowRight, UserPlus, Trash2 } from "lucide-react";
import { Modal } from "../../../components/ui/modal";
import clsx from "clsx";

export default function TeamAssignmentBuilder({ isOpen, onClose, onCreate }) {
  const [project, setProject] = useState("");
  const [client, setClient] = useState("");
  const [roles, setRoles] = useState([{ name: "", count: 1 }]);
  
  const addRole = () => {
    setRoles([...roles, { name: "", count: 1 }]);
  };

  const updateRole = (index, field, value) => {
    const newRoles = [...roles];
    newRoles[index][field] = value;
    setRoles(newRoles);
  };

  const removeRole = (index) => {
    if (roles.length === 1) return;
    const newRoles = [...roles];
    newRoles.splice(index, 1);
    setRoles(newRoles);
  };

  const handleCreate = () => {
    // Filter out empty roles
    const validRoles = roles.filter(r => r.name.trim() !== "" && r.count > 0).map(r => ({ ...r, assigned: 0 }));
    if (!project || validRoles.length === 0) return;
    
    onCreate({ project, client, roles: validRoles });
    
    // Reset state
    setProject("");
    setClient("");
    setRoles([{ name: "", count: 1 }]);
  };

  const isFormValid = project.trim() !== "" && roles.some(r => r.name.trim() !== "" && r.count > 0);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Team Assignment" className="max-w-2xl w-full">
      <div className="space-y-6">
        {/* Project Details */}
        <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-500" />
            Project Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Project Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="e.g. Project A" 
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Client (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. BuildRight Construction" 
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Roles & Team Composition */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              Team Composition
            </h3>
            <button 
              onClick={addRole}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium rounded-lg text-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Role
            </button>
          </div>
          
          <div className="space-y-3">
            {roles.map((role, idx) => (
              <div key={idx} className="flex items-start gap-3 relative group">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Role / Skill</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mason, Helper, Painter" 
                    value={role.name}
                    onChange={(e) => updateRole(idx, 'name', e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Count</label>
                  <input 
                    type="number" 
                    min="1"
                    value={role.count}
                    onChange={(e) => updateRole(idx, 'count', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-center"
                  />
                </div>
                {roles.length > 1 && (
                  <button 
                    onClick={() => removeRole(idx)}
                    className="mt-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleCreate}
            disabled={!isFormValid}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Build Team
          </button>
        </div>
      </div>
    </Modal>
  );
}
