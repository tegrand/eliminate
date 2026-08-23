import React from 'react';
// import { useAuth } from '../../../../contexts/AuthContext'; // Example context

/**
 * RoleGuard - Conditionally renders children based on user roles
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Elements to render if authorized
 * @param {string[]} props.allowedRoles - Array of roles that are allowed to see this content
 * @param {React.ReactNode} [props.fallback=null] - What to render if unauthorized
 */
export default function RoleGuard({ children, allowedRoles, fallback = null }) {
  // In a real implementation, get the user's role from your auth store
  // const { user } = useAuth();
  // const userRole = user?.role || 'GUEST';
  
  // MOCK:
  const userRole = 'ADMIN'; 
  
  const hasAccess = allowedRoles.includes(userRole);

  if (!hasAccess) {
    return fallback;
  }

  return <>{children}</>;
}
