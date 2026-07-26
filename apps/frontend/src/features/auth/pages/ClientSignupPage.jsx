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
      clientType: "COMPANY"
    }
  });

  const clientType = watch("clientType");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Dynamic import to avoid circular dependency issues if any
      const { authApi } = await import("../api/auth.api");
      await authApi.registerClient(data);
      toast.success("Client account created successfully! Please log in.");
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
            <p className="text-xs text-gray-500">Instant access for employers and enterprise businesses.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
            <button
              type="button"
              onClick={() => setValue("clientType", "INDIVIDUAL")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${
                clientType === "INDIVIDUAL" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <User className="w-4 h-4" /> Individual
            </button>
            <button
              type="button"
              onClick={() => setValue("clientType", "COMPANY")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${
                clientType === "COMPANY" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Building2 className="w-4 h-4" /> Company
            </button>
          </div>

          {clientType === "COMPANY" && (
            <Input
              label="Company Name"
              placeholder="e.g. Acme Corp Inc."
              error={errors.companyName?.message}
              {...register("companyName")}
            />
          )}
          <Input
            label="Contact Person Name"
            placeholder="e.g. John Doe"
            error={errors.contactPerson?.message}
            {...register("contactPerson")}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="email"
              label="Work Email"
              placeholder="john@company.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Phone Number"
              placeholder="+1 234 567 8900"
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
            <CheckCircle2 className="mr-2 h-4 w-4" /> Create Client Account
          </Button>
        </form>
      </div>
    </div>
  );
}
