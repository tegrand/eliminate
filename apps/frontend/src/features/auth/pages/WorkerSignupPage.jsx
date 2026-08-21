import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { ArrowLeft, Users, CheckCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../../hooks/useAuth";
import SocialSignupOptions from "../components/SocialSignupOptions";

const KERALA_DISTRICTS = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam", 
  "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", "Kozhikode", 
  "Wayanad", "Kannur", "Kasaragod"
];

export default function WorkerSignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    gender: "MALE",
    addressLine1: "",
    state: "Kerala",
    district: "Ernakulam",
    travelDistance: "10",
    jobType: "",
    experience: "",
    skill: "",
    language: "",
    expectedDailyWage: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateString = maxDate.toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { authApi } = await import("../api/auth.api");
      await authApi.registerWorker(formData);
      
      // Auto-login the user
      const response = await authApi.login({ email: formData.email, password: formData.password });
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

        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Worker Onboarding</h2>
              <p className="text-xs text-gray-500">Independent Worker Registration</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-semibold text-gray-900">Basic Details</h3>
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Santhosh Kumar"
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="email"
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="santhosh@example.com"
                  required
                />
                <Input
                  type="password"
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Mobile Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  required
                />
                <Input
                  label="Address Line 1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="House/Flat number, Street"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Date of Birth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  max={maxDateString}
                  required
                />
                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={[
                    { value: "MALE", label: "Male" },
                    { value: "FEMALE", label: "Female" },
                    { value: "OTHER", label: "Other" }
                  ]}
                />
              </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-end pt-6 border-t border-gray-100">
            <Button type="submit" loading={loading} className="bg-gray-900 hover:bg-gray-800">
              Submit
            </Button>
          </div>
        </form>
        
        <SocialSignupOptions role="WORKER" />
      </div>
    </div>
  );
}

