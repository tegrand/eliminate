import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";
import { ArrowRight, Shield, Menu, X } from "lucide-react";

export default function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a>
          <a href="#user-types" className="hover:text-gray-900 transition-colors">Solutions</a>
          <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
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

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4 shadow-lg absolute w-full left-0 top-16">
          <nav className="flex flex-col space-y-3 text-base font-medium text-gray-600">
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-900 block py-2 border-b border-gray-50">Features</a>
            <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-900 block py-2 border-b border-gray-50">How It Works</a>
            <a href="#user-types" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-900 block py-2 border-b border-gray-50">Solutions</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-900 block py-2 border-b border-gray-50">Pricing</a>
            <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-900 block py-2 border-b border-gray-50">FAQ</a>
          </nav>
          <div className="flex flex-col gap-3 pt-2">
            <Link
              to={ROUTES.LOGIN}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 py-3 rounded-lg transition-colors"
            >
              Log In
            </Link>
            <Link
              to={ROUTES.SIGNUP}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center font-semibold bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
