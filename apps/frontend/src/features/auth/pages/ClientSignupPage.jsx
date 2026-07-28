import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";
import { clientSignupSchema } from "../schemas/signupSchemas";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { ArrowLeft, Building2, User, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ClientSignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(clientSignupSchema),
    defaultValues: {
      clientType: "INDIVIDUAL"
    }
  });

  const clientType = watch("clientType");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { authApi } = await import("../api/auth.api");
      await authApi.registerClient(data);
      toast.success("Account created successfully! Please log in.");
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <Link to={ROUTES.SIGNUP} className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Role Selection
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-green-100 text-green-700 rounded-xl flex items-center justify-center">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Client Registration</h2>
            <p className="text-xs text-gray-500">Create your account to start hiring workers.</p>
          </div>
        </div>

        {/* Client Type Selector */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">I am registering as a</p>
          <div className="grid grid-cols-2 gap-3">
            {/* Individual Option */}
            <button
              type="button"
              onClick={() => setValue("clientType", "INDIVIDUAL")}
              className={`relative flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 transition-all cursor-pointer ${
                clientType === "INDIVIDUAL"
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {clientType === "INDIVIDUAL" && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </span>
              )}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                clientType === "INDIVIDUAL" ? "bg-blue-100" : "bg-gray-100"
              }`}>
                <User className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm">Individual</p>
                <p className="text-xs opacity-70 mt-0.5">Personal hiring</p>
              </div>
            </button>

            {/* Company Option */}
            <button
              type="button"
              onClick={() => setValue("clientType", "COMPANY")}
              className={`relative flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 transition-all cursor-pointer ${
                clientType === "COMPANY"
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {clientType === "COMPANY" && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </span>
              )}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                clientType === "COMPANY" ? "bg-blue-100" : "bg-gray-100"
              }`}>
                <Building2 className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm">Company</p>
                <p className="text-xs opacity-70 mt-0.5">Business hiring</p>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Company Name - only for COMPANY type */}
          {clientType === "COMPANY" && (
            <Input
              label="Company Name"
              placeholder="e.g. Acme Corporation Pvt. Ltd."
              error={errors.companyName?.message}
              {...register("companyName")}
            />
          )}

          <Input
            label={clientType === "INDIVIDUAL" ? "Your Full Name" : "Contact Person Name"}
            placeholder={clientType === "INDIVIDUAL" ? "e.g. Rahul Sharma" : "e.g. John Doe"}
            error={errors.contactPerson?.message}
            {...register("contactPerson")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Phone Number"
              placeholder="+91 98765 43210"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
            <Input
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
          </div>

          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              {...register("acceptTerms")}
            />
            <label htmlFor="terms" className="text-xs text-gray-600">
              I agree to the <a href="#terms" className="text-blue-600 underline">Terms of Service</a> and <a href="#privacy" className="text-blue-600 underline">Privacy Policy</a>.
            </label>
          </div>
          {errors.acceptTerms && <p className="text-xs text-red-500 mt-1">{errors.acceptTerms.message}</p>}

          <Button type="submit" loading={loading} className="w-full mt-6 bg-gray-900 hover:bg-gray-800">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Create Account
          </Button>

          <p className="text-center text-xs text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to={ROUTES.LOGIN} className="text-blue-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
