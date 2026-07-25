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
          Welcome back, {user?.name || "User"}. Here's what's happening today.
        </p>
      </div>

      {user?.status === 'PENDING' && (
        <div className="mb-8 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Account Status: Unverified</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>Profile Not Completed / Documents Not Submitted. Please submit required documents for verification.</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
