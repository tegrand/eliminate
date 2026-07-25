import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";
import { ArrowRight, CheckCircle, ShieldCheck, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-6">
            <Zap className="h-3.5 w-3.5 text-blue-600" />
            <span>Next-Generation Workforce Infrastructure</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
            The Complete Operating System for <span className="text-blue-600">On-Demand Labor</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
            Eliminate operational friction. Connect enterprise clients, staffing agencies, and skilled workers in a single automated platform with real-time tracking and instant payroll.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={ROUTES.SIGNUP}
              className="w-full sm:w-auto text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto text-base font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 px-7 py-3.5 rounded-xl transition-all flex items-center justify-center"
            >
              See How It Works
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span>Verified Identity & Credentials</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span>Automated Geofenced Attendance</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              <span>100% Tax & Legal Compliance</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
