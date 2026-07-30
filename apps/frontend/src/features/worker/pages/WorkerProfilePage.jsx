import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, MapPin, Briefcase, Loader2, Save, FileText } from "lucide-react";
import { toast } from "sonner";
import { workerApi } from "../api/worker.api";
import Button from "../../../components/ui/button/Button";
import MyDocumentsPage from "../../documents/pages/MyDocumentsPage";

const WORK_PREFERENCES = [
  "Daily Work",
  "Contract Work",
  "Long-Term",
  "Part-Time",
  "Full-Time"
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your professional information and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-5">
            <User className="w-4 h-4 text-indigo-500" />
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Work Preferences */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-5">
            <Briefcase className="w-4 h-4 text-indigo-500" />
            Work Preferences
          </h2>
          
          <div className="flex flex-wrap gap-2">
            {WORK_PREFERENCES.map(pref => {
              const isSelected = formData.workPreferences.includes(pref);
              return (
                <button
                  key={pref}
                  type="button"
                  onClick={() => handlePreferenceToggle(pref)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isSelected 
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-600 shadow-sm" 
                      : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {pref}
                </button>
              );
            })}
          </div>
          {formData.workPreferences.length === 0 && (
            <p className="text-xs text-amber-600 mt-3">Please select at least one work preference to get better matches.</p>
          )}
        </div>

        {/* Preferred Locations */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-5">
            <MapPin className="w-4 h-4 text-indigo-500" />
            Location Preferences
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preferred State</label>
              <input
                type="text"
                name="preferredState"
                value={formData.preferredState}
                onChange={handleChange}
                placeholder="e.g. Kerala"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preferred District</label>
              <input
                type="text"
                name="preferredDistrict"
                value={formData.preferredDistrict}
                onChange={handleChange}
                placeholder="e.g. Ernakulam"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Maximum Travel Distance (km)</label>
              <input
                type="number"
                name="maxTravelDistance"
                value={formData.maxTravelDistance}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 50"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
              />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="willingToRelocate"
                    checked={formData.willingToRelocate}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`block w-10 h-5 rounded-full transition-colors ${formData.willingToRelocate ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                  <div className={`absolute left-[2px] top-[2px] bg-white w-4 h-4 rounded-full transition-transform ${formData.willingToRelocate ? 'transform translate-x-5' : ''}`}></div>
                </div>
                <div className="ml-3 text-sm font-medium text-slate-700">
                  Willing to Relocate
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-5">
            <FileText className="w-4 h-4 text-indigo-500" />
            My Documents
          </h2>
          <MyDocumentsPage embedded={true} />
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            loading={updateMutation.isPending}
            className="px-8"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
