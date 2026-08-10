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
  Bell,
  DollarSign,
  UserCircle,
  Briefcase,
  Bookmark,
  CalendarCheck,
  ShieldCheck,
  ClipboardList,
  UserCheck,
  UserPlus,
  Settings,
} from "lucide-react";

const ALL_ROLES = ["SUPER_ADMIN", "CLIENT", "AGENCY", "WORKER"];
const ADMIN_ONLY = ["SUPER_ADMIN"];

export const NAVIGATION_CONFIG = [
  // ─── OVERVIEW ────────────────────────────────────────────────────────────
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

  // ─── WORKER PORTAL ───────────────────────────────────────────────────────
  {
    group: "My Workspace",
    roles: ["WORKER"],
    items: [
      {
        title: "Invitations",
        path: ROUTES.MY_INVITATIONS,
        icon: Bell,
        roles: ["WORKER"],
      },

      {
        title: "My Jobs",
        path: ROUTES.MY_JOBS,
        icon: Briefcase,
        roles: ["WORKER"],
      },
      {
        title: "My Earnings",
        path: "/worker/earnings",
        icon: DollarSign,
        roles: ["WORKER"],
      },

      {
        title: "Work History",
        path: "/worker/history",
        icon: FileText,
        roles: ["WORKER"],
      },
    ],
  },

  // ─── WORKER ACCOUNT ──────────────────────────────────────────────────────
  {
    group: "Account",
    roles: ["WORKER"],
    items: [
      {
        title: "Settings",
        path: ROUTES.WORKER_SETTINGS,
        icon: Settings,
        roles: ["WORKER"],
      },
    ],
  },

  // ─── CLIENT PORTAL ───────────────────────────────────────────────────────
  {
    group: "Recruitment",
    roles: ["CLIENT"],
    items: [
      {
        title: "Find Workers",
        path: ROUTES.WORKFORCE_SEARCH,
        icon: Users,
        roles: ["CLIENT"],
      },
      {
        title: "Find Agencies",
        path: ROUTES.AGENCY_SEARCH,
        icon: Building2,
        roles: ["CLIENT"],
      },
      {
        title: "Assignments",
        path: ROUTES.ASSIGNMENTS,
        icon: UserCheck,
        roles: ["CLIENT"],
      },
      {
        title: "My Requests",
        path: ROUTES.CLIENT_REQUESTS,
        icon: Briefcase,
        roles: ["CLIENT"],
      },
    ],
  },



  // ─── AGENCY PORTAL ───────────────────────────────────────────────────────
  {
    group: "Workforce Management",
    roles: ["AGENCY"],
    items: [
      {
        title: "Our Workers",
        path: ROUTES.WORKERS + "?view=my",
        icon: Users,
        roles: ["AGENCY"],
      },
    ],
  },
  {
    group: "Client Management",
    roles: ["AGENCY"],
    items: [

      {
        title: "Hiring Requests",
        path: ROUTES.HIRING_REQUESTS,
        icon: Briefcase,
        roles: ["AGENCY"],
      },
      {
        title: "Earnings",
        path: "/agency/earnings",
        icon: DollarSign,
        roles: ["AGENCY"],
      }
    ],
  },
  // ─── AGENCY ACCOUNT ──────────────────────────────────────────────────────
  {
    group: "Account",
    roles: ["AGENCY"],
    items: [
      {
        title: "Settings",
        path: ROUTES.AGENCY_SETTINGS,
        icon: Settings,
        roles: ["AGENCY"],
      },
    ],
  },

  // ─── CLIENT ACCOUNT ──────────────────────────────────────────────────────
  {
    group: "Account",
    roles: ["CLIENT"],
    items: [
      {
        title: "Settings",
        path: ROUTES.CLIENT_PROFILE,
        icon: Settings,
        roles: ["CLIENT"],
      },
    ],
  },

  // ─── SUPER ADMIN PORTAL ──────────────────────────────────────────────────
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

      {
        title: "Hiring Requests",
        path: ROUTES.HIRING_REQUESTS,
        icon: Briefcase,
        roles: ["AGENCY", "WORKER", "CLIENT"],
      },
    ],
  },
  {
    group: "Financial Management",
    roles: ADMIN_ONLY,
    items: [
      {
        title: "Worker Payouts",
        path: "/admin/worker-payouts",
        icon: DollarSign,
        roles: ADMIN_ONLY,
      },
      {
        title: "Agency Payouts",
        path: "/agency-payouts",
        icon: DollarSign,
        roles: ADMIN_ONLY,
      },
    ],
  },
  {
    group: "System Configuration",
    roles: ADMIN_ONLY,
    items: [
      {
        title: "Settings",
        path: ROUTES.SETTINGS,
        icon: Settings,
        roles: ADMIN_ONLY,
      },
    ],
  },
];
