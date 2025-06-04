import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  Shield, 
  Users, 
  Lock, 
  Key, 
  Settings, 
  UserCheck,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  Save,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Globe,
  Smartphone,
  Computer,
  History,
  LogOut,
  Ban,
  UserPlus,
  UserMinus,
  FileText,
  Calendar,
  MapPin,
  Wifi,
  WifiOff,
  Activity,
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Target,
  Database,
  FileCheck,
  UserX,
  AlertCircle,
  Info,
  RefreshCw
} from "lucide-react";

interface UserGroup {
  id: number;
  name: string;
  description: string;
  color: string;
  memberCount: number;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

interface Permission {
  module: string;
  read: boolean;
  write: boolean;
  delete: boolean;
  export: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  group: string;
  isActive: boolean;
  lastLogin: string;
  failedAttempts: number;
  twoFactorEnabled: boolean;
  customPermissions?: Permission[];
  avatar?: string;
}

interface SecuritySettings {
  enforce2FA: boolean;
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireLowercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSymbols: boolean;
  sessionTimeoutMinutes: number;
  maxFailedAttempts: number;
  ipWhitelist: string[];
  enableAuditLog: boolean;
}

interface LoginSession {
  id: number;
  userId: number;
  userName: string;
  ipAddress: string;
  device: string;
  location: string;
  loginTime: string;
  lastActivity: string;
  isActive: boolean;
  userAgent: string;
}

interface AuditLog {
  id: number;
  userId: number;
  userName: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  success: boolean;
  details: string;
}

export default function AccessManagement() {
  const [activeTab, setActiveTab] = useState("groups");
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [showPermissionMatrix, setShowPermissionMatrix] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Sample data
  const sampleGroups: UserGroup[] = [
    {
      id: 1,
      name: "مدیر سیستم",
      description: "دسترسی کامل به تمام بخش‌های سیستم",
      color: "bg-red-100 text-red-800",
      memberCount: 2,
      permissions: ["*"],
      isActive: true,
      createdAt: "1403/05/01",
      createdBy: "مدیر ارشد"
    },
    {
      id: 2,
      name: "کارکنان آزمایشگاه",
      description: "دسترسی به بخش آزمایشگاه و نتایج",
      color: "bg-blue-100 text-blue-800",
      memberCount: 8,
      permissions: ["lab.read", "lab.write", "results.read", "results.write"],
      isActive: true,
      createdAt: "1403/05/01",
      createdBy: "مدیر سیستم"
    },
    {
      id: 3,
      name: "تیم CRM",
      description: "مدیریت ارتباط با مشتریان و فروش",
      color: "bg-green-100 text-green-800",
      memberCount: 5,
      permissions: ["crm.read", "crm.write", "patients.read", "reports.read"],
      isActive: true,
      createdAt: "1403/05/02",
      createdBy: "مدیر سیستم"
    },
    {
      id: 4,
      name: "تیم مالی",
      description: "مدیریت مالی و حسابداری",
      color: "bg-purple-100 text-purple-800",
      memberCount: 3,
      permissions: ["finance.read", "finance.write", "reports.read", "reports.export"],
      isActive: true,
      createdAt: "1403/05/03",
      createdBy: "مدیر سیستم"
    },
    {
      id: 5,
      name: "نمونه‌گیران",
      description: "نمونه‌گیری در محل و ثبت اطلاعات",
      color: "bg-yellow-100 text-yellow-800",
      memberCount: 12,
      permissions: ["collection.read", "collection.write", "patients.read"],
      isActive: true,
      createdAt: "1403/05/05",
      createdBy: "مدیر عملیات"
    }
  ];

  const sampleUsers: User[] = [
    {
      id: 1,
      name: "دکتر حسین هدادی",
      email: "h.hadadi@linktodoctor.ir",
      role: "مدیر سیستم",
      group: "مدیر سیستم",
      isActive: true,
      lastLogin: "1403/06/15 14:30",
      failedAttempts: 0,
      twoFactorEnabled: true
    },
    {
      id: 2,
      name: "سارا احمدی",
      email: "s.ahmadi@linktodoctor.ir",
      role: "متخصص آزمایشگاه",
      group: "کارکنان آزمایشگاه",
      isActive: true,
      lastLogin: "1403/06/15 13:45",
      failedAttempts: 0,
      twoFactorEnabled: true
    },
    {
      id: 3,
      name: "علی محمدی",
      email: "a.mohammadi@linktodoctor.ir",
      role: "کارشناس CRM",
      group: "تیم CRM",
      isActive: true,
      lastLogin: "1403/06/15 12:20",
      failedAttempts: 1,
      twoFactorEnabled: false
    },
    {
      id: 4,
      name: "مریم رضایی",
      email: "m.rezaei@linktodoctor.ir",
      role: "حسابدار",
      group: "تیم مالی",
      isActive: true,
      lastLogin: "1403/06/14 16:10",
      failedAttempts: 0,
      twoFactorEnabled: true
    },
    {
      id: 5,
      name: "محمد تقوی",
      email: "m.taghavi@linktodoctor.ir",
      role: "نمونه‌گیر",
      group: "نمونه‌گیران",
      isActive: false,
      lastLogin: "1403/06/10 09:15",
      failedAttempts: 3,
      twoFactorEnabled: false
    }
  ];

  const modules = [
    { name: "dashboard", label: "داشبورد" },
    { name: "patients", label: "بیماران" },
    { name: "orders", label: "سفارشات" },
    { name: "results", label: "نتایج" },
    { name: "inventory", label: "انبار" },
    { name: "crm", label: "CRM" },
    { name: "finance", label: "مالی" },
    { name: "reports", label: "گزارشات" },
    { name: "settings", label: "تنظیمات" },
    { name: "users", label: "کاربران" }
  ];

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    enforce2FA: true,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: false,
    sessionTimeoutMinutes: 480,
    maxFailedAttempts: 3,
    ipWhitelist: ["192.168.1.0/24", "10.0.0.0/8"],
    enableAuditLog: true
  });

  const sampleSessions: LoginSession[] = [
    {
      id: 1,
      userId: 1,
      userName: "دکتر حسین هدادی",
      ipAddress: "192.168.1.100",
      device: "Desktop",
      location: "تهران، ایران",
      loginTime: "1403/06/15 14:30",
      lastActivity: "1403/06/15 15:45",
      isActive: true,
      userAgent: "Chrome 120.0 Windows"
    },
    {
      id: 2,
      userId: 2,
      userName: "سارا احمدی",
      ipAddress: "192.168.1.105",
      device: "Mobile",
      location: "تهران، ایران",
      loginTime: "1403/06/15 13:45",
      lastActivity: "1403/06/15 15:30",
      isActive: true,
      userAgent: "Safari 17.0 iOS"
    },
    {
      id: 3,
      userId: 3,
      userName: "علی محمدی",
      ipAddress: "85.185.45.12",
      device: "Desktop",
      location: "اصفهان، ایران",
      loginTime: "1403/06/15 12:20",
      lastActivity: "1403/06/15 14:15",
      isActive: false,
      userAgent: "Firefox 121.0 Windows"
    }
  ];

  const sampleAuditLogs: AuditLog[] = [
    {
      id: 1,
      userId: 1,
      userName: "دکتر حسین هدادی",
      action: "ایجاد گروه کاربری",
      resource: "نمونه‌گیران",
      timestamp: "1403/06/15 15:30",
      ipAddress: "192.168.1.100",
      success: true,
      details: "گروه جدید با 5 مجوز ایجاد شد"
    },
    {
      id: 2,
      userId: 2,
      userName: "سارا احمدی",
      action: "تغییر مجوز کاربر",
      resource: "علی محمدی",
      timestamp: "1403/06/15 14:45",
      ipAddress: "192.168.1.105",
      success: true,
      details: "مجوز صدور گزارش افزوده شد"
    },
    {
      id: 3,
      userId: 5,
      userName: "محمد تقوی",
      action: "تلاش ورود ناموفق",
      resource: "سیستم",
      timestamp: "1403/06/15 09:15",
      ipAddress: "178.22.45.67",
      success: false,
      details: "رمز عبور نادرست - تلاش سوم"
    }
  ];

  const getGroupColor = (groupName: string) => {
    const group = sampleGroups.find(g => g.name === groupName);
    return group?.color || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">فعال</Badge> :
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">غیرفعال</Badge>;
  };

  const getDeviceIcon = (device: string) => {
    return device === "Mobile" ? <Smartphone className="w-4 h-4" /> : <Computer className="w-4 h-4" />;
  };

  const filteredUsers = sampleUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.group === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <TooltipProvider>
      <div className="space-y-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">مدیریت دسترسی کاربران</h1>
            <p className="text-gray-600 mt-1">کنترل دسترسی، امنیت و مجوزهای کاربران سیستم</p>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            <Button variant="outline">
              <Download className="w-4 h-4 ml-2" />
              صدور گزارش
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowGroupForm(true)}
            >
              <Plus className="w-4 h-4 ml-2" />
              گروه جدید
            </Button>
          </div>
        </div>

        {/* Security Alert */}
        <Card className="card-professional border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
              <div>
                <h3 className="font-medium text-amber-800">هشدار امنیتی</h3>
                <p className="text-sm text-amber-600">
                  3 تلاش ورود ناموفق در 24 ساعت گذشته شناسایی شده است
                </p>
              </div>
              <Button size="sm" variant="outline" className="border-amber-600 text-amber-700 mr-auto">
                بررسی جزئیات
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="groups" className="flex items-center space-x-2 space-x-reverse">
              <Users className="w-4 h-4" />
              <span>گروه‌های کاربری</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center space-x-2 space-x-reverse">
              <Lock className="w-4 h-4" />
              <span>سطوح دسترسی</span>
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center space-x-2 space-x-reverse">
              <Key className="w-4 h-4" />
              <span>مجوزهای خاص</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center space-x-2 space-x-reverse">
              <UserCheck className="w-4 h-4" />
              <span>نقش‌بندی</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2 space-x-reverse">
              <Settings className="w-4 h-4" />
              <span>تنظیمات امنیتی</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center space-x-2 space-x-reverse">
              <Shield className="w-4 h-4" />
              <span>کنترل دسترسی</span>
            </TabsTrigger>
          </TabsList>

          {/* User Groups Tab */}
          <TabsContent value="groups" className="mt-6">
            <div className="space-y-6">
              {/* Groups Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="card-professional">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">کل گروه‌ها</p>
                        <p className="text-2xl font-bold text-gray-900">{sampleGroups.length}</p>
                      </div>
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-professional">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">کل کاربران</p>
                        <p className="text-2xl font-bold text-gray-900">{sampleUsers.length}</p>
                      </div>
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <UserCheck className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-professional">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">احراز هویت دوگانه</p>
                        <p className="text-2xl font-bold text-green-600">
                          {sampleUsers.filter(u => u.twoFactorEnabled).length}
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <ShieldCheck className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-professional">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">نشست‌های فعال</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {sampleSessions.filter(s => s.isActive).length}
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Groups List */}
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle>گروه‌های کاربری</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sampleGroups.map((group) => (
                      <div key={group.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 space-x-reverse">
                            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Users className="h-6 w-6 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 space-x-reverse mb-2">
                                <h3 className="font-semibold text-gray-900">{group.name}</h3>
                                <Badge className={group.color}>{group.name}</Badge>
                                {getStatusBadge(group.isActive)}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{group.description}</p>
                              <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                                <span>{group.memberCount} کاربر</span>
                                <span>•</span>
                                <span>{group.permissions.length} مجوز</span>
                                <span>•</span>
                                <span>ایجاد شده در {group.createdAt}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setShowPermissionMatrix(true)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>مشاهده مجوزها</p>
                              </TooltipContent>
                            </Tooltip>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => setShowDeleteConfirm(group.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Access Levels Tab */}
          <TabsContent value="permissions" className="mt-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>ماتریس مجوزهای دسترسی</span>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 ml-1" />
                      پیش‌نمایش
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">
                      <Save className="w-4 h-4 ml-1" />
                      ذخیره تغییرات
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-right p-4 font-medium text-gray-700">ماژول</th>
                        <th className="text-center p-4 font-medium text-gray-700">
                          <Tooltip>
                            <TooltipTrigger>خواندن</TooltipTrigger>
                            <TooltipContent>
                              <p>مشاهده اطلاعات و داده‌ها</p>
                            </TooltipContent>
                          </Tooltip>
                        </th>
                        <th className="text-center p-4 font-medium text-gray-700">
                          <Tooltip>
                            <TooltipTrigger>نوشتن</TooltipTrigger>
                            <TooltipContent>
                              <p>ایجاد و ویرایش اطلاعات</p>
                            </TooltipContent>
                          </Tooltip>
                        </th>
                        <th className="text-center p-4 font-medium text-gray-700">
                          <Tooltip>
                            <TooltipTrigger>حذف</TooltipTrigger>
                            <TooltipContent>
                              <p>حذف اطلاعات و رکوردها</p>
                            </TooltipContent>
                          </Tooltip>
                        </th>
                        <th className="text-center p-4 font-medium text-gray-700">
                          <Tooltip>
                            <TooltipTrigger>صدور</TooltipTrigger>
                            <TooltipContent>
                              <p>صدور گزارش و فایل</p>
                            </TooltipContent>
                          </Tooltip>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {modules.map((module) => (
                        <tr key={module.name} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4 font-medium">{module.label}</td>
                          <td className="p-4 text-center">
                            <Switch defaultChecked />
                          </td>
                          <td className="p-4 text-center">
                            <Switch defaultChecked={module.name !== "reports"} />
                          </td>
                          <td className="p-4 text-center">
                            <Switch defaultChecked={module.name === "dashboard" || module.name === "patients"} />
                          </td>
                          <td className="p-4 text-center">
                            <Switch defaultChecked={module.name === "reports" || module.name === "finance"} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Custom Permissions Tab */}
          <TabsContent value="custom" className="mt-6">
            <div className="space-y-6">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle>مجوزهای اختصاصی کاربران</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sampleUsers.slice(0, 3).map((user) => (
                      <div key={user.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">{user.name}</h3>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Badge className={getGroupColor(user.group)}>{user.group}</Badge>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 ml-1" />
                              ویرایش مجوزها
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-gray-700">مجوزهای پایه (از گروه)</h4>
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="outline">dashboard.read</Badge>
                              <Badge variant="outline">patients.read</Badge>
                              <Badge variant="outline">orders.write</Badge>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-gray-700">مجوزهای اضافی</h4>
                            <div className="flex flex-wrap gap-1">
                              <Badge className="bg-green-100 text-green-800">reports.export</Badge>
                              <Badge className="bg-green-100 text-green-800">finance.read</Badge>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-gray-700">محدودیت‌ها</h4>
                            <div className="flex flex-wrap gap-1">
                              <Badge className="bg-red-100 text-red-800">users.delete</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Audit Trail */}
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle>سابقه تغییرات مجوزها</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sampleAuditLogs.filter(log => log.action.includes("مجوز")).map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            log.success ? "bg-green-100" : "bg-red-100"
                          }`}>
                            {log.success ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{log.action}</p>
                            <p className="text-xs text-gray-600">{log.userName} - {log.resource}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600">{log.timestamp}</p>
                          <p className="text-xs text-gray-500">{log.ipAddress}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Role Mapping Tab */}
          <TabsContent value="roles" className="mt-6">
            <div className="space-y-6">
              {/* Bulk Actions */}
              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">تخصیص گروهی نقش‌ها</h3>
                      <p className="text-gray-600">انتخاب چندین کاربر و تخصیص نقش یکسان</p>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Select>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="انتخاب نقش" />
                        </SelectTrigger>
                        <SelectContent>
                          {sampleGroups.map(group => (
                            <SelectItem key={group.id} value={group.name}>{group.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <UserPlus className="w-4 h-4 ml-2" />
                        اعمال تغییرات
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Users List with Role Assignment */}
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>نقش‌بندی کاربران</span>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div>
                        <Input
                          placeholder="جستجو کاربر..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-64 search-input"
                        />
                      </div>
                      <Select value={filterRole} onValueChange={setFilterRole}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="فیلتر نقش" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">همه نقش‌ها</SelectItem>
                          {sampleGroups.map(group => (
                            <SelectItem key={group.id} value={group.name}>{group.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 space-x-reverse">
                            <input type="checkbox" className="rounded" />
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 space-x-reverse mb-1">
                                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                {getStatusBadge(user.isActive)}
                                {user.twoFactorEnabled && (
                                  <Badge className="bg-blue-100 text-blue-800">
                                    <ShieldCheck className="w-3 h-3 ml-1" />
                                    2FA
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                              <div className="flex items-center space-x-3 space-x-reverse text-sm text-gray-500">
                                <span>آخرین ورود: {user.lastLogin}</span>
                                {user.failedAttempts > 0 && (
                                  <span className="text-red-600">
                                    • {user.failedAttempts} تلاش ناموفق
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <Badge className={getGroupColor(user.group)}>{user.group}</Badge>
                            <Select defaultValue={user.group}>
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {sampleGroups.map(group => (
                                  <SelectItem key={group.id} value={group.name}>{group.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 ml-2" />
                                  ویرایش کاربر
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Key className="w-4 h-4 ml-2" />
                                  مجوزهای خاص
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <LogOut className="w-4 h-4 ml-2" />
                                  خروج از همه نشست‌ها
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Ban className="w-4 h-4 ml-2" />
                                  مسدود کردن
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Settings Tab */}
          <TabsContent value="security" className="mt-6">
            <div className="space-y-6">
              {/* Authentication Settings */}
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle>تنظیمات احراز هویت</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">اجباری بودن احراز هویت دوگانه</h3>
                      <p className="text-sm text-gray-600">الزام همه کاربران به فعال‌سازی 2FA</p>
                    </div>
                    <Switch 
                      checked={securitySettings.enforce2FA}
                      onCheckedChange={(checked) => 
                        setSecuritySettings(prev => ({ ...prev, enforce2FA: checked }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        حداقل طول رمز عبور
                      </label>
                      <Input 
                        type="number" 
                        value={securitySettings.passwordMinLength}
                        onChange={(e) => 
                          setSecuritySettings(prev => ({ 
                            ...prev, 
                            passwordMinLength: parseInt(e.target.value) 
                          }))
                        }
                        className="border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        مدت زمان نشست (دقیقه)
                      </label>
                      <Input 
                        type="number" 
                        value={securitySettings.sessionTimeoutMinutes}
                        onChange={(e) => 
                          setSecuritySettings(prev => ({ 
                            ...prev, 
                            sessionTimeoutMinutes: parseInt(e.target.value) 
                          }))
                        }
                        className="border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">الزامات رمز عبور</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">حروف بزرگ انگلیسی</span>
                        <Switch 
                          checked={securitySettings.passwordRequireUppercase}
                          onCheckedChange={(checked) => 
                            setSecuritySettings(prev => ({ ...prev, passwordRequireUppercase: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">حروف کوچک انگلیسی</span>
                        <Switch 
                          checked={securitySettings.passwordRequireLowercase}
                          onCheckedChange={(checked) => 
                            setSecuritySettings(prev => ({ ...prev, passwordRequireLowercase: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">اعداد</span>
                        <Switch 
                          checked={securitySettings.passwordRequireNumbers}
                          onCheckedChange={(checked) => 
                            setSecuritySettings(prev => ({ ...prev, passwordRequireNumbers: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">نمادهای خاص</span>
                        <Switch 
                          checked={securitySettings.passwordRequireSymbols}
                          onCheckedChange={(checked) => 
                            setSecuritySettings(prev => ({ ...prev, passwordRequireSymbols: checked }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* IP Whitelisting */}
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle>کنترل دسترسی IP</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        لیست سفید IP (هر کدام در خط جداگانه)
                      </label>
                      <Textarea 
                        value={securitySettings.ipWhitelist.join('\n')}
                        onChange={(e) => 
                          setSecuritySettings(prev => ({ 
                            ...prev, 
                            ipWhitelist: e.target.value.split('\n').filter(ip => ip.trim()) 
                          }))
                        }
                        placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                        className="border-gray-300 min-h-[100px]"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>آدرس‌های IP مجاز: {securitySettings.ipWhitelist.length}</span>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 ml-1" />
                        افزودن IP فعلی
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Actions */}
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle>اعمال امنیتی</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      <LogOut className="w-4 h-4 ml-2" />
                      خروج همه کاربران
                    </Button>
                    <Button variant="outline" className="border-yellow-600 text-yellow-700">
                      <Fingerprint className="w-4 h-4 ml-2" />
                      اجبار تغییر رمز
                    </Button>
                    <Button variant="outline" className="border-blue-600 text-blue-700">
                      <Download className="w-4 h-4 ml-2" />
                      گزارش امنیتی
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Access Control Tab */}
          <TabsContent value="audit" className="mt-6">
            <div className="space-y-6">
              {/* Active Sessions */}
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>نشست‌های فعال</span>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 ml-1" />
                      بروزرسانی
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sampleSessions.filter(s => s.isActive).map((session) => (
                      <div key={session.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 space-x-reverse">
                            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                              {getDeviceIcon(session.device)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 space-x-reverse mb-1">
                                <h3 className="font-semibold text-gray-900">{session.userName}</h3>
                                <Badge className="bg-green-100 text-green-800">فعال</Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                                <div className="flex items-center space-x-2 space-x-reverse">
                                  <Globe className="w-4 h-4" />
                                  <span>{session.ipAddress}</span>
                                </div>
                                <div className="flex items-center space-x-2 space-x-reverse">
                                  <MapPin className="w-4 h-4" />
                                  <span>{session.location}</span>
                                </div>
                                <div className="flex items-center space-x-2 space-x-reverse">
                                  <Clock className="w-4 h-4" />
                                  <span>ورود: {session.loginTime}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Button variant="outline" size="sm" className="text-red-600">
                              <LogOut className="w-4 h-4 ml-1" />
                              خروج اجباری
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Login History */}
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>سابقه ورود به سیستم</span>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">همه</SelectItem>
                          <SelectItem value="success">موفق</SelectItem>
                          <SelectItem value="failed">ناموفق</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 ml-1" />
                        فیلتر
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sampleAuditLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            log.success ? "bg-green-100" : "bg-red-100"
                          }`}>
                            {log.success ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{log.action}</p>
                            <p className="text-xs text-gray-600">{log.userName} - {log.details}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600">{log.timestamp}</p>
                          <p className="text-xs text-gray-500">{log.ipAddress}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-right">تأیید حذف گروه</AlertDialogTitle>
              <AlertDialogDescription className="text-right">
                آیا از حذف این گروه کاربری اطمینان دارید؟ این عمل قابل بازگشت نیست و تمام کاربران این گروه به گروه پیش‌فرض منتقل خواهند شد.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex justify-start space-x-2 space-x-reverse">
              <AlertDialogCancel>انصراف</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                حذف کردن
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Group Form Dialog */}
        <Dialog open={showGroupForm} onOpenChange={setShowGroupForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-right text-xl font-bold">
                ایجاد گروه کاربری جدید
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نام گروه *</label>
                <Input placeholder="نام گروه کاربری" className="border-gray-300" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
                <Textarea 
                  placeholder="توضیحات مختصر درباره این گروه..."
                  className="border-gray-300 min-h-[80px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رنگ نمایش</label>
                <div className="flex space-x-2 space-x-reverse">
                  {["bg-red-100 text-red-800", "bg-blue-100 text-blue-800", "bg-green-100 text-green-800", "bg-purple-100 text-purple-800", "bg-yellow-100 text-yellow-800"].map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 border-gray-300 ${color}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">مجوزهای پایه</label>
                <div className="grid grid-cols-2 gap-3">
                  {modules.slice(0, 6).map((module) => (
                    <div key={module.name} className="flex items-center space-x-2 space-x-reverse">
                      <input type="checkbox" id={module.name} className="rounded" />
                      <label htmlFor={module.name} className="text-sm text-gray-700">
                        {module.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 space-x-reverse mt-6">
              <Button variant="outline" onClick={() => setShowGroupForm(false)}>
                انصراف
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                ایجاد گروه
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}