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


import WorkerSettingsPage from "../features/worker/pages/WorkerSettingsPage";
import WorkerInvitationsPage from "../features/worker/pages/WorkerInvitationsPage";
import WorkerAssignmentsPage from "../features/worker/pages/WorkerAssignmentsPage";
import WorkerAttendancePage from "../features/worker/pages/WorkerAttendancePage";
import WorkerNotificationsPage from "../features/worker/pages/WorkerNotificationsPage";
import WorkerHistoryPage from "../features/worker/pages/WorkerHistoryPage";
import WorkerEarningsPage from "../features/worker/pages/WorkerEarningsPage";
import MyDocumentsPage from "../features/documents/pages/MyDocumentsPage";
import ClientListPage from "../features/client/pages/ClientListPage";
import ClientDetailsPage from "../features/client/pages/ClientDetailsPage";
import ClientProfilePage from "../features/client/pages/ClientProfilePage";
import ClientWorkerSearchPage from "../features/client/pages/ClientWorkerSearchPage";
import ClientWorkerProfilePage from "../features/client/pages/ClientWorkerProfilePage";
import ClientAgencySearchPage from "../features/client/pages/ClientAgencySearchPage";
import ClientRequestsPage from "../features/client/pages/ClientRequestsPage";


import AgencyListPage from "../features/agency/pages/AgencyListPage";
import AgencyDetailsPage from "../features/agency/pages/AgencyDetailsPage";
import AgencyProfilePage from "../features/agency/pages/AgencyProfilePage";
import AgencySettingsPage from "../features/agency/pages/AgencySettingsPage";
import AgencyClientListPage from "../features/agency/pages/AgencyClientListPage";

import SkillListPage from "../features/master-data/skill/pages/SkillListPage";
import CategoryListPage from "../features/master-data/category/pages/CategoryListPage";
import LanguageListPage from "../features/master-data/language/pages/LanguageListPage";
import LocationListPage from "../features/master-data/location/pages/LocationListPage";

import HiringRequestsPage from "../features/hiring-requests/pages/HiringRequestsPage";
import HiringRequestDetailsPage from "../features/hiring-requests/pages/HiringRequestDetailsPage";

import AssignmentListPage from "../features/assignment/pages/AssignmentListPage";
import AssignmentDetailsPage from "../features/assignment/pages/AssignmentDetailsPage";

import AttendanceListPage from "../features/attendance/pages/AttendanceListPage";
import BulkAttendancePage from "../features/attendance/pages/BulkAttendancePage";
import AttendanceVerificationPage from "../features/attendance/pages/AttendanceVerificationPage";
import MissingAttendancePage from "../features/attendance/pages/MissingAttendancePage";

import PayrollListPage from "../features/payroll/pages/PayrollListPage";
import PayrollDetailsPage from "../features/payroll/pages/PayrollDetailsPage";

import InvoiceListPage from "../features/invoice/pages/InvoiceListPage";
import InvoiceDetailsPage from "../features/invoice/pages/InvoiceDetailsPage";

import PaymentListPage from "../features/payment/pages/PaymentListPage";
import PaymentReceiptPage from "../features/payment/pages/PaymentReceiptPage";
import WorkerPayoutsPage from "../features/payment/pages/WorkerPayoutsPage";

import SettingsPage from "../features/settings/pages/SettingsPage";
import AdminRoutes from "../features/admin/routes/AdminRoutes";

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
          {/* Admin Foundation */}
          <Route path={ROUTES.ADMIN} element={<AdminRoutes />} />

          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

            {/* Workers */}
            <Route path={ROUTES.WORKERS} element={<WorkerListPage />} />
            <Route path={ROUTES.WORKER_DETAILS} element={<WorkerDetailsPage />} />
            

            <Route path={ROUTES.WORKER_SETTINGS} element={<WorkerSettingsPage />} />

            <Route path={ROUTES.MY_INVITATIONS} element={<WorkerInvitationsPage />} />
            <Route path={ROUTES.MY_JOBS} element={<WorkerAssignmentsPage />} />
            <Route path={ROUTES.MY_ATTENDANCE} element={<WorkerAttendancePage />} />
            <Route path="/worker/notifications" element={<WorkerNotificationsPage />} />
            <Route path="/worker/history" element={<WorkerHistoryPage />} />
            <Route path="/worker/earnings" element={<WorkerEarningsPage />} />
            <Route path={ROUTES.WORKFORCE_SEARCH} element={<ClientWorkerSearchPage />} />
            <Route path={ROUTES.WORKFORCE_PROFILE} element={<ClientWorkerProfilePage />} />
            <Route path={ROUTES.AGENCY_SEARCH} element={<ClientAgencySearchPage />} />

            {/* Clients */}
            <Route path={ROUTES.CLIENTS} element={<ClientListPage />} />
            <Route path={ROUTES.CLIENT_DETAILS} element={<ClientDetailsPage />} />
            <Route path={ROUTES.CLIENT_PROFILE} element={<ClientProfilePage />} />
            <Route path={ROUTES.CLIENT_REQUESTS} element={<ClientRequestsPage />} />
            

            {/* Agencies */}
            <Route path={ROUTES.AGENCIES} element={<AgencyListPage />} />
            <Route path={ROUTES.AGENCY_DETAILS} element={<AgencyDetailsPage />} />
            <Route path={ROUTES.AGENCY_PROFILE} element={<AgencyProfilePage />} />\n              <Route path={ROUTES.AGENCY_SETTINGS} element={<AgencySettingsPage />} />
            <Route path={ROUTES.AGENCY_CLIENTS} element={<AgencyClientListPage />} />

            {/* Master Data */}
            <Route path={ROUTES.SKILLS} element={<SkillListPage />} />
            <Route path={ROUTES.CATEGORIES} element={<CategoryListPage />} />
            <Route path={ROUTES.LANGUAGES} element={<LanguageListPage />} />
            <Route path={ROUTES.LOCATIONS} element={<LocationListPage />} />

            {/* Hiring Requests */}
            <Route path={ROUTES.HIRING_REQUESTS} element={<HiringRequestsPage />} />
            <Route path={ROUTES.HIRING_REQUEST_DETAILS} element={<HiringRequestDetailsPage />} />

            {/* Assignments */}
            <Route path={ROUTES.ASSIGNMENTS} element={<AssignmentListPage />} />
            <Route path={ROUTES.ASSIGNMENT_DETAILS} element={<AssignmentDetailsPage />} />

            {/* Attendance */}
            <Route path={ROUTES.ATTENDANCE} element={<AttendanceListPage />} />
            <Route path={ROUTES.ATTENDANCE_BULK} element={<BulkAttendancePage />} />
            <Route path={ROUTES.ATTENDANCE_VERIFY} element={<AttendanceVerificationPage />} />
            <Route path={ROUTES.ATTENDANCE_MISSING} element={<MissingAttendancePage />} />

            {/* Payroll */}
            <Route path={ROUTES.PAYROLLS} element={<PayrollListPage />} />
            <Route path={ROUTES.PAYROLL_DETAILS} element={<PayrollDetailsPage />} />

            {/* Invoices */}
            <Route path={ROUTES.INVOICES} element={<InvoiceListPage />} />
            <Route path={ROUTES.INVOICE_DETAILS} element={<InvoiceDetailsPage />} />

            {/* Payments */}
            <Route path={ROUTES.PAYMENTS} element={<PaymentListPage />} />
            <Route path={ROUTES.PAYMENT_RECEIPT} element={<PaymentReceiptPage />} />
            <Route path="/admin/worker-payouts" element={<WorkerPayoutsPage />} />

            {/* System Settings */}
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />

          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
