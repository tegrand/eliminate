import { ROUTES } from "../routes/routePaths";
import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  BookOpen,
  Tags,
  Globe,
  MapPin,
  CreditCard,
  FileText,
  DollarSign,
  UserCircle,
  Briefcase,
  Bookmark,
  CalendarCheck,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";

const ALL_ROLES = ["SUPER_ADMIN", "CLIENT", "AGENCY", "WORKER"];
const ADMIN_ONLY = ["SUPER_ADMIN"];

// clientType is derived from the user object: "COMPANY" | "INDIVIDUAL" | undefined
export const NAVIGATION_CONFIG = [
  // ─── OVERVIEW (all roles) ─────────────────────────────────────────────────
  {
    group: "Overview",
    roles: ALL_ROLES,
    items: [
      {
        title: "Dashboard",
        path: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
        roles: ALL_ROLES,
      },
    ],
  },

  // ─── CLIENT – COMPANY ─────────────────────────────────────────────────────
  {
    group: "Job Management",
    roles: ["CLIENT"],
    clientTypes: ["COMPANY"],
    items: [
      {
        title: "Job Requirements",
        path: ROUTES.JOB_REQUIREMENTS,
        icon: ClipboardList,
        roles: ["CLIENT"],
        clientTypes: ["COMPANY"],
      },
    ],
  },
  {
    group: "My Workers",
    roles: ["CLIENT"],
    clientTypes: ["COMPANY"],
    items: [
      {
        title: "Assigned Workers",
        path: ROUTES.WORKERS,
        icon: Users,
        roles: ["CLIENT"],
        clientTypes: ["COMPANY"],
      },
      {
        title: "Attendance",
        path: ROUTES.ATTENDANCE,
        icon: CalendarCheck,
        roles: ["CLIENT"],
        clientTypes: ["COMPANY"],
      },
    ],
  },
  {
    group: "My Agencies",
    roles: ["CLIENT"],
    clientTypes: ["COMPANY"],
    items: [
      {
        title: "Agencies",
        path: ROUTES.AGENCIES,
        icon: Building2,
        roles: ["CLIENT"],
        clientTypes: ["COMPANY"],
      },
    ],
  },


  // ─── WORKER PORTAL ────────────────────────────────────────────────────────
  {
    group: "Job Opportunities",
    roles: ["WORKER"],
    items: [
      {
        title: "Find Work",
        path: ROUTES.FIND_WORK,
        icon: Briefcase,
        roles: ["WORKER"],
      },
      {
        title: "My Jobs",
        path: ROUTES.MY_JOBS,
        icon: Bookmark,
        roles: ["WORKER"],
      },
      {
        title: "My Attendance",
        path: ROUTES.MY_ATTENDANCE,
        icon: CalendarCheck,
        roles: ["WORKER"],
      },
      {
        title: "My Payments",
        path: ROUTES.MY_PAYMENTS,
        icon: CreditCard,
        roles: ["WORKER"],
      },
      {
        title: "My Documents",
        path: ROUTES.MY_DOCUMENTS,
        icon: FileText,
        roles: ["WORKER"],
      },
    ],
  },

  // ─── SUPER ADMIN PORTAL ───────────────────────────────────────────────────
  {
    group: "User Management",
    roles: ADMIN_ONLY,
    items: [
      {
        title: "Workers",
        path: ROUTES.WORKERS,
        icon: Users,
        roles: ADMIN_ONLY,
      },
      {
        title: "Agencies",
        path: ROUTES.AGENCIES,
        icon: Building2,
        roles: ADMIN_ONLY,
      },
      {
        title: "Clients",
        path: ROUTES.CLIENTS,
        icon: Building2,
        roles: ADMIN_ONLY,
      },
    ],
  },
  {
    group: "Operations",
    roles: ADMIN_ONLY,
    items: [
      {
        title: "Job Requirements",
        path: ROUTES.JOB_REQUIREMENTS,
        icon: ClipboardList,
        roles: ADMIN_ONLY,
      },
      {
        title: "Attendance Monitor",
        path: ROUTES.ATTENDANCE,
        icon: ShieldCheck,
        roles: ADMIN_ONLY,
      },
    ],
  },
  {
    group: "Finance",
    roles: ADMIN_ONLY,
    items: [
      {
        title: "Payroll",
        path: ROUTES.PAYROLLS,
        icon: DollarSign,
        roles: ADMIN_ONLY,
      },
      {
        title: "Invoices",
        path: ROUTES.INVOICES,
        icon: FileText,
        roles: ADMIN_ONLY,
      },
      {
        title: "Payments",
        path: ROUTES.PAYMENTS,
        icon: CreditCard,
        roles: ADMIN_ONLY,
      },
    ],
  },
  {
    group: "Master Data",
    roles: ADMIN_ONLY,
    items: [
      {
        title: "Skills",
        path: ROUTES.SKILLS,
        icon: BookOpen,
        roles: ADMIN_ONLY,
      },
      {
        title: "Categories",
        path: ROUTES.CATEGORIES,
        icon: Tags,
        roles: ADMIN_ONLY,
      },
      {
        title: "Languages",
        path: ROUTES.LANGUAGES,
        icon: Globe,
        roles: ADMIN_ONLY,
      },
      {
        title: "Locations",
        path: ROUTES.LOCATIONS,
        icon: MapPin,
        roles: ADMIN_ONLY,
      },
    ],
  },
];
