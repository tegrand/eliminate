import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User, Phone, Briefcase, FileText, Loader2, Save } from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";
import api from "../../../api/axios";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ContactInfoForm from "../components/ContactInfoForm";
import ProfessionalInfoForm from "../components/ProfessionalInfoForm";
import DocumentsForm from "../components/DocumentsForm";

export default function WorkerProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/workers/my-profile");
        setProfileData(response.data.data);
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (updatedFields) => {
    try {
      setSaving(true);
      const response = await api.patch(`/workers/my-profile`, updatedFields);
      setProfileData(response.data.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const tabs = [
    { id: "personal", label: "Personal Information", icon: User },
    { id: "contact", label: "Contact Details", icon: Phone },
    { id: "professional", label: "Professional Details", icon: Briefcase },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto pt-4 pb-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your personal information and documents</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-700">
            Profile Completion: <span className="font-bold text-indigo-600">65%</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-4 shrink-0">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap md:whitespace-normal
                    ${isActive 
                      ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                    }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8">
          {activeTab === "personal" && <PersonalInfoForm data={profileData} onSave={handleSave} saving={saving} />}
          {activeTab === "contact" && <ContactInfoForm data={profileData} onSave={handleSave} saving={saving} />}
          {activeTab === "professional" && <ProfessionalInfoForm data={profileData} onSave={handleSave} saving={saving} />}
          {activeTab === "documents" && <DocumentsForm data={profileData} onSave={handleSave} saving={saving} />}
        </div>
      </div>
    </div>
  );
}
