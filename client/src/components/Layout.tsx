import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

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
        isMobile ? 'w-full' : sidebarCollapsed ? 'ml-16' : 'ml-80'
      }`}>
        <TopBar onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="min-h-full p-6 pb-20">
            {children}
          </div>
          {/* Footer */}
          <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 mt-auto">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4 space-x-reverse">
                <span>سامانه LinkToDoctor</span>
                <span>نسخه 1.0.0</span>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse">
                <span>© ۱۴۰۳ تمام حقوق محفوظ است</span>
                <span>•</span>
                <span>پشتیبانی: ۰۲۱-۱۲۳۴۵۶۷۸</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
