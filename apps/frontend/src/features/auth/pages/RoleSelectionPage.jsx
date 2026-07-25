import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";
import { Building2, Briefcase, Users, ArrowRight, ShieldCheck } from "lucide-react";

export default function RoleSelectionPage() {
  const roles = [
    {
      id: "CLIENT",
      title: "Client",
      subtitle: "For Employers & Businesses",
      description: "I need skilled workers for my business or enterprise operations.",
      icon: Building2,
      badge: "Instant Access",
      badgeColor: "bg-green-50 text-green-700 border-green-100",
      buttonText: "Continue as Client",
      link: ROUTES.SIGNUP_CLIENT
    },
    {
      id: "AGENCY",
      title: "Agency",
      subtitle: "For Staffing Vendors",
      description: "I manage, train, and supply skilled workers to enterprise clients.",
      icon: Briefcase,
      badge: "Requires Verification",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
      buttonText: "Continue as Agency",
      link: ROUTES.SIGNUP_AGENCY
    },
    {
      id: "WORKER",
      title: "Worker",
      subtitle: "For Job Seekers",
      description: "I am looking for reliable, high-paying work opportunities.",
      icon: Users,
      badge: "Requires Verification",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-100",
      buttonText: "Continue as Worker",
      link: ROUTES.SIGNUP_WORKER
    }
  ];

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-4">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Secure Enterprise Registration</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Create Your Account
          </h1>
          <p className="mt-3 text-base text-gray-600">
            Choose how you want to use the platform to get started.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <div 
              key={role.id}
              className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="h-12 w-12 rounded-xl bg-gray-900 text-white flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <role.icon className="h-6 w-6" />
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${role.badgeColor}`}>
                    {role.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900">{role.title}</h3>
                <p className="text-xs font-medium text-gray-500 mb-3">{role.subtitle}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-8">{role.description}</p>
              </div>

              <Link
                to={role.link}
                className="w-full bg-gray-900 group-hover:bg-blue-600 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>{role.buttonText}</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-gray-500 mt-12">
          Already have an account? <Link to={ROUTES.LOGIN} className="text-blue-600 font-semibold hover:underline">Log in here</Link>
        </p>
      </div>
    </div>
  );
}
