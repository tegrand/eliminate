import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routePaths";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Landing Page
import LandingPage from "../features/landing/pages/LandingPage";

// Onboarding & Auth Pages
import RoleSelectionPage from "../features/auth/pages/RoleSelectionPage";
import ClientSignupPage from "../features/auth/pages/ClientSignupPage";
import AgencySignupPage from "../features/auth/pages/AgencySignupPage";
import WorkerSignupPage from "../features/auth/pages/WorkerSignupPage";
import PendingApprovalPage from "../features/auth/pages/PendingApprovalPage";

import LoginPage from "../features/auth/pages/LoginPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";

// Dashboard & Feature Pages
import DashboardPage from "../features/dashboard/pages/DashboardPage";

import WorkerListPage from "../features/worker/pages/WorkerListPage";
import WorkerDetailsPage from "../features/worker/pages/WorkerDetailsPage";

import ClientListPage from "../features/client/pages/ClientListPage";
import ClientDetailsPage from "../features/client/pages/ClientDetailsPage";

import AgencyListPage from "../features/agency/pages/AgencyListPage";
import AgencyDetailsPage from "../features/agency/pages/AgencyDetailsPage";

import SkillListPage from "../features/master-data/skill/pages/SkillListPage";
import CategoryListPage from "../features/master-data/category/pages/CategoryListPage";
import LanguageListPage from "../features/master-data/language/pages/LanguageListPage";
import LocationListPage from "../features/master-data/location/pages/LocationListPage";

import JobRequirementListPage from "../features/job-requirement/pages/JobRequirementListPage";
import AssignWorkersPage from "../features/job-requirement/pages/AssignWorkersPage";

import AssignmentListPage from "../features/assignment/pages/AssignmentListPage";

import AttendanceListPage from "../features/attendance/pages/AttendanceListPage";
import BulkAttendancePage from "../features/attendance/pages/BulkAttendancePage";
import AttendanceVerificationPage from "../features/attendance/pages/AttendanceVerificationPage";

import PayrollListPage from "../features/payroll/pages/PayrollListPage";
import PayrollDetailsPage from "../features/payroll/pages/PayrollDetailsPage";

import InvoiceListPage from "../features/invoice/pages/InvoiceListPage";
import InvoiceDetailsPage from "../features/invoice/pages/InvoiceDetailsPage";

import PaymentListPage from "../features/payment/pages/PaymentListPage";

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
    <h1 className="text-4xl font-bold text-gray-900 mb-2">404 - Page Not Found</h1>
    <p className="text-gray-500 mb-6">The requested page does not exist or has been moved.</p>
  </div>
);

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Marketing & Onboarding Routes */}
        <Route element={<PublicRoute />}>
          <Route element={<PublicLayout />}>
            <Route path={ROUTES.LANDING} element={<LandingPage />} />
            <Route path={ROUTES.SIGNUP} element={<RoleSelectionPage />} />
            <Route path={ROUTES.SIGNUP_CLIENT} element={<ClientSignupPage />} />
            <Route path={ROUTES.SIGNUP_AGENCY} element={<AgencySignupPage />} />
            <Route path={ROUTES.SIGNUP_WORKER} element={<WorkerSignupPage />} />
            <Route path={ROUTES.PENDING_APPROVAL} element={<PendingApprovalPage />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
          </Route>
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

            {/* Workers */}
            <Route path={ROUTES.WORKERS} element={<WorkerListPage />} />
            <Route path={ROUTES.WORKER_DETAILS} element={<WorkerDetailsPage />} />

            {/* Clients */}
            <Route path={ROUTES.CLIENTS} element={<ClientListPage />} />
            <Route path={ROUTES.CLIENT_DETAILS} element={<ClientDetailsPage />} />

            {/* Agencies */}
            <Route path={ROUTES.AGENCIES} element={<AgencyListPage />} />
            <Route path={ROUTES.AGENCY_DETAILS} element={<AgencyDetailsPage />} />

            {/* Master Data */}
            <Route path={ROUTES.SKILLS} element={<SkillListPage />} />
            <Route path={ROUTES.CATEGORIES} element={<CategoryListPage />} />
            <Route path={ROUTES.LANGUAGES} element={<LanguageListPage />} />
            <Route path={ROUTES.LOCATIONS} element={<LocationListPage />} />

            {/* Job Requirements */}
            <Route path={ROUTES.JOB_REQUIREMENTS} element={<JobRequirementListPage />} />
            <Route path={ROUTES.ASSIGN_WORKERS} element={<AssignWorkersPage />} />

            {/* Assignments */}
            <Route path={ROUTES.ASSIGNMENTS} element={<AssignmentListPage />} />

            {/* Attendance */}
            <Route path={ROUTES.ATTENDANCE} element={<AttendanceListPage />} />
            <Route path={ROUTES.ATTENDANCE_BULK} element={<BulkAttendancePage />} />
            <Route path={ROUTES.ATTENDANCE_VERIFY} element={<AttendanceVerificationPage />} />

            {/* Payroll */}
            <Route path={ROUTES.PAYROLLS} element={<PayrollListPage />} />
            <Route path={ROUTES.PAYROLL_DETAILS} element={<PayrollDetailsPage />} />

            {/* Invoices */}
            <Route path={ROUTES.INVOICES} element={<InvoiceListPage />} />
            <Route path={ROUTES.INVOICE_DETAILS} element={<InvoiceDetailsPage />} />

            {/* Payments */}
            <Route path={ROUTES.PAYMENTS} element={<PaymentListPage />} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
