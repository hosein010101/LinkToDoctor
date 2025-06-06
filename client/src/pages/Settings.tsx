import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IOSSwitch } from "@/components/ui/ios-switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  Building, 
  Users, 
  Bell, 
  Shield, 
  Database, 
  Palette, 
  Globe,
  Save,
  RotateCcw,
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  Printer,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  
  // Lab Information State
  const [labInfo, setLabInfo] = useState({
    name: "آزمایشگاه لینک تو دکتر",
    license: "LAB-2024-001",
    phone: "021-12345678",
    email: "info@linkto.doctor",
    address: "تهران، خیابان ولیعصر، پلاک 123",
    website: "www.linkto.doctor",
    manager: "دکتر حسین هددی",
    establishedYear: "1401",
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    dailyReports: true,
    weeklyReports: false,
    orderUpdates: true,
    systemAlerts: true,
    reminderTime: "08:00",
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    language: "fa",
    timezone: "Asia/Tehran",
    dateFormat: "persian",
    currency: "IRR",
    autoBackup: true,
    maintenanceMode: false,
    debugMode: false,
    sessionTimeout: "30",
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: "90",
    loginAttempts: "5",
    sessionLock: true,
    ipWhitelist: false,
    auditLog: true,
    encryptData: true,
  });

  const handleSaveLabInfo = () => {
    toast({
      title: "موفقیت",
      description: "اطلاعات آزمایشگاه به‌روزرسانی شد",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "موفقیت", 
      description: "تنظیمات اعلان‌ها به‌روزرسانی شد",
    });
  };

  const handleSaveSystem = () => {
    toast({
      title: "موفقیت",
      description: "تنظیمات سیستم به‌روزرسانی شد",
    });
  };

  const handleSaveSecurity = () => {
    toast({
      title: "موفقیت",
      description: "تنظیمات امنیتی به‌روزرسانی شد",
    });
  };

  const handleExportData = () => {
    toast({
      title: "در حال پردازش",
      description: "خروجی داده‌ها آماده می‌شود...",
    });
  };

  const handleImportData = () => {
    toast({
      title: "توجه",
      description: "لطفاً فایل مورد نظر را انتخاب کنید",
    });
  };

  const handleResetSystem = () => {
    toast({
      title: "هشدار",
      description: "این عمل غیرقابل بازگشت است. آیا مطمئن هستید؟",
      variant: "destructive",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تنظیمات آزمایشگاه</h1>
          <p className="text-gray-600 mt-1">مدیریت تنظیمات و پیکربندی سیستم</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="w-4 h-4 ml-2" />
            خروجی تنظیمات
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSaveSystem}>
            <Save className="w-4 h-4 ml-2" />
            ذخیره تغییرات
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="lab-info" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="lab-info">اطلاعات آزمایشگاه</TabsTrigger>
          <TabsTrigger value="notifications">اعلان‌ها</TabsTrigger>
          <TabsTrigger value="system">سیستم</TabsTrigger>
          <TabsTrigger value="security">امنیت</TabsTrigger>
          <TabsTrigger value="data">داده‌ها</TabsTrigger>
        </TabsList>

        {/* Lab Information Tab */}
        <TabsContent value="lab-info" className="mt-6">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <Building className="w-5 h-5 text-blue-600" />
                <span>اطلاعات آزمایشگاه</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="lab-name">نام آزمایشگاه</Label>
                    <Input
                      id="lab-name"
                      value={labInfo.name}
                      onChange={(e) => setLabInfo({...labInfo, name: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="license">شماره مجوز</Label>
                    <Input
                      id="license"
                      value={labInfo.license}
                      onChange={(e) => setLabInfo({...labInfo, license: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">تلفن</Label>
                    <Input
                      id="phone"
                      value={labInfo.phone}
                      onChange={(e) => setLabInfo({...labInfo, phone: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">ایمیل</Label>
                    <Input
                      id="email"
                      type="email"
                      value={labInfo.email}
                      onChange={(e) => setLabInfo({...labInfo, email: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="manager">مدیر آزمایشگاه</Label>
                    <Input
                      id="manager"
                      value={labInfo.manager}
                      onChange={(e) => setLabInfo({...labInfo, manager: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">وب‌سایت</Label>
                    <Input
                      id="website"
                      value={labInfo.website}
                      onChange={(e) => setLabInfo({...labInfo, website: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="established">سال تأسیس</Label>
                    <Input
                      id="established"
                      value={labInfo.establishedYear}
                      onChange={(e) => setLabInfo({...labInfo, establishedYear: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">آدرس</Label>
                    <Textarea
                      id="address"
                      value={labInfo.address}
                      onChange={(e) => setLabInfo({...labInfo, address: e.target.value})}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSaveLabInfo} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Save className="w-4 h-4 ml-2" />
                  ذخیره اطلاعات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <Bell className="w-5 h-5 text-orange-600" />
                <span>تنظیمات اعلان‌ها</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>اعلان‌های ایمیل</Label>
                      <p className="text-sm text-gray-600">دریافت اعلان‌ها از طریق ایمیل</p>
                    </div>
                    <IOSSwitch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailNotifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>اعلان‌های پیامکی</Label>
                      <p className="text-sm text-gray-600">دریافت اعلان‌ها از طریق پیامک</p>
                    </div>
                    <IOSSwitch
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) => setNotifications({...notifications, smsNotifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>اعلان‌های فوری</Label>
                      <p className="text-sm text-gray-600">اعلان‌های فوری در مرورگر</p>
                    </div>
                    <IOSSwitch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => setNotifications({...notifications, pushNotifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>گزارش‌های روزانه</Label>
                      <p className="text-sm text-gray-600">ارسال گزارش عملکرد روزانه</p>
                    </div>
                    <IOSSwitch
                      checked={notifications.dailyReports}
                      onCheckedChange={(checked) => setNotifications({...notifications, dailyReports: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>گزارش‌های هفتگی</Label>
                      <p className="text-sm text-gray-600">ارسال گزارش عملکرد هفتگی</p>
                    </div>
                    <IOSSwitch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) => setNotifications({...notifications, weeklyReports: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>به‌روزرسانی سفارشات</Label>
                      <p className="text-sm text-gray-600">اطلاع از تغییرات وضعیت سفارشات</p>
                    </div>
                    <IOSSwitch
                      checked={notifications.orderUpdates}
                      onCheckedChange={(checked) => setNotifications({...notifications, orderUpdates: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>هشدارهای سیستم</Label>
                      <p className="text-sm text-gray-600">اطلاع از مشکلات سیستم</p>
                    </div>
                    <IOSSwitch
                      checked={notifications.systemAlerts}
                      onCheckedChange={(checked) => setNotifications({...notifications, systemAlerts: checked})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="reminder-time">زمان یادآوری روزانه</Label>
                    <Input
                      id="reminder-time"
                      type="time"
                      value={notifications.reminderTime}
                      onChange={(e) => setNotifications({...notifications, reminderTime: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Save className="w-4 h-4 ml-2" />
                  ذخیره تنظیمات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="mt-6">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <SettingsIcon className="w-5 h-5 text-purple-600" />
                <span>تنظیمات سیستم</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="language">زبان سیستم</Label>
                    <Select value={systemSettings.language} onValueChange={(value) => setSystemSettings({...systemSettings, language: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fa">فارسی</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timezone">منطقه زمانی</Label>
                    <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings({...systemSettings, timezone: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Tehran">تهران</SelectItem>
                        <SelectItem value="Asia/Dubai">دبی</SelectItem>
                        <SelectItem value="Europe/London">لندن</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date-format">فرمت تاریخ</Label>
                    <Select value={systemSettings.dateFormat} onValueChange={(value) => setSystemSettings({...systemSettings, dateFormat: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="persian">شمسی</SelectItem>
                        <SelectItem value="gregorian">میلادی</SelectItem>
                        <SelectItem value="hijri">قمری</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="session-timeout">مدت زمان نشست (دقیقه)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={systemSettings.sessionTimeout}
                      onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>پشتیبان‌گیری خودکار</Label>
                      <p className="text-sm text-gray-600">پشتیبان‌گیری روزانه از داده‌ها</p>
                    </div>
                    <Switch
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoBackup: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>حالت تعمیر و نگهداری</Label>
                      <p className="text-sm text-gray-600">غیرفعال کردن موقت سیستم</p>
                    </div>
                    <Switch
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>حالت اشکال‌زدایی</Label>
                      <p className="text-sm text-gray-600">فعال‌سازی لاگ‌های تفصیلی</p>
                    </div>
                    <Switch
                      checked={systemSettings.debugMode}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, debugMode: checked})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="currency">واحد پول</Label>
                    <Select value={systemSettings.currency} onValueChange={(value) => setSystemSettings({...systemSettings, currency: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IRR">ریال ایران</SelectItem>
                        <SelectItem value="USD">دلار آمریکا</SelectItem>
                        <SelectItem value="EUR">یورو</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSaveSystem} className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Save className="w-4 h-4 ml-2" />
                  ذخیره تنظیمات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <Shield className="w-5 h-5 text-red-600" />
                <span>تنظیمات امنیتی</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>احراز هویت دو مرحله‌ای</Label>
                      <p className="text-sm text-gray-600">افزایش امنیت ورود</p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: checked})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="password-expiry">انقضای رمز عبور (روز)</Label>
                    <Input
                      id="password-expiry"
                      type="number"
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="login-attempts">حداکثر تلاش‌های ورود</Label>
                    <Input
                      id="login-attempts"
                      type="number"
                      value={securitySettings.loginAttempts}
                      onChange={(e) => setSecuritySettings({...securitySettings, loginAttempts: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>قفل خودکار نشست</Label>
                      <p className="text-sm text-gray-600">قفل کردن پس از عدم فعالیت</p>
                    </div>
                    <Switch
                      checked={securitySettings.sessionLock}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, sessionLock: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>فهرست سفید IP</Label>
                      <p className="text-sm text-gray-600">محدود کردن دسترسی به IP های خاص</p>
                    </div>
                    <Switch
                      checked={securitySettings.ipWhitelist}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, ipWhitelist: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>لاگ حسابرسی</Label>
                      <p className="text-sm text-gray-600">ثبت تمام فعالیت‌های کاربران</p>
                    </div>
                    <Switch
                      checked={securitySettings.auditLog}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, auditLog: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>رمزگذاری داده‌ها</Label>
                      <p className="text-sm text-gray-600">رمزگذاری اطلاعات حساس</p>
                    </div>
                    <Switch
                      checked={securitySettings.encryptData}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, encryptData: checked})}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSaveSecurity} className="bg-red-600 hover:bg-red-700 text-white">
                  <Save className="w-4 h-4 ml-2" />
                  ذخیره تنظیمات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management Tab */}
        <TabsContent value="data" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Database className="w-5 h-5 text-green-600" />
                  <span>مدیریت داده‌ها</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">پشتیبان‌گیری</span>
                  </div>
                  <p className="text-xs text-blue-700 mb-3">
                    آخرین پشتیبان‌گیری: 1403/05/30 - 14:30
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 ml-2" />
                    دانلود پشتیبان
                  </Button>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse mb-2">
                    <Upload className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">بازیابی داده‌ها</span>
                  </div>
                  <p className="text-xs text-orange-700 mb-3">
                    بازگردانی داده‌ها از فایل پشتیبان
                  </p>
                  <Button variant="outline" className="w-full" onClick={handleImportData}>
                    <Upload className="w-4 h-4 ml-2" />
                    آپلود فایل
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>عملیات حساس</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse mb-2">
                    <RotateCcw className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-900">بازنشانی تنظیمات</span>
                  </div>
                  <p className="text-xs text-yellow-700 mb-3">
                    بازگردانی تنظیمات به حالت پیش‌فرض
                  </p>
                  <Button variant="outline" className="w-full">
                    <RotateCcw className="w-4 h-4 ml-2" />
                    بازنشانی
                  </Button>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse mb-2">
                    <Trash2 className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-900">حذف کامل داده‌ها</span>
                  </div>
                  <p className="text-xs text-red-700 mb-3">
                    حذف تمام داده‌ها - غیرقابل بازگشت
                  </p>
                  <Button variant="destructive" className="w-full" onClick={handleResetSystem}>
                    <Trash2 className="w-4 h-4 ml-2" />
                    حذف داده‌ها
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}