import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { ArrowLeft, Briefcase, CheckCircle, Upload } from "lucide-react";
import { toast } from "sonner";

export default function AgencySignupPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
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
    state: "",
    pincode: "",
    gstNumber: "",
    licenseNumber: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      setLoading(true);
      try {
        const { authApi } = await import("../api/auth.api");
        await authApi.registerAgency(formData);
        toast.success("Agency registration submitted for Super Admin review.");
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

        {/* Wizard Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Agency Onboarding</h2>
              <p className="text-xs text-gray-500">Step {currentStep} of 4</p>
            </div>
          </div>

          {/* Step Pills */}
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map(step => (
              <div 
                key={step} 
                className={`h-2 rounded-full transition-all ${
                  step === currentStep ? "w-6 bg-amber-500" : step < currentStep ? "w-2 bg-gray-900" : "w-2 bg-gray-200"
                }`} 
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          {/* STEP 1: Agency Info */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-semibold text-gray-900">Step 1: Agency & Owner Credentials</h3>
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
          )}

          {/* STEP 2: Business Info */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-semibold text-gray-900">Step 2: Business Address & Licenses</h3>
              <Input
                label="Registered Business Address"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="Suite 400, Industrial Hub"
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
                  placeholder="California"
                  required
                />
                <Input
                  label="Pincode / Postal Code"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="90210"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Input
                  label="GST Number (Optional)"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="22AAAAA0000A1Z5"
                />
                <Input
                  label="Labor Supply License # (Optional)"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="LIC-99201-B"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Documents */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-semibold text-gray-900">Step 3: Verification Documents</h3>
              <p className="text-xs text-gray-500">Upload clear scanned copies for Super Admin verification.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-amber-500 transition-colors cursor-pointer bg-gray-50/50">
                  <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">Business Registration Certificate (Optional)</p>
                  <p className="text-[10px] text-gray-400 mt-1">PDF, PNG, JPG (Max 5MB)</p>
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-amber-500 transition-colors cursor-pointer bg-gray-50/50">
                  <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">GST Registration (Optional)</p>
                  <p className="text-[10px] text-gray-400 mt-1">PDF, PNG, JPG (Max 5MB)</p>
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-amber-500 transition-colors cursor-pointer bg-gray-50/50">
                  <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">Owner Identity Proof (Optional)</p>
                  <p className="text-[10px] text-gray-400 mt-1">Passport, Govt ID</p>
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-amber-500 transition-colors cursor-pointer bg-gray-50/50">
                  <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">Office Address Proof (Optional)</p>
                  <p className="text-[10px] text-gray-400 mt-1">Utility Bill, Lease Agreement</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-semibold text-gray-900">Step 4: Final Review & Submission</h3>
              <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl text-xs space-y-2 text-gray-700">
                <p><strong>Agency:</strong> {formData.agencyName || "N/A"}</p>
                <p><strong>Owner:</strong> {formData.ownerName || "N/A"}</p>
                <p><strong>Email:</strong> {formData.email || "N/A"}</p>
                <p><strong>Phone:</strong> {formData.phone || "N/A"}</p>
                <p><strong>Location:</strong> {formData.district}, {formData.state}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs text-gray-500 leading-relaxed">
                By submitting this form, you confirm that all attached agency documents and license credentials are authentic. Upon submission, your agency account status will be set to <strong>Pending Verification</strong> until reviewed by Super Admin.
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" onClick={handlePrev}>
                Previous
              </Button>
            ) : <div />}

            <Button type="submit" loading={loading} className="bg-gray-900 hover:bg-gray-800">
              {currentStep === 4 ? (
                <>Submit Agency Registration <CheckCircle className="ml-2 h-4 w-4" /></>
              ) : "Continue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
