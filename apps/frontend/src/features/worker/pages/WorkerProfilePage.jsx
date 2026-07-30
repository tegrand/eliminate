import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  User, MapPin, Briefcase, Loader2, Save, FileText, 
  BarChart2, Folder, CheckCircle2, Circle, 
  Calendar, Clock, X, Upload
} from "lucide-react";
import { toast } from "sonner";
import { workerApi } from "../api/worker.api";
import Button from "../../../components/ui/button/Button";
import MyDocumentsPage from "../../documents/pages/MyDocumentsPage";

const WORK_PREFS = [
  { id: "Daily Work", label: "Daily Work", icon: Calendar },
  { id: "Contract Work", label: "Contract Work", icon: FileText },
  { id: "Long-Term", label: "Long-Term", icon: Clock },
  { id: "Part-Time", label: "Part-Time", icon: Clock },
  { id: "Full-Time", label: "Full-Time", icon: Briefcase }
];

export default function WorkerProfilePage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    workPreferences: [],
    preferredDistrict: "",
    preferredState: "",
    maxTravelDistance: "",
    willingToRelocate: false,
  });

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["workerProfile"],
    queryFn: async () => {
      const res = await workerApi.getMyWorkerProfile();
      return res.data ?? res;
    }
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        gender: profileData.gender || "",
        workPreferences: profileData.workPreferences || [],
        preferredDistrict: profileData.preferredDistrict || "",
        preferredState: profileData.preferredState || "",
        maxTravelDistance: profileData.maxTravelDistance || "",
        willingToRelocate: profileData.willingToRelocate || false,
      });
    }
  }, [profileData]);

  const updateMutation = useMutation({
    mutationFn: (data) => workerApi.updateMyWorkerProfile(data),
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries(["workerProfile"]);
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to update profile")
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handlePreferenceToggle = (pref) => {
    setFormData(prev => {
      const isSelected = prev.workPreferences.includes(pref);
      return {
        ...prev,
        workPreferences: isSelected 
          ? prev.workPreferences.filter(p => p !== pref)
          : [...prev.workPreferences, pref]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      maxTravelDistance: formData.maxTravelDistance ? parseInt(formData.maxTravelDistance) : null
    };
    updateMutation.mutate(payload);
  };

  // Calculate completion
  const completionItems = [
    { name: "Basic Information", filled: formData.firstName && formData.lastName && formData.gender },
    { name: "Work Preferences", filled: formData.workPreferences.length > 0 },
    { name: "Location Preferences", filled: formData.preferredState && formData.preferredDistrict },
    { name: "Documents", filled: false } // Real documents calculation requires checking uploaded docs, placeholder for now
  ];
  const completedCount = completionItems.filter(i => i.filled).length;
  const totalCount = completionItems.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-6 pb-24 space-y-6 animate-fade-in px-4 sm:px-6 lg:px-8">
      
      <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
        
        {/* TOP ROW: Profile Completion & Documents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Profile Completion Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <h2 className="text-[15px] font-bold text-slate-900">Profile Completion</h2>
              </div>
              <button type="button" className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors">
                View Details
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 items-center">
              {/* Circular Progress */}
              <div className="relative w-32 h-32 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="10" fill="none" />
                  <circle 
                    cx="50" cy="50" r="40" 
                    stroke="#4f46e5" strokeWidth="10" fill="none" 
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionPercentage / 100)}`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-slate-900">{completionPercentage}%</span>
                  <span className="text-[10px] text-slate-500 font-medium">Complete</span>
                </div>
              </div>

              {/* Checklist */}
              <div className="flex-1 w-full space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed mb-4">Complete your profile to get better matches and opportunities.</p>
                <div className="space-y-3">
                  {completionItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        {item.filled ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300" />
                        )}
                        <span className={`text-sm ${item.filled ? 'text-slate-900' : 'text-slate-500'}`}>{item.name}</span>
                      </div>
                      <span className="text-xs font-medium text-slate-400">
                        {item.filled ? "Complete" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Documents Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Folder className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-slate-900">Documents</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Upload your documents to verify your profile</p>
                </div>
              </div>
              <button type="button" className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors">
                View All
              </button>
            </div>

            {/* Embed actual documents page here to keep it functional */}
            <div className="flex-1 overflow-y-auto min-h-[200px]">
               <MyDocumentsPage embedded={true} />
            </div>
          </div>

        </div>

        {/* MIDDLE ROW: Basic Info & Work Preferences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Basic Information Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-slate-900">Basic Information</h2>
                <p className="text-xs text-slate-500 mt-0.5">Update your personal details</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    required
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Gender</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none appearance-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Work Preferences Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-slate-900">Work Preferences</h2>
                <p className="text-xs text-slate-500 mt-0.5">Select your preferred work types</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {WORK_PREFS.map(pref => {
                const isSelected = formData.workPreferences.includes(pref.id);
                return (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => handlePreferenceToggle(pref.id)}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      isSelected 
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500 shadow-sm" 
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <pref.icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="text-[10px] sm:text-xs font-semibold text-center leading-tight">{pref.label}</span>
                    
                    {isSelected && (
                      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white">
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 mt-4 flex items-center gap-1.5">
               <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">i</span>
               Please select at least one work preference to get better matches.
            </p>
          </div>

        </div>

        {/* BOTTOM ROW: Location Preferences */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-slate-900">Location Preferences</h2>
              <p className="text-xs text-slate-500 mt-0.5">Tell us where you prefer to work</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Preferred State</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="preferredState"
                  value={formData.preferredState}
                  onChange={handleChange}
                  placeholder="e.g. Kerala"
                  className="w-full pl-9 pr-3 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Preferred District</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="preferredDistrict"
                  value={formData.preferredDistrict}
                  onChange={handleChange}
                  placeholder="e.g. Ernakulam"
                  className="w-full pl-9 pr-3 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Maximum Travel Distance (km)</label>
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="number"
                  name="maxTravelDistance"
                  value={formData.maxTravelDistance}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g. 50"
                  className="w-full pl-9 pr-12 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-xs font-medium text-slate-400">km</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex items-center pt-2">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="willingToRelocate"
                    checked={formData.willingToRelocate}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`block w-10 h-5 rounded-full transition-colors ${formData.willingToRelocate ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                  <div className={`absolute left-[2px] top-[2px] bg-white w-4 h-4 rounded-full transition-transform ${formData.willingToRelocate ? 'transform translate-x-5' : ''}`}></div>
                </div>
                <div className="ml-3 text-sm font-semibold text-slate-700">
                  Willing to Relocate
                </div>
              </label>
            </div>
          </div>
        </div>

      </form>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 flex justify-end gap-3 md:pl-64">
        <Button 
          type="button" 
          variant="outline"
          className="px-6 rounded-xl text-slate-700 border-slate-200 hover:bg-slate-50"
        >
          <X className="w-4 h-4 mr-1.5" />
          Cancel
        </Button>
        <Button 
          type="submit" 
          form="profile-form"
          loading={updateMutation.isPending}
          className="px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700"
        >
          <Save className="w-4 h-4 mr-1.5" />
          Save Changes
        </Button>
      </div>

    </div>
  );
}
