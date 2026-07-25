import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { ArrowLeft, Users, CheckCircle, Upload, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function WorkerSignupPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state across 5 steps
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "MALE",
    houseName: "",
    district: "",
    state: "",
    pincode: "",
    primarySkill: "",
    experienceYears: "2",
    preferredCategory: "",
    expectedSalary: "$25/hr"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      setLoading(true);
      try {
        const { authApi } = await import("../api/auth.api");
        await authApi.registerWorker(formData);
        toast.success("Worker application submitted for Super Admin verification.");
        navigate(ROUTES.PENDING_APPROVAL);
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
              <p className="text-xs text-gray-500">Step {currentStep} of 5 • Independent Worker Registration</p>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map(step => (
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

          {/* STEP 2: Address */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-semibold text-gray-900">Step 2: Permanent Address</h3>
              <Input
                label="House / Villa Name & Street"
                name="houseName"
                value={formData.houseName}
                onChange={handleChange}
                placeholder="No. 42, Green Valley Apartments"
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="District"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Central District"
                  required
                />
                <Input
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Texas"
                  required
                />
                <Input
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="75001"
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 3: Professional Details */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-semibold text-gray-900">Step 3: Skills & Professional Experience</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Primary Trade / Skill"
                  name="primarySkill"
                  value={formData.primarySkill}
                  onChange={handleChange}
                  placeholder="e.g. Certified Electrician, Forklift Operator"
                  required
                />
                <Input
                  label="Years of Experience"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  placeholder="e.g. 4"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Preferred Job Category"
                  name="preferredCategory"
                  value={formData.preferredCategory}
                  onChange={handleChange}
                  placeholder="e.g. Logistics & Warehouse"
                  required
                />
                <Input
                  label="Expected Pay Rate"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                  placeholder="e.g. $25/hr"
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 4: Documents & Bank */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-semibold text-gray-900">Step 4: Identity & Bank Uploads</h3>
              <p className="text-xs text-gray-500">Required for automated background checks and direct wage deposits.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50/50">
                  <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">Profile Photo *</p>
                  <p className="text-[10px] text-gray-400 mt-1">Clear headshot photo</p>
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50/50">
                  <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">Govt ID (Aadhaar/National ID) *</p>
                  <p className="text-[10px] text-gray-400 mt-1">Front & Back PDF/JPG</p>
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50/50">
                  <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">Bank Passbook / Cancelled Cheque *</p>
                  <p className="text-[10px] text-gray-400 mt-1">For direct wage deposits</p>
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50/50">
                  <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">Trade Skill Certificates (Optional)</p>
                  <p className="text-[10px] text-gray-400 mt-1">Proof of certification</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-semibold text-gray-900">Step 5: Review Application</h3>
              <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl text-xs space-y-2 text-gray-700">
                <p><strong>Full Name:</strong> {formData.fullName || "N/A"}</p>
                <p><strong>Contact:</strong> {formData.email} • {formData.phone}</p>
                <p><strong>Trade & Skill:</strong> {formData.primarySkill} ({formData.experienceYears} yrs experience)</p>
                <p><strong>Address:</strong> {formData.district}, {formData.state}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs text-gray-500 flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Independent Registration Notice:</strong> You are registering as an independent worker. You are not attached to any staffing agency. Once verified by Super Admin, agencies or employers can match you to shifts directly.
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
              {currentStep === 5 ? (
                <>Submit Worker Application <CheckCircle className="ml-2 h-4 w-4" /></>
              ) : "Continue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
