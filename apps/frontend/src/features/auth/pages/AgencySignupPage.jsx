import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { ArrowLeft, Briefcase, CheckCircle, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../../hooks/useAuth";
import SocialSignupOptions from "../components/SocialSignupOptions";

export default function AgencySignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [agencyType, setAgencyType] = useState("corporate");

  // Form State across steps
  const [formData, setFormData] = useState({
    agencyName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    addressLine1: "",
    district: "",
    state: "Kerala",
    pincode: "",
    gstNumber: "",
    licenseNumber: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // If Individual, use Owner Name as Agency Name
    const payload = { ...formData };
    if (agencyType === "individual") {
      payload.agencyName = payload.ownerName;
      payload.gstNumber = "";
      payload.licenseNumber = "";
    }

    try {
      const { authApi } = await import("../api/auth.api");
      await authApi.registerAgency(payload);
      
      // Auto-login the user
      const response = await authApi.login({ email: payload.email, password: payload.password });
      login(response.data.data.user, response.data.data.accessToken);
      
      toast.success("Registration successful! Welcome to your dashboard.");
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <Link to={ROUTES.SIGNUP} className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Role Selection
        </Link>

        {/* Wizard Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Agency Onboarding</h2>
              <p className="text-xs text-gray-500">Agency / Recruiter Registration</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Agency Type Selection */}
          <div className="space-y-3 mb-8">
            <h3 className="text-sm font-semibold text-gray-900">Are you registering as a Corporate Agency or an Individual Recruiter?</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAgencyType("corporate")}
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${agencyType === "corporate" ? "border-amber-500 bg-amber-50 text-amber-800" : "border-gray-200 hover:border-amber-200 hover:bg-amber-50/50 text-gray-600"}`}
              >
                <span className="font-bold text-sm">Corporate Agency</span>
                <span className="text-[11px] mt-1 opacity-70">Company / Organization</span>
              </button>
              <button
                type="button"
                onClick={() => setAgencyType("individual")}
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${agencyType === "individual" ? "border-amber-500 bg-amber-50 text-amber-800" : "border-gray-200 hover:border-amber-200 hover:bg-amber-50/50 text-gray-600"}`}
              >
                <span className="font-bold text-sm">Individual Recruiter</span>
                <span className="text-[11px] mt-1 opacity-70">Independent Person</span>
              </button>
            </div>
          </div>

          {/* Agency Info */}
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-semibold text-gray-900">{agencyType === "corporate" ? "Agency & Owner Credentials" : "Your Details"}</h3>
              
              {agencyType === "corporate" && (
                <Input
                  label="Agency Name"
                  name="agencyName"
                  value={formData.agencyName}
                  onChange={handleChange}
                  placeholder="e.g. Apex Staffing Partners"
                  required={agencyType === "corporate"}
                />
              )}

              <Input
                label={agencyType === "corporate" ? "Owner / Managing Director Name" : "Full Name"}
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder={agencyType === "corporate" ? "e.g. Anita Sharma" : "e.g. Rahul Kumar"}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="email"
                  label={agencyType === "corporate" ? "Official Email" : "Email Address"}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={agencyType === "corporate" ? "contact@apexstaffing.com" : "rahul@example.com"}
                  required
                />
                <Input
                  label={agencyType === "corporate" ? "Official Phone Number" : "Phone Number"}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8901"
                  required
                />
              </div>

              {agencyType === "corporate" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="GST Number (Optional)"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    placeholder="e.g. 32ABCDE1234F1Z5"
                  />
                  <Input
                    label="License Number (Optional)"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="e.g. LIC/2023/KOC/8892"
                  />
                </div>
              )}

              <Input
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-end pt-6 border-t border-gray-100">
            <Button type="submit" loading={loading} className="bg-gray-900 hover:bg-gray-800">
              Submit
            </Button>
          </div>
        </form>
        
        <SocialSignupOptions role="AGENCY" />
      </div>
    </div>
  );
}
