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
  const isCompany = clientData?.clientType === "COMPANY";

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      clientType:     clientData?.clientType     || "INDIVIDUAL",
      companyName:    clientData?.companyName    || "",
      contactPerson:  clientData?.contactPerson  || "",
      phone:          clientData?.phone          || "",
      alternatePhone: clientData?.alternatePhone || "",
      email:          clientData?.email          || clientData?.user?.email || "",
      gstNumber:      clientData?.gstNumber      || "",
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
    <form onSubmit={handleSubmit(save)} className="space-y-8 animate-fade-in">
      
      {/* 1. Header & Image Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gray-50/50 rounded-2xl border border-gray-100">
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md text-white text-2xl font-bold">
              {clientData?.user?.avatar
                ? <img src={clientData.user.avatar} alt="" className="w-full h-full object-cover rounded-2xl" />
                : initials}
            </div>
            <button type="button" title="Upload Photo" className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <Camera className="w-4 h-4 text-gray-500 hover:text-blue-600" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-gray-900">
                {isCompany && clientData?.companyName ? clientData.companyName : clientData?.contactPerson || (isCompany ? "Company Profile" : "My Profile")}
              </h3>
              {getStatusBadge(clientData?.profileStatus)}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{clientData?.user?.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-gray-200 shadow-sm text-gray-600">
              {isCompany ? <Building2 className="w-3.5 h-3.5 text-blue-500" /> : <User className="w-3.5 h-3.5 text-blue-500" />}
              {isCompany ? "Company Account" : "Individual Account"}
            </div>
          </div>
        </div>
        
        {/* Right side actions if any */}
        <div className="shrink-0 flex sm:flex-col items-end justify-end gap-2">
          {/* Read-only client type warning if we want to show it, or just empty space */}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* 2. Basic Information */}
      <section>
        <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" /> Basic Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {isCompany && (
            <Field label="Company Name" icon={Building2} error={errors.companyName?.message}>
              <input {...register("companyName", { required: "Company name is required" })}
                className="field-input" placeholder="e.g. Acme Corp" />
            </Field>
          )}

          <Field label="Contact Person" icon={User} error={errors.contactPerson?.message}>
            <input {...register("contactPerson", { required: "Contact person is required" })}
              className="field-input" placeholder="e.g. John Doe" />
          </Field>

          {isCompany && (
            <Field label="GST Number" icon={FileText} error={errors.gstNumber?.message}>
              <input {...register("gstNumber")}
                className="field-input uppercase" placeholder="29ABCDE1234F1Z5" />
            </Field>
          )}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* 3. Contact Information */}
      <section>
        <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" /> Contact Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Primary Phone" icon={Phone} error={errors.phone?.message}>
            <input {...register("phone", { required: "Primary phone is required" })}
              className="field-input" placeholder="+91 9876543210" />
          </Field>
          <Field label="Alternate Phone" icon={Phone}>
            <input {...register("alternatePhone")}
              className="field-input" placeholder="Optional alternate number" />
          </Field>
          <Field label="Email Address" icon={Mail} error={errors.email?.message}>
            <input {...register("email", { required: "Email is required" })}
              type="email" className="field-input" placeholder="you@example.com" />
          </Field>
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* 4. Address & Location */}
      <section>
        <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" /> Location Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Address Line 1" icon={MapPin} className="md:col-span-2">
            <input {...register("addressLine1")}
              className="field-input" placeholder="Building, Street, Area" />
          </Field>
          <Field label="Address Line 2" icon={MapPin} className="md:col-span-2">
            <input {...register("addressLine2")}
              className="field-input" placeholder="Landmark, Locality (Optional)" />
          </Field>
          
          <Field label="City / District" icon={Globe} error={errors.city?.message}>
            <input {...register("city")}
              className="field-input" placeholder="e.g. Kochi" />
          </Field>
          <Field label="State" icon={Globe}>
            <input {...register("state")}
              className="field-input" placeholder="e.g. Kerala" />
          </Field>
          <Field label="PIN Code" icon={Hash} error={errors.postalCode?.message}>
            <input {...register("postalCode")}
              className="field-input" placeholder="e.g. 682001" />
          </Field>
          <Field label="Country" icon={Globe}>
            <input {...register("country")}
              className="field-input" placeholder="e.g. India" />
          </Field>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button type="submit" disabled={saving || !isDirty}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98]">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Saving Changes…" : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
