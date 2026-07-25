import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";
import { Clock, ShieldCheck, ArrowRight } from "lucide-react";

export default function PendingApprovalPage() {
  return (
    <div className="min-h-[85vh] bg-gray-50/50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
        <div className="h-16 w-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="h-8 w-8 animate-pulse" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Submitted!</h1>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Your account is currently <span className="font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Pending Verification</span>.
        </p>

        <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl text-xs text-gray-500 leading-relaxed mb-6 text-left space-y-2">
          <div className="flex items-center gap-2 font-medium text-gray-700">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span>Super Admin Verification Standard</span>
          </div>
          <p>
            To maintain high operational quality and compliance, all Agency and Worker accounts must be verified by a Super Administrator before gaining dashboard access.
          </p>
          <p>
            You will receive an email notification once your documents and credentials have been approved.
          </p>
        </div>

        <Link
          to={ROUTES.LANDING}
          className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-sm transition-all"
        >
          Return to Home <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
