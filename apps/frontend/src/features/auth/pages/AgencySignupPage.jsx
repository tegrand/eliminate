import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { ArrowLeft, Briefcase, CheckCircle, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../../hooks/useAuth";

export default function AgencySignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

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
    try {
      const { authApi } = await import("../api/auth.api");
      await authApi.registerAgency(formData);
      
      // Auto-login the user
      const response = await authApi.login({ email: formData.email, password: formData.password });
      login(response.data.data.user, response.data.data.accessToken);
      
      toast.success("Agency registration successful! Welcome to your dashboard.");
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
              <p className="text-xs text-gray-500">Agency Registration</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Agency Info */}
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-semibold text-gray-900">Agency & Owner Credentials</h3>
              <Input
                label="Agency Name"
                name="agencyName"
                value={formData.agencyName}
                onChange={handleChange}
                placeholder="e.g. Apex Staffing Partners"
                required
              />
              <Input
                label="Owner / Managing Director Name"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="e.g. Anita Sharma"
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="email"
                  label="Official Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@apexstaffing.com"
                  required
                />
                <Input
                  label="Official Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8901"
                  required
                />
              </div>
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
      </div>
    </div>
  );
}
