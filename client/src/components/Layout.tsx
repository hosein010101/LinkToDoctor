import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <Sidebar collapsed={sidebarCollapsed} isMobile={isMobile} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isMobile ? 'w-full' : sidebarCollapsed ? 'mr-16' : 'mr-80'
      }`}>
        <TopBar onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 dashboard-content">
          <div className="min-h-full p-6">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
