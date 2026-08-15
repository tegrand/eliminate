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
  WORKER_SETTINGS: "/worker/settings",
  MY_ATTENDANCE: "/my-attendance",

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

  // Agency
  AGENCIES: "/agencies",
  AGENCY_DETAILS: "/agencies/:id",
  AGENCY_PROFILE: "/agency/profile",
  AGENCY_SETTINGS: "/agency/settings",
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


  // Settings
  SETTINGS: "/settings",
  ADVERTISEMENTS: "/advertisements",
  AD_PACKAGES: "/ad-packages",

  // Admin
  ADMIN: "/admin/*",
};
