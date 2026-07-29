import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCircle2, AlertCircle, Building2, Briefcase, FileText, IndianRupee, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { workerApi } from "../api/worker.api";
import { formatDistanceToNow } from "date-fns";
import Button from "../../../components/ui/button/Button";

export default function WorkerNotificationsPage() {
  const queryClient = useQueryClient();

  const { data: notificationsData, isLoading, error } = useQuery({
    queryKey: ["workerNotifications"],
    queryFn: async () => {
      const res = await workerApi.getNotifications();
      return res.data ?? res;
    }
  });

  const notifications = Array.isArray(notificationsData) ? notificationsData : [];

  const markReadMutation = useMutation({
    mutationFn: (id) => workerApi.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["workerNotifications"]);
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => workerApi.markAllNotificationsRead(),
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries(["workerNotifications"]);
    }
  });

  const getIcon = (type) => {
    switch (type) {
      case 'APPROVAL':
      case 'VERIFICATION':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'AGENCY_INVITE':
        return <Building2 className="w-5 h-5 text-blue-500" />;
      case 'JOB_ASSIGNMENT':
      case 'JOB_INVITATION':
        return <Briefcase className="w-5 h-5 text-indigo-500" />;
      case 'PAYMENT':
        return <IndianRupee className="w-5 h-5 text-emerald-600" />;
      case 'SYSTEM':
      default:
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Stay updated with your latest alerts and messages.</p>
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            onClick={() => markAllReadMutation.mutate()}
            loading={markAllReadMutation.isPending}
            className="text-sm"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 border-b border-red-100">
            Failed to load notifications.
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">All caught up!</h3>
            <p className="text-slate-500 text-sm">You have no new notifications right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-5 flex gap-4 transition-colors hover:bg-slate-50 ${!notification.isRead ? 'bg-indigo-50/30' : ''}`}
                onClick={() => !notification.isRead && markReadMutation.mutate(notification.id)}
              >
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${!notification.isRead ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm ${!notification.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-slate-400 whitespace-nowrap ml-4">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 pr-8 leading-relaxed">
                    {notification.message}
                  </p>
                </div>

                {!notification.isRead && (
                  <div className="shrink-0 flex items-center">
                    <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
