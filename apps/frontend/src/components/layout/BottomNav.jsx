import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, Users, User, Settings, Building2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../routes/routePaths";

export default function BottomNav() {
  const { user } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  if (!user) return null;

  const profileType = user.profileType;

  // Resolve target paths based on roles
  const getClientsPath = () => {
    if (profileType === "CLIENT") return ROUTES.WORKFORCE_SEARCH;
    if (profileType === "AGENCY") return ROUTES.WORKERS + "?view=my";
    if (profileType === "SUPER_ADMIN") return ROUTES.CLIENTS;
    return ROUTES.DASHBOARD;
  };

  const getProfilePath = () => {
    if (profileType === "CLIENT") return ROUTES.DASHBOARD;
    if (profileType === "WORKER") return ROUTES.WORKER_PROFILE;
    if (profileType === "AGENCY") return ROUTES.AGENCY_PROFILE;
    return ROUTES.DASHBOARD;
  };

  const getSettingsPath = () => {
    if (profileType === "CLIENT") return ROUTES.CLIENT_PROFILE;
    if (profileType === "WORKER") return ROUTES.WORKER_SETTINGS;
    if (profileType === "AGENCY") return ROUTES.AGENCY_SETTINGS;
    if (profileType === "SUPER_ADMIN") return ROUTES.SETTINGS;
    return ROUTES.DASHBOARD;
  };

  const clientsPath = getClientsPath();
  const profilePath = getProfilePath();
  const settingsPath = getSettingsPath();

  // Determine active state for roles
  const isDashboardActive = pathname === ROUTES.DASHBOARD;
  const isClientsActive = pathname.startsWith(ROUTES.WORKFORCE_SEARCH) || pathname.startsWith(ROUTES.CLIENTS) || (pathname.startsWith(ROUTES.WORKERS) && !pathname.includes("profile"));
  const isProfileActive = pathname === ROUTES.CLIENT_PROFILE || pathname === ROUTES.WORKER_PROFILE || pathname === ROUTES.AGENCY_PROFILE;
  const isSettingsActive = 
    pathname === ROUTES.SETTINGS || 
    pathname === ROUTES.WORKER_SETTINGS || 
    pathname === ROUTES.AGENCY_SETTINGS ||
    pathname === ROUTES.CLIENT_PROFILE;

  const isWorker = profileType === "WORKER";

  // Choose items dynamically depending on role
  let navItems = [];

  if (isWorker) {
    navItems = [
      {
        label: "Home",
        icon: LayoutGrid,
        path: ROUTES.DASHBOARD,
        isActive: isDashboardActive,
      },
      {
        label: "Profile",
        icon: User,
        path: ROUTES.WORKER_PROFILE,
        isActive: isProfileActive,
      },
      {
        label: "Settings",
        icon: Settings,
        path: ROUTES.WORKER_SETTINGS,
        isActive: isSettingsActive,
      },
    ];
  } else if (profileType === "CLIENT") {
    navItems = [
      {
        label: "Dashboard",
        icon: LayoutGrid,
        path: ROUTES.DASHBOARD,
        isActive: pathname === ROUTES.DASHBOARD,
      },
      {
        label: "Workers",
        icon: Users,
        path: ROUTES.WORKFORCE_SEARCH,
        isActive: pathname.startsWith(ROUTES.WORKFORCE_SEARCH),
      },
      {
        label: "Agency",
        icon: Building2,
        path: ROUTES.AGENCY_SEARCH,
        isActive: pathname.startsWith(ROUTES.AGENCY_SEARCH) || pathname.startsWith("/search-agencies"),
      },
      {
        label: "Settings",
        icon: Settings,
        path: ROUTES.CLIENT_PROFILE,
        isActive: pathname === ROUTES.CLIENT_PROFILE,
      },
    ];
  } else if (profileType === "AGENCY") {
    navItems = [
      {
        label: "Home",
        icon: LayoutGrid,
        path: ROUTES.DASHBOARD,
        isActive: isDashboardActive,
      },
      {
        label: "Workers",
        icon: Users,
        path: ROUTES.WORKERS + "?view=my",
        isActive: pathname.startsWith(ROUTES.WORKERS),
      },
      {
        label: "Profile",
        icon: Building2,
        path: ROUTES.AGENCY_PROFILE,
        isActive: pathname === ROUTES.AGENCY_PROFILE,
      },
      {
        label: "Settings",
        icon: Settings,
        path: ROUTES.AGENCY_SETTINGS,
        isActive: pathname === ROUTES.AGENCY_SETTINGS,
      },
    ];
  } else {
    navItems = [
      {
        label: "Dashboard",
        icon: LayoutGrid,
        path: ROUTES.DASHBOARD,
        isActive: isDashboardActive,
      },
      {
        label: "Clients",
        icon: Users,
        path: clientsPath,
        isActive: isClientsActive,
      },
      {
        label: "Profile",
        icon: User,
        path: profilePath,
        isActive: isProfileActive,
      },
      {
        label: "Settings",
        icon: Settings,
        path: settingsPath,
        isActive: isSettingsActive,
      },
    ];
  }

  const activeTextColor = isWorker 
    ? "text-emerald-600 font-bold" 
    : profileType === "CLIENT"
      ? "text-sky-600 font-bold"
      : profileType === "AGENCY"
        ? "text-purple-600 font-bold"
        : "text-blue-600 font-semibold";

  const activeLineColor = isWorker 
    ? "bg-emerald-500" 
    : profileType === "CLIENT"
      ? "bg-sky-500"
      : profileType === "AGENCY"
        ? "bg-purple-600"
        : "bg-blue-600";

  return (
    <div className={`fixed bottom-0 left-0 right-0 h-[64px] bg-white border-t border-slate-100 flex items-center justify-around z-[100] shadow-[0_-4px_10px_rgba(0,0,0,0.03)] px-2 ${
      isWorker || profileType === "AGENCY" ? "" : "lg:hidden"
    }`}>
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Link
            key={idx}
            to={item.path}
            className={`relative flex flex-col items-center justify-center flex-1 h-full py-2 transition-all ${
              item.isActive ? activeTextColor : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {/* Top active indicator line */}
            {item.isActive && (
              <span className={`absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[3px] ${activeLineColor} rounded-b-full transition-all duration-300`} />
            )}
            
            <Icon className={`w-5 h-5 mb-1 transition-transform duration-200 ${item.isActive ? "scale-105" : ""}`} />
            <span className="text-[10px] tracking-wide font-medium">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
