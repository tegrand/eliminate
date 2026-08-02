import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { ArrowLeft, Users, CheckCircle, Upload, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../../hooks/useAuth";

export default function WorkerSignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    gender: "MALE",
    primarySkill: "",
    expectedDailyWage: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
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
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
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
              <p className="text-xs text-gray-500">Step {currentStep} of 3 • Independent Worker Registration</p>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex gap-1.5">
            {[1, 2, 3].map(step => (
              <div 
                key={step} 
                className={`h-2 rounded-full transition-all ${
                  step === currentStep ? "w-6 bg-blue-600" : step < currentStep ? "w-2 bg-gray-900" : "w-2 bg-gray-200"
                }`} 
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          {/* STEP 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-semibold text-gray-900">Step 1: Personal Information</h3>
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
                  placeholder="+1 234 567 8902"
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
          )}

          {/* STEP 2: Job Info */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-semibold text-gray-900">Step 2: Job Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Primary Trade / Skill"
                  name="primarySkill"
                  value={formData.primarySkill}
                  onChange={handleChange}
                  placeholder="e.g. Mason, Electrician"
                  required
                />
                <Input
                  label="Expected Daily Wage"
                  name="expectedDailyWage"
                  value={formData.expectedDailyWage}
                  onChange={handleChange}
                  placeholder="e.g. ₹900"
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-semibold text-gray-900">Step 3: Review Application</h3>
              <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl text-xs space-y-2 text-gray-700">
                <p><strong>Full Name:</strong> {formData.fullName || "N/A"}</p>
                <p><strong>Contact:</strong> {formData.email} • {formData.phone}</p>
                <p><strong>Job & Wage:</strong> {formData.primarySkill} ({formData.expectedDailyWage})</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs text-gray-500 flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Independent Registration Notice:</strong> You are registering as an independent worker. Once registered, agencies or employers can match you to shifts directly.
                </span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" onClick={handlePrev}>
                Previous
              </Button>
            ) : <div />}

            <Button type="submit" loading={loading} className="bg-gray-900 hover:bg-gray-800">
              {currentStep === 3 ? (
                <>Submit Worker Application <CheckCircle className="ml-2 h-4 w-4" /></>
              ) : "Continue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
