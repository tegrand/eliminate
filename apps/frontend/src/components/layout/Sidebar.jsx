import { NAVIGATION_CONFIG } from "../../config/navigation";
import SidebarLogo from "./sidebar/SidebarLogo";
import SidebarGroup from "./sidebar/SidebarGroup";

export default function Sidebar() {
  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-white shadow-sm w-64 flex-shrink-0">
      <SidebarLogo />
      
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {NAVIGATION_CONFIG.map((group, index) => (
          <SidebarGroup key={group.group || index} group={group} />
        ))}
      </div>
    </div>
  );
}
