import { Navigate, useLocation } from "react-router-dom";

export default function ClientProfilePage() {
  const location = useLocation();
  return <Navigate to={`/dashboard${location.search}`} replace />;
}
