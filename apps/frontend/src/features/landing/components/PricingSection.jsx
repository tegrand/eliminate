import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";
import { Check } from "lucide-react";

export default function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "$199",
      period: "/month",
      description: "Ideal for growing businesses needing up to 50 active workers per month.",
      features: ["Up to 50 Workers/Mo", "Basic Geofence Attendance", "Automated Invoicing", "Email Support"],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "$499",
      period: "/month",
      description: "Designed for mid-market operations requiring multi-agency management.",
      features: ["Up to 250 Workers/Mo", "Biometric Shift Verification", "Automated Payroll Engine", "Multi-Agency Dispatch", "Priority 24/7 Support"],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Custom solutions for large enterprises deploying 1,000+ workers across multiple sites.",
      features: ["Unlimited Workers", "Custom ERP & Payroll API Integration", "Dedicated Account Manager", "SLAs & Legal Compliance Suite", "Custom Audit Logs"],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Transparent Pricing for Scaling Businesses
          </h2>
          <p className="mt-4 text-base text-gray-600">
            No hidden fees. Choose a plan that matches your monthly labor deployment scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`p-8 rounded-2xl flex flex-col justify-between ${
                plan.popular 
                  ? "bg-gray-900 text-white shadow-xl ring-2 ring-blue-600" 
                  : "bg-white text-gray-900 border border-gray-200 shadow-sm"
              }`}
            >
              <div>
                {plan.popular && (
                  <span className="bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className={`text-xs mb-6 ${plan.popular ? "text-gray-400" : "text-gray-500"}`}>{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className={`text-sm ${plan.popular ? "text-gray-400" : "text-gray-500"}`}>{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 text-sm">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className={`h-4 w-4 flex-shrink-0 ${plan.popular ? "text-blue-400" : "text-blue-600"}`} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={ROUTES.SIGNUP_CLIENT}
                className={`w-full text-center text-sm font-semibold py-3 rounded-xl transition-colors ${
                  plan.popular 
                    ? "bg-blue-600 hover:bg-blue-500 text-white" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
