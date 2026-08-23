import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import PageContainer from "../components/layout/PageContainer";
import BottomNav from "../components/layout/BottomNav";
import { SidebarProvider } from "../contexts/SidebarContext";
import { useAuth } from "../hooks/useAuth";

export default function DashboardLayout() {
  const { user } = useAuth();
  const isWorker = user?.profileType === "WORKER";
  const isClient = user?.profileType === "CLIENT";
  const isAgency = user?.profileType === "AGENCY";
  const isNoSidebar = isWorker || isClient || isAgency;

  const bgImage = isWorker 
    ? "/screen/worker_screen.png" 
    : isClient 
      ? "/screen/client_screen.png" 
      : isAgency
        ? "/screen/agency_screen.png"
        : null;

  return (
    <SidebarProvider>
      <div 
        className={`flex h-screen overflow-hidden font-sans text-gray-900 ${
          bgImage ? "bg-no-repeat bg-cover bg-center" : "bg-gray-50"
        }`}
        style={bgImage ? { backgroundImage: `url('${bgImage}')` } : {}}
      >
        {!isNoSidebar && <Sidebar />}

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header />
          
          <PageContainer isTransparent={Boolean(bgImage)}>
            <Outlet />
          </PageContainer>
        </div>
      </div>
      <BottomNav />
    </SidebarProvider>
  );
}
