import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminUIContext = createContext();

export function AdminUIProvider({ children }) {
  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('adminSidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  // Theme placeholder
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    localStorage.setItem('adminSidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  
  const openDrawer = (content) => {
    setDrawerContent(content);
    setIsDrawerOpen(true);
  };
  
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setDrawerContent(null), 300); // Wait for animation
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setModalContent(null), 300);
  };

  const value = {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    toggleSidebar,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    drawerContent,
    isModalOpen,
    openModal,
    closeModal,
    modalContent,
    theme,
    setTheme
  };

  return (
    <AdminUIContext.Provider value={value}>
      {children}
    </AdminUIContext.Provider>
  );
}

export const useAdminUI = () => {
  const context = useContext(AdminUIContext);
  if (context === undefined) {
    throw new Error('useAdminUI must be used within an AdminUIProvider');
  }
  return context;
};
