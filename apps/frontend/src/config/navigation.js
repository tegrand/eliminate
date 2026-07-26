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
  UserCircle
} from "lucide-react";

const ALL_ROLES = ["SUPER_ADMIN", "CLIENT", "AGENCY", "WORKER"];
const ADMIN_ONLY = ["SUPER_ADMIN"];

export const NAVIGATION_CONFIG = [
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
      {
        title: "My Profile",
        path: ROUTES.WORKER_PROFILE,
        icon: UserCircle,
        roles: ["WORKER"],
      }
    ]
  },
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
      }
    ]
  },
  {
    group: "Finance & Operations",
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
      }
    ]
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
      }
    ]
  }
];
