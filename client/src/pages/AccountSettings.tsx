import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SettingsIcon } from "@/components/ui/custom-icons";
import { Bell, Globe, Moon, Sun, Volume2, Mail, Smartphone, Save } from "lucide-react";

export default function AccountSettings() {
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      orderUpdates: true,
      systemAlerts: true,
      marketingEmails: false
    },
    preferences: {
      language: "fa",
      theme: "light",
      timezone: "Asia/Tehran",
      dateFormat: "persian",
      soundEnabled: true
    },
    privacy: {
      profileVisibility: "internal",
      activityLog: true,
      dataSharing: false
    }
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handlePreferenceChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // API call to save settings
    console.log("Saving settings:", settings);
    // Show success notification
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <SettingsIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">تنظیمات حساب</h1>
        </div>
        <Button onClick={handleSaveSettings} className="flex items-center space-x-2 space-x-reverse">
          <Save className="w-4 h-4" />
          <span>ذخیره تنظیمات</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <Bell className="w-5 h-5" />
              <span>تنظیمات اعلانات</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">اعلانات ایمیل</Label>
                  <div className="text-sm text-gray-500">
                    دریافت اعلانات مهم از طریق ایمیل
                  </div>
                </div>
                <Switch
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">اعلانات پیامکی</Label>
                  <div className="text-sm text-gray-500">
                    دریافت اطلاعیه‌های فوری از طریق پیامک
                  </div>
                </div>
                <Switch
                  checked={settings.notifications.smsNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">اعلانات بروزرسانی سفارش</Label>
                  <div className="text-sm text-gray-500">
                    اطلاع از تغییرات وضعیت سفارشات
                  </div>
                </div>
                <Switch
                  checked={settings.notifications.orderUpdates}
                  onCheckedChange={(checked) => handleNotificationChange('orderUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">هشدارهای سیستم</Label>
                  <div className="text-sm text-gray-500">
                    اعلانات مربوط به مسائل فنی و امنیتی
                  </div>
                </div>
                <Switch
                  checked={settings.notifications.systemAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('systemAlerts', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <Globe className="w-5 h-5" />
              <span>تنظیمات عمومی</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>زبان رابط کاربری</Label>
                <Select value={settings.preferences.language} onValueChange={(value) => handlePreferenceChange('language', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fa">فارسی</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>تم ظاهری</Label>
                <Select value={settings.preferences.theme} onValueChange={(value) => handlePreferenceChange('theme', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">روشن</SelectItem>
                    <SelectItem value="dark">تیره</SelectItem>
                    <SelectItem value="auto">خودکار</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>منطقه زمانی</Label>
                <Select value={settings.preferences.timezone} onValueChange={(value) => handlePreferenceChange('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Tehran">تهران (GMT+3:30)</SelectItem>
                    <SelectItem value="Asia/Dubai">دبی (GMT+4:00)</SelectItem>
                    <SelectItem value="Europe/London">لندن (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>فرمت تاریخ</Label>
                <Select value={settings.preferences.dateFormat} onValueChange={(value) => handlePreferenceChange('dateFormat', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="persian">شمسی (۱۴۰۳/۰۱/۰۱)</SelectItem>
                    <SelectItem value="gregorian">میلادی (2024/03/21)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">صداهای سیستم</Label>
                  <div className="text-sm text-gray-500">
                    پخش صدا برای اعلانات و هشدارها
                  </div>
                </div>
                <Switch
                  checked={settings.preferences.soundEnabled}
                  onCheckedChange={(checked) => handlePreferenceChange('soundEnabled', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <span>تنظیمات حریم خصوصی</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>نمایش پروفایل</Label>
                <Select value={settings.privacy.profileVisibility} onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">عمومی</SelectItem>
                    <SelectItem value="internal">داخلی (فقط همکاران)</SelectItem>
                    <SelectItem value="private">خصوصی</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">ثبت فعالیت‌ها</Label>
                  <div className="text-sm text-gray-500">
                    ذخیره تاریخچه فعالیت‌های شما
                  </div>
                </div>
                <Switch
                  checked={settings.privacy.activityLog}
                  onCheckedChange={(checked) => handlePrivacyChange('activityLog', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}