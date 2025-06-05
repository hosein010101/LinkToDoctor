import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Key, Smartphone, Monitor, MapPin, Clock, AlertTriangle, Check, X } from "lucide-react";

export default function SecurityPrivacy() {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [activeSessions] = useState([
    {
      id: 1,
      device: "Chrome on Windows",
      location: "تهران، ایران",
      ipAddress: "192.168.1.100",
      lastActivity: "۵ دقیقه پیش",
      isCurrent: true
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "تهران، ایران", 
      ipAddress: "192.168.1.101",
      lastActivity: "۲ ساعت پیش",
      isCurrent: false
    }
  ]);

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("رمز عبور جدید و تکرار آن مطابقت ندارند");
      return;
    }
    // API call to change password
    console.log("Changing password");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleLogoutSession = (sessionId: number) => {
    // API call to logout specific session
    console.log("Logging out session:", sessionId);
  };

  const handleLogoutAllSessions = () => {
    // API call to logout all other sessions
    console.log("Logging out all other sessions");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 space-x-reverse">
        <Shield className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">امنیت و حریم خصوصی</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <Key className="w-5 h-5" />
              <span>تغییر رمز عبور</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">رمز عبور فعلی</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="رمز عبور فعلی خود را وارد کنید"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">رمز عبور جدید</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="رمز عبور جدید"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تکرار رمز عبور جدید</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="رمز عبور جدید را تکرار کنید"
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>نکات امنیتی:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• حداقل ۸ کاراکتر</li>
                <li>• شامل حروف بزرگ و کوچک</li>
                <li>• شامل اعداد و نمادهای ویژه</li>
              </ul>
            </div>

            <Button onClick={handlePasswordChange} className="w-full">
              تغییر رمز عبور
            </Button>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <Smartphone className="w-5 h-5" />
              <span>احراز هویت دومرحله‌ای</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">فعال‌سازی ۲FA</Label>
                <p className="text-sm text-gray-500">
                  امنیت بیشتر با کد تأیید از طریق موبایل
                </p>
              </div>
              <ToggleSwitch
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>

            {twoFactorEnabled ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 p-3 rounded-md">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      احراز هویت دومرحله‌ای فعال است
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  مشاهده کدهای پشتیبان
                </Button>
                <Button variant="outline" className="w-full">
                  تنظیم مجدد ۲FA
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-md">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-sm text-amber-800">
                      احراز هویت دومرحله‌ای غیرفعال است
                    </span>
                  </div>
                </div>
                <Button className="w-full">
                  راه‌اندازی ۲FA
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <Monitor className="w-5 h-5" />
                <span>جلسات فعال</span>
              </CardTitle>
              <Button variant="outline" onClick={handleLogoutAllSessions}>
                خروج از همه جلسات
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <Monitor className="w-8 h-8 text-gray-400" />
                    <div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="font-medium">{session.device}</span>
                        {session.isCurrent && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            جلسه فعلی
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500 mt-1">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <MapPin className="w-3 h-3" />
                          <span>{session.location}</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Clock className="w-3 h-3" />
                          <span>{session.lastActivity}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        IP: {session.ipAddress}
                      </div>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLogoutSession(session.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4 ml-1" />
                      خروج
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Privacy Policy */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>حریم خصوصی و سیاست‌ها</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Shield className="w-6 h-6" />
                <span>سیاست حریم خصوصی</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Key className="w-6 h-6" />
                <span>قوانین امنیتی</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Monitor className="w-6 h-6" />
                <span>تاریخچه فعالیت</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}