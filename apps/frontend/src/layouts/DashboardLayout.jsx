import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import PageContainer from "../components/layout/PageContainer";
import BottomNav from "../components/layout/BottomNav";
import { SidebarProvider } from "../contexts/SidebarContext";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-gray-900">
        <Sidebar />

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header />
          
          <PageContainer>
            <Outlet />
          </PageContainer>
        </div>
      </div>
      <BottomNav />
    </SidebarProvider>
  );
}
