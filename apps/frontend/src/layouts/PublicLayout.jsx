import { Outlet } from "react-router-dom";
import PublicNavbar from "../features/landing/components/PublicNavbar";
import Footer from "../features/landing/components/Footer";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
