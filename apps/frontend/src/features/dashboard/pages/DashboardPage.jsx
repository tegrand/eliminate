import DashboardStats from "../components/DashboardStats";
import QuickActions from "../components/QuickActions";
import RecentActivity from "../components/RecentActivity";
import UpcomingRequirements from "../components/UpcomingRequirements";
import NotificationPanel from "../components/NotificationPanel";
import { useAuth } from "../../../hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-500">
          Welcome back, {user?.name || "Admin"}. Here's what's happening today.
        </p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <QuickActions />
          <UpcomingRequirements />
        </div>
        
        <div className="space-y-8">
          <NotificationPanel />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
