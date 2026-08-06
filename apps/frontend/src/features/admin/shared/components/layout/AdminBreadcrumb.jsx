import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function AdminBreadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // If we are at /admin exactly, maybe don't show breadcrumb or just show Dashboard
  if (pathnames.length <= 1) {
    return null;
  }

  return (
    <nav className="flex mb-4 text-sm font-medium text-gray-500" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link to="/admin" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
        </li>
        {pathnames.slice(1).map((value, index) => {
          const isLast = index === pathnames.length - 2;
          const to = `/admin/${pathnames.slice(1, index + 2).join('/')}`;
          
          // Basic formatting: capitalize first letter, replace hyphens with spaces
          const title = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

          return (
            <li key={to}>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                {isLast ? (
                  <span className="text-gray-900 font-semibold cursor-default">{title}</span>
                ) : (
                  <Link to={to} className="text-gray-600 hover:text-blue-600 transition-colors">
                    {title}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
