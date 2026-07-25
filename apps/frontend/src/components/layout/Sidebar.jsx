import { NAVIGATION_CONFIG } from "../../config/navigation";
import SidebarLogo from "./sidebar/SidebarLogo";
import SidebarGroup from "./sidebar/SidebarGroup";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../routes/routePaths";

const ROLE_ACCESS = {
  SUPER_ADMIN: ["*"],
  WORKER: [ROUTES.DASHBOARD, ROUTES.ASSIGNMENTS, ROUTES.ATTENDANCE, ROUTES.JOB_BOARD, ROUTES.MY_PROFILE],
  AGENCY: [ROUTES.DASHBOARD, ROUTES.WORKERS, ROUTES.ASSIGNMENTS, ROUTES.ATTENDANCE, ROUTES.JOB_REQUIREMENTS, ROUTES.PAYROLLS, ROUTES.INVOICES, ROUTES.PAYMENTS],
  CLIENT: [ROUTES.DASHBOARD, ROUTES.WORKERS, ROUTES.AGENCIES, ROUTES.ASSIGNMENTS, ROUTES.JOB_REQUIREMENTS, ROUTES.INVOICES, ROUTES.PAYMENTS],
};

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.profileType || "WORKER";
  
  const allowedPaths = ROLE_ACCESS[role] || [];
  const hasAccess = (path) => allowedPaths.includes("*") || allowedPaths.includes(path);

  const filteredNav = NAVIGATION_CONFIG.map(group => {
    const items = group.items.filter(item => hasAccess(item.path));
    if (items.length === 0) return null;
    return { ...group, items };
  }).filter(Boolean);

  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-white shadow-sm w-64 flex-shrink-0">
      <SidebarLogo />
      
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {filteredNav.map((group, index) => (
          <SidebarGroup key={group.group || index} group={group} />
        ))}
      </div>
    </div>
  );
}
