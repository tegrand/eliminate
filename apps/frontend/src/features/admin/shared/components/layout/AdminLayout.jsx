import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminBreadcrumb from './AdminBreadcrumb';
import AdminDrawer from './AdminDrawer';
import AdminModal from './AdminModal';
import { AdminUIProvider } from '../../contexts/AdminUIContext';

function AdminLayoutContent() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-gray-900">
      <AdminSidebar />
      
      <div className="flex flex-col flex-1 w-full min-w-0 overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <AdminBreadcrumb />
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      <AdminDrawer />
      <AdminModal />
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AdminUIProvider>
      <AdminLayoutContent />
    </AdminUIProvider>
  );
}
