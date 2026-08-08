import { useState, useEffect } from "react";
import { Settings, Save, Loader2, DollarSign, ShieldCheck } from "lucide-react";
import api from "../../../api/axios";
import { useAuth } from "../../../hooks/useAuth";

export default function AgencySettingsPage() {
  const { user } = useAuth();
  const [feePercentage, setFeePercentage] = useState("");
  const [workerFixedAmount, setWorkerFixedAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user?.agencyProfile?.id) return;
      try {
        const { agencyApi } = await import('../api/agency.api.js');
        const response = await agencyApi.getAgencyById(user.agencyProfile.id);
        const data = response.data || response;
        setFeePercentage(data.feePercentage ?? "");
        setWorkerFixedAmount(data.workerFixedAmount ?? "");
      } catch (error) {
        setMessage({ type: "error", text: "Failed to load settings." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [user]);

  const handleSave = async () => {
    if (!user?.agencyProfile?.id) return;
    setIsSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const { agencyApi } = await import('../api/agency.api.js');
      await agencyApi.updateAgency(user.agencyProfile.id, { 
        feePercentage: Number(feePercentage),
        workerFixedAmount: Number(workerFixedAmount)
      });
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
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="w-full py-6 animate-fade-in max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="w-6 h-6 text-indigo-600" />
          Agency Settings
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Manage your financial configurations and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* Financial Settings Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Financial Settings
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure your agency fee and fixed worker amount.
            </p>
          </div>

          <div className="p-5">
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agency Fee Percentage (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={feePercentage}
                    onChange={(e) => setFeePercentage(e.target.value)}
                    placeholder="e.g. 10"
                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fixed Worker Amount (₹)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={workerFixedAmount}
                    onChange={(e) => setWorkerFixedAmount(e.target.value)}
                    placeholder="e.g. 1580"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                These values are used to calculate the total amount when a client hires your agency.
              </p>
            </div>

            {message.text && (
              <div className={\`mt-4 p-3 rounded-md text-sm \${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}\`}>
                {message.text}
              </div>
            )}
          </div>

          <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              Change Password
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Update your account password securely.
            </p>
          </div>

          <div className="p-5">
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                 
                 if (!current || !newPass || !confirm) {
                   alert("Please fill all fields.");
                   return;
                 }
                 
                 if (newPass !== confirm) {
                   alert("New passwords do not match.");
                   return;
                 }
                 
                 import('../../auth/api/auth.api.js').then(module => {
                   module.authApi.changePassword({ oldPassword: current, newPassword: newPass })
                     .then(() => {
                       alert("Password changed successfully!");
                       document.getElementById('currentPassword').value = '';
                       document.getElementById('newPassword').value = '';
                       document.getElementById('confirmPassword').value = '';
                     })
                     .catch(err => alert(err?.response?.data?.message || "Failed to change password"));
                 });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
