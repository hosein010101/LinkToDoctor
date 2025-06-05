import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserProfileIcon, SettingsIcon } from "@/components/ui/custom-icons";
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit3, Save, X } from "lucide-react";

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "دکتر حسین حدادی",
    email: "h.hadadi@linktodoctor.com",
    phone: "09123456789",
    role: "مدیر آزمایشگاه",
    department: "بخش آزمایشگاه مرکزی",
    address: "تهران، خیابان ولیعصر، پلاک ۱۲۳",
    joinDate: "۱۴۰۱/۰۳/۱۵"
  });

  const handleSave = () => {
    // API call to update user profile
    setIsEditing(false);
    // Show success notification
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <UserProfileIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">پروفایل کاربری</h1>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
          className="flex items-center space-x-2 space-x-reverse"
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4" />
              <span>لغو</span>
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              <span>ویرایش پروفایل</span>
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-blue-500">
              <AvatarImage src="/avatars/dr-hadadi.jpg" alt={formData.name} />
              <AvatarFallback className="bg-blue-500 text-white text-3xl font-bold">
                ح.ح
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{formData.name}</h2>
            <Badge variant="outline" className="mb-4">
              {formData.role}
            </Badge>
            <p className="text-sm text-gray-600 mb-4">{formData.department}</p>
            <div className="flex items-center justify-center space-x-2 space-x-reverse text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>عضویت از {formData.joinDate}</span>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <User className="w-5 h-5" />
              <span>اطلاعات شخصی</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">نام و نام خانوادگی</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="text-right"
                  />
                ) : (
                  <p className="p-2 text-gray-900">{formData.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">ایمیل</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="text-right"
                  />
                ) : (
                  <div className="flex items-center space-x-2 space-x-reverse p-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{formData.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">شماره تماس</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="text-right"
                  />
                ) : (
                  <div className="flex items-center space-x-2 space-x-reverse p-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{formData.phone}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">نقش</Label>
                <div className="flex items-center space-x-2 space-x-reverse p-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{formData.role}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="address">آدرس</Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="text-right"
                />
              ) : (
                <div className="flex items-center space-x-2 space-x-reverse p-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{formData.address}</span>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  لغو
                </Button>
                <Button onClick={handleSave} className="flex items-center space-x-2 space-x-reverse">
                  <Save className="w-4 h-4" />
                  <span>ذخیره تغییرات</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>خلاصه فعالیت</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">۱۲۸</div>
              <div className="text-sm text-gray-600">سفارشات پردازش شده</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">۹۷%</div>
              <div className="text-sm text-gray-600">نرخ تکمیل به موقع</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">۴.۸</div>
              <div className="text-sm text-gray-600">امتیاز عملکرد</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}