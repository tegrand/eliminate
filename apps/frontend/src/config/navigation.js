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
  DollarSign
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
        path: ROUTES.ASSIGNMENTS,
        icon: Briefcase,
      },
      {
        title: "Attendance",
        path: ROUTES.ATTENDANCE,
        icon: Clock,
      }
    ]
  },
  {
    group: "Clients & Orders",
    items: [
      {
        title: "Clients",
        path: ROUTES.CLIENTS,
        icon: Building2,
      },
      {
        title: "Job Requirements",
        path: ROUTES.JOB_REQUIREMENTS,
        icon: FileText,
      }
    ]
  },
  {
    group: "Finance & Operations",
    items: [
      {
        title: "Payroll",
        path: ROUTES.PAYROLLS,
        icon: DollarSign,
      },
      {
        title: "Invoices",
        path: ROUTES.INVOICES,
        icon: FileText,
      },
      {
        title: "Payments",
        path: ROUTES.PAYMENTS,
        icon: CreditCard,
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
  }
];
