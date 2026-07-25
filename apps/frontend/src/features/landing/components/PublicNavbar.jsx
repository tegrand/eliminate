import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";
import { ArrowRight, Shield } from "lucide-react";

export default function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
            <Shield className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">
            ELIMINATE<span className="text-blue-600">.</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a>
          <a href="#user-types" className="hover:text-gray-900 transition-colors">Solutions</a>
          <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.LOGIN}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3.5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Log In
          </Link>
          <Link
            to={ROUTES.SIGNUP}
            className="text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
