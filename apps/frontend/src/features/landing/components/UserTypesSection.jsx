import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";
import { Building2, Users, Briefcase, ArrowRight } from "lucide-react";

export default function UserTypesSection() {
  const roles = [
    {
      title: "Businesses & Clients",
      description: "Scale your workforce on demand. Access thousands of verified workers and agency partners with full operational visibility.",
      icon: Building2,
      cta: "Register as Client",
      link: ROUTES.SIGNUP_CLIENT,
      badge: "For Employers"
    },
    {
      title: "Staffing Agencies",
      description: "Streamline workforce supply. Manage your talent pool, receive direct job orders from enterprise clients, and automate billing.",
      icon: Briefcase,
      cta: "Register as Agency",
      link: ROUTES.SIGNUP_AGENCY,
      badge: "For Vendors"
    },
    {
      title: "Skilled Workers",
      description: "Find reliable work opportunities. Register independently, get matched to top employers, and receive guaranteed timely payouts.",
      icon: Users,
      cta: "Register as Worker",
      link: ROUTES.SIGNUP_WORKER,
      badge: "For Job Seekers"
    }
  ];

  return (
    <section id="user-types" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Tailored Solutions for Every Stakeholder
          </h2>
          <p className="mt-4 text-base text-gray-600">
            Choose your role and start streamlining workforce management today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, idx) => (
            <div key={idx} className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all group">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-6">
                  {role.badge}
                </span>
                <div className="h-10 w-10 rounded-xl bg-gray-900 text-white flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors">
                  <role.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{role.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-8">{role.description}</p>
              </div>

              <Link
                to={role.link}
                className="inline-flex items-center justify-between text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors pt-4 border-t border-gray-100"
              >
                <span>{role.cta}</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
