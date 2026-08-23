import React, { useState } from 'react';
import { Menu, Search, Bell, User, Settings, LogOut, Sun } from 'lucide-react';
import { useAdminUI } from '../../contexts/AdminUIContext';

export default function AdminHeader() {
  const { openDrawer } = useAdminUI();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
      <div className="flex items-center flex-1">
        <button
          onClick={() => openDrawer(<MobileNavigation />)}
          className="p-2 mr-2 text-gray-500 rounded-md md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Open mobile menu"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Placeholder */}
        <div className="hidden md:flex relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full py-2 pl-10 pr-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors placeholder-gray-400"
            placeholder="Search across admin..."
            readOnly
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-xs text-gray-400 font-medium font-mono border border-gray-200 rounded px-1.5 py-0.5">âŒ˜K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Theme Placeholder */}
        <button className="p-2 text-gray-400 rounded-full hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Sun size={20} />
        </button>



        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span className="sr-only">Open user menu</span>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              A
            </div>
          </button>

          {profileOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setProfileOpen(false)}
              ></div>
              <div className="absolute right-0 z-20 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                  <p className="text-xs text-gray-500 truncate">admin@example.com</p>
                </div>
                <a href="#profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <User className="mr-2 w-4 h-4 text-gray-400" />
                  Profile
                </a>
                <a href="#settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings className="mr-2 w-4 h-4 text-gray-400" />
                  Settings
                </a>
                <a href="#logout" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <LogOut className="mr-2 w-4 h-4 text-red-400" />
                  Logout
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// Temporary component to inject into drawer for mobile navigation
function MobileNavigation() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Navigation Placeholder</h2>
      <p className="text-sm text-gray-500">In a full implementation, the sidebar content would be rendered here on mobile devices.</p>
    </div>
  );
}
