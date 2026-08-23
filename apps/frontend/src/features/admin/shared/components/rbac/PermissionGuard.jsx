import React from 'react';
// import { useAuth } from '../../../../contexts/AuthContext'; // Example context

/**
 * PermissionGuard - Conditionally renders children based on specific permissions
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Elements to render if authorized
 * @param {string[]} props.permissions - Array of required permissions
 * @param {boolean} [props.requireAll=false] - If true, user needs all permissions. If false, needs at least one.
 * @param {React.ReactNode} [props.fallback=null] - What to render if unauthorized
 */
export default function PermissionGuard({ children, permissions, requireAll = false, fallback = null }) {
  // In a real implementation, get the user's permissions from your auth store
  // const { user } = useAuth();
  // const userPermissions = user?.permissions || [];
  
  // MOCK:
  const userPermissions = ['create:product', 'view:users']; 
  
  const hasAccess = requireAll 
    ? permissions.every(p => userPermissions.includes(p))
    : permissions.some(p => userPermissions.includes(p));

  if (!hasAccess) {
    return fallback;
  }

  return <>{children}</>;
}
