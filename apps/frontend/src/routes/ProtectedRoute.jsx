import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "./routePaths";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show a loading state while we verify the session on initial load
  if (isLoading) {
    // TODO: Replace this with a global Skeleton or Spinner UI component
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Authenticating...</div>;
  }

  // If session verification completes and user is not authenticated, kick them to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
