export const ROUTES = {
  // Public Landing & Onboarding
  LANDING: "/",
  SIGNUP: "/signup",
  SIGNUP_CLIENT: "/signup/client",
  SIGNUP_AGENCY: "/signup/agency",
  SIGNUP_WORKER: "/signup/worker",
  PENDING_APPROVAL: "/pending-approval",

  // Auth
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Overview
  DASHBOARD: "/dashboard",

  // Worker
  WORKERS: "/workers",
  WORKER_CREATE: "/workers/new",
  WORKER_DETAILS: "/workers/:id",
  WORKER_EDIT: "/workers/:id/edit",

  // Client
  CLIENTS: "/clients",
  CLIENT_CREATE: "/clients/new",
  CLIENT_EDIT: "/clients/:id/edit",

  // Agency
  AGENCIES: "/agencies",
  AGENCY_CREATE: "/agencies/new",
  AGENCY_EDIT: "/agencies/:id/edit",

  // Master Data
  SKILLS: "/skills",
  CATEGORIES: "/categories",
  LANGUAGES: "/languages",
  LOCATIONS: "/locations",

  // Job Requirements
  JOB_REQUIREMENTS: "/job-requirements",
  ASSIGN_WORKERS: "/job-requirements/:id/assign",

  // Assignments
  ASSIGNMENTS: "/assignments",

  // Attendance
  ATTENDANCE: "/attendance",
  ATTENDANCE_BULK: "/attendance/bulk",
  ATTENDANCE_VERIFY: "/attendance/verify/:id",

  // Payroll
  PAYROLLS: "/payrolls",
  PAYROLL_DETAILS: "/payrolls/:id",

  // Invoices
  INVOICES: "/invoices",
  INVOICE_DETAILS: "/invoices/:id",

  // Payments
  PAYMENTS: "/payments",
};
