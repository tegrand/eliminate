import React, { useEffect, useState } from "react";
import { User, Phone, Briefcase, Calendar, CheckCircle } from "lucide-react";
import { workerApi } from "../../worker/api/worker.api";
import { toast } from "react-hot-toast";

export default function WorkerProfilePage() {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const profileData = await workerApi.getMe();
      setProfile(profileData);
      setFormData(profileData);

      const appsData = await workerApi.getMyApplications();
      setApplications(appsData || []);
    } catch (error) {
      console.error("Failed to load profile:", error);
      toast.error("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await workerApi.updateMe({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        gender: formData.gender,
      });
      setProfile(updated);
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-sm text-gray-500">Manage your personal information and view job applications.</p>
        </div>
        {!editMode ? (
          <button onClick={() => setEditMode(true)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200">
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => { setEditMode(false); setFormData(profile); }} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center"><User className="h-5 w-5 mr-2 text-gray-400"/> Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
            {editMode ? (
              <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:border-amber-500 focus:ring-amber-500" value={formData.firstName || ''} onChange={e => setFormData({...formData, firstName: e.target.value})} />
            ) : <p className="text-gray-900 font-medium">{profile?.firstName || "-"}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
            {editMode ? (
              <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:border-amber-500 focus:ring-amber-500" value={formData.lastName || ''} onChange={e => setFormData({...formData, lastName: e.target.value})} />
            ) : <p className="text-gray-900 font-medium">{profile?.lastName || "-"}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
            {editMode ? (
              <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:border-amber-500 focus:ring-amber-500" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
            ) : <p className="text-gray-900 font-medium">{profile?.phone || "-"}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
            {editMode ? (
              <select className="w-full border-gray-300 rounded-lg shadow-sm focus:border-amber-500 focus:ring-amber-500" value={formData.gender || ''} onChange={e => setFormData({...formData, gender: e.target.value})}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            ) : <p className="text-gray-900 font-medium">{profile?.gender || "-"}</p>}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center"><Briefcase className="h-5 w-5 mr-2 text-gray-400"/> My Applications</h3>
        {applications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {applications.map(app => (
              <div key={app.id} className="py-4 flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">{app.jobRequirement?.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            You haven't applied to any jobs yet.
          </div>
        )}
      </div>
    </div>
  );
}
