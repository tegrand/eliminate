import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Breadcrumb from "../components/layout/Breadcrumb";
import PageContainer from "../components/layout/PageContainer";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-gray-900">
      {/* Sidebar - Desktop Only (Hidden on Mobile/Tablet via Tailwind classes) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        
        <PageContainer>
          <Breadcrumb />
          
          {/* This renders the actual feature page (e.g. WorkerListPage) */}
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
}
