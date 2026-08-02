import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  User, Phone, Mail, MapPin, Loader2, Save, Camera,
  Building2, Hash, CheckCircle2, FileText, Globe
} from "lucide-react";
import { clientApi } from "../api/client.api";

// Helper for form fields
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

export default function ClientProfileForm({ clientData, refetchClient }) {
  const [activeTab, setActiveTab] = useState("basic");

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      contactPerson:  clientData?.contactPerson  || "",
      phone:          clientData?.phone          || "",
      alternatePhone: clientData?.alternatePhone || "",
      email:          clientData?.email          || clientData?.user?.email || "",
      addressLine1:   clientData?.addressLine1   || "",
      addressLine2:   clientData?.addressLine2   || "",
      city:           clientData?.city           || "",
      state:          clientData?.state          || "",
      country:        clientData?.country        || "India",
      postalCode:     clientData?.postalCode     || "",
    },
  });

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: (data) => clientApi.updateMe(data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      refetchClient();
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to update profile"),
  });

  const initials = clientData?.contactPerson
    ? clientData.contactPerson.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : (clientData?.user?.email?.[0] || "U").toUpperCase();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3.5 h-3.5"/> Verified</span>;
      case 'PENDING':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-700">Pending</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-700">{status || 'ACTIVE'}</span>;
    }
  };

  return (
    <form onSubmit={handleSubmit(save)} className="flex flex-col h-full animate-fade-in">
      <div className="p-5 flex-1">
        
        {/* Header & Image Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 text-lg font-bold">
                {clientData?.user?.avatar
                  ? <img src={clientData.user.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                  : initials}
              </div>
              <button type="button" title="Upload Photo" className="absolute bottom-0 right-0 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 text-gray-500 transition-colors">
                <Camera className="w-3 h-3 text-gray-500 hover:text-blue-600" />
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2">
                  {clientData?.contactPerson || "My Profile"}
                {getStatusBadge(clientData?.profileStatus)}
              </div>
              <p className="text-sm text-gray-500">{clientData?.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Inner Tabs */}
        <div className="flex gap-6 border-b border-gray-100 mt-2">
          {[
            { id: "basic", label: "Basic Details" },
            { id: "contact", label: "Contact Details" },
            { id: "location", label: "Location Details" },
          ].map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === t.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="pt-6">
          {activeTab === "basic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Field label="Contact Person" icon={User} error={errors.contactPerson?.message}>
                <input {...register("contactPerson", { required: "Contact person is required" })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" placeholder="e.g. John Doe" />
              </Field>

            </div>
          )}

          {activeTab === "contact" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Primary Phone" icon={Phone} error={errors.phone?.message}>
                <input {...register("phone", { required: "Primary phone is required" })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" placeholder="+91 9876543210" />
              </Field>
              <Field label="Alternate Phone" icon={Phone}>
                <input {...register("alternatePhone")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" placeholder="Optional alternate number" />
              </Field>
              <Field label="Email Address" icon={Mail} error={errors.email?.message}>
                <input {...register("email", { required: "Email is required" })}
                  type="email" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" placeholder="you@example.com" />
              </Field>
            </div>
          )}

          {activeTab === "location" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Address Line 1" icon={MapPin} className="md:col-span-2">
                <input {...register("addressLine1")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" placeholder="Building, Street, Area" />
              </Field>
              <Field label="Address Line 2" icon={MapPin} className="md:col-span-2">
                <input {...register("addressLine2")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" placeholder="Landmark, Locality (Optional)" />
              </Field>
              <Field label="City / District" icon={Globe} error={errors.city?.message}>
                <input {...register("city")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" placeholder="e.g. Kochi" />
              </Field>
              <Field label="State" icon={Globe}>
                <input {...register("state")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" placeholder="e.g. Kerala" />
              </Field>
              <Field label="PIN Code" icon={Hash} error={errors.postalCode?.message}>
                <input {...register("postalCode")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" placeholder="e.g. 682001" />
              </Field>
              <Field label="Country" icon={Globe}>
                <input {...register("country")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" placeholder="e.g. India" />
              </Field>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex justify-end mt-auto">
        <button type="submit" disabled={saving || !isDirty}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
