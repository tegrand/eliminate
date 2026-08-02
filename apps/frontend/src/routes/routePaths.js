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
  WORKER_DETAILS: "/workers/:id",
  WORKER_PROFILE: "/worker/profile",
  MY_INVITATIONS: "/worker/invitations",
  WORKER_SETTINGS: "/worker/settings",
  FIND_WORK: "/find-work",
  MY_JOBS: "/my-jobs",
  MY_ATTENDANCE: "/my-attendance",
  MY_PAYMENTS: "/my-payments",
  MY_DOCUMENTS: "/my-documents",
  MY_SKILLS: "/my-skills",

  // Client
  CLIENTS: "/clients",
  CLIENT_DETAILS: "/clients/:id",
  CLIENT_PROFILE: "/client/profile",
  WORKFORCE_SEARCH: "/search-workers",
  WORKFORCE_PROFILE: "/search-workers/:id",
  AGENCY_SEARCH: "/search-agencies",
  CLIENT_JOBS: "/jobs",
  CLIENT_REQUESTS: "/client/requests",
  

  // Agency
  AGENCIES: "/agencies",
  AGENCY_DETAILS: "/agencies/:id",
  AGENCY_PROFILE: "/agency/profile",
  AGENCY_CLIENTS: "/agency/clients",
  AGENCY_JOB_REQUIREMENTS: "/agency/job-requirements",
  AGENCY_TEAM_ASSIGNMENTS: "/agency/team-assignments",

  // Master Data
  SKILLS: "/skills",
  CATEGORIES: "/categories",
  LANGUAGES: "/languages",
  LOCATIONS: "/locations",

  // Job Requirements
  JOB_REQUIREMENTS: "/job-requirements",
  JOB_REQUIREMENT_DETAILS: "/job-requirements/:id",
  ASSIGN_WORKERS: "/job-requirements/:id/assign",

  // Hiring Requests
  HIRING_REQUESTS: "/hiring-requests",

  // Assignments
  ASSIGNMENTS: "/assignments",
  ASSIGNMENT_DETAILS: "/assignments/:id",

  // Attendance
  ATTENDANCE: "/attendance",
  ATTENDANCE_BULK: "/attendance/bulk",
  ATTENDANCE_VERIFY: "/attendance/verify/:id",
  ATTENDANCE_MISSING: "/attendance/missing/:id",

  // Payroll
  PAYROLLS: "/payrolls",
  PAYROLL_DETAILS: "/payrolls/:id",

  // Invoices
  INVOICES: "/invoices",
  INVOICE_DETAILS: "/invoices/:id",

  // Payments
  PAYMENTS: "/payments",
  PAYMENT_RECEIPT: "/payments/:id",

  // Settings
  SETTINGS: "/settings",
};
