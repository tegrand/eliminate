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
    group: "User Management",
    items: [
      {
        title: "Workers",
        path: ROUTES.WORKERS,
        icon: Users,
        subItems: [
          { title: "Dashboard", path: ROUTES.WORKERS },
          { title: "Pending", path: `${ROUTES.WORKERS}?status=PENDING` },
          { title: "Approved", path: `${ROUTES.WORKERS}?status=APPROVED` },
          { title: "Rejected", path: `${ROUTES.WORKERS}?status=REJECTED` },
          { title: "Suspended", path: `${ROUTES.WORKERS}?status=SUSPENDED` }
        ]
      },
      {
        title: "Agencies",
        path: ROUTES.AGENCIES,
        icon: Building2,
        subItems: [
          { title: "Dashboard", path: ROUTES.AGENCIES },
          { title: "Pending", path: `${ROUTES.AGENCIES}?status=PENDING` },
          { title: "Approved", path: `${ROUTES.AGENCIES}?status=APPROVED` },
          { title: "Rejected", path: `${ROUTES.AGENCIES}?status=REJECTED` },
          { title: "Suspended", path: `${ROUTES.AGENCIES}?status=SUSPENDED` }
        ]
      },
      {
        title: "Clients",
        path: ROUTES.CLIENTS,
        icon: Building2,
        subItems: [
          { title: "Dashboard", path: ROUTES.CLIENTS },
          { title: "Active", path: `${ROUTES.CLIENTS}?status=ACTIVE` },
          { title: "Suspended", path: `${ROUTES.CLIENTS}?status=SUSPENDED` }
        ]
      }
    ]
  },
  {
    group: "Operations",
    items: [
      {
        title: "Assignments",
        path: ROUTES.ASSIGNMENTS,
        icon: Briefcase,
      },
      {
        title: "Attendance",
        path: ROUTES.ATTENDANCE,
        icon: Clock,
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
