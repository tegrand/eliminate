import { useState } from "react";
import { Settings, Palette } from "lucide-react";

export default function SettingsPage() {
  const [theme, setTheme] = useState("light");

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    // Ideally use a toast or context here to actually apply theme
    alert("Theme updated!");
  };

  return (
    <div className="w-full py-6 animate-fade-in max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="w-6 h-6 text-blue-600" />
          System Settings
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Manage platform configurations and global parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 items-start">
        {/* Theme Preferences Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-600" />
              Theme Preferences
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select your preferred visual theme for the application.
            </p>
          </div>

          <div className="p-5">
            <div className="max-w-md flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">App Theme</label>
              <select 
                value={theme} 
                onChange={handleThemeChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="light">Light Theme</option>
                <option value="dark">Dark Theme (Coming Soon)</option>
                <option value="system">System Default</option>
              </select>
            </div>
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
