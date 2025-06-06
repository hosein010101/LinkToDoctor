import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  Search, 
  Filter, 
  Download,
  Settings,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Clock,
  User,
  Activity,
  Database,
  Shield,
  Wifi,
  Server,
  Archive,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  FileText
} from "lucide-react";

interface NotificationItem {
  id: number;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  timestamp: Date;
  category: string;
  isRead: boolean;
  priority: "low" | "medium" | "high" | "critical";
  source: string;
  userId?: string;
}

interface SystemLog {
  id: number;
  level: "debug" | "info" | "warn" | "error" | "fatal";
  message: string;
  timestamp: Date;
  module: string;
  userId?: string;
  ip?: string;
  action: string;
  details?: any;
}

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("24h");
  const [showSettings, setShowSettings] = useState(false);

  // Mock data - في التطبيق الحقيقي، هذه البيانات ستأتي من API
  const notifications: NotificationItem[] = [
    {
      id: 1,
      type: "success",
      title: "تکمیل نمونه‌گیری",
      message: "نمونه‌گیری برای بیمار احمد رضایی با موفقیت تکمیل شد",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      category: "collection",
      isRead: false,
      priority: "medium",
      source: "نمونه‌گیری",
      userId: "collector_001"
    },
    {
      id: 2,
      type: "warning",
      title: "کمبود موجودی",
      message: "موجودی تیوب آزمایش در حال اتمام است (۵ عدد باقی‌مانده)",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      category: "inventory",
      isRead: false,
      priority: "high",
      source: "سیستم موجودی"
    },
    {
      id: 3,
      type: "error",
      title: "خطا در پردازش نتیجه",
      message: "خطا در پردازش نتیجه آزمایش برای سفارش LAB-2025-0123",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      category: "results",
      isRead: true,
      priority: "critical",
      source: "پردازش نتایج"
    },
    {
      id: 4,
      type: "info",
      title: "سفارش جدید",
      message: "سفارش جدید LAB-2025-0198 ثبت شد",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      category: "orders",
      isRead: true,
      priority: "low",
      source: "مدیریت سفارشات"
    },
    {
      id: 5,
      type: "success",
      title: "تحویل نتیجه",
      message: "نتیجه آزمایش برای فاطمه محمدی تحویل داده شد",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      category: "delivery",
      isRead: true,
      priority: "medium",
      source: "تحویل نتایج"
    }
  ];

  const systemLogs: SystemLog[] = [
    {
      id: 1,
      level: "info",
      message: "User login successful",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      module: "authentication",
      userId: "haddadi",
      ip: "192.168.1.100",
      action: "login"
    },
    {
      id: 2,
      level: "warn",
      message: "Database connection timeout",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      module: "database",
      action: "connection_timeout",
      details: { timeout: "30s", retries: 3 }
    },
    {
      id: 3,
      level: "error",
      message: "Failed to process test result",
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      module: "result_processor",
      action: "process_result",
      details: { orderId: "LAB-2025-0123", error: "validation_failed" }
    },
    {
      id: 4,
      level: "info",
      message: "New order created",
      timestamp: new Date(Date.now() - 40 * 60 * 1000),
      module: "order_management",
      userId: "haddadi",
      action: "create_order",
      details: { orderId: "LAB-2025-0198" }
    },
    {
      id: 5,
      level: "debug",
      message: "Inventory check completed",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      module: "inventory",
      action: "inventory_check"
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "error": return <XCircle className="w-5 h-5 text-red-500" />;
      case "info": return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case "error": return <XCircle className="w-4 h-4 text-red-500" />;
      case "warn": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "info": return <Info className="w-4 h-4 text-blue-500" />;
      case "debug": return <Settings className="w-4 h-4 text-gray-500" />;
      case "fatal": return <XCircle className="w-4 h-4 text-red-700" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "bg-gray-100 text-gray-700",
      medium: "bg-blue-100 text-blue-700",
      high: "bg-orange-100 text-orange-700",
      critical: "bg-red-100 text-red-700"
    };
    
    const labels = {
      low: "کم",
      medium: "متوسط",
      high: "بالا",
      critical: "بحرانی"
    };

    return (
      <Badge className={variants[priority as keyof typeof variants] || variants.low}>
        {labels[priority as keyof typeof labels] || "نامشخص"}
      </Badge>
    );
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return "الان";
    if (minutes < 60) return `${minutes} دقیقه پیش`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ساعت پیش`;
    
    const days = Math.floor(hours / 24);
    return `${days} روز پیش`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">اعلان‌ها و لاگ سیستم</h1>
          <p className="text-gray-600 mt-2">مدیریت اعلان‌ها و نظارت بر عملکرد سیستم</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 ml-2" />
            خروجی گزارش
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 ml-2" />
            بروزرسانی
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4 ml-2" />
            تنظیمات
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">اعلان‌های جدید</p>
                <p className="text-2xl font-bold text-blue-900">{unreadCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">سیستم فعال</p>
                <p className="text-2xl font-bold text-green-900">۹۹.۸%</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">هشدارهای امروز</p>
                <p className="text-2xl font-bold text-orange-900">۳</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">رویدادهای ثبت شده</p>
                <p className="text-2xl font-bold text-purple-900">۱۲۴</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 ml-2" />
              تنظیمات اعلان‌ها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">اعلان‌های ایمیل</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">سفارشات جدید</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">تکمیل نمونه‌گیری</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">کمبود موجودی</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">اعلان‌های SMS</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">نتایج آماده</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">خطاهای بحرانی</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">یادآوری قرارملاقات</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">تنظیمات عمومی</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">صداهای اعلان</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">اعلان‌های دسکتاپ</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">حذف خودکار قدیمی‌ها</span>
                    <Switch />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            اعلان‌ها
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs px-1 py-0 min-w-[1.25rem] h-5">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            لاگ سیستم
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[250px]">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="جستجو در اعلان‌ها..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="نوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه انواع</SelectItem>
                    <SelectItem value="success">موفقیت</SelectItem>
                    <SelectItem value="warning">هشدار</SelectItem>
                    <SelectItem value="error">خطا</SelectItem>
                    <SelectItem value="info">اطلاعات</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="دسته‌بندی" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه دسته‌ها</SelectItem>
                    <SelectItem value="orders">سفارشات</SelectItem>
                    <SelectItem value="collection">نمونه‌گیری</SelectItem>
                    <SelectItem value="results">نتایج</SelectItem>
                    <SelectItem value="inventory">موجودی</SelectItem>
                    <SelectItem value="delivery">تحویل</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="زمان" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">۱ ساعت گذشته</SelectItem>
                    <SelectItem value="24h">۲۴ ساعت گذشته</SelectItem>
                    <SelectItem value="7d">۷ روز گذشته</SelectItem>
                    <SelectItem value="30d">۳۰ روز گذشته</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>اعلان‌های اخیر</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Archive className="w-4 h-4 ml-2" />
                    بایگانی همه
                  </Button>
                  <Button variant="outline" size="sm">
                    <CheckCircle className="w-4 h-4 ml-2" />
                    علامت‌گذاری به عنوان خوانده شده
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {notifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div className={`p-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50 border-r-4 border-blue-500' : ''}`}>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              {getPriorityBadge(notification.priority)}
                              <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {notification.source}
                              </span>
                              {notification.userId && (
                                <span>کاربر: {notification.userId}</span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm">
                                {notification.isRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Archive className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < notifications.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          {/* Log Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[250px]">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="جستجو در لاگ‌ها..."
                    className="pr-10"
                  />
                </div>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="سطح لاگ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه سطوح</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="fatal">Fatal</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="ماژول" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه ماژول‌ها</SelectItem>
                    <SelectItem value="authentication">احراز هویت</SelectItem>
                    <SelectItem value="database">پایگاه داده</SelectItem>
                    <SelectItem value="order_management">مدیریت سفارش</SelectItem>
                    <SelectItem value="result_processor">پردازش نتایج</SelectItem>
                    <SelectItem value="inventory">موجودی</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* System Logs */}
          <Card>
            <CardHeader>
              <CardTitle>لاگ سیستم</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {systemLogs.map((log, index) => (
                  <div key={log.id}>
                    <div className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getLogIcon(log.level)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {log.level.toUpperCase()}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {log.module}
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-500">{formatTime(log.timestamp)}</span>
                          </div>
                          
                          <p className="text-sm text-gray-900 mb-2 font-mono">{log.message}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>عملیات: {log.action}</span>
                              {log.userId && (
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {log.userId}
                                </span>
                              )}
                              {log.ip && (
                                <span className="flex items-center gap-1">
                                  <Wifi className="w-3 h-3" />
                                  {log.ip}
                                </span>
                              )}
                            </div>
                            
                            {log.details && (
                              <Button variant="ghost" size="sm">
                                <Info className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < systemLogs.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}