import { NAVIGATION_CONFIG } from "../../config/navigation";
import SidebarLogo from "./sidebar/SidebarLogo";
import SidebarGroup from "./sidebar/SidebarGroup";
import { useAuth } from "../../hooks/useAuth";

export default function Sidebar() {
  const { user } = useAuth();
  const profileType = user?.profileType;

  const filteredNavigation = NAVIGATION_CONFIG.map(group => {
    if (group.roles && !group.roles.includes(profileType)) return null;

    const filteredItems = group.items.filter(item => {
      if (!item.roles) return true;
      return item.roles.includes(profileType);
    });

    if (filteredItems.length === 0) return null;
    return { ...group, items: filteredItems };
  }).filter(Boolean);

  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-white shadow-sm w-64 flex-shrink-0">
      <SidebarLogo />
      
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {filteredNavigation.map((group, index) => (
          <SidebarGroup key={group.group || index} group={group} />
        ))}
      </div>
    </div>
  );
}
