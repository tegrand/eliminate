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

  return (
    <SidebarProvider>
      <div 
        className={`flex h-screen overflow-hidden font-sans text-gray-900 ${
          isWorker ? "bg-no-repeat bg-cover bg-center" : "bg-gray-50"
        }`}
        style={isWorker ? { backgroundImage: `url('/screen/worker_screen.png')` } : {}}
      >
        {!isWorker && <Sidebar />}

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header />
          
          <PageContainer isWorker={isWorker}>
            <Outlet />
          </PageContainer>
        </div>
      </div>
      <BottomNav />
    </SidebarProvider>
  );
}
