import React from 'react';
import { useAdminUI } from '../contexts/AdminUIContext';
import { X } from 'lucide-react';

export default function AdminDrawer() {
  const { isDrawerOpen, closeDrawer, drawerContent } = useAdminUI();

  if (!isDrawerOpen && !drawerContent) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`
          fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300
          ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div 
        className={`
          fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out
          ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Drawer Menu</h2>
          <button
            onClick={closeDrawer}
            className="p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="sr-only">Close panel</span>
            <X size={20} />
          </button>
        </div>
        <div className="relative flex-1 px-4 py-6 sm:px-6 overflow-y-auto">
          {drawerContent}
        </div>
      </div>
    </>
  );
}
