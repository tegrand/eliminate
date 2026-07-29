import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useSidebar } from "../../contexts/SidebarContext";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";
import { LogOut, Search, User, ChevronDown } from "lucide-react";
import NotificationBell from "../ui/notifications/NotificationBell";

export default function Header() {
  const { logout, user } = useAuth();
  const { toggleSidebar } = useSidebar();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10 flex-shrink-0">
      {/* Mobile/Tablet Menu Button */}
      <div className="flex items-center lg:hidden">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors" aria-label="Open sidebar"
        >
          <div className="w-5 flex flex-col gap-1">
            <span className="block w-full h-0.5 bg-gray-500 rounded-full"></span>
            <span className="block w-full h-0.5 bg-gray-500 rounded-full"></span>
            <span className="block w-full h-0.5 bg-gray-500 rounded-full"></span>
          </div>
        </button>
      </div>

      {/* Search Bar - Styled to match screenshot */}
      <div className="hidden sm:flex items-center flex-1 ml-4 lg:ml-0 max-w-xl">
        <div className="w-full relative flex items-center">
          <div className="absolute left-3 text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-9 pr-16 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-shadow text-gray-700 placeholder-gray-400"
          />
          <div className="absolute right-3 flex items-center pointer-events-none">
            <span className="text-xs text-gray-400 font-medium tracking-wide">Ctrl + K</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-5 ml-auto">
        <NotificationBell />
        
        {/* Profile Section with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 pl-2 border-l border-gray-100 hover:bg-gray-50 rounded-lg py-1 px-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-600">
              <User className="w-5 h-5" />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-semibold text-gray-900 leading-tight capitalize">
                {user?.email?.split('@')[0] || "User"}
              </span>
              <span className="text-xs text-gray-500 font-medium capitalize">
                {user?.profileType?.replace('_', ' ').toLowerCase() || "User"}
              </span>
            </div>
            <div className="text-gray-400">
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 animate-fade-in-up origin-top-right">
              {/* User Info Section */}
              <div className="px-4 py-2 border-b border-gray-100 mb-1">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.profileType === "SUPER_ADMIN" ? "Super Admin" : user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate" title={user?.email}>
                  {user?.email || "No email"}
                </p>
              </div>

              {/* Profile Link (Worker Only) */}
              {user?.profileType === "WORKER" && (
                <Link 
                  to={ROUTES.WORKER_PROFILE}
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors mb-1"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </Link>
              )}

              {/* Profile Link (Client Only) */}
              {user?.profileType === "CLIENT" && (
                <Link 
                  to={ROUTES.CLIENT_PROFILE}
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors mb-1"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.clientType === "COMPANY" ? "Company Profile" : "My Profile"}</span>
                </Link>
              )}

              {/* Logout Button */}
              <button 
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
