import { NavLink } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";

export default function Sidebar() {
  const navItems = [
    { name: "Dashboard", path: ROUTES.DASHBOARD },
    { name: "Workers", path: ROUTES.WORKERS },
    { name: "Clients", path: ROUTES.CLIENTS },
    { name: "Agencies", path: ROUTES.AGENCIES },
    { name: "Skills", path: ROUTES.SKILLS },
    { name: "Categories", path: ROUTES.CATEGORIES },
    { name: "Languages", path: ROUTES.LANGUAGES },
    { name: "Locations", path: ROUTES.LOCATIONS },
    { name: "Job Requirements", path: ROUTES.JOB_REQUIREMENTS },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 h-screen border-r border-gray-200 bg-white sticky top-0 flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">Eliminate</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
