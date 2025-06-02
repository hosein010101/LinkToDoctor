import { Menu, Bell, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  onToggleSidebar: () => void;
}

export default function TopBar({ onToggleSidebar }: TopBarProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="text-gray-600" size={20} />
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-medical-text">داشبورد مدیریت آزمایشگاه</h2>
            <p className="text-sm text-gray-500">مدیریت جامع خدمات آزمایشگاهی</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="relative">
            <Button variant="ghost" size="sm" className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell className="text-gray-600" size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-medical-orange text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="text-right">
              <p className="text-sm font-semibold text-medical-text">دکتر احمد محمدی</p>
              <p className="text-xs text-gray-500">مدیر آزمایشگاه</p>
            </div>
            <div className="w-10 h-10 bg-medical-teal rounded-full flex items-center justify-center">
              <UserRound className="text-white" size={20} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
