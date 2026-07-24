import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "./routePaths";

// Mock auth hook - will be replaced with real auth logic (zustand/context)
const useAuth = () => ({ isAuthenticated: true });

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <div className="protected-layout">
      {/* We can add a common Sidebar/Header layout wrapper here later */}
      <Outlet />
    </div>
  );
};

export default ProtectedRoute;
