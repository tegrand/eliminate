import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6">
          Ready to Modernize Your Workforce Operations?
        </h2>
        <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-10">
          Join hundreds of enterprise clients, agencies, and thousands of skilled workers today.
        </p>
        <Link
          to={ROUTES.SIGNUP}
          className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-xl shadow-lg transition-all"
        >
          Create Your Free Account <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
