import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function SidebarLogo() {
  return (
    <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-6">
      <Link to="/" className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Shield className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold tracking-tight text-gray-900">ELIMINATE</span>
      </Link>
    </div>
  );
}
