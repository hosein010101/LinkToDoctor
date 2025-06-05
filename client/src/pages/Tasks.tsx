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
  CheckSquare, Plus, Filter, Search, Calendar, Clock, Users, 
  MoreHorizontal, Flag, MessageSquare, Paperclip, Eye, Edit,
  Trash2, User, Target, AlertCircle, CheckCircle, XCircle,
  ArrowRight, ArrowDown, ArrowUp, Timer
} from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignee: {
    name: string;
    avatar?: string;
  };
  dueDate: string;
  tags: string[];
  comments: number;
  attachments: number;
  progress: number;
  department: string;
  category: string;
}

export default function Tasks() {
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const tasks: Task[] = [
    {
      id: 1,
      title: "بهبود سیستم نمونه‌گیری",
      description: "اصلاح و بهینه‌سازی فرآیند نمونه‌گیری خون برای کاهش زمان انتظار",
      status: "in_progress",
      priority: "high",
      assignee: { name: "فاطمه احمدی" },
      dueDate: "1403/06/15",
      tags: ["نمونه‌گیری", "بهبود"],
      comments: 3,
      attachments: 2,
      progress: 65,
      department: "عملیات",
      category: "تکنیکال"
    },
    {
      id: 2,
      title: "آموزش نمونه‌گیران جدید",
      description: "برگزاری دوره آموزشی ویژه نمونه‌گیران تازه استخدام",
      status: "todo",
      priority: "medium",
      assignee: { name: "علی محمدی" },
      dueDate: "1403/06/20",
      tags: ["آموزش", "منابع انسانی"],
      comments: 1,
      attachments: 0,
      progress: 0,
      department: "آموزش",
      category: "منابع انسانی"
    },
    {
      id: 3,
      title: "گزارش عملکرد ماهانه",
      description: "تهیه گزارش جامع عملکرد آزمایشگاه برای ماه گذشته",
      status: "review",
      priority: "medium",
      assignee: { name: "مریم حسینی" },
      dueDate: "1403/06/10",
      tags: ["گزارش", "آمار"],
      comments: 5,
      attachments: 3,
      progress: 85,
      department: "مدیریت",
      category: "گزارش‌گیری"
    },
    {
      id: 4,
      title: "بروزرسانی تجهیزات",
      description: "بررسی و بروزرسانی تجهیزات آزمایشگاه",
      status: "done",
      priority: "low",
      assignee: { name: "حسن کاظمی" },
      dueDate: "1403/05/30",
      tags: ["تجهیزات", "نگهداری"],
      comments: 2,
      attachments: 1,
      progress: 100,
      department: "فنی",
      category: "تجهیزات"
    },
    {
      id: 5,
      title: "بررسی رضایت مشتریان",
      description: "انجام نظرسنجی از مشتریان و تحلیل نتایج",
      status: "in_progress",
      priority: "high",
      assignee: { name: "زهرا نوری" },
      dueDate: "1403/06/25",
      tags: ["مشتری", "نظرسنجی"],
      comments: 4,
      attachments: 2,
      progress: 40,
      department: "CRM",
      category: "تحقیقات"
    },
    {
      id: 6,
      title: "بهینه‌سازی مسیر نمونه‌گیری",
      description: "تحلیل و بهینه‌سازی مسیرهای نمونه‌گیری در شهر",
      status: "todo",
      priority: "urgent",
      assignee: { name: "رضا صادقی" },
      dueDate: "1403/06/08",
      tags: ["لجستیک", "بهینه‌سازی"],
      comments: 0,
      attachments: 1,
      progress: 0,
      department: "عملیات",
      category: "لجستیک"
    },
    {
      id: 7,
      title: "پیاده‌سازی سیستم هوشمند",
      description: "توسعه سیستم هوشمند برای مدیریت نوبت‌دهی",
      status: "in_progress",
      priority: "high",
      assignee: { name: "سارا کریمی" },
      dueDate: "1403/07/01",
      tags: ["IT", "هوشمند‌سازی"],
      comments: 8,
      attachments: 5,
      progress: 30,
      department: "IT",
      category: "توسعه"
    },
    {
      id: 8,
      title: "بازبینی پروتکل‌های بهداشتی",
      description: "بررسی و بروزرسانی پروتکل‌های بهداشت و ایمنی",
      status: "review",
      priority: "medium",
      assignee: { name: "دکتر احمدی" },
      dueDate: "1403/06/18",
      tags: ["بهداشت", "ایمنی"],
      comments: 3,
      attachments: 4,
      progress: 90,
      department: "کیفیت",
      category: "ایمنی"
    }
  ];

  const getStatusBadge = (status: string) => {
    const configs = {
      todo: { label: "انجام نشده", color: "bg-gray-100 text-gray-800" },
      in_progress: { label: "در حال انجام", color: "bg-blue-100 text-blue-800" },
      review: { label: "بررسی", color: "bg-orange-100 text-orange-800" },
      done: { label: "تکمیل شده", color: "bg-green-100 text-green-800" }
    } as const;
    
    const config = configs[status as keyof typeof configs];
    return <Badge className={`${config.color} hover:${config.color}`}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const configs = {
      low: { label: "کم", color: "bg-gray-100 text-gray-800", icon: ArrowDown },
      medium: { label: "متوسط", color: "bg-yellow-100 text-yellow-800", icon: ArrowRight },
      high: { label: "بالا", color: "bg-orange-100 text-orange-800", icon: ArrowUp },
      urgent: { label: "فوری", color: "bg-red-100 text-red-800", icon: Flag }
    } as const;
    
    const config = configs[priority as keyof typeof configs];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} hover:${config.color} flex items-center space-x-1 space-x-reverse`}>
        <IconComponent className="w-3 h-3" />
        <span>{config.label}</span>
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      todo: <XCircle className="w-4 h-4 text-gray-500" />,
      in_progress: <Timer className="w-4 h-4 text-blue-500" />,
      review: <AlertCircle className="w-4 h-4 text-orange-500" />,
      done: <CheckCircle className="w-4 h-4 text-green-500" />
    };
    return icons[status as keyof typeof icons];
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const statusColumns = [
    { id: "todo", title: "انجام نشده", color: "bg-gray-50" },
    { id: "in_progress", title: "در حال انجام", color: "bg-blue-50" },
    { id: "review", title: "بررسی", color: "bg-orange-50" },
    { id: "done", title: "تکمیل شده", color: "bg-green-50" }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مدیریت وظایف</h1>
          <p className="text-gray-600 mt-1">مدیریت و پیگیری وظایف تیم</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button variant="outline">
            <Filter className="w-4 h-4 ml-2" />
            فیلتر پیشرفته
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 ml-2" />
            وظیفه جدید
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="card-professional">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="جستجو در وظایف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input pr-10"
                />
              </div>
            </div>
            <div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="todo">انجام نشده</SelectItem>
                  <SelectItem value="in_progress">در حال انجام</SelectItem>
                  <SelectItem value="review">بررسی</SelectItem>
                  <SelectItem value="done">تکمیل شده</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="اولویت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه اولویت‌ها</SelectItem>
                  <SelectItem value="low">کم</SelectItem>
                  <SelectItem value="medium">متوسط</SelectItem>
                  <SelectItem value="high">بالا</SelectItem>
                  <SelectItem value="urgent">فوری</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button 
                variant={viewMode === "kanban" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("kanban")}
              >
                کانبان
              </Button>
              <Button 
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                جدول
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">کل وظایف</p>
                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
              </div>
              <CheckSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">در حال انجام</p>
                <p className="text-2xl font-bold text-gray-900">{getTasksByStatus("in_progress").length}</p>
              </div>
              <Timer className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">تکمیل شده</p>
                <p className="text-2xl font-bold text-gray-900">{getTasksByStatus("done").length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">نرخ تکمیل</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((getTasksByStatus("done").length / tasks.length) * 100)}%
                </p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {statusColumns.map(column => (
            <div key={column.id} className="space-y-4">
              <div className={`p-4 rounded-lg ${column.color}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  <Badge variant="secondary">{getTasksByStatus(column.id).length}</Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                {getTasksByStatus(column.id).map(task => (
                  <Card key={task.id} className="card-professional hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-gray-900 text-sm leading-relaxed">{task.title}</h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 ml-2" />
                                مشاهده
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 ml-2" />
                                ویرایش
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 ml-2" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed">{task.description}</p>

                        <div className="flex items-center justify-between">
                          {getPriorityBadge(task.priority)}
                          <span className="text-xs text-gray-500">{task.dueDate}</span>
                        </div>

                        {task.status === "in_progress" && (
                          <div>
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>پیشرفت</span>
                              <span>{task.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all"
                                style={{width: `${task.progress}%`}}
                              ></div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={task.assignee.avatar} />
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                {task.assignee.name.split(' ')[0][0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-600">{task.assignee.name}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-500">
                            {task.comments > 0 && (
                              <div className="flex items-center space-x-1 space-x-reverse">
                                <MessageSquare className="w-3 h-3" />
                                <span>{task.comments}</span>
                              </div>
                            )}
                            {task.attachments > 0 && (
                              <div className="flex items-center space-x-1 space-x-reverse">
                                <Paperclip className="w-3 h-3" />
                                <span>{task.attachments}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {task.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {task.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{task.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card className="card-professional">
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-3 px-4 font-medium text-gray-900">وظیفه</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">وضعیت</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">اولویت</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">مسئول</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">مهلت</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">پیشرفت</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map(task => (
                    <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{task.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          <div className="flex items-center space-x-2 space-x-reverse mt-2">
                            {task.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {getStatusIcon(task.status)}
                          {getStatusBadge(task.status)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getPriorityBadge(task.priority)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={task.assignee.avatar} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {task.assignee.name.split(' ')[0][0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-900">{task.assignee.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{task.dueDate}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-20">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{width: `${task.progress}%`}}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{task.progress}%</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <MessageSquare className="w-4 h-4 ml-2" />
                                نظرات ({task.comments})
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Paperclip className="w-4 h-4 ml-2" />
                                پیوست‌ها ({task.attachments})
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 ml-2" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
    </div>
  );
}