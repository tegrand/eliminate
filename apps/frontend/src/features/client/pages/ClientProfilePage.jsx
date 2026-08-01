import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  User, Phone, Mail, MapPin, Lock, History, Monitor,
  Loader2, Save, Camera, ShieldCheck, LogOut, ChevronRight,
  Globe, Hash, CheckCircle2, AlertCircle, Smartphone, Eye, EyeOff, Settings
} from "lucide-react";
import { useForm } from "react-hook-form";
import { usersApi } from "../../../api/users.api";
import { useAuth } from "../../../hooks/useAuth";
import { clientApi } from "../api/client.api";
import ClientProfileForm from "../components/ClientProfileForm";

const TABS = []; // Not used anymore

// ── Action badge colours for login history ────────────────────────────────────
const ACTION_STYLE = {
  LOGIN:           { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Login" },
  LOGOUT:          { bg: "bg-gray-50",    text: "text-gray-600",    dot: "bg-gray-400",    label: "Logout" },
  FAILED_LOGIN:    { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500",     label: "Failed Login" },
  REFRESH:         { bg: "bg-blue-50",    text: "text-blue-600",    dot: "bg-blue-400",    label: "Token Refresh" },
  PASSWORD_CHANGE: { bg: "bg-violet-50",  text: "text-violet-700",  dot: "bg-violet-500",  label: "Password Changed" },
  ACCOUNT_LOCK:    { bg: "bg-orange-50",  text: "text-orange-700",  dot: "bg-orange-500",  label: "Account Locked" },
};

function parseUserAgent(ua = "") {
  if (!ua) return "Unknown device";
  if (ua.includes("iPhone") || ua.includes("Android")) return "📱 Mobile";
  if (ua.includes("Chrome"))  return "🌐 Chrome";
  if (ua.includes("Firefox")) return "🦊 Firefox";
  if (ua.includes("Safari"))  return "🧭 Safari";
  if (ua.includes("Edge"))    return "🌐 Edge";
  return "💻 Desktop";
}

// ── Sub-sections ─────────────────────────────────────────────────────────────

function ChangePasswordTab() {
  const [show, setShow] = useState({ current: false, new: false, confirm: false });

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

  const { mutate: change, isPending } = useMutation({
    mutationFn: (d) => usersApi.changePassword({ currentPassword: d.currentPassword, newPassword: d.newPassword }),
    onSuccess: () => { toast.success("Password changed!"); reset(); },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to change password"),
  });

  const toggle = (field) => setShow(s => ({ ...s, [field]: !s[field] }));

  return (
    <form onSubmit={handleSubmit(change)} className="flex flex-col h-full">
      <div className="p-5 space-y-5 flex-1">


      {[
        { id: "currentPassword", label: "Current Password", placeholder: "Enter current password", field: "current" },
        { id: "newPassword",     label: "New Password",     placeholder: "Enter new password",     field: "new",
          validate: v => v.length >= 8 || "Minimum 8 characters" },
        { id: "confirmPassword", label: "Confirm Password", placeholder: "Re-enter new password",  field: "confirm",
          validate: v => v === watch("newPassword") || "Passwords do not match" },
      ].map(({ id, label, placeholder, field, validate }) => (
        <div key={id} className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">{label}</label>
          <div className="relative">
            <input
              {...register(id, { required: `${label} is required`, validate })}
              type={show[field] ? "text" : "password"}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all pr-10"
            />
            <button type="button" onClick={() => toggle(field)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {show[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors[id] && <p className="text-xs text-red-500">{errors[id].message}</p>}
        </div>
      ))}

      </div>
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex justify-end mt-auto">
        <button type="submit" disabled={isPending}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          {isPending ? "Changing…" : "Change Password"}
        </button>
      </div>
    </form>
  );
}

function LoginHistoryTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["loginHistory"],
    queryFn: async () => {
      const res = await usersApi.getLoginHistory();
      return res.data.data;
    },
  });

  if (isLoading) return <Spinner />;

  const logs = data || [];

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">Showing last {logs.length} auth events for your account.</p>

      {logs.length === 0 ? (
        <Empty icon={History} message="No login history found." />
      ) : (
        <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
          {logs.map((log) => {
            const style = ACTION_STYLE[log.action] || ACTION_STYLE["LOGIN"];
            return (
              <div key={log.id} className="flex items-center gap-4 px-5 py-4 bg-white hover:bg-gray-50 transition-colors">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${style.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                      {style.label}
                    </span>
                    <span className="text-xs text-gray-400">{parseUserAgent(log.userAgent)}</span>
                    {log.ipAddress && (
                      <span className="text-xs text-gray-400">· {log.ipAddress}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(log.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ActiveSessionsTab() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["activeSessions"],
    queryFn: async () => {
      const res = await usersApi.getActiveSessions();
      return res.data.data;
    },
  });

  const { mutate: revokeAll, isPending: revoking } = useMutation({
    mutationFn: () => usersApi.revokeAllSessions(),
    onSuccess: () => {
      toast.success("All sessions revoked. You will be logged out.");
      queryClient.invalidateQueries(["activeSessions"]);
    },
    onError: () => toast.error("Failed to revoke sessions"),
  });

  if (isLoading) return <Spinner />;

  const sessions = data?.sessions || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{sessions.length} active session{sessions.length !== 1 ? "s" : ""} found.</p>
        {sessions.length > 0 && (
          <button onClick={() => revokeAll()} disabled={revoking}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-100 transition-colors disabled:opacity-50">
            {revoking ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            Revoke All Sessions
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <Empty icon={Monitor} message="No active sessions found." />
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id}
              className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">{session.label}</p>
                  {session.isCurrent && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Last active: {session.lastActive
                    ? new Date(session.lastActive).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
                    : "Unknown"}
                </p>
                <p className="text-xs text-gray-400">
                  Expires: {session.expiresAt
                    ? new Date(session.expiresAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
                    : "Unknown"}
                </p>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" title="Active" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function Field({ label, icon: Icon, error, className = "", children }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />} {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
    </div>
  );
}

function Empty({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center gap-3 py-14 text-gray-400">
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
        <Icon className="w-7 h-7 text-gray-300" />
      </div>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ClientProfilePage() {
  const { user } = useAuth();

  const { data: clientData, isLoading, refetch } = useQuery({
    queryKey: ["clientProfile"],
    queryFn: async () => {
      const res = await clientApi.getMe(); // returns ApiResponse body: { success, data: client }
      return res.data ?? res;              // extract the actual client object
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-full py-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="w-6 h-6 text-blue-600" />
          Settings
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Manage your account details, password, and security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Profile Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Profile Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Update your personal or company information.
            </p>
          </div>
          <div className="flex-1 flex flex-col">
            <ClientProfileForm clientData={clientData} refetchClient={refetch} />
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-600" />
              Change Password
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Update your account password securely.
            </p>
          </div>
          <div className="flex-1 flex flex-col">
            <ChangePasswordTab />
          </div>
        </div>
      </div>
    </div>
  );
}
