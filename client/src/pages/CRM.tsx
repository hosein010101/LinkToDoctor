import { useState } from "react";
import { 
  Users, MessageCircle, Crown, TrendingUp, Zap, HeadphonesIcon,
  UserPlus, Filter, MoreHorizontal, Star, Gift, Plus, AlertTriangle, 
  CheckCircle, Clock, ArrowRight, Edit, Trash2, Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Contact {
  id: number;
  name: string;
  phone: string;
  email?: string;
  type: "patient" | "doctor" | "partner" | "supplier";
  status: "active" | "inactive";
  lastContact: string;
  totalOrders: number;
  totalSpent: number;
  vipLevel?: "bronze" | "silver" | "gold" | "platinum";
  tags: string[];
  notes?: string;
}

export default function CRM() {
  const [activeTab, setActiveTab] = useState("contacts");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const sampleContacts: Contact[] = [
    {
      id: 1,
      name: "مریم احمدی",
      phone: "09123456789",
      email: "maryam@example.com",
      type: "patient",
      status: "active",
      lastContact: "1403/05/15",
      totalOrders: 8,
      totalSpent: 2450000,
      vipLevel: "gold",
      tags: ["VIP", "منتظم", "راضی"],
      notes: "بیمار وفادار با تاریخچه خوب پرداخت"
    },
    {
      id: 2,
      name: "دکتر حسن رضوی",
      phone: "09987654321",
      email: "h.rezavi@clinic.com",
      type: "doctor",
      status: "active",
      lastContact: "1403/05/20",
      totalOrders: 25,
      totalSpent: 5600000,
      vipLevel: "platinum",
      tags: ["شریک", "پزشک", "مرجع"],
      notes: "پزشک مرجع در منطقه با ارجاعات متعدد"
    },
    {
      id: 3,
      name: "علی محمدی",
      phone: "09111222333",
      email: "ali.m@gmail.com",
      type: "patient",
      status: "active",
      lastContact: "1403/05/18",
      totalOrders: 3,
      totalSpent: 850000,
      tags: ["جدید", "پتانسیل"],
      notes: "مشتری جدید با پتانسیل خوب"
    }
  ];

  const getVIPBadge = (level?: string) => {
    if (!level) return null;
    const config = {
      bronze: { label: "برنز", color: "bg-orange-100 text-orange-800" },
      silver: { label: "نقره", color: "bg-gray-100 text-gray-800" },
      gold: { label: "طلا", color: "bg-yellow-100 text-yellow-800" },
      platinum: { label: "پلاتین", color: "bg-purple-100 text-purple-800" }
    };
    const vipConfig = config[level as keyof typeof config];
    return (
      <Badge className={`${vipConfig.color} hover:${vipConfig.color}`}>
        <Crown className="w-3 h-3 ml-1" />
        {vipConfig.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      active: { label: "فعال", color: "bg-green-100 text-green-800" },
      inactive: { label: "غیرفعال", color: "bg-gray-100 text-gray-800" }
    } as const;
    
    const config = configs[status as keyof typeof configs];
    if (!config) return null;
    
    return <Badge className={`${config.color} hover:${config.color}`}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fa-IR') + ' تومان';
  };

  const filteredContacts = sampleContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone.includes(searchTerm);
    const matchesType = filterType === "all" || contact.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مدیریت ارتباط با مشتری (CRM)</h1>
          <p className="text-gray-600 mt-1">مدیریت مخاطبین، پیامک انبوه و تحلیل مشتریان</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button variant="outline">
            <Filter className="w-4 h-4 ml-2" />
            گزارش تحلیلی
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 ml-2" />
            کمپین جدید
          </Button>
        </div>
      </div>

      {/* Modern Colored Tabs */}
      <div className="w-full mb-6">
        <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 rounded-2xl p-3 shadow-lg border border-blue-100">
          <div className="grid grid-cols-6 gap-3">
            <button
              onClick={() => setActiveTab("contacts")}
              className={`
                flex items-center justify-center space-x-2 space-x-reverse px-4 py-4 rounded-xl 
                transition-all duration-300 font-semibold text-sm relative overflow-hidden
                ${activeTab === "contacts" 
                  ? "bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100 text-cyan-800 shadow-lg transform scale-110 border-2 border-cyan-200" 
                  : "text-slate-600 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50 hover:text-cyan-700 hover:shadow-md"
                }
              `}
            >
              <Users className="w-5 h-5" />
              <span>فهرست مخاطبین</span>
            </button>
            
            <button
              onClick={() => setActiveTab("sms")}
              className={`
                flex items-center justify-center space-x-2 space-x-reverse px-4 py-4 rounded-xl 
                transition-all duration-300 font-semibold text-sm relative overflow-hidden
                ${activeTab === "sms" 
                  ? "bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 text-emerald-800 shadow-lg transform scale-110 border-2 border-emerald-200" 
                  : "text-slate-600 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-green-50 hover:text-emerald-700 hover:shadow-md"
                }
              `}
            >
              <MessageCircle className="w-5 h-5" />
              <span>پیامک انبوه</span>
            </button>
            
            <button
              onClick={() => setActiveTab("vip")}
              className={`
                flex items-center justify-center space-x-2 space-x-reverse px-4 py-4 rounded-xl 
                transition-all duration-300 font-semibold text-sm relative overflow-hidden
                ${activeTab === "vip" 
                  ? "bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 text-amber-800 shadow-lg transform scale-110 border-2 border-amber-200" 
                  : "text-slate-600 hover:bg-gradient-to-br hover:from-amber-50 hover:to-yellow-50 hover:text-amber-700 hover:shadow-md"
                }
              `}
            >
              <Crown className="w-5 h-5" />
              <span>بیماران VIP</span>
            </button>
            
            <button
              onClick={() => setActiveTab("analytics")}
              className={`
                flex items-center justify-center space-x-2 space-x-reverse px-4 py-4 rounded-xl 
                transition-all duration-300 font-semibold text-sm relative overflow-hidden
                ${activeTab === "analytics" 
                  ? "bg-gradient-to-br from-purple-100 via-violet-100 to-fuchsia-100 text-purple-800 shadow-lg transform scale-110 border-2 border-purple-200" 
                  : "text-slate-600 hover:bg-gradient-to-br hover:from-purple-50 hover:to-violet-50 hover:text-purple-700 hover:shadow-md"
                }
              `}
            >
              <TrendingUp className="w-5 h-5" />
              <span>تحلیل مشتری</span>
            </button>
            
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`
                flex items-center justify-center space-x-2 space-x-reverse px-4 py-4 rounded-xl 
                transition-all duration-300 font-semibold text-sm relative overflow-hidden
                ${activeTab === "campaigns" 
                  ? "bg-gradient-to-br from-rose-100 via-pink-100 to-red-100 text-rose-800 shadow-lg transform scale-110 border-2 border-rose-200" 
                  : "text-slate-600 hover:bg-gradient-to-br hover:from-rose-50 hover:to-pink-50 hover:text-rose-700 hover:shadow-md"
                }
              `}
            >
              <Zap className="w-5 h-5" />
              <span>کمپین خودکار</span>
            </button>
            
            <button
              onClick={() => setActiveTab("support")}
              className={`
                flex items-center justify-center space-x-2 space-x-reverse px-4 py-4 rounded-xl 
                transition-all duration-300 font-semibold text-sm relative overflow-hidden
                ${activeTab === "support" 
                  ? "bg-gradient-to-br from-indigo-100 via-blue-100 to-sky-100 text-indigo-800 shadow-lg transform scale-110 border-2 border-indigo-200" 
                  : "text-slate-600 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-blue-50 hover:text-indigo-700 hover:shadow-md"
                }
              `}
            >
              <HeadphonesIcon className="w-5 h-5" />
              <span>تیکت پشتیبانی</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "contacts" && (
        <div className="space-y-6">
          {/* Filters */}
          <Card className="card-professional">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Input
                    placeholder="جستجو در مخاطبین..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="نوع مخاطب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه انواع</SelectItem>
                      <SelectItem value="patient">بیمار</SelectItem>
                      <SelectItem value="doctor">پزشک</SelectItem>
                      <SelectItem value="partner">شریک کاری</SelectItem>
                      <SelectItem value="supplier">تامین کننده</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Button variant="outline" className="w-full">
                    <Filter className="w-4 h-4 ml-2" />
                    فیلترهای پیشرفته
                  </Button>
                </div>
                <div>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <UserPlus className="w-4 h-4 ml-2" />
                    مخاطب جدید
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contacts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className="card-professional hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`/avatars/contact-${contact.id}.jpg`} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {contact.name.split(' ')[0][0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                        <p className="text-sm text-gray-600">{contact.phone}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 ml-2" />
                          مشاهده جزئیات
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 ml-2" />
                          ویرایش
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageCircle className="w-4 h-4 ml-2" />
                          ارسال پیامک
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 ml-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {getStatusBadge(contact.status)}
                        {contact.vipLevel && getVIPBadge(contact.vipLevel)}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {contact.type === "patient" ? "بیمار" :
                         contact.type === "doctor" ? "پزشک" :
                         contact.type === "partner" ? "شریک" : "تامین کننده"}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>تعداد سفارشات:</span>
                        <span className="font-medium">{contact.totalOrders}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>مجموع خرید:</span>
                        <span className="font-medium">{formatCurrency(contact.totalSpent)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>آخرین تماس:</span>
                        <span className="font-medium">{contact.lastContact}</span>
                      </div>
                    </div>

                    {contact.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {contact.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "sms" && (
        <div className="space-y-6">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle>پیامک انبوه</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">سیستم پیامک انبوه</h3>
                <p className="text-gray-600 mb-6">ارسال پیامک های انبوه به مشتریان و پیگیری نتایج</p>
                <Button>
                  <Plus className="w-4 h-4 ml-2" />
                  کمپین پیامکی جدید
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "vip" && (
        <div className="space-y-6">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle>مشتریان VIP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleContacts.filter(c => c.vipLevel).map((contact) => (
                  <div key={contact.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={`/avatars/contact-${contact.id}.jpg`} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {contact.name.split(' ')[0][0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                          <p className="text-sm text-gray-600">{contact.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 space-x-reverse">
                        {getVIPBadge(contact.vipLevel)}
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{formatCurrency(contact.totalSpent)}</p>
                          <p className="text-xs text-gray-600">{contact.totalOrders} سفارش</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Gift className="w-4 h-4 ml-1" />
                          هدیه ویژه
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle>تحلیل مشتریان</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">تحلیل رفتار مشتریان</h3>
                <p className="text-gray-600 mb-6">گزارش های تحلیلی از رفتار و ترجیحات مشتریان</p>
                <Button>
                  <TrendingUp className="w-4 h-4 ml-2" />
                  مشاهده گزارش کامل
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "campaigns" && (
        <div className="space-y-6">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle>کمپین‌های خودکار</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">کمپین‌های خودکار</h3>
                <p className="text-gray-600 mb-6">ایجاد کمپین‌های پیامکی خودکار برای مناسبت‌ها و یادآوری‌ها</p>
                <Button>
                  <Plus className="w-4 h-4 ml-2" />
                  ایجاد کمپین خودکار
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "support" && (
        <div className="space-y-6">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle>تیکت‌های پشتیبانی</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <HeadphonesIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">سیستم پشتیبانی</h3>
                <p className="text-gray-600 mb-6">مدیریت تیکت های پشتیبانی و پیگیری مسائل مشتریان</p>
                <Button>
                  <Plus className="w-4 h-4 ml-2" />
                  تیکت جدید
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}