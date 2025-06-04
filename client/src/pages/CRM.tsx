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
import { 
  Users, 
  MessageCircle, 
  Crown, 
  TrendingUp, 
  Zap, 
  HeadphonesIcon,
  Phone,
  Mail,
  Send,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Star,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserPlus,
  MessageSquare,
  Target,
  BarChart3,
  Gift,
  Settings,
  Download,
  Upload,
  Search,
  Plus,
  Eye
} from "lucide-react";

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

interface SMSCampaign {
  id: number;
  name: string;
  message: string;
  targetGroup: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  scheduledDate?: string;
  recipientCount: number;
  sentCount: number;
  deliveryRate: number;
  createdAt: string;
}

interface SupportTicket {
  id: number;
  title: string;
  description: string;
  customerName: string;
  customerPhone: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  category: "technical" | "billing" | "appointment" | "complaint" | "suggestion";
}

interface CustomerAnalytics {
  totalCustomers: number;
  activeCustomers: number;
  newThisMonth: number;
  churnRate: number;
  avgOrderValue: number;
  customerLifetimeValue: number;
  satisfactionScore: number;
  topServices: Array<{ name: string; count: number }>;
}

export default function CRM() {
  const [activeTab, setActiveTab] = useState("contacts");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showSMSComposer, setShowSMSComposer] = useState(false);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Sample data
  const sampleContacts: Contact[] = [
    {
      id: 1,
      name: "احمد رضایی",
      phone: "09123456789",
      email: "ahmad@email.com",
      type: "patient",
      status: "active",
      lastContact: "1403/05/20",
      totalOrders: 15,
      totalSpent: 2500000,
      vipLevel: "gold",
      tags: ["دیابت", "مشتری وفادار"],
      notes: "بیمار منظم، همیشه به موقع"
    },
    {
      id: 2,
      name: "دکتر سارا نوری",
      phone: "09987654321",
      email: "dr.nouri@clinic.com",
      type: "doctor",
      status: "active",
      lastContact: "1403/05/18",
      totalOrders: 45,
      totalSpent: 8500000,
      vipLevel: "platinum",
      tags: ["متخصص قلب", "شریک کاری"],
      notes: "پزشک همکار، حجم بالای ارجاع"
    },
    {
      id: 3,
      name: "فاطمه احمدی",
      phone: "09111234567",
      email: "fateme@email.com",
      type: "patient",
      status: "active",
      lastContact: "1403/05/15",
      totalOrders: 8,
      totalSpent: 1200000,
      vipLevel: "silver",
      tags: ["بیمه تامین اجتماعی"],
      notes: "مشتری جدید، نیاز به پیگیری"
    },
    {
      id: 4,
      name: "شرکت تجهیزات پزشکی آریا",
      phone: "02188776655",
      email: "info@aria-medical.com",
      type: "supplier",
      status: "active",
      lastContact: "1403/05/10",
      totalOrders: 12,
      totalSpent: 45000000,
      tags: ["تامین کننده اصلی", "قابل اعتماد"],
      notes: "تامین کننده تجهیزات آزمایشگاهی"
    }
  ];

  const sampleCampaigns: SMSCampaign[] = [
    {
      id: 1,
      name: "یادآوری آزمایش ماهانه",
      message: "سلام {نام}، زمان آزمایش ماهانه شما فرا رسیده. لطفا جهت هماهنگی تماس بگیرید.",
      targetGroup: "بیماران دیابتی",
      status: "sent",
      scheduledDate: "1403/05/20",
      recipientCount: 150,
      sentCount: 148,
      deliveryRate: 98.7,
      createdAt: "1403/05/19"
    },
    {
      id: 2,
      name: "تخفیف ویژه آزمایش",
      message: "آزمایش‌های کامل با 20% تخفیف! فقط تا پایان ماه. کد تخفیف: HEALTH20",
      targetGroup: "مشتریان VIP",
      status: "scheduled",
      scheduledDate: "1403/05/25",
      recipientCount: 85,
      sentCount: 0,
      deliveryRate: 0,
      createdAt: "1403/05/20"
    },
    {
      id: 3,
      name: "اطلاع‌رسانی سرویس جدید",
      message: "خدمات نمونه‌گیری در منزل اکنون در منطقه شما فعال است. جهت اطلاعات بیشتر تماس بگیرید.",
      targetGroup: "همه مشتریان",
      status: "draft",
      recipientCount: 520,
      sentCount: 0,
      deliveryRate: 0,
      createdAt: "1403/05/21"
    }
  ];

  const sampleTickets: SupportTicket[] = [
    {
      id: 1,
      title: "مشکل در دریافت نتایج آزمایش",
      description: "از دیروز تلاش می‌کنم نتایج آزمایش خود را از سایت دانلود کنم اما موفق نمی‌شوم.",
      customerName: "علی محمدی",
      customerPhone: "09123334455",
      priority: "medium",
      status: "in_progress",
      assignedTo: "تیم فنی",
      createdAt: "1403/05/21",
      updatedAt: "1403/05/21",
      category: "technical"
    },
    {
      id: 2,
      title: "درخواست تغییر زمان نمونه‌گیری",
      description: "به دلیل مسافرت اضطراری نیاز به تغییر زمان نمونه‌گیری دارم.",
      customerName: "مریم کریمی",
      customerPhone: "09987776655",
      priority: "low",
      status: "resolved",
      assignedTo: "بخش پذیرش",
      createdAt: "1403/05/20",
      updatedAt: "1403/05/20",
      category: "appointment"
    },
    {
      id: 3,
      title: "شکایت از کیفیت خدمات",
      description: "نمونه‌گیر با تاخیر زیادی به منزل آمد و رفتار مناسبی نداشت.",
      customerName: "حسن رضوی",
      customerPhone: "09111223344",
      priority: "high",
      status: "open",
      assignedTo: "مدیر کیفیت",
      createdAt: "1403/05/21",
      updatedAt: "1403/05/21",
      category: "complaint"
    }
  ];

  const analytics: CustomerAnalytics = {
    totalCustomers: 2847,
    activeCustomers: 1923,
    newThisMonth: 156,
    churnRate: 5.2,
    avgOrderValue: 285000,
    customerLifetimeValue: 1850000,
    satisfactionScore: 4.6,
    topServices: [
      { name: "آزمایش خون کامل", count: 487 },
      { name: "آزمایش قند", count: 356 },
      { name: "آزمایش کلسترول", count: 298 },
      { name: "آزمایش ادرار", count: 234 },
      { name: "آزمایش تیروئید", count: 189 }
    ]
  };

  const getVIPBadge = (level?: string) => {
    if (!level) return null;
    const config = {
      bronze: { label: "برنز", color: "bg-orange-100 text-orange-800" },
      silver: { label: "نقره", color: "bg-gray-100 text-gray-800" },
      gold: { label: "طلا", color: "bg-orange-100 text-orange-800" },
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

  const getStatusBadge = (status: string, type: "contact" | "campaign" | "ticket") => {
    const configs = {
      contact: {
        active: { label: "فعال", color: "bg-green-100 text-green-800" },
        inactive: { label: "غیرفعال", color: "bg-gray-100 text-gray-800" }
      },
      campaign: {
        draft: { label: "پیش‌نویس", color: "bg-gray-100 text-gray-800" },
        scheduled: { label: "زمان‌بندی شده", color: "bg-blue-100 text-blue-800" },
        sent: { label: "ارسال شده", color: "bg-green-100 text-green-800" },
        failed: { label: "ناموفق", color: "bg-red-100 text-red-800" }
      },
      ticket: {
        open: { label: "باز", color: "bg-red-100 text-red-800" },
        in_progress: { label: "در حال بررسی", color: "bg-orange-100 text-orange-800" },
        resolved: { label: "حل شده", color: "bg-green-100 text-green-800" },
        closed: { label: "بسته", color: "bg-gray-100 text-gray-800" }
      }
    };
    
    const config = configs[type][status as keyof typeof configs[typeof type]];
    return <Badge className={`${config.color} hover:${config.color}`}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const config = {
      low: { label: "کم", color: "bg-gray-100 text-gray-800" },
      medium: { label: "متوسط", color: "bg-orange-100 text-orange-800" },
      high: { label: "بالا", color: "bg-orange-100 text-orange-800" },
      urgent: { label: "فوری", color: "bg-red-100 text-red-800" }
    };
    const priorityConfig = config[priority as keyof typeof config];
    return <Badge className={`${priorityConfig.color} hover:${priorityConfig.color}`}>{priorityConfig.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const filteredContacts = sampleContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone.includes(searchTerm);
    const matchesType = filterType === "all" || contact.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مدیریت ارتباط با مشتریان</h1>
          <p className="text-gray-600 mt-1">فهرست مخاطبین، پیگیری‌ها و تحلیل مشتریان</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button 
            variant="outline"
            onClick={() => setShowSMSComposer(true)}
          >
            <MessageCircle className="w-4 h-4 ml-2" />
            پیامک جدید
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowNewTicket(true)}
          >
            <Plus className="w-4 h-4 ml-2" />
            تیکت جدید
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="contacts" className="flex items-center space-x-2 space-x-reverse">
            <Users className="w-4 h-4" />
            <span>فهرست مخاطبین</span>
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center space-x-2 space-x-reverse">
            <MessageCircle className="w-4 h-4" />
            <span>پیامک انبوه</span>
          </TabsTrigger>
          <TabsTrigger value="vip" className="flex items-center space-x-2 space-x-reverse">
            <Crown className="w-4 h-4" />
            <span>بیماران VIP</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2 space-x-reverse">
            <TrendingUp className="w-4 h-4" />
            <span>تحلیل مشتری</span>
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center space-x-2 space-x-reverse">
            <Zap className="w-4 h-4" />
            <span>کمپین خودکار</span>
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center space-x-2 space-x-reverse">
            <HeadphonesIcon className="w-4 h-4" />
            <span>تیکت پشتیبانی</span>
          </TabsTrigger>
        </TabsList>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="mt-6">
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
                          <DropdownMenuItem onClick={() => setSelectedContact(contact)}>
                            <Eye className="w-4 h-4 ml-2" />
                            مشاهده جزئیات
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 ml-2" />
                            ویرایش
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="w-4 h-4 ml-2" />
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
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">نوع:</span>
                        <Badge variant="outline">
                          {contact.type === 'patient' ? 'بیمار' : 
                           contact.type === 'doctor' ? 'پزشک' :
                           contact.type === 'partner' ? 'شریک کاری' : 'تامین کننده'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">وضعیت:</span>
                        {getStatusBadge(contact.status, "contact")}
                      </div>
                      {contact.vipLevel && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">VIP:</span>
                          {getVIPBadge(contact.vipLevel)}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">سفارشات:</span>
                        <span className="font-semibold">{contact.totalOrders}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">مبلغ کل:</span>
                        <span className="font-semibold text-green-600">{formatCurrency(contact.totalSpent)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">آخرین تماس:</span>
                        <span className="text-sm">{contact.lastContact}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* SMS Tab */}
        <TabsContent value="sms" className="mt-6">
          <div className="space-y-6">
            {/* SMS Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Send className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ارسال شده امروز</p>
                      <p className="text-2xl font-bold text-gray-900">1,247</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">نرخ تحویل</p>
                      <p className="text-2xl font-bold text-gray-900">97.8%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">در انتظار ارسال</p>
                      <p className="text-2xl font-bold text-gray-900">85</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">مخاطبین فعال</p>
                      <p className="text-2xl font-bold text-gray-900">2,847</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Campaign List */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>کمپین‌های پیامکی</span>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setShowSMSComposer(true)}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    کمپین جدید
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-right p-4 font-medium text-gray-700">نام کمپین</th>
                        <th className="text-right p-4 font-medium text-gray-700">گروه هدف</th>
                        <th className="text-right p-4 font-medium text-gray-700">وضعیت</th>
                        <th className="text-right p-4 font-medium text-gray-700">تعداد گیرنده</th>
                        <th className="text-right p-4 font-medium text-gray-700">نرخ تحویل</th>
                        <th className="text-right p-4 font-medium text-gray-700">تاریخ ایجاد</th>
                        <th className="text-right p-4 font-medium text-gray-700">عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleCampaigns.map((campaign) => (
                        <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4 font-medium">{campaign.name}</td>
                          <td className="p-4">{campaign.targetGroup}</td>
                          <td className="p-4">{getStatusBadge(campaign.status, "campaign")}</td>
                          <td className="p-4">{campaign.recipientCount}</td>
                          <td className="p-4">
                            {campaign.deliveryRate > 0 ? `${campaign.deliveryRate}%` : '-'}
                          </td>
                          <td className="p-4">{campaign.createdAt}</td>
                          <td className="p-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 ml-2" />
                                  مشاهده جزئیات
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 ml-2" />
                                  ویرایش
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="w-4 h-4 ml-2" />
                                  گزارش
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* VIP Patients Tab */}
        <TabsContent value="vip" className="mt-6">
          <div className="space-y-6">
            {/* VIP Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Crown className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">پلاتین</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Crown className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">طلا</p>
                      <p className="text-2xl font-bold text-gray-900">48</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Crown className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">نقره</p>
                      <p className="text-2xl font-bold text-gray-900">127</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Crown className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">برنز</p>
                      <p className="text-2xl font-bold text-gray-900">294</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* VIP Patients List */}
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
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">کل مشتریان</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.totalCustomers.toLocaleString('fa-IR')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">مشتریان فعال</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.activeCustomers.toLocaleString('fa-IR')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <UserPlus className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">جدید این ماه</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.newThisMonth}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">رضایت مشتریان</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.satisfactionScore}/5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle>آمار مالی</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-gray-700">میانگین ارزش سفارش</span>
                      <span className="font-bold text-green-600">{formatCurrency(analytics.avgOrderValue)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-gray-700">ارزش دوره حیات مشتری</span>
                      <span className="font-bold text-blue-600">{formatCurrency(analytics.customerLifetimeValue)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-gray-700">نرخ ترک مشتری</span>
                      <span className="font-bold text-red-600">{analytics.churnRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle>محبوب‌ترین خدمات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.topServices.map((service, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-700">{service.name}</span>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <span className="font-semibold">{service.count}</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(service.count / analytics.topServices[0].count) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="mt-6">
          <div className="space-y-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>کمپین‌های خودکار</span>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Zap className="w-4 h-4 ml-2" />
                    کمپین جدید
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 space-x-reverse mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold">یادآوری قرار ملاقات</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">ارسال خودکار پیامک یادآوری 24 ساعت قبل از قرار ملاقات</p>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-green-100 text-green-800">فعال</Badge>
                        <Button variant="outline" size="sm">تنظیمات</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 space-x-reverse mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Gift className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-semibold">پیامک تولد</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">ارسال تبریک تولد به همراه کد تخفیف ویژه</p>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-green-100 text-green-800">فعال</Badge>
                        <Button variant="outline" size="sm">تنظیمات</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 space-x-reverse mb-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Target className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="font-semibold">پیگیری مشتریان غیرفعال</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">ارسال پیامک ترغیبی برای مشتریان غیرفعال</p>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-yellow-100 text-yellow-800">غیرفعال</Badge>
                        <Button variant="outline" size="sm">فعال‌سازی</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="mt-6">
          <div className="space-y-6">
            {/* Support Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">تیکت‌های باز</p>
                      <p className="text-2xl font-bold text-gray-900">24</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">در حال بررسی</p>
                      <p className="text-2xl font-bold text-gray-900">18</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">حل شده امروز</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">میانگین پاسخ</p>
                      <p className="text-2xl font-bold text-gray-900">2.5 ساعت</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tickets List */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>تیکت‌های پشتیبانی</span>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setShowNewTicket(true)}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    تیکت جدید
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleTickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{ticket.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
                            <span>{ticket.customerName}</span>
                            <span>•</span>
                            <span>{ticket.customerPhone}</span>
                            <span>•</span>
                            <span>{ticket.createdAt}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {getPriorityBadge(ticket.priority)}
                          {getStatusBadge(ticket.status, "ticket")}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                          <span>تخصیص: {ticket.assignedTo || 'تخصیص نیافته'}</span>
                          <span>•</span>
                          <span>دسته: {
                            ticket.category === 'technical' ? 'فنی' :
                            ticket.category === 'billing' ? 'مالی' :
                            ticket.category === 'appointment' ? 'قرار ملاقات' :
                            ticket.category === 'complaint' ? 'شکایت' : 'پیشنهاد'
                          }</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 ml-1" />
                            پاسخ
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 ml-2" />
                                مشاهده جزئیات
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 ml-2" />
                                ویرایش
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CheckCircle className="w-4 h-4 ml-2" />
                                حل شده
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
      </Tabs>

      {/* SMS Composer Modal */}
      <Dialog open={showSMSComposer} onOpenChange={setShowSMSComposer}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-right text-xl font-bold">
              ارسال پیامک جدید
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">گروه هدف</label>
                <Select>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="انتخاب گروه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه مشتریان</SelectItem>
                    <SelectItem value="vip">مشتریان VIP</SelectItem>
                    <SelectItem value="patients">بیماران</SelectItem>
                    <SelectItem value="inactive">غیرفعال</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">زمان ارسال</label>
                <Select>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="انتخاب زمان" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">هم‌اکنون</SelectItem>
                    <SelectItem value="schedule">زمان‌بندی</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">متن پیام</label>
              <Textarea 
                placeholder="متن پیامک خود را وارد کنید..."
                className="border-gray-300 min-h-[120px]"
              />
              <p className="text-xs text-gray-500 mt-1">تعداد کاراکتر: 0/160</p>
            </div>
            
            <div className="flex justify-end space-x-3 space-x-reverse">
              <Button variant="outline" onClick={() => setShowSMSComposer(false)}>
                انصراف
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Send className="w-4 h-4 ml-2" />
                ارسال پیامک
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Ticket Modal */}
      <Dialog open={showNewTicket} onOpenChange={setShowNewTicket}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-right text-xl font-bold">
              ایجاد تیکت پشتیبانی جدید
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نام مشتری</label>
                <Input placeholder="نام کامل مشتری" className="border-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">شماره تلفن</label>
                <Input placeholder="09123456789" className="border-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اولویت</label>
                <Select>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="انتخاب اولویت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">کم</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="high">بالا</SelectItem>
                    <SelectItem value="urgent">فوری</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
                <Select>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="انتخاب دسته" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">فنی</SelectItem>
                    <SelectItem value="billing">مالی</SelectItem>
                    <SelectItem value="appointment">قرار ملاقات</SelectItem>
                    <SelectItem value="complaint">شکایت</SelectItem>
                    <SelectItem value="suggestion">پیشنهاد</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">عنوان</label>
              <Input placeholder="عنوان مختصر مشکل" className="border-gray-300" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
              <Textarea 
                placeholder="توضیح کامل مشکل یا درخواست..."
                className="border-gray-300 min-h-[120px]"
              />
            </div>
            
            <div className="flex justify-end space-x-3 space-x-reverse">
              <Button variant="outline" onClick={() => setShowNewTicket(false)}>
                انصراف
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 ml-2" />
                ایجاد تیکت
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Details Modal */}
      {selectedContact && (
        <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-right text-xl font-bold">
                جزئیات مخاطب: {selectedContact.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">شماره تلفن</label>
                  <p className="text-gray-900 font-semibold">{selectedContact.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">ایمیل</label>
                  <p className="text-gray-900 font-semibold">{selectedContact.email || 'وارد نشده'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">نوع مخاطب</label>
                  <p className="text-gray-900 font-semibold">
                    {selectedContact.type === 'patient' ? 'بیمار' : 
                     selectedContact.type === 'doctor' ? 'پزشک' :
                     selectedContact.type === 'partner' ? 'شریک کاری' : 'تامین کننده'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">وضعیت</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedContact.status, "contact")}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">تعداد سفارشات</label>
                  <p className="text-gray-900 font-semibold">{selectedContact.totalOrders}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">مبلغ کل خرید</label>
                  <p className="text-gray-900 font-semibold text-green-600">{formatCurrency(selectedContact.totalSpent)}</p>
                </div>
                {selectedContact.vipLevel && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">سطح VIP</label>
                    <div className="mt-1">
                      {getVIPBadge(selectedContact.vipLevel)}
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-700">آخرین تماس</label>
                  <p className="text-gray-900 font-semibold">{selectedContact.lastContact}</p>
                </div>
              </div>
              
              {selectedContact.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">برچسب‌ها</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedContact.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedContact.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">یادداشت‌ها</label>
                  <p className="text-gray-900 mt-1">{selectedContact.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}