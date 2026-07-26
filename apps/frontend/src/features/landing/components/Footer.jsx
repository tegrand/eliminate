import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Shield className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                ELIMINATE<span className="text-blue-500">.</span>
              </span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed">
              Enterprise workforce management system powering shift fulfillment, attendance verification, and automated payroll.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Solutions</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/signup/client" className="hover:text-white transition-colors">For Employers & Clients</Link></li>
              <li><Link to="/signup/agency" className="hover:text-white transition-colors">For Staffing Agencies</Link></li>
              <li><Link to="/signup/worker" className="hover:text-white transition-colors">For Job Seekers & Workers</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Legal & Compliance</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Security & Audit</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} ELIMINATE Workforce Platform Inc. All rights reserved.</p>
          <p>Designed for Enterprise Performance</p>
        </div>
      </div>
    </footer>
  );
}
