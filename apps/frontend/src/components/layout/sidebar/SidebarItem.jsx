import { NavLink } from "react-router-dom";
import clsx from "clsx";

export default function SidebarItem({ item }) {
  const Icon = item.icon;

  if (item.disabled) {
    return (
      <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-400 opacity-60 cursor-not-allowed">
        {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
        <span className="truncate">{item.title}</span>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Soon</span>
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          isActive
            ? "bg-blue-50 text-blue-700"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        )
      }
    >
      {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
      <span className="truncate">{item.title}</span>
    </NavLink>
  );
}
