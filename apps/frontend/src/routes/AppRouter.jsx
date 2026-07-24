import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routePaths";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Pages
import LoginPage from "../pages/LoginPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import DashboardPage from "../pages/DashboardPage";
import WorkerPage from "../pages/WorkerPage";
import ClientPage from "../pages/ClientPage";
import AgencyPage from "../pages/AgencyPage";
import JobRequirementPage from "../pages/JobRequirementPage";
import NotFoundPage from "../pages/NotFoundPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with AuthLayout */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
          </Route>
        </Route>

        {/* Protected Routes with DashboardLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.WORKERS} element={<WorkerPage />} />
            <Route path={ROUTES.CLIENTS} element={<ClientPage />} />
            <Route path={ROUTES.AGENCIES} element={<AgencyPage />} />
            
            {/* Temporary placeholders for non-created pages */}
            <Route path={ROUTES.SKILLS} element={<div className="p-4">Skills</div>} />
            <Route path={ROUTES.CATEGORIES} element={<div className="p-4">Categories</div>} />
            <Route path={ROUTES.LANGUAGES} element={<div className="p-4">Languages</div>} />
            <Route path={ROUTES.LOCATIONS} element={<div className="p-4">Locations</div>} />
            
            <Route path={ROUTES.JOB_REQUIREMENTS} element={<JobRequirementPage />} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
