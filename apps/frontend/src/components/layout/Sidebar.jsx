import { NAVIGATION_CONFIG } from "../../config/navigation";
import SidebarLogo from "./sidebar/SidebarLogo";
import SidebarGroup from "./sidebar/SidebarGroup";
import { useAuth } from "../../hooks/useAuth";
import { useSidebar } from "../../contexts/SidebarContext";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";


export default function Sidebar() {
  const { user } = useAuth();
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const profileType = user?.profileType;
  const location = useLocation();

  if (profileType === "WORKER" || profileType === "CLIENT" || profileType === "AGENCY") return null;

  const filteredNavigation = NAVIGATION_CONFIG.map(group => {
    if (group.roles && !group.roles.includes(profileType)) return null;

    const filteredItems = group.items.filter(item => {
      if (!item.roles) return true;
      return item.roles.includes(profileType);
    });

    if (filteredItems.length === 0) return null;
    return { ...group, items: filteredItems };
  }).filter(Boolean);

  // Close sidebar on route change on mobile
  useEffect(() => {
    closeSidebar();
  }, [location.pathname, closeSidebar]);

  const shouldShowAd = !['/client/profile', '/agency/profile', '/agency/settings'].some(path => location.pathname.includes(path));

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform bg-white flex h-full flex-col border-r border-gray-200 shadow-xl w-72 lg:w-64 flex-shrink-0
        transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 lg:shadow-sm
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <SidebarLogo />
        
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {filteredNavigation.map((group, index) => (
            <SidebarGroup key={group.group || index} group={group} />
          ))}
        </div>

        {shouldShowAd && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 mt-auto shrink-0">

          </div>
        )}
      </div>
    </>
  );
}
