import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "./routePaths";

// Mock auth hook - will be replaced with real auth logic (zustand/context)
const useAuth = () => ({ isAuthenticated: false });

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
