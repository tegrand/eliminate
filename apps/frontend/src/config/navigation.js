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
  UserCheck,
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
        title: "Post a Job",
        path: ROUTES.CREATE_JOB,
        icon: FileText,
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
    ],
  },
];
