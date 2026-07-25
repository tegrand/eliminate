import { Users, Clock, DollarSign, ShieldCheck, Cpu, BarChart3 } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "Smart Talent Allocation",
      description: "Algorithmically match qualified workers to client job requirements based on skills, geography, and availability."
    },
    {
      icon: Clock,
      title: "Biometric & Geofenced Attendance",
      description: "Ensure zero time-theft with automated check-ins, location validation, and supervisor discrepancy verification."
    },
    {
      icon: DollarSign,
      title: "Instant Payroll Engine",
      description: "Automatically calculate wages, overtime multipliers, tax withholdings, and advance deductions with 1-click approvals."
    },
    {
      icon: ShieldCheck,
      title: "Automated Compliance",
      description: "Keep complete digital audit trails for labor law regulations, license checks, GST compliance, and worker documentation."
    },
    {
      icon: Cpu,
      title: "Multi-Agency Coordination",
      description: "Allow multiple staffing agencies to supply talent seamlessly to large-scale enterprise deployments without double-booking."
    },
    {
      icon: BarChart3,
      title: "Operational Analytics",
      description: "Real-time dashboards for shift coverage, agency fulfillment rates, labor spend, and worker attendance metrics."
    }
  ];

  return (
    <section id="features" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Engineered for Enterprise Efficiency
          </h2>
          <p className="mt-4 text-base text-gray-600">
            Everything you need to orchestrate complex workforce operations from job post to final payroll.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
