import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useSidebar } from "../../contexts/SidebarContext";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";
import { LogOut, Search, User, ChevronDown } from "lucide-react";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import { calculateWorkerProfileCompletion } from "../../utils/profileCompletion";
import { useQuery } from "@tanstack/react-query";
import { workerApi } from "../../features/worker/api/worker.api";


export default function Header() {
  const { logout, user } = useAuth();
  const { toggleSidebar } = useSidebar();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: workerProfileRes } = useQuery({
    queryKey: ["myWorkerProfile"],
    queryFn: () => workerApi.getMyWorkerProfile(),
    enabled: user?.profileType === "WORKER"
  });

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
    <header className="pt-2 pb-1 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 flex-shrink-0 bg-transparent pointer-events-none">
      {/* Mobile/Sidebar Toggle (Three Lines Button) */}
      {user?.profileType !== "WORKER" && (
        <div className="flex items-center pointer-events-auto">
          <button 
            onClick={toggleSidebar}
            className="p-2.5 text-gray-700 bg-white/90 hover:bg-white backdrop-blur-md border border-gray-200/80 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer" 
            aria-label="Toggle sidebar"
          >
            <div className="w-4 flex flex-col gap-1">
              <span className="block w-full h-0.5 bg-gray-700 rounded-full"></span>
              <span className="block w-full h-0.5 bg-gray-700 rounded-full"></span>
              <span className="block w-full h-0.5 bg-gray-700 rounded-full"></span>
            </div>
          </button>
        </div>
      )}

      {/* Right Actions - Profile Icon without Header Box */}
      <div className="flex items-center ml-auto pointer-events-auto">
        {/* Profile Section with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 bg-white/90 hover:bg-white backdrop-blur-md border border-gray-200/80 rounded-2xl py-1.5 px-3 shadow-sm hover:shadow transition-all focus:outline-none cursor-pointer"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 relative overflow-hidden shrink-0">
              {user?.avatar ? (
                <img src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar.startsWith('/') ? '' : '/'}${user.avatar}`} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4" />
              )}
              {user?.profileType === "WORKER" && user?.workerProfile?.profileStatus !== "VERIFIED" && (
                <span className="absolute top-0 right-0 block w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 leading-tight capitalize">
                {user?.email?.split('@')[0] || "User"}
              </span>
              <span className="text-[10px] text-gray-500 font-semibold capitalize">
                {user?.profileType?.replace('_', ' ').toLowerCase() || "User"}
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
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

              {/* Profile Progress (Worker Only) */}
              {user?.profileType === "WORKER" && (() => {
                const latestWorkerProfile = workerProfileRes?.data?.data || workerProfileRes?.data || workerProfileRes || user?.workerProfile;
                const percent = calculateWorkerProfileCompletion({ ...user, workerProfile: latestWorkerProfile });
                return (
                <div className="w-full px-4 py-3 flex items-center justify-between gap-3 border-b border-gray-50 mb-1 bg-slate-50/50">
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Profile Completion</p>
                    <p className="text-[10px] text-gray-500">Update in settings</p>
                  </div>
                  
                  {/* Circular Progress */}
                  <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="12" fill="none" />
                      <circle cx="50" cy="50" r="40" stroke="#2563EB" strokeWidth="12" fill="none" 
                        strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (percent/100))} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-blue-600">{percent}%</span>
                    </div>
                  </div>
                </div>
              )})()}

              {/* Profile Link (Agency Only) */}
              {user?.profileType === "AGENCY" && (
                <Link 
                  to={ROUTES.AGENCY_PROFILE}
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors mb-1"
                >
                  <User className="w-4 h-4" />
                  <span>Agency Profile</span>
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
