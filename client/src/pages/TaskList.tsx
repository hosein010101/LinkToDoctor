import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { 
  Plus,
  Calendar,
  User,
  Edit3,
  Trash2,
  Clock,
  AlertTriangle,
  CheckCircle,
  LayoutGrid,
  List,
  Flag,
  Search,
  TrendingUp,
  ArrowDown
} from "lucide-react";

interface Task {
  id: number;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TaskList() {
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");
  
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    assignee: "",
    deadline: ""
  });

  // Sample tasks data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "بررسی گزارش‌های ماهانه آزمایشگاه",
      description: "تحلیل و بررسی گزارش‌های عملکرد ماه گذشته",
      status: "pending",
      priority: "high",
      assignee: "دکتر علی احمدی",
      deadline: "۱۴۰۳/۰۹/۱۵",
      createdAt: "۱۴۰۳/۰۹/۰۱",
      updatedAt: "۱۴۰۳/۰۹/۰۱"
    },
    {
      id: 2,
      title: "آپدیت سیستم مدیریت کارکنان",
      description: "بروزرسانی نرم‌افزار HR و اضافه کردن ویژگی‌های جدید",
      status: "in_progress",
      priority: "medium",
      assignee: "رضا موسوی",
      deadline: "۱۴۰۳/۰۹/۲۰",
      createdAt: "۱۴۰۳/۰۸/۲۵",
      updatedAt: "۱۴۰۳/۰۹/۰۵"
    },
    {
      id: 3,
      title: "تهیه برنامه آموزشی کارکنان جدید",
      description: "طراحی و تهیه محتوای آموزشی برای ورود کارکنان تازه استخدام",
      status: "done",
      priority: "low",
      assignee: "حسین رضایی",
      deadline: "۱۴۰۳/۰۹/۱۰",
      createdAt: "۱۴۰۳/۰۸/۲۰",
      updatedAt: "۱۴۰۳/۰۹/۰۸"
    },
    {
      id: 4,
      title: "خرید تجهیزات جدید آزمایشگاه",
      description: "بررسی و خرید دستگاه‌های مورد نیاز بخش آزمایشگاه",
      status: "pending",
      priority: "urgent",
      assignee: "مریم کریمی",
      deadline: "۱۴۰۳/۰۹/۱۲",
      createdAt: "۱۴۰۳/۰۹/۰۳",
      updatedAt: "۱۴۰۳/۰۹/۰۳"
    },
    {
      id: 5,
      title: "بازنگری پروتکل‌های ایمنی",
      description: "به‌روزرسانی و بهبود پروتکل‌های ایمنی در محیط کار",
      status: "in_progress",
      priority: "high",
      assignee: "فاطمه محمدی",
      deadline: "۱۴۰۳/۰۹/۱۸",
      createdAt: "۱۴۰۳/۰۸/۳۰",
      updatedAt: "۱۴۰۳/۰۹/۰۶"
    }
  ]);

  const getPriorityBg = (priority: Task["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-amber-50 border border-amber-200";
      case "medium":
        return "bg-emerald-50 border border-emerald-200";
      case "high":
        return "bg-blue-50 border border-blue-200";
      case "urgent":
        return "bg-purple-50 border border-purple-200";
      default:
        return "bg-gray-50 border border-gray-200";
    }
  };

  const getPriorityIcon = (priority: Task["priority"]) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="w-3 h-3" style={{color: '#7C3AED'}} />;
      case "high":
        return <TrendingUp className="w-3 h-3" style={{color: '#2563EB'}} />;
      case "medium":
        return <Clock className="w-3 h-3" style={{color: '#10B981'}} />;
      case "low":
        return <ArrowDown className="w-3 h-3" style={{color: '#F59E0B'}} />;
      default:
        return <Clock className="w-3 h-3" style={{color: '#6B7280'}} />;
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "bg-slate-50 border-slate-200";
      case "in_progress":
        return "bg-indigo-50 border-indigo-200";
      case "done":
        return "bg-emerald-50 border-emerald-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusTitle = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "در انتظار";
      case "in_progress":
        return "در حال انجام";
      case "done":
        return "انجام شده";
      default:
        return status;
    }
  };

  const handleAddTask = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveTask = () => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: Math.max(...tasks.map(t => t.id)) + 1,
        title: newTask.title,
        description: newTask.description,
        status: "pending",
        priority: newTask.priority,
        assignee: newTask.assignee,
        deadline: newTask.deadline,
        createdAt: new Date().toLocaleDateString('fa-IR'),
        updatedAt: new Date().toLocaleDateString('fa-IR')
      };
      
      setTasks([...tasks, task]);
      setIsAddModalOpen(false);
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        assignee: "",
        deadline: ""
      });
    }
  };

  const handleCancelAdd = () => {
    setIsAddModalOpen(false);
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      assignee: "",
      deadline: ""
    });
  };

  const handleTaskStatusChange = (taskId: number, newStatus: Task["status"]) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, updatedAt: new Date().toLocaleDateString('fa-IR') }
        : task
    ));
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.includes(searchTerm) || 
                         task.description?.includes(searchTerm) ||
                         task.assignee.includes(searchTerm);
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchesAssignee = filterAssignee === "all" || task.assignee === filterAssignee;
    
    return matchesSearch && matchesPriority && matchesAssignee;
  });

  const tasksByStatus = {
    pending: filteredTasks.filter(task => task.status === "pending"),
    in_progress: filteredTasks.filter(task => task.status === "in_progress"),
    done: filteredTasks.filter(task => task.status === "done")
  };

  const assignees = Array.from(new Set(tasks.map(task => task.assignee)));

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مدیریت وظایف</h1>
          <p className="text-gray-600 mt-1">مدیریت و پیگیری وظایف تیم</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <Button
              variant={viewMode === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className={`flex items-center ${viewMode === "kanban" ? "bg-white shadow-sm border-0 text-indigo-600" : "text-slate-600 hover:text-indigo-600"}`}
            >
              <LayoutGrid className="w-4 h-4 ml-2" />
              کانبان
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className={`flex items-center ${viewMode === "table" ? "bg-white shadow-sm border-0 text-indigo-600" : "text-slate-600 hover:text-indigo-600"}`}
            >
              <List className="w-4 h-4 ml-2" />
              جدول
            </Button>
          </div>
          <Button onClick={handleAddTask} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg border-0">
            <Plus className="w-4 h-4 ml-2" />
            وظیفه جدید
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="جستجو در وظایف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="فیلتر اولویت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه اولویت‌ها</SelectItem>
                <SelectItem value="urgent">فوری</SelectItem>
                <SelectItem value="high">بالا</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="low">پایین</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterAssignee} onValueChange={setFilterAssignee}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="فیلتر مسئول" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه اعضا</SelectItem>
                {assignees.map((assignee) => (
                  <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {(["pending", "in_progress", "done"] as const).map((status) => (
            <div key={status} className={`${getStatusColor(status)} border-2 rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{getStatusTitle(status)}</h3>
                <Badge variant="secondary">{tasksByStatus[status].length}</Badge>
              </div>
              
              <div className="space-y-3">
                {tasksByStatus[status].map((task) => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-gray-900 text-sm leading-relaxed">{task.title}</h4>
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <button className="p-1 text-gray-700 hover:bg-gray-100 rounded">
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button 
                              className="p-1 text-gray-700 hover:bg-gray-100 rounded"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        
                        {task.description && (
                          <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <div className={`${getPriorityBg(task.priority)} text-xs px-2 py-1 rounded-full inline-flex items-center space-x-1 space-x-reverse`}>
                              {getPriorityIcon(task.priority)}
                              <span style={{color: '#000000', fontWeight: '600'}}>{task.priority === "urgent" ? "فوری" : task.priority === "high" ? "بالا" : task.priority === "medium" ? "متوسط" : "پایین"}</span>
                            </div>
                          </div>
                          
                          {task.deadline && (
                            <div className="flex items-center text-gray-500">
                              <Calendar className="w-3 h-3 ml-1" />
                              <span>{task.deadline}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-600 text-xs">
                            <User className="w-3 h-3 ml-1" />
                            <span>{task.assignee}</span>
                          </div>
                          
                          {status !== "done" && (
                            <div className="flex space-x-1 space-x-reverse">
                              {status === "pending" && (
                                <button
                                  className="text-xs px-2 py-1 h-6 bg-white border border-gray-300 rounded text-gray-900 hover:bg-gray-50 font-medium"
                                  onClick={() => handleTaskStatusChange(task.id, "in_progress")}
                                >
                                  شروع
                                </button>
                              )}
                              {status === "in_progress" && (
                                <button
                                  className="text-xs px-2 py-1 h-6 bg-white border border-gray-300 rounded text-gray-900 hover:bg-gray-50 font-medium flex items-center"
                                  onClick={() => handleTaskStatusChange(task.id, "done")}
                                >
                                  <CheckCircle className="w-3 h-3 ml-1" />
                                  تمام
                                </button>
                              )}
                            </div>
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
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-right p-4 font-semibold text-gray-900">عنوان</th>
                    <th className="text-right p-4 font-semibold text-gray-900">مسئول</th>
                    <th className="text-right p-4 font-semibold text-gray-900">اولویت</th>
                    <th className="text-right p-4 font-semibold text-gray-900">وضعیت</th>
                    <th className="text-right p-4 font-semibold text-gray-900">موعد</th>
                    <th className="text-right p-4 font-semibold text-gray-900">اقدامات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">{task.title}</div>
                          {task.description && (
                            <div className="text-sm text-gray-600 mt-1 line-clamp-1">{task.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{task.assignee}</td>
                      <td className="p-4">
                        <div className={`${getPriorityBg(task.priority)} text-xs px-2 py-1 rounded-full inline-flex items-center space-x-1 space-x-reverse`}>
                          {getPriorityIcon(task.priority)}
                          <span style={{color: '#000000', fontWeight: '600'}}>{task.priority === "urgent" ? "فوری" : task.priority === "high" ? "بالا" : task.priority === "medium" ? "متوسط" : "پایین"}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div 
                          className={`text-xs px-2 py-1 rounded-full inline-flex items-center ${
                            task.status === "pending" ? "bg-yellow-100 border border-yellow-200" :
                            task.status === "in_progress" ? "bg-blue-100 border border-blue-200" :
                            "bg-green-100 border border-green-200"
                          }`}
                        >
                          <span style={{color: '#1f2937', fontWeight: '600'}}>{getStatusTitle(task.status)}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{task.deadline || "-"}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button className="p-2 text-gray-700 hover:bg-gray-100 rounded">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCancelAdd}
        title="افزودن وظیفه جدید"
        size="lg"
      >
        <div className="p-6" dir="rtl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">عنوان وظیفه *</label>
              <Input
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="عنوان وظیفه را وارد کنید"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md resize-none h-20"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="توضیحات اختیاری..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اولویت</label>
                <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value as Task["priority"] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">پایین</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="high">بالا</SelectItem>
                    <SelectItem value="urgent">فوری</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">مسئول</label>
                <Input
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  placeholder="نام مسئول"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">موعد انجام</label>
              <Input
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                placeholder="۱۴۰۳/۰۹/۱۵"
              />
            </div>
            
            <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t">
              <Button variant="outline" onClick={handleCancelAdd}>
                انصراف
              </Button>
              <Button 
                onClick={handleSaveTask}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!newTask.title.trim()}
              >
                ایجاد وظیفه
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}