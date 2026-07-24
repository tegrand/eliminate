import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routePaths";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Feature Pages
import LoginPage from "../features/auth/pages/LoginPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import WorkerListPage from "../features/worker/pages/WorkerListPage";
import ClientListPage from "../features/client/pages/ClientListPage";
import AgencyListPage from "../features/agency/pages/AgencyListPage";
import SkillListPage from "../features/master-data/skill/pages/SkillListPage";
import CategoryListPage from "../features/master-data/category/pages/CategoryListPage";
import LanguageListPage from "../features/master-data/language/pages/LanguageListPage";
import LocationListPage from "../features/master-data/location/pages/LocationListPage";
import JobRequirementListPage from "../features/job-requirement/pages/JobRequirementListPage";

const NotFoundPage = () => <h1>404 Not Found</h1>;

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
          </Route>
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.WORKERS} element={<WorkerListPage />} />
            <Route path={ROUTES.CLIENTS} element={<ClientListPage />} />
            <Route path={ROUTES.AGENCIES} element={<AgencyListPage />} />
            <Route path={ROUTES.SKILLS} element={<SkillListPage />} />
            <Route path={ROUTES.CATEGORIES} element={<CategoryListPage />} />
            <Route path={ROUTES.LANGUAGES} element={<LanguageListPage />} />
            <Route path={ROUTES.LOCATIONS} element={<LocationListPage />} />
            <Route path={ROUTES.JOB_REQUIREMENTS} element={<JobRequirementListPage />} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
