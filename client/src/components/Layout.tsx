import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-medical-bg">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex-1 overflow-hidden">
        <TopBar 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <main className="p-6 overflow-y-auto h-[calc(100vh-80px)] scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  );
}
