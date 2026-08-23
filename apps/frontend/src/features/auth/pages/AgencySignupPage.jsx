import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";
import { ArrowLeft, Briefcase } from "lucide-react";
import SocialSignupOptions from "../components/SocialSignupOptions";

export default function AgencySignupPage() {
  return (
    <div className="min-h-[85vh] bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <Link to={ROUTES.SIGNUP} className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Role Selection
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Agency Registration</h2>
            <p className="text-xs text-gray-500">Create your account to recruit workers.</p>
          </div>
        </div>

        <SocialSignupOptions role="AGENCY" />

        <p className="text-center text-xs text-gray-500 mt-8">
            Already have an account?{" "}
            <Link to={ROUTES.LOGIN} className="text-blue-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
