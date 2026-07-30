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
  Search,
  DollarSign,
  UserCircle,
  Briefcase,
  Bookmark,
  CalendarCheck,
  ShieldCheck,
  ClipboardList,
  UserCheck,
  UserPlus,
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
        title: "My Skills",
        path: ROUTES.MY_SKILLS,
        icon: UserCheck, // Will import if needed, or use a general one like FileText. Let's use Tags
        roles: ["WORKER"],
      },
      {
        title: "My Documents",
        path: ROUTES.MY_DOCUMENTS,
        icon: FileText,
        roles: ["WORKER"],
      },
      {
        title: "Invitations",
        path: ROUTES.MY_INVITATIONS,
        icon: Bell,
        roles: ["WORKER"],
      },
      {
        title: "Find Work",
        path: ROUTES.FIND_WORK,
        icon: Search,
        roles: ["WORKER"],
      },
      {
        title: "My Jobs",
        path: ROUTES.MY_JOBS,
        icon: Briefcase,
        roles: ["WORKER"],
      },
      {
        title: "Attendance",
        path: ROUTES.MY_ATTENDANCE,
        icon: Clock,
        roles: ["WORKER"],
      },
      {
        title: "Work History",
        path: "/worker/history",
        icon: FileText,
        roles: ["WORKER"],
      },
      {
        title: "Complaints",
        path: "/worker/complaints",
        icon: Bookmark,
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
        title: "My Jobs",
        path: ROUTES.CLIENT_JOBS,
        icon: FileText,
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
      {
        title: "Find / Add Workers",
        path: ROUTES.WORKERS + "?view=all",
        icon: UserPlus,
        roles: ["AGENCY"],
      },
      {
        title: "Job Requirements",
        path: ROUTES.AGENCY_JOB_REQUIREMENTS,
        icon: Briefcase,
        roles: ["AGENCY"],
      },
      {
        title: "Team Assignments",
        path: ROUTES.AGENCY_TEAM_ASSIGNMENTS,
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
        title: "Clients",
        path: ROUTES.AGENCY_CLIENTS,
        icon: UserCheck,
        roles: ["AGENCY"],
      }
    ],
  },

  // ─── COMPANY TOOLS ───────────────────────────────────────────────────────
  {
    group: "Enterprise Tools",
    roles: ["CLIENT"],
    clientType: "COMPANY", // Special flag for Sidebar.jsx to check
    items: [
      {
        title: "Projects",
        path: ROUTES.COMPANY_PROJECTS,
        icon: Building2,
        roles: ["CLIENT"],
      },
      {
        title: "Sites",
        path: ROUTES.COMPANY_SITES,
        icon: MapPin,
        roles: ["CLIENT"],
      },
      {
        title: "Departments",
        path: ROUTES.COMPANY_DEPARTMENTS,
        icon: Users,
        roles: ["CLIENT"],
      },
      {
        title: "Teams",
        path: ROUTES.COMPANY_TEAMS,
        icon: Users,
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
        title: "Assignments",
        path: ROUTES.ASSIGNMENTS,
        icon: UserCheck,
        roles: ["SUPER_ADMIN", "AGENCY", "WORKER", "CLIENT"],
      },
      {
        title: "Hiring Requests",
        path: ROUTES.HIRING_REQUESTS,
        icon: Briefcase,
        roles: ["AGENCY", "WORKER", "CLIENT"],
      },
    ],
  },
];
