import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "./routePaths";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show a loading state while we verify the session on initial load
  if (isLoading) {
    // TODO: Replace this with a global Skeleton or Spinner UI component
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Authenticating...</div>;
  }

  // If an authenticated user tries to hit a public route (like /login), redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
