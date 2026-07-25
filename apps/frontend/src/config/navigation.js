import { ROUTES } from "../routes/routePaths";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase, 
  Clock, 
  BookOpen, 
  Tags, 
  Globe, 
  MapPin, 
  CreditCard, 
  FileText, 
  BarChart, 
  ShieldCheck 
} from "lucide-react";

export const NAVIGATION_CONFIG = [
  {
    group: "Overview",
    items: [
      {
        title: "Dashboard",
        path: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
      }
    ]
  },
  {
    group: "Workforce",
    items: [
      {
        title: "Workers",
        path: ROUTES.WORKERS,
        icon: Users,
      },
      {
        title: "Agencies",
        path: ROUTES.AGENCIES,
        icon: Building2,
      },
      {
        title: "Assignments",
        path: "/assignments",
        icon: Briefcase,
        disabled: true, // Future
      },
      {
        title: "Attendance",
        path: "/attendance",
        icon: Clock,
        disabled: true, // Future
      }
    ]
  },
  {
    group: "Clients",
    items: [
      {
        title: "Clients",
        path: ROUTES.CLIENTS,
        icon: Briefcase,
      },
      {
        title: "Job Requirements",
        path: ROUTES.JOB_REQUIREMENTS,
        icon: FileText,
      }
    ]
  },
  {
    group: "Master Data",
    items: [
      {
        title: "Skills",
        path: ROUTES.SKILLS,
        icon: BookOpen,
      },
      {
        title: "Categories",
        path: ROUTES.CATEGORIES,
        icon: Tags,
      },
      {
        title: "Languages",
        path: ROUTES.LANGUAGES,
        icon: Globe,
      },
      {
        title: "Locations",
        path: ROUTES.LOCATIONS,
        icon: MapPin,
      }
    ]
  },
  {
    group: "Operations",
    items: [
      {
        title: "Payments",
        path: "/payments",
        icon: CreditCard,
        disabled: true,
      },
      {
        title: "Invoices",
        path: "/invoices",
        icon: FileText,
        disabled: true,
      },
      {
        title: "Reports",
        path: "/reports",
        icon: BarChart,
        disabled: true,
      }
    ]
  },
  {
    group: "Settings",
    items: [
      {
        title: "Users",
        path: "/settings/users",
        icon: Users,
        disabled: true,
      },
      {
        title: "Roles",
        path: "/settings/roles",
        icon: ShieldCheck,
        disabled: true,
      },
      {
        title: "Permissions",
        path: "/settings/permissions",
        icon: ShieldCheck,
        disabled: true,
      }
    ]
  }
];
