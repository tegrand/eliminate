import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  User, Phone, Mail, MapPin, Lock, History, Monitor,
  Loader2, Save, Camera, ShieldCheck, LogOut, ChevronRight,
  Globe, Hash, CheckCircle2, AlertCircle, Smartphone, Eye, EyeOff,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { usersApi } from "../../../api/users.api";
import { useAuth } from "../../../hooks/useAuth";
import { clientApi } from "../api/client.api";

const TABS = [
  { id: "profile", label: "Edit Profile", icon: User },
  { id: "password", label: "Change Password", icon: Lock },
  { id: "history", label: "Login History", icon: History },
  { id: "sessions", label: "Active Sessions", icon: Monitor },
];

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

function EditProfileTab({ clientData, refetchClient }) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      contactPerson: clientData?.contactPerson || "",
      phone:         clientData?.phone         || "",
      email:         clientData?.email         || clientData?.user?.email || "",
      addressLine1:  clientData?.addressLine1  || "",
      city:          clientData?.city          || "",
      postalCode:    clientData?.postalCode    || "",
    },
  });

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: (d) => clientApi.updateMe(d),
    onSuccess: () => {
      toast.success("Profile updated!");
      refetchClient();
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to update profile"),
  });

  const initials = clientData?.contactPerson
    ? clientData.contactPerson.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : (clientData?.user?.email?.[0] || "U").toUpperCase();

  return (
    <form onSubmit={handleSubmit(save)} className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5 p-5 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg text-white text-2xl font-bold">
            {clientData?.user?.avatar
              ? <img src={clientData.user.avatar} alt="" className="w-full h-full object-cover rounded-2xl" />
              : initials}
          </div>
          <button type="button" title="Upload photo (coming soon)" className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-blue-50 transition-colors">
            <Camera className="w-3.5 h-3.5 text-blue-600" />
          </button>
        </div>
        <div>
          <p className="font-semibold text-gray-900">{clientData?.contactPerson || "—"}</p>
          <p className="text-sm text-gray-500">{clientData?.user?.email}</p>
          <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Full Name" icon={User} error={errors.contactPerson?.message}>
          <input {...register("contactPerson", { required: "Full name is required" })}
            className="field-input" placeholder="John Doe" />
        </Field>

        <Field label="Mobile Number" icon={Phone} error={errors.phone?.message}>
          <input {...register("phone", { required: "Mobile number is required" })}
            className="field-input" placeholder="+91 9876543210" />
        </Field>

        <Field label="Email Address" icon={Mail} error={errors.email?.message}>
          <input {...register("email", { required: "Email is required" })}
            type="email" className="field-input" placeholder="you@example.com" />
        </Field>

        <Field label="District" icon={Globe} error={errors.city?.message}>
          <input {...register("city", { required: "District is required" })}
            className="field-input" placeholder="e.g. Ernakulam" />
        </Field>

        <Field label="Address" icon={MapPin} className="md:col-span-2">
          <input {...register("addressLine1")}
            className="field-input" placeholder="House / Street / Area" />
        </Field>

        <Field label="Pincode" icon={Hash} error={errors.postalCode?.message}>
          <input {...register("postalCode", { required: "Pincode is required" })}
            className="field-input" placeholder="682001" />
        </Field>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button type="submit" disabled={saving || !isDirty}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

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
    <form onSubmit={handleSubmit(change)} className="space-y-5 max-w-md">
      <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-700">
        <ShieldCheck className="w-5 h-5 mt-0.5 shrink-0" />
        <p>Use a strong password with at least 8 characters, a number, and a special character.</p>
      </div>

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
              className="field-input pr-10"
            />
            <button type="button" onClick={() => toggle(field)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {show[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors[id] && <p className="text-xs text-red-500">{errors[id].message}</p>}
        </div>
      ))}

      <button type="submit" disabled={isPending}
        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors">
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
        {isPending ? "Changing…" : "Change Password"}
      </button>
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
  const [activeTab, setActiveTab] = useState("profile");

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
    <div className="w-full max-w-4xl mx-auto pt-4 pb-12 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account details, password, and security settings</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600" />

        {/* Tab nav */}
        <div className="border-b border-gray-100 px-6 -mt-px">
          <nav className="flex gap-1 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    active
                      ? "border-blue-600 text-blue-700"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab content */}
        <div className="p-6 sm:p-8">
          {activeTab === "profile"  && <EditProfileTab clientData={clientData} refetchClient={refetch} />}
          {activeTab === "password" && <ChangePasswordTab />}
          {activeTab === "history"  && <LoginHistoryTab />}
          {activeTab === "sessions" && <ActiveSessionsTab />}
        </div>
      </div>

      {/* Inject field-input style scoped to this page */}
      <style>{`
        .field-input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.625rem;
          font-size: 0.875rem;
          background: white;
          color: #111827;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
        }
        .field-input::placeholder { color: #9ca3af; }
      `}</style>
    </div>
  );
}
