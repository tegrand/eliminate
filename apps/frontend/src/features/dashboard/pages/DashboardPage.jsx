import DashboardStats from "../components/DashboardStats";
import { useAuth } from "../../../hooks/useAuth";
import { Calendar, ChevronDown } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="w-full pb-8 pt-0 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Welcome back, {user?.profileType === "SUPER_ADMIN" ? "Super Admin" : user?.name || "User"}! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening in your system today.
          </p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>May 21, 2025</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <DashboardStats />
    </div>
  );
}
