import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Search, Filter, Plus, Star, MapPin, Phone, Mail, 
  Clock, Award, TrendingUp, Target, Activity, CheckCircle,
  Eye, Edit, MoreHorizontal, Calendar, UserCheck, Navigation,
  Timer, Zap, Shield, Heart, MessageSquare, X
} from "lucide-react";

interface CollectorProfile {
  id: number;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  status: "active" | "on_leave" | "training" | "suspended";
  employeeId: string;
  hireDate: string;
  department: string;
  supervisor: string;
  specialties: string[];
  certifications: string[];
  location: {
    region: string;
    coverage: string[];
  };
  performance: {
    rating: number;
    totalSamples: number;
    successRate: number;
    avgTimePerSample: number;
    customerSatisfaction: number;
    punctuality: number;
  };
  weeklyStats: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };
  monthlyTarget: number;
  monthlyProgress: number;
  achievements: string[];
  recentActivity: {
    date: string;
    action: string;
    location: string;
  }[];
}

export default function CollectorProfiles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedCollector, setSelectedCollector] = useState<CollectorProfile | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const collectors: CollectorProfile[] = [
    {
      id: 1,
      name: "فاطمه احمدی",
      phone: "09121234567",
      email: "f.ahmadi@linkto.doctor",
      status: "active",
      employeeId: "EMP001",
      hireDate: "1401/03/15",
      department: "نمونه‌گیری منزل",
      supervisor: "دکتر رضایی",
      specialties: ["نمونه‌گیری خون", "آزمایش ادرار", "نمونه‌گیری کودکان"],
      certifications: ["گواهینامه نمونه‌گیری", "کمک‌های اولیه", "بهداشت حرفه‌ای"],
      location: {
        region: "تهران شمال",
        coverage: ["ولنجک", "زعفرانیه", "فرمانیه", "نیاوران"]
      },
      performance: {
        rating: 4.8,
        totalSamples: 2847,
        successRate: 96.2,
        avgTimePerSample: 22,
        customerSatisfaction: 9.1,
        punctuality: 94.5
      },
      weeklyStats: {
        monday: 12,
        tuesday: 15,
        wednesday: 14,
        thursday: 16,
        friday: 13,
        saturday: 8,
        sunday: 5
      },
      monthlyTarget: 200,
      monthlyProgress: 167,
      achievements: ["نمونه‌گیر ماه", "بالاترین رضایت مشتری", "بدون خطا"],
      recentActivity: [
        { date: "1403/05/22", action: "نمونه‌گیری موفق", location: "ولنجک" },
        { date: "1403/05/22", action: "تکمیل دوره آموزشی", location: "مرکز آموزش" },
        { date: "1403/05/21", action: "نمونه‌گیری اورژانس", location: "زعفرانیه" }
      ]
    },
    {
      id: 2,
      name: "علی محمدی",
      phone: "09129876543",
      email: "a.mohammadi@linkto.doctor",
      status: "active",
      employeeId: "EMP002",
      hireDate: "1400/11/08",
      department: "نمونه‌گیری منزل",
      supervisor: "دکتر صادقی",
      specialties: ["نمونه‌گیری خون", "آزمایش میکروبی", "نمونه‌گیری سالمندان"],
      certifications: ["گواهینامه نمونه‌گیری", "مراقبت سالمندان", "کمک‌های اولیه"],
      location: {
        region: "تهران جنوب",
        coverage: ["یوسف آباد", "جردن", "الهیه", "قیطریه"]
      },
      performance: {
        rating: 4.6,
        totalSamples: 2156,
        successRate: 94.8,
        avgTimePerSample: 25,
        customerSatisfaction: 8.7,
        punctuality: 91.2
      },
      weeklyStats: {
        monday: 10,
        tuesday: 12,
        wednesday: 11,
        thursday: 14,
        friday: 12,
        saturday: 6,
        sunday: 3
      },
      monthlyTarget: 180,
      monthlyProgress: 142,
      achievements: ["پنچ سال خدمت", "بهترین همکاری تیمی"],
      recentActivity: [
        { date: "1403/05/22", action: "نمونه‌گیری موفق", location: "جردن" },
        { date: "1403/05/21", action: "گزارش عملکرد ماهانه", location: "دفتر مرکزی" },
        { date: "1403/05/21", action: "نمونه‌گیری موفق", location: "یوسف آباد" }
      ]
    },
    {
      id: 3,
      name: "مریم حسینی",
      phone: "09135551234",
      email: "m.hosseini@linkto.doctor",
      status: "active",
      employeeId: "EMP003",
      hireDate: "1402/01/20",
      department: "نمونه‌گیری منزل",
      supervisor: "دکتر رضایی",
      specialties: ["نمونه‌گیری خون", "آزمایش هورمونی", "نمونه‌گیری زنان"],
      certifications: ["گواهینامه نمونه‌گیری", "مامایی", "آزمایش‌های ویژه"],
      location: {
        region: "تهران غرب",
        coverage: ["پونک", "سعادت آباد", "شهرک غرب", "تهرانپارس"]
      },
      performance: {
        rating: 4.9,
        totalSamples: 1894,
        successRate: 97.1,
        avgTimePerSample: 20,
        customerSatisfaction: 9.3,
        punctuality: 96.8
      },
      weeklyStats: {
        monday: 14,
        tuesday: 16,
        wednesday: 15,
        thursday: 17,
        friday: 14,
        saturday: 9,
        sunday: 4
      },
      monthlyTarget: 190,
      monthlyProgress: 158,
      achievements: ["نمونه‌گیر نمونه", "صفر خطا", "بالاترین دقت"],
      recentActivity: [
        { date: "1403/05/22", action: "نمونه‌گیری ویژه", location: "پونک" },
        { date: "1403/05/22", action: "بازآموزی تخصصی", location: "مرکز آموزش" },
        { date: "1403/05/21", action: "نمونه‌گیری موفق", location: "سعادت آباد" }
      ]
    },
    {
      id: 4,
      name: "حسن کاظمی",
      phone: "09187771234",
      email: "h.kazemi@linkto.doctor",
      status: "training",
      employeeId: "EMP004",
      hireDate: "1403/02/10",
      department: "نمونه‌گیری منزل",
      supervisor: "دکتر صادقی",
      specialties: ["نمونه‌گیری خون", "آزمایش ادرار"],
      certifications: ["گواهینامه نمونه‌گیری", "کمک‌های اولیه"],
      location: {
        region: "تهران شرق",
        coverage: ["تجریش", "دروس", "فرشته", "شریعتی"]
      },
      performance: {
        rating: 4.2,
        totalSamples: 845,
        successRate: 92.4,
        avgTimePerSample: 28,
        customerSatisfaction: 8.4,
        punctuality: 89.1
      },
      weeklyStats: {
        monday: 8,
        tuesday: 10,
        wednesday: 9,
        thursday: 11,
        friday: 10,
        saturday: 5,
        sunday: 2
      },
      monthlyTarget: 120,
      monthlyProgress: 98,
      achievements: ["تازه کار امیدوار"],
      recentActivity: [
        { date: "1403/05/22", action: "دوره آموزشی", location: "مرکز آموزش" },
        { date: "1403/05/21", action: "نمونه‌گیری تحت نظارت", location: "تجریش" },
        { date: "1403/05/21", action: "ارزیابی عملکرد", location: "دفتر مرکزی" }
      ]
    },
    {
      id: 5,
      name: "زهرا نوری",
      phone: "09333444555",
      email: "z.nouri@linkto.doctor",
      status: "on_leave",
      employeeId: "EMP005",
      hireDate: "1399/09/12",
      department: "نمونه‌گیری منزل",
      supervisor: "دکتر رضایی",
      specialties: ["نمونه‌گیری خون", "آزمایش ژنتیک", "نمونه‌گیری نوزادان"],
      certifications: ["گواهینامه نمونه‌گیری", "مراقبت نوزادان", "ژنتیک پزشکی", "کمک‌های اولیه"],
      location: {
        region: "تهران مرکز",
        coverage: ["بهارستان", "لاله‌زار", "پامنار", "منیریه"]
      },
      performance: {
        rating: 4.7,
        totalSamples: 3245,
        successRate: 95.6,
        avgTimePerSample: 24,
        customerSatisfaction: 8.9,
        punctuality: 93.7
      },
      weeklyStats: {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0
      },
      monthlyTarget: 200,
      monthlyProgress: 0,
      achievements: ["پنج سال خدمت", "متخصص نوزادان", "بالاترین تنوع"],
      recentActivity: [
        { date: "1403/05/15", action: "شروع مرخصی زایمان", location: "دفتر مرکزی" },
        { date: "1403/05/14", action: "تحویل تجهیزات", location: "دفتر مرکزی" },
        { date: "1403/05/14", action: "آخرین نمونه‌گیری", location: "پامنار" }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    const configs = {
      active: { label: "فعال", color: "bg-green-100 text-green-800" },
      on_leave: { label: "در مرخصی", color: "bg-blue-100 text-blue-800" },
      training: { label: "آموزش", color: "bg-orange-100 text-orange-800" },
      suspended: { label: "تعلیق", color: "bg-red-100 text-red-800" }
    } as const;
    
    const config = configs[status as keyof typeof configs];
    if (!config) return null;
    
    return <Badge className={`${config.color} hover:${config.color}`}>{config.label}</Badge>;
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-orange-500 fill-orange-500' : 'text-gray-300'}`} 
      />
    ));
  };

  const filteredCollectors = collectors.filter(collector => {
    const matchesSearch = collector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collector.phone.includes(searchTerm) ||
                         collector.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || collector.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || collector.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">پروفایل نمونه‌گیران</h1>
          <p className="text-gray-600 mt-1">مدیریت جامع اطلاعات و عملکرد نمونه‌گیران</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button variant="outline">
            <Plus className="w-4 h-4 ml-2" />
            نمونه‌گیر جدید
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Users className="w-4 h-4 ml-2" />
            گزارش عملکرد
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="card-professional">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="جستجو بر اساس نام، تلفن یا کد پرسنلی..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="active">فعال</SelectItem>
                  <SelectItem value="on_leave">در مرخصی</SelectItem>
                  <SelectItem value="training">آموزش</SelectItem>
                  <SelectItem value="suspended">تعلیق</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="بخش" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه بخش‌ها</SelectItem>
                  <SelectItem value="نمونه‌گیری منزل">نمونه‌گیری منزل</SelectItem>
                  <SelectItem value="نمونه‌گیری مرکز">نمونه‌گیری مرکز</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button 
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                Grid
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollectors.map((collector) => (
            <Card key={collector.id} className="card-professional hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={collector.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                        {collector.name.split(' ')[0][0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{collector.name}</h3>
                      <p className="text-sm text-gray-600">{collector.employeeId}</p>
                      <div className="flex items-center space-x-2 space-x-reverse mt-1">
                        {getStatusBadge(collector.status)}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedCollector(collector)}>
                        <Eye className="w-4 h-4 ml-2" />
                        مشاهده پروفایل
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 ml-2" />
                        ویرایش
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="w-4 h-4 ml-2" />
                        ارسال پیام
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{collector.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{collector.location.region}</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{collector.hireDate}</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <UserCheck className="w-4 h-4 text-gray-400" />
                      <span>{collector.supervisor}</span>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">امتیاز عملکرد</span>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        {getRatingStars(collector.performance.rating)}
                        <span className="text-sm font-bold text-gray-900 mr-1">
                          {collector.performance.rating}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-green-50 p-2 rounded">
                        <span className="text-green-700 font-medium">{collector.performance.successRate}%</span>
                        <p className="text-green-600">نرخ موفقیت</p>
                      </div>
                      <div className="bg-blue-50 p-2 rounded">
                        <span className="text-blue-700 font-medium">{collector.performance.totalSamples}</span>
                        <p className="text-blue-600">کل نمونه‌ها</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-2">پیشرفت ماهانه</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{width: `${(collector.monthlyProgress / collector.monthlyTarget) * 100}%`}}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {collector.monthlyProgress} از {collector.monthlyTarget}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {collector.achievements.slice(0, 2).map((achievement, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Award className="w-3 h-3 ml-1" />
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card className="card-professional">
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-3 px-4 font-medium text-gray-900">نمونه‌گیر</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">وضعیت</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">منطقه</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">امتیاز</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">نرخ موفقیت</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">پیشرفت ماهانه</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCollectors.map((collector) => (
                    <tr key={collector.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={collector.avatar} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {collector.name.split(' ')[0][0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{collector.name}</p>
                            <p className="text-sm text-gray-600">{collector.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(collector.status)}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{collector.location.region}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          {getRatingStars(collector.performance.rating)}
                          <span className="text-sm font-medium text-gray-900 mr-1">
                            {collector.performance.rating}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-green-600">
                          {collector.performance.successRate}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-24">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{width: `${(collector.monthlyProgress / collector.monthlyTarget) * 100}%`}}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {collector.monthlyProgress}/{collector.monthlyTarget}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Button size="sm" variant="outline" onClick={() => setSelectedCollector(collector)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Profile Modal */}
      {selectedCollector && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCollector(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedCollector.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                      {selectedCollector.name.split(' ')[0][0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCollector.name}</h2>
                    <p className="text-gray-600">{selectedCollector.employeeId} - {selectedCollector.department}</p>
                    <div className="flex items-center space-x-2 space-x-reverse mt-2">
                      {getStatusBadge(selectedCollector.status)}
                      <div className="flex items-center space-x-1 space-x-reverse">
                        {getRatingStars(selectedCollector.performance.rating)}
                        <span className="text-sm font-medium text-gray-900 mr-1">
                          {selectedCollector.performance.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedCollector(null)}
                  className="flex items-center space-x-2 space-x-reverse"
                >
                  <X className="w-4 h-4" />
                  <span>بستن</span>
                </Button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">نمای کلی</TabsTrigger>
                  <TabsTrigger value="performance">عملکرد</TabsTrigger>
                  <TabsTrigger value="schedule">برنامه</TabsTrigger>
                  <TabsTrigger value="activity">فعالیت‌ها</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">اطلاعات شخصی</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{selectedCollector.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{selectedCollector.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>تاریخ استخدام: {selectedCollector.hireDate}</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <UserCheck className="w-4 h-4 text-gray-400" />
                          <span>سرپرست: {selectedCollector.supervisor}</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>منطقه: {selectedCollector.location.region}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">تخصص‌ها و گواهینامه‌ها</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">تخصص‌ها:</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedCollector.specialties.map((specialty, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">گواهینامه‌ها:</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedCollector.certifications.map((cert, index) => (
                              <Badge key={index} className="text-xs bg-blue-100 text-blue-800">
                                <Shield className="w-3 h-3 ml-1" />
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">منطقه پوشش</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedCollector.location.coverage.map((area, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            <MapPin className="w-3 h-3 ml-1" />
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">دستاوردها</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedCollector.achievements.map((achievement, index) => (
                          <Badge key={index} className="text-sm bg-orange-100 text-orange-800">
                            <Award className="w-3 h-3 ml-1" />
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Target className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-600">کل نمونه‌ها</p>
                            <p className="text-2xl font-bold text-gray-900">{selectedCollector.performance.totalSamples}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-600">نرخ موفقیت</p>
                            <p className="text-2xl font-bold text-gray-900">{selectedCollector.performance.successRate}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Timer className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-600">زمان میانگین</p>
                            <p className="text-2xl font-bold text-gray-900">{selectedCollector.performance.avgTimePerSample}<span className="text-sm">دقیقه</span></p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Heart className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="text-sm text-gray-600">رضایت مشتری</p>
                            <p className="text-2xl font-bold text-gray-900">{selectedCollector.performance.customerSatisfaction}/10</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Clock className="w-5 h-5 text-orange-600" />
                          <div>
                            <p className="text-sm text-gray-600">دقت زمانی</p>
                            <p className="text-2xl font-bold text-gray-900">{selectedCollector.performance.punctuality}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-600">پیشرفت ماهانه</p>
                            <p className="text-2xl font-bold text-gray-900">{Math.round((selectedCollector.monthlyProgress / selectedCollector.monthlyTarget) * 100)}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">آمار هفتگی</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-7 gap-2">
                        {Object.entries(selectedCollector.weeklyStats).map(([day, count]) => (
                          <div key={day} className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">
                              {day === 'monday' ? 'دوشنبه' :
                               day === 'tuesday' ? 'سه‌شنبه' :
                               day === 'wednesday' ? 'چهارشنبه' :
                               day === 'thursday' ? 'پنج‌شنبه' :
                               day === 'friday' ? 'جمعه' :
                               day === 'saturday' ? 'شنبه' : 'یکشنبه'}
                            </p>
                            <p className="text-lg font-bold text-gray-900">{count}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">فعالیت‌های اخیر</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedCollector.recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-center space-x-3 space-x-reverse p-3 bg-gray-50 rounded-lg">
                            <Activity className="w-5 h-5 text-blue-600" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{activity.action}</p>
                              <p className="text-sm text-gray-600">{activity.location}</p>
                            </div>
                            <span className="text-xs text-gray-500">{activity.date}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}