import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Phone, 
  Eye, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Users,
  UserCheck,
  Navigation,
  MessageSquare,
  Star,
  TrendingUp,
  Calendar,
  Filter,
  Search,
  Plus,
  RotateCcw,
  Activity,
  Timer,
  Target,
  Award,
  Zap,
  Globe
} from "lucide-react";

interface Collector {
  id: number;
  name: string;
  phone: string;
  avatar?: string;
  status: "available" | "in-progress" | "offline";
  currentTask?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  supervisor: string;
  dailyStats: {
    samplesCollected: number;
    successRate: number;
    averageTime: number;
  };
  rating: number;
  onlineTime: number;
}

interface CollectionTask {
  id: number;
  collectorId: number;
  patientName: string;
  testType: string;
  location: string;
  scheduledTime: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  priority: "urgent" | "high" | "normal";
  startTime?: string;
  notes?: string;
}

export default function SampleCollection() {
  const [selectedCollector, setSelectedCollector] = useState<number | null>(null);
  const [taskForm, setTaskForm] = useState({
    collectorId: "",
    patientName: "",
    testType: "",
    location: "",
    scheduledTime: "",
    notes: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("today");

  // Sample data with Persian names
  const collectors: Collector[] = [
    {
      id: 1,
      name: "فاطمه احمدی",
      phone: "09121234567",
      status: "in-progress",
      currentTask: "نمونه‌گیری خانم کریمی - تست خون",
      location: {
        lat: 35.6892,
        lng: 51.3890,
        address: "تهران، خیابان ولیعصر، پلاک ۱۲۳"
      },
      supervisor: "دکتر رضایی",
      dailyStats: {
        samplesCollected: 8,
        successRate: 95,
        averageTime: 25
      },
      rating: 4.8,
      onlineTime: 6.5
    },
    {
      id: 2,
      name: "علی محمدی",
      phone: "09129876543",
      status: "available",
      location: {
        lat: 35.7010,
        lng: 51.4018,
        address: "تهران، میدان تجریش"
      },
      supervisor: "دکتر صادقی",
      dailyStats: {
        samplesCollected: 12,
        successRate: 88,
        averageTime: 22
      },
      rating: 4.6,
      onlineTime: 7.2
    },
    {
      id: 3,
      name: "مریم حسینی",
      phone: "09135551234",
      status: "in-progress",
      currentTask: "نمونه‌گیری آقای نوری - آزمایش ادرار",
      location: {
        lat: 35.6980,
        lng: 51.4100,
        address: "تهران، خیابان کریمخان، پلاک ۴۵"
      },
      supervisor: "دکتر رضایی",
      dailyStats: {
        samplesCollected: 6,
        successRate: 92,
        averageTime: 28
      },
      rating: 4.7,
      onlineTime: 5.8
    },
    {
      id: 4,
      name: "حسن کاظمی",
      phone: "09187771234",
      status: "available",
      location: {
        lat: 35.7150,
        lng: 51.3850,
        address: "تهران، خیابان شریعتی"
      },
      supervisor: "دکتر صادقی",
      dailyStats: {
        samplesCollected: 10,
        successRate: 90,
        averageTime: 24
      },
      rating: 4.5,
      onlineTime: 8.0
    }
  ];

  const tasks: CollectionTask[] = [
    {
      id: 1,
      collectorId: 1,
      patientName: "زهرا کریمی",
      testType: "آزمایش خون کامل",
      location: "تهران، خیابان ولیعصر، پلاک ۱۲۳",
      scheduledTime: "14:30",
      status: "in-progress",
      priority: "urgent",
      startTime: "14:25"
    },
    {
      id: 2,
      collectorId: 3,
      patientName: "احمد نوری",
      testType: "آزمایش ادرار",
      location: "تهران، خیابان کریمخان، پلاک ۴۵",
      scheduledTime: "15:00",
      status: "in-progress",
      priority: "normal",
      startTime: "14:55"
    }
  ];

  const pendingTasks = tasks.filter(task => task.status === "pending").length;
  const inProgressTasks = tasks.filter(task => task.status === "in-progress").length;
  const activeCollectors = collectors.filter(c => c.status === "in-progress").length;
  const availableCollectors = collectors.filter(c => c.status === "available").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-700";
      case "in-progress": return "bg-blue-100 text-blue-700";
      case "offline": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-700";
      case "high": return "bg-orange-100 text-orange-700";
      case "normal": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleTaskSubmit = () => {
    console.log("Task assigned:", taskForm);
    // Reset form
    setTaskForm({
      collectorId: "",
      patientName: "",
      testType: "",
      location: "",
      scheduledTime: "",
      notes: ""
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-medical-muted">نمونه‌گیری در انتظار</p>
                <p className="text-2xl font-bold text-medical-warning">{pendingTasks}</p>
              </div>
              <Clock className="w-8 h-8 text-medical-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-medical-muted">در حال انجام</p>
                <p className="text-2xl font-bold text-medical-info">{inProgressTasks}</p>
              </div>
              <Activity className="w-8 h-8 text-medical-info" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-medical-muted">نمونه‌گیران فعال</p>
                <p className="text-2xl font-bold text-medical-success">{activeCollectors}</p>
              </div>
              <UserCheck className="w-8 h-8 text-medical-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-medical-muted">نمونه‌گیران آماده</p>
                <p className="text-2xl font-bold text-medical-action">{availableCollectors}</p>
              </div>
              <Users className="w-8 h-8 text-medical-action" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="active" className="text-medical-secondary hover:text-medical-primary">نمونه‌گیری فعال</TabsTrigger>
          <TabsTrigger value="collectors" className="text-medical-secondary hover:text-medical-primary">نمونه‌گیران</TabsTrigger>
          <TabsTrigger value="assign" className="text-medical-secondary hover:text-medical-primary">تخصیص ماموریت</TabsTrigger>
          <TabsTrigger value="map" className="text-medical-secondary hover:text-medical-primary">نقشه زنده</TabsTrigger>
          <TabsTrigger value="performance" className="text-medical-secondary hover:text-medical-primary">عملکرد روزانه</TabsTrigger>
        </TabsList>

        {/* Active Collections */}
        <TabsContent value="active" className="space-y-4">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>نمونه‌گیری‌های فعال</span>
                <Badge className="bg-blue-100 text-blue-700">{inProgressTasks} فعال</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collectors.filter(c => c.status === "in-progress").map((collector) => (
                  <Card key={collector.id} className="border border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4 space-x-reverse">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={collector.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {collector.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <h3 className="font-medium text-gray-900">{collector.name}</h3>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{collector.phone}</p>
                          <div className="mt-2">
                            <Badge className={getStatusColor(collector.status)}>
                              در حال انجام
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mt-2">{collector.currentTask}</p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <MapPin className="w-3 h-3 ml-1" />
                            {collector.location.address}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Eye className="w-4 h-4 ml-1" />
                          مشاهده ماموریت
                        </Button>
                        <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                          <Phone className="w-4 h-4 ml-1" />
                          تماس
                        </Button>
                        <Button size="sm" variant="outline" className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 hover:border-orange-300">
                          <AlertTriangle className="w-4 h-4 ml-1" />
                          گزارش مشکل
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                          <CheckCircle className="w-4 h-4 ml-1" />
                          پایان ماموریت
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Available Collectors */}
        <TabsContent value="collectors" className="space-y-4">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>نمونه‌گیران موجود</span>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Input
                    placeholder="جستجو نمونه‌گیر..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 search-input"
                  />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="وضعیت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه</SelectItem>
                      <SelectItem value="available">آماده</SelectItem>
                      <SelectItem value="in-progress">مشغول</SelectItem>
                      <SelectItem value="offline">آفلاین</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {collectors
                  .filter(c => filterStatus === "all" || c.status === filterStatus)
                  .filter(c => c.name.includes(searchTerm))
                  .map((collector) => (
                  <div key={collector.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={collector.avatar} />
                        <AvatarFallback className="bg-gray-100">
                          {collector.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <h4 className="font-medium text-gray-900">{collector.name}</h4>
                          <div className={`w-2 h-2 rounded-full ${
                            collector.status === "available" ? "bg-green-500" : 
                            collector.status === "in-progress" ? "bg-blue-500" : "bg-gray-400"
                          }`}></div>
                        </div>
                        <p className="text-sm text-gray-600">{collector.phone}</p>
                        <Badge className={getStatusColor(collector.status)}>
                          {collector.status === "available" ? "آماده" : 
                           collector.status === "in-progress" ? "مشغول" : "آفلاین"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="text-left text-sm">
                        <div className="flex items-center text-gray-600">
                          <Star className="w-4 h-4 text-yellow-500 ml-1" />
                          {collector.rating}
                        </div>
                        <div className="text-xs text-gray-500">
                          {collector.dailyStats.samplesCollected} نمونه امروز
                        </div>
                      </div>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        <Plus className="w-4 h-4 ml-1" />
                        تخصیص ماموریت
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 ml-1" />
                        پروفایل
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Task Assignment */}
        <TabsContent value="assign" className="space-y-4">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle>تخصیص ماموریت جدید</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">انتخاب نمونه‌گیر</label>
                  <Select value={taskForm.collectorId} onValueChange={(value) => setTaskForm({...taskForm, collectorId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="نمونه‌گیر را انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      {collectors.filter(c => c.status === "available").map(collector => (
                        <SelectItem key={collector.id} value={collector.id.toString()}>
                          {collector.name} - {collector.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نام بیمار</label>
                  <Input
                    placeholder="نام بیمار را وارد کنید"
                    value={taskForm.patientName}
                    onChange={(e) => setTaskForm({...taskForm, patientName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نوع آزمایش</label>
                  <Input
                    placeholder="نوع آزمایش"
                    value={taskForm.testType}
                    onChange={(e) => setTaskForm({...taskForm, testType: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">زمان</label>
                  <Input
                    type="time"
                    value={taskForm.scheduledTime}
                    onChange={(e) => setTaskForm({...taskForm, scheduledTime: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">آدرس</label>
                  <Input
                    placeholder="آدرس کامل محل نمونه‌گیری"
                    value={taskForm.location}
                    onChange={(e) => setTaskForm({...taskForm, location: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">یادداشت‌ها</label>
                  <Textarea
                    placeholder="توضیحات اضافی..."
                    value={taskForm.notes}
                    onChange={(e) => setTaskForm({...taskForm, notes: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 space-x-reverse">
                <Button variant="outline" onClick={() => setTaskForm({
                  collectorId: "", patientName: "", testType: "", location: "", scheduledTime: "", notes: ""
                })}>
                  <RotateCcw className="w-4 h-4 ml-1" />
                  پاک کردن
                </Button>
                <Button onClick={handleTaskSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <CheckCircle className="w-4 h-4 ml-1" />
                  تخصیص ماموریت
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Map */}
        <TabsContent value="map" className="space-y-4">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 ml-2" />
                نقشه زنده نمونه‌گیران
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">نقشه تعاملی در اینجا نمایش داده می‌شود</p>
                  <p className="text-sm text-gray-500">موقعیت نمونه‌گیران و مقاصد به صورت زنده</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {collectors.filter(c => c.status === "in-progress").map(collector => (
                  <div key={collector.id} className="flex items-center space-x-3 space-x-reverse p-3 bg-blue-50 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{collector.name}</p>
                      <p className="text-xs text-gray-600">{collector.location.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily Performance */}
        <TabsContent value="performance" className="space-y-4">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>عملکرد روزانه نمونه‌گیران</span>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Select value={filterDate} onValueChange={setFilterDate}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">امروز</SelectItem>
                      <SelectItem value="week">این هفته</SelectItem>
                      <SelectItem value="month">این ماه</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline">
                    <Filter className="w-4 h-4 ml-1" />
                    فیلتر
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-right py-3 px-4 font-medium text-gray-700">نمونه‌گیر</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">ناظر</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">تعداد نمونه</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">نرخ موفقیت</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">میانگین زمان</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">امتیاز</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">ساعات آنلاین</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collectors.map((collector) => (
                      <tr key={collector.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                {collector.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{collector.name}</p>
                              <p className="text-xs text-gray-500">{collector.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{collector.supervisor}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Target className="w-4 h-4 text-blue-500 ml-1" />
                            <span className="font-medium">{collector.dailyStats.samplesCollected}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                            <span className={`font-medium ${
                              collector.dailyStats.successRate >= 90 ? "text-green-600" : 
                              collector.dailyStats.successRate >= 80 ? "text-yellow-600" : "text-red-600"
                            }`}>
                              {collector.dailyStats.successRate}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Timer className="w-4 h-4 text-purple-500 ml-1" />
                            <span className="text-sm">{collector.dailyStats.averageTime} دقیقه</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 ml-1" />
                            <span className="font-medium">{collector.rating}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Zap className="w-4 h-4 text-orange-500 ml-1" />
                            <span className="text-sm">{collector.onlineTime} ساعت</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <Button size="sm" variant="outline" className="p-1">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="p-1">
                              <MessageSquare className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="p-1">
                              <Award className="w-3 h-3" />
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
        </TabsContent>
      </Tabs>


    </div>
  );
}