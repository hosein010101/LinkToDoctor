import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
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
  AlertTriangle
} from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  
  // Lab Information State
  const [labInfo, setLabInfo] = useState({
    name: "آزمایشگاه پارس",
    license: "LAB-2024-001",
    phone: "021-12345678",
    email: "info@parslab.ir",
    address: "تهران، خیابان ولیعصر، پلاک 123",
    website: "www.parslab.ir",
    manager: "دکتر احمد محمدی",
    establishedYear: "1398",
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    orderUpdates: true,
    resultReady: true,
    lowInventory: true,
    systemAlerts: true,
    dailyReports: false,
    weeklyReports: true,
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    language: "fa",
    timezone: "Asia/Tehran",
    dateFormat: "jalali",
    currency: "IRR",
    workingHours: {
      start: "08:00",
      end: "18:00",
    },
    workingDays: ["saturday", "sunday", "monday", "tuesday", "wednesday"],
    autoBackup: true,
    backupFrequency: "daily",
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    passwordExpiry: 90,
    sessionTimeout: 120,
    twoFactorAuth: false,
    loginAttempts: 5,
    ipWhitelist: "",
    auditLog: true,
  });

  const handleSaveLabInfo = () => {
    // In a real app, this would make an API call
    toast({
      title: "موفقیت",
      description: "اطلاعات آزمایشگاه به‌روزرسانی شد",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "موفقیت", 
      description: "تنظیمات اعلان‌ها ذخیره شد",
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
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-medical-text">تنظیمات آزمایشگاه</h3>
              <p className="text-sm text-gray-500 mt-1">مدیریت تنظیمات و پیکربندی سیستم</p>
            </div>
            <div className="w-12 h-12 bg-medical-teal bg-opacity-20 rounded-lg flex items-center justify-center">
              <SettingsIcon className="text-medical-teal" size={24} />
            </div>
          </div>
        </CardContent>
      </Card>

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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 space-x-reverse mb-6">
                <Building className="w-5 h-5 text-medical-teal" />
                <h4 className="text-lg font-semibold text-medical-text">اطلاعات آزمایشگاه</h4>
              </div>

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
                    <Label htmlFor="website">وب‌سایت</Label>
                    <Input
                      id="website"
                      value={labInfo.website}
                      onChange={(e) => setLabInfo({...labInfo, website: e.target.value})}
                      className="mt-1"
                    />
                  </div>

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
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex justify-end space-x-3 space-x-reverse">
                <Button variant="outline">
                  <RotateCcw className="ml-2 w-4 h-4" />
                  بازنشانی
                </Button>
                <Button onClick={handleSaveLabInfo} className="bg-medical-teal hover:bg-opacity-90 text-white">
                  <Save className="ml-2 w-4 h-4" />
                  ذخیره تغییرات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 space-x-reverse mb-6">
                <Bell className="w-5 h-5 text-medical-teal" />
                <h4 className="text-lg font-semibold text-medical-text">تنظیمات اعلان‌ها</h4>
              </div>

              <div className="space-y-6">
                <div>
                  <h5 className="text-md font-medium text-medical-text mb-4">روش‌های اعلان</h5>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <Label htmlFor="email-notifications">اعلان‌های ایمیل</Label>
                      </div>
                      <ToggleSwitch
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, emailNotifications: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <Label htmlFor="sms-notifications">اعلان‌های پیامکی</Label>
                      </div>
                      <ToggleSwitch
                        checked={notifications.smsNotifications}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, smsNotifications: checked})
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h5 className="text-md font-medium text-medical-text mb-4">انواع اعلان</h5>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="order-updates">به‌روزرسانی سفارشات</Label>
                      <ToggleSwitch
                        checked={notifications.orderUpdates}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, orderUpdates: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="result-ready">آمادگی نتایج</Label>
                      <ToggleSwitch
                        checked={notifications.resultReady}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, resultReady: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="low-inventory">کمبود موجودی</Label>
                      <ToggleSwitch
                        checked={notifications.lowInventory}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, lowInventory: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="system-alerts">هشدارهای سیستم</Label>
                      <ToggleSwitch
                        checked={notifications.systemAlerts}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, systemAlerts: checked})
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h5 className="text-md font-medium text-medical-text mb-4">گزارش‌های دوره‌ای</h5>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="daily-reports">گزارش‌های روزانه</Label>
                      <ToggleSwitch
                        checked={notifications.dailyReports}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, dailyReports: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="weekly-reports">گزارش‌های هفتگی</Label>
                      <ToggleSwitch
                        checked={notifications.weeklyReports}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, weeklyReports: checked})
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={handleSaveNotifications} className="bg-medical-teal hover:bg-opacity-90 text-white">
                  <Save className="ml-2 w-4 h-4" />
                  ذخیره تنظیمات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 space-x-reverse mb-6">
                <Database className="w-5 h-5 text-medical-teal" />
                <h4 className="text-lg font-semibold text-medical-text">تنظیمات سیستم</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="language">زبان سیستم</Label>
                    <Select value={systemSettings.language} onValueChange={(value) => 
                      setSystemSettings({...systemSettings, language: value})
                    }>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fa">فارسی</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timezone">منطقه زمانی</Label>
                    <Select value={systemSettings.timezone} onValueChange={(value) => 
                      setSystemSettings({...systemSettings, timezone: value})
                    }>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Tehran">تهران (UTC+3:30)</SelectItem>
                        <SelectItem value="UTC">UTC (UTC+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date-format">فرمت تاریخ</Label>
                    <Select value={systemSettings.dateFormat} onValueChange={(value) => 
                      setSystemSettings({...systemSettings, dateFormat: value})
                    }>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jalali">شمسی</SelectItem>
                        <SelectItem value="gregorian">میلادی</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="currency">واحد پول</Label>
                    <Select value={systemSettings.currency} onValueChange={(value) => 
                      setSystemSettings({...systemSettings, currency: value})
                    }>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IRR">ریال ایران</SelectItem>
                        <SelectItem value="USD">دلار آمریکا</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>ساعات کاری</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div>
                        <Label htmlFor="start-time" className="text-xs">شروع</Label>
                        <Input
                          id="start-time"
                          type="time"
                          value={systemSettings.workingHours.start}
                          onChange={(e) => setSystemSettings({
                            ...systemSettings,
                            workingHours: {...systemSettings.workingHours, start: e.target.value}
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="end-time" className="text-xs">پایان</Label>
                        <Input
                          id="end-time"
                          type="time"
                          value={systemSettings.workingHours.end}
                          onChange={(e) => setSystemSettings({
                            ...systemSettings,
                            workingHours: {...systemSettings.workingHours, end: e.target.value}
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="backup-frequency">تکرار پشتیبان‌گیری</Label>
                    <Select value={systemSettings.backupFrequency} onValueChange={(value) => 
                      setSystemSettings({...systemSettings, backupFrequency: value})
                    }>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">ساعتی</SelectItem>
                        <SelectItem value="daily">روزانه</SelectItem>
                        <SelectItem value="weekly">هفتگی</SelectItem>
                        <SelectItem value="monthly">ماهانه</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-backup">پشتیبان‌گیری خودکار</Label>
                    <ToggleSwitch
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) => 
                        setSystemSettings({...systemSettings, autoBackup: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={handleSaveSystem} className="bg-medical-teal hover:bg-opacity-90 text-white">
                  <Save className="ml-2 w-4 h-4" />
                  ذخیره تنظیمات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 space-x-reverse mb-6">
                <Shield className="w-5 h-5 text-medical-teal" />
                <h4 className="text-lg font-semibold text-medical-text">تنظیمات امنیتی</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="password-expiry">انقضای رمز عبور (روز)</Label>
                    <Input
                      id="password-expiry"
                      type="number"
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings, 
                        passwordExpiry: parseInt(e.target.value)
                      })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="session-timeout">زمان انقضای جلسه (دقیقه)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings, 
                        sessionTimeout: parseInt(e.target.value)
                      })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="login-attempts">حداکثر تلاش ورود ناموفق</Label>
                    <Input
                      id="login-attempts"
                      type="number"
                      value={securitySettings.loginAttempts}
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings, 
                        loginAttempts: parseInt(e.target.value)
                      })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="two-factor">احراز هویت دو مرحله‌ای</Label>
                    <ToggleSwitch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({...securitySettings, twoFactorAuth: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="audit-log">ثبت گزارش‌های حسابرسی</Label>
                    <ToggleSwitch
                      checked={securitySettings.auditLog}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({...securitySettings, auditLog: checked})
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="ip-whitelist">فهرست سفید IP (اختیاری)</Label>
                    <Textarea
                      id="ip-whitelist"
                      value={securitySettings.ipWhitelist}
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings, 
                        ipWhitelist: e.target.value
                      })}
                      placeholder="192.168.1.0/24"
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={handleSaveSecurity} className="bg-medical-teal hover:bg-opacity-90 text-white">
                  <Save className="ml-2 w-4 h-4" />
                  ذخیره تنظیمات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management Tab */}
        <TabsContent value="data" className="mt-6">
          <div className="space-y-6">
            {/* Export/Import */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 space-x-reverse mb-6">
                  <Database className="w-5 h-5 text-medical-teal" />
                  <h4 className="text-lg font-semibold text-medical-text">مدیریت داده‌ها</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="text-md font-medium text-medical-text">خروجی داده‌ها</h5>
                    <p className="text-sm text-gray-500">
                      تمام داده‌های سیستم را به فرمت JSON یا CSV خروجی بگیرید
                    </p>
                    <div className="flex space-x-2 space-x-reverse">
                      <Button onClick={handleExportData} variant="outline">
                        <Download className="ml-2 w-4 h-4" />
                        خروجی JSON
                      </Button>
                      <Button onClick={handleExportData} variant="outline">
                        <Printer className="ml-2 w-4 h-4" />
                        خروجی CSV
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-md font-medium text-medical-text">ورودی داده‌ها</h5>
                    <p className="text-sm text-gray-500">
                      داده‌های از پیش تهیه شده را به سیستم وارد کنید
                    </p>
                    <Button onClick={handleImportData} variant="outline">
                      <Upload className="ml-2 w-4 h-4" />
                      انتخاب فایل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Backup & Restore */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 space-x-reverse mb-6">
                  <Shield className="w-5 h-5 text-medical-orange" />
                  <h4 className="text-lg font-semibold text-medical-text">پشتیبان‌گیری و بازیابی</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="text-md font-medium text-medical-text">پشتیبان‌گیری دستی</h5>
                    <p className="text-sm text-gray-500">
                      یک نسخه پشتیبان کامل از سیستم تهیه کنید
                    </p>
                    <Button className="bg-medical-green hover:bg-opacity-90 text-white">
                      <Download className="ml-2 w-4 h-4" />
                      ایجاد پشتیبان
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-md font-medium text-medical-text">بازیابی سیستم</h5>
                    <p className="text-sm text-gray-500">
                      سیستم را از یک نسخه پشتیبان بازیابی کنید
                    </p>
                    <Button variant="outline">
                      <Upload className="ml-2 w-4 h-4" />
                      انتخاب فایل پشتیبان
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 space-x-reverse mb-6">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h4 className="text-lg font-semibold text-red-600">منطقه خطر</h4>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="text-md font-medium text-red-800 mb-2">بازنشانی سیستم</h5>
                    <p className="text-sm text-red-600 mb-4">
                      تمام داده‌ها و تنظیمات حذف خواهند شد. این عمل غیرقابل بازگشت است.
                    </p>
                    <Button onClick={handleResetSystem} variant="destructive">
                      <Trash2 className="ml-2 w-4 h-4" />
                      بازنشانی کامل سیستم
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
