import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAdminUI } from '../../contexts/AdminUIContext';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Boxes, 
  ShoppingCart, 
  Users, 
  Ticket, 
  BarChart3, 
  Settings, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const MENU_ITEMS = [
  { group: 'Overview', items: [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard }
  ]},
  { group: 'Catalog', items: [
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Inventory', path: '/admin/inventory', icon: Boxes },
  ]},
  { group: 'Sales', items: [
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
  ]},
  { group: 'System', items: [
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
    { name: 'Roles & Permissions', path: '/admin/roles', icon: ShieldCheck },
  ]}
];

export default function AdminSidebar() {
  const { isSidebarCollapsed, toggleSidebar, isDrawerOpen } = useAdminUI();
  const location = useLocation();

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
        ${isSidebarCollapsed ? 'w-20' : 'w-64'}
        md:relative
        ${isDrawerOpen ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
      `}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!isSidebarCollapsed && (
          <span className="text-lg font-semibold text-gray-900 tracking-tight">Admin Panel</span>
        )}
        {isSidebarCollapsed && (
          <span className="text-lg font-bold text-blue-600 mx-auto">A</span>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-1.5 text-gray-500 rounded-md hover:bg-gray-100 hidden md:block focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 space-y-6 custom-scrollbar">
        {MENU_ITEMS.map((group, index) => (
          <div key={index} className="px-3">
            {!isSidebarCollapsed && (
              <h3 className="px-3 mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                {group.group}
              </h3>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors group
                        ${isActive 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }
                        ${isSidebarCollapsed ? 'justify-center' : ''}
                      `}
                      title={isSidebarCollapsed ? item.name : undefined}
                    >
                      <item.icon 
                        className={`
                          flex-shrink-0 
                          ${isSidebarCollapsed ? 'mr-0' : 'mr-3'} 
                          ${isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}
                        `} 
                        size={20} 
                      />
                      {!isSidebarCollapsed && <span>{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
