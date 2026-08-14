import { useState, useEffect } from "react";
import { Settings, Save, Loader2, DollarSign } from "lucide-react";
import api from "../../../api/axios";

// ── Main Settings Page ────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [fee, setFee] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/settings");
        if (response.data && response.data.data) {
          setFee(response.data.data.platform_fee_percentage || "");
        }
      } catch (error) {
        setMessage({ type: "error", text: "Failed to load settings." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await api.put("/settings", { platform_fee_percentage: fee });
      setMessage({ type: "success", text: "Settings saved successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save settings." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-full py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="w-6 h-6 text-blue-600" />
          System Settings
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Manage platform configurations and global parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Payment Settings Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Payment Settings
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure platform fees and commission rates.
          </p>
        </div>

        <div className="p-5">
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Fee Percentage (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="e.g. 10"
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              This percentage will be automatically added to the worker's expected daily wage when displayed to clients.
            </p>
          </div>

          {message.text && (
            <div className={`mt-4 p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}
        </div>

        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Settings
          </button>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            Change Password
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Update your account password securely.
          </p>
        </div>

        <div className="p-5">
          <div className="max-w-md space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => {
               const current = document.getElementById('currentPassword').value;
               const newPass = document.getElementById('newPassword').value;
               const confirm = document.getElementById('confirmPassword').value;
               
               if (newPass !== confirm) {
                 alert("New passwords do not match.");
                 return;
               }
               
               // Implement change password API call
               import('../../../features/auth/api/auth.api.js').then(module => {
                 module.authApi.changePassword({ oldPassword: current, newPassword: newPass })
                   .then(() => alert("Password changed successfully!"))
                   .catch(err => alert(err?.response?.data?.message || "Failed to change password"));
               });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>

      </div>
    </div>
  );
}
