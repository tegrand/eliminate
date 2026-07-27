import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User, Phone, Mail, MapPin, Loader2, Save, Building2, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { useAuth } from "../../../hooks/useAuth";
import { clientApi } from "../api/client.api";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function ClientProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await clientApi.getMe();
        setProfileData(data);
        reset({
          contactPerson: data.contactPerson || "",
          email: data.email || data.user?.email || "",
          phone: data.phone || "",
          addressLine1: data.addressLine1 || "",
          addressLine2: data.addressLine2 || "",
          city: data.city || "",
          postalCode: data.postalCode || "",
        });
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const onSubmit = async (formData) => {
    try {
      setSaving(true);
      const updated = await clientApi.updateMe(formData);
      setProfileData(updated);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto pt-4 pb-12 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            My Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your personal and contact details</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative"></div>
        
        <div className="px-6 sm:px-10 pb-10 relative">
          {/* Avatar Section */}
          <div className="flex justify-between items-end -mt-12 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
                {profileData?.user?.avatar ? (
                  <img src={profileData.user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <User className="w-10 h-10" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-green-50 text-green-700 border border-green-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4" /> Active Client
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
              
              <Input
                label="Full Name"
                placeholder="John Doe"
                {...register("contactPerson", { required: "Full name is required" })}
                error={errors.contactPerson?.message}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Profile Photo URL</label>
                <input
                  type="text"
                  disabled
                  value={profileData?.user?.avatar || "No photo uploaded"}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                />
              </div>

              <Input
                label="Mobile Number"
                placeholder="+91 9876543210"
                {...register("phone", { required: "Mobile number is required" })}
                error={errors.phone?.message}
              />

              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                {...register("email", { required: "Email is required" })}
                error={errors.email?.message}
              />

              <div className="md:col-span-2">
                <Input
                  label="Address"
                  placeholder="House/Flat No, Street, Area"
                  {...register("addressLine1")}
                />
              </div>

              <Input
                label="District"
                placeholder="e.g. Ernakulam"
                {...register("city", { required: "District is required" })}
                error={errors.city?.message}
              />

              <Input
                label="Pincode"
                placeholder="682001"
                {...register("postalCode", { required: "Pincode is required" })}
                error={errors.postalCode?.message}
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button type="submit" disabled={saving} className="min-w-[140px]">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
