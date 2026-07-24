import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 font-bold text-xl border-b text-blue-600">ELIMINATE</div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li><a href="/dashboard" className="block p-2 hover:bg-slate-50 rounded">Dashboard</a></li>
            <li><a href="/workers" className="block p-2 hover:bg-slate-50 rounded">Workers</a></li>
            <li><a href="/clients" className="block p-2 hover:bg-slate-50 rounded">Clients</a></li>
            <li><a href="/agencies" className="block p-2 hover:bg-slate-50 rounded">Agencies</a></li>
            <li><a href="/job-requirements" className="block p-2 hover:bg-slate-50 rounded">Job Requirements</a></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <div className="text-sm text-gray-500">
            {/* Breadcrumb Placeholder */}
            Dashboard / Overview
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
              U
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
