import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export default function SidebarItem({ item }) {
  const Icon = item.icon;
  const location = useLocation();
  const hasSubItems = item.subItems && item.subItems.length > 0;
  
  // Check if any sub-item is active
  const isSubItemActive = hasSubItems && item.subItems.some(
    sub => location.pathname === sub.path || (sub.path.includes('?') && location.search === sub.path.split('?')[1])
  );
  
  const [isOpen, setIsOpen] = useState(isSubItemActive);

  useEffect(() => {
    if (isSubItemActive) {
      setIsOpen(true);
    }
  }, [isSubItemActive, location.pathname]);

  if (item.disabled) {
    return (
      <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-normal text-gray-400 opacity-60 cursor-not-allowed">
        {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
        <span className="truncate">{item.title}</span>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Soon</span>
      </div>
    );
  }

  if (hasSubItems) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            "w-full flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-normal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
            isOpen || isSubItemActive
              ? "bg-blue-50 text-blue-700"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
          )}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
            <span className="truncate">{item.title}</span>
          </div>
          <ChevronDown className={clsx("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </button>
        {isOpen && (
          <div className="pl-9 space-y-1 mt-1">
            {item.subItems.map((sub, idx) => (
              <NavLink
                key={sub.path || idx}
                to={sub.path}
                end={sub.path === item.path}
                className={({ isActive }) =>
                  clsx(
                    "block rounded-md px-3 py-2 text-sm font-normal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    (isActive || (sub.path.includes('?') && location.search.includes(sub.path.split('?')[1]))) 
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  )
                }
              >
                {sub.title}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-normal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          isActive
            ? "bg-blue-50 text-blue-700"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
        )
      }
    >
      {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
      <span className="truncate">{item.title}</span>
    </NavLink>
  );
}
