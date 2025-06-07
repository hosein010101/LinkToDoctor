import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { 
  User, 
  TestTube, 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Minus, 
  Search,
  CheckCircle,
  FileText,
  CreditCard
} from "lucide-react";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface SelectedService {
  id: number;
  name: string;
  code: string;
  price: string;
  category: string;
  quantity: number;
}

export default function NewOrder() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState("patient");
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const [patientData, setPatientData] = useState({
    name: "",
    nationalId: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    address: "",
    emergencyContact: "",
    medicalHistory: ""
  });

  const [orderData, setOrderData] = useState({
    priority: "normal",
    notes: "",
    scheduledDate: "",
    scheduledTimeSlot: "",
    collectionAddress: "",
    paymentMethod: "cash"
  });

  const timeSlots = [
    "8:00 - 9:00",
    "9:00 - 10:00", 
    "10:00 - 11:00",
    "11:00 - 12:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00"
  ];

  const { data: labServices = [] } = useQuery({
    queryKey: ["/api/lab-services"],
  });

  const { data: patients = [] } = useQuery({
    queryKey: ["/api/patients"],
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch("/api/lab-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error("Failed to create order");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "موفقیت",
        description: "سفارش با موفقیت ثبت شد",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/lab-orders"] });
      setPatientData({
        name: "",
        nationalId: "",
        phone: "",
        email: "",
        age: "",
        gender: "",
        address: "",
        emergencyContact: "",
        medicalHistory: ""
      });
      setSelectedServices([]);
      setSelectedDate(undefined);
      setActiveTab("patient");
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "خطا در ثبت سفارش",
        variant: "destructive",
      });
    },
  });

  const filteredServices = (labServices as any[]).filter((service: any) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addService = (service: any) => {
    const existing = selectedServices.find(s => s.id === service.id);
    if (existing) {
      setSelectedServices(prev => 
        prev.map(s => s.id === service.id ? { ...s, quantity: s.quantity + 1 } : s)
      );
    } else {
      setSelectedServices(prev => [...prev, { ...service, quantity: 1 }]);
    }
  };

  const removeService = (serviceId: number) => {
    setSelectedServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const updateQuantity = (serviceId: number, quantity: number) => {
    if (quantity <= 0) {
      removeService(serviceId);
    } else {
      setSelectedServices(prev => 
        prev.map(s => s.id === serviceId ? { ...s, quantity } : s)
      );
    }
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, service) => {
      const price = parseFloat(service.price.replace(/[^\d]/g, ''));
      return total + (price * service.quantity);
    }, 0);
  };

  const handleSubmitOrder = () => {
    if (!patientData.name || !patientData.nationalId || !patientData.phone) {
      toast({
        title: "خطا",
        description: "لطفا اطلاعات ضروری بیمار را کامل کنید",
        variant: "destructive",
      });
      return;
    }

    if (selectedServices.length === 0) {
      toast({
        title: "خطا", 
        description: "لطفا حداقل یک آزمایش انتخاب کنید",
        variant: "destructive",
      });
      return;
    }

    const orderPayload = {
      patient: patientData,
      services: selectedServices,
      orderData: {
        ...orderData,
        scheduledDate: selectedDate?.toISOString(),
        total: calculateTotal()
      }
    };

    createOrderMutation.mutate(orderPayload);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ثبت سفارش جدید</h1>
        <p className="text-gray-600">اطلاعات بیمار و آزمایش‌های مورد نیاز را وارد کنید</p>
      </div>

      <div className="w-full mb-8">
        <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 rounded-2xl p-3 shadow-lg border border-blue-100">
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={() => setActiveTab("patient")}
              className={`
                flex items-center justify-center space-x-2 space-x-reverse px-4 py-4 rounded-xl 
                transition-all duration-300 font-semibold text-sm relative overflow-hidden
                ${activeTab === "patient" 
                  ? "bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100 text-cyan-800 shadow-lg transform scale-105 border-2 border-cyan-200" 
                  : "text-slate-600 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50 hover:text-cyan-700 hover:shadow-md"
                }
              `}
            >
              <User className="w-5 h-5" />
              <span>اطلاعات بیمار</span>
            </button>
            
            <button
              onClick={() => setActiveTab("services")}
              className={`
                flex items-center justify-center space-x-2 space-x-reverse px-4 py-4 rounded-xl 
                transition-all duration-300 font-semibold text-sm relative overflow-hidden
                ${activeTab === "services" 
                  ? "bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 text-emerald-800 shadow-lg transform scale-105 border-2 border-emerald-200" 
                  : "text-slate-600 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-green-50 hover:text-emerald-700 hover:shadow-md"
                }
              `}
            >
              <TestTube className="w-5 h-5" />
              <span>انتخاب آزمایشات</span>
            </button>
            
            <button
              onClick={() => setActiveTab("scheduling")}
              className={`
                flex items-center justify-center space-x-2 space-x-reverse px-4 py-4 rounded-xl 
                transition-all duration-300 font-semibold text-sm relative overflow-hidden
                ${activeTab === "scheduling" 
                  ? "bg-gradient-to-br from-purple-100 via-violet-100 to-indigo-100 text-purple-800 shadow-lg transform scale-105 border-2 border-purple-200" 
                  : "text-slate-600 hover:bg-gradient-to-br hover:from-purple-50 hover:to-violet-50 hover:text-purple-700 hover:shadow-md"
                }
              `}
            >
              <CalendarIcon className="w-5 h-5" />
              <span>زمان‌بندی</span>
            </button>
            
            <button
              onClick={() => setActiveTab("summary")}
              className={`
                flex items-center justify-center space-x-2 space-x-reverse px-4 py-4 rounded-xl 
                transition-all duration-300 font-semibold text-sm relative overflow-hidden
                ${activeTab === "summary" 
                  ? "bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 text-amber-800 shadow-lg transform scale-105 border-2 border-amber-200" 
                  : "text-slate-600 hover:bg-gradient-to-br hover:from-amber-50 hover:to-yellow-50 hover:text-amber-700 hover:shadow-md"
                }
              `}
            >
              <FileText className="w-5 h-5" />
              <span>خلاصه و تأیید</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === "patient" && (
        <div className="space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <User className="w-5 h-5 text-blue-600" />
                <span>اطلاعات بیمار</span>
              </CardTitle>
              <CardDescription>
                اطلاعات شخصی و تماس بیمار را وارد کنید
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">نام و نام خانوادگی *</Label>
                  <Input
                    id="name"
                    value={patientData.name}
                    onChange={(e) => setPatientData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="نام کامل بیمار"
                    className="border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationalId">کد ملی *</Label>
                  <Input
                    id="nationalId"
                    value={patientData.nationalId}
                    onChange={(e) => setPatientData(prev => ({ ...prev, nationalId: e.target.value }))}
                    placeholder="0123456789"
                    className="border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">شماره تماس *</Label>
                  <Input
                    id="phone"
                    value={patientData.phone}
                    onChange={(e) => setPatientData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="09123456789"
                    className="border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <Input
                    id="email"
                    type="email"
                    value={patientData.email}
                    onChange={(e) => setPatientData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="example@email.com"
                    className="border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">سن</Label>
                  <Input
                    id="age"
                    type="number"
                    value={patientData.age}
                    onChange={(e) => setPatientData(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="سن بیمار"
                    className="border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">جنسیت</Label>
                  <Select value={patientData.gender} onValueChange={(value) => setPatientData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder="انتخاب جنسیت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">مرد</SelectItem>
                      <SelectItem value="female">زن</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">آدرس</Label>
                <Textarea
                  id="address"
                  value={patientData.address}
                  onChange={(e) => setPatientData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="آدرس کامل بیمار"
                  className="border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">شماره تماس اضطراری</Label>
                <Input
                  id="emergencyContact"
                  value={patientData.emergencyContact}
                  onChange={(e) => setPatientData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                  placeholder="شماره تماس در مواقع اضطراری"
                  className="border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalHistory">سابقه پزشکی</Label>
                <Textarea
                  id="medicalHistory"
                  value={patientData.medicalHistory}
                  onChange={(e) => setPatientData(prev => ({ ...prev, medicalHistory: e.target.value }))}
                  placeholder="سابقه بیماری، دارو، آلرژی و..."
                  className="border-gray-200"
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => setActiveTab("services")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  مرحله بعد: انتخاب آزمایشات
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "services" && (
        <div className="space-y-6">
          {selectedServices.length > 0 && (
            <Card className="border-green-200 bg-green-50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span>آزمایشات انتخاب شده ({selectedServices.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <span className="font-medium">{service.name}</span>
                        <Badge variant="secondary">{service.code}</Badge>
                      </div>
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(service.id, service.quantity - 1)}
                            disabled={service.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="min-w-[2rem] text-center">{service.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(service.id, service.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <span className="font-medium">{(parseFloat(service.price.replace(/[^\d]/g, '')) * service.quantity).toLocaleString()} تومان</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeService(service.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="text-left pt-3 border-t border-green-200">
                    <span className="text-lg font-bold text-green-800">
                      مجموع: {calculateTotal().toLocaleString()} تومان
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <TestTube className="w-5 h-5 text-blue-600" />
                <span>انتخاب آزمایشات</span>
              </CardTitle>
              <CardDescription>
                آزمایشات مورد نیاز را از لیست زیر انتخاب کنید
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex space-x-4 space-x-reverse">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="جستجو در آزمایشات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 border-gray-200"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 border-gray-200">
                    <SelectValue placeholder="دسته‌بندی" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه دسته‌ها</SelectItem>
                    <SelectItem value="blood">آزمایش خون</SelectItem>
                    <SelectItem value="urine">آزمایش ادرار</SelectItem>
                    <SelectItem value="hormone">هورمون</SelectItem>
                    <SelectItem value="biochemistry">بیوشیمی</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map((service: any) => (
                  <div key={service.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-500">کد: {service.code}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-600">{service.price}</span>
                        <Button
                          onClick={() => addService(service)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4 ml-1" />
                          افزودن
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab("patient")}
                >
                  مرحله قبل
                </Button>
                <Button 
                  onClick={() => setActiveTab("scheduling")}
                  disabled={selectedServices.length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  مرحله بعد: زمان‌بندی
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "scheduling" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
                  <span>انتخاب تاریخ</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 5}
                  className="rounded-md border border-gray-200"
                />
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>تنظیمات نمونه‌گیری</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>ساعت نمونه‌گیری</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={orderData.scheduledTimeSlot === slot ? "default" : "outline"}
                        onClick={() => setOrderData(prev => ({ ...prev, scheduledTimeSlot: slot }))}
                        className="h-11"
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">اولویت</Label>
                  <Select value={orderData.priority} onValueChange={(value) => setOrderData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger className="border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">کم</SelectItem>
                      <SelectItem value="normal">معمولی</SelectItem>
                      <SelectItem value="high">بالا</SelectItem>
                      <SelectItem value="urgent">فوری</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collectionAddress">آدرس نمونه‌گیری</Label>
                  <Textarea
                    id="collectionAddress"
                    value={orderData.collectionAddress}
                    onChange={(e) => setOrderData(prev => ({ ...prev, collectionAddress: e.target.value }))}
                    placeholder="آدرس محل نمونه‌گیری (در صورت تفاوت با آدرس بیمار)"
                    className="border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">یادداشت‌ها</Label>
                  <Textarea
                    id="notes"
                    value={orderData.notes}
                    onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="توضیحات اضافی برای نمونه‌گیر"
                    className="border-gray-200"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => setActiveTab("services")}
            >
              مرحله قبل
            </Button>
            <Button 
              onClick={() => setActiveTab("summary")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              مرحله بعد: خلاصه و تأیید
            </Button>
          </div>
        </div>
      )}

      {activeTab === "summary" && (
        <div className="space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>خلاصه سفارش</span>
              </CardTitle>
              <CardDescription>
                اطلاعات وارد شده را بررسی و تأیید کنید
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center space-x-2 space-x-reverse">
                  <User className="w-4 h-4" />
                  <span>اطلاعات بیمار</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">نام:</span> {patientData.name}</div>
                  <div><span className="font-medium">کد ملی:</span> {patientData.nationalId}</div>
                  <div><span className="font-medium">تلفن:</span> {patientData.phone}</div>
                  <div><span className="font-medium">ایمیل:</span> {patientData.email || "ندارد"}</div>
                  {patientData.age && <div><span className="font-medium">سن:</span> {patientData.age}</div>}
                  {patientData.gender && <div><span className="font-medium">جنسیت:</span> {patientData.gender === 'male' ? 'مرد' : 'زن'}</div>}
                </div>
                {patientData.address && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">آدرس:</span> {patientData.address}
                  </div>
                )}
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center space-x-2 space-x-reverse">
                  <TestTube className="w-4 h-4" />
                  <span>آزمایشات انتخاب شده</span>
                </h3>
                <div className="space-y-2">
                  {selectedServices.map((service) => (
                    <div key={service.id} className="flex justify-between items-center text-sm">
                      <span>{service.name} ({service.code})</span>
                      <span>
                        {service.quantity} × {service.price} = {(parseFloat(service.price.replace(/[^\d]/g, '')) * service.quantity).toLocaleString()} تومان
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>مجموع:</span>
                    <span className="text-green-600">{calculateTotal().toLocaleString()} تومان</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center space-x-2 space-x-reverse">
                  <CalendarIcon className="w-4 h-4" />
                  <span>زمان‌بندی</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">تاریخ:</span> {selectedDate ? format(selectedDate, "yyyy/MM/dd") : "انتخاب نشده"}</div>
                  <div><span className="font-medium">ساعت:</span> {orderData.scheduledTimeSlot || "انتخاب نشده"}</div>
                  <div><span className="font-medium">اولویت:</span> {orderData.priority}</div>
                </div>
                {orderData.notes && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">یادداشت:</span> {orderData.notes}
                  </div>
                )}
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center space-x-2 space-x-reverse">
                  <CreditCard className="w-4 h-4" />
                  <span>روش پرداخت</span>
                </h3>
                <Select value={orderData.paymentMethod} onValueChange={(value) => setOrderData(prev => ({ ...prev, paymentMethod: value }))}>
                  <SelectTrigger className="border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">نقد در محل</SelectItem>
                    <SelectItem value="card">کارت در محل</SelectItem>
                    <SelectItem value="online">پرداخت آنلاین</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab("scheduling")}
                >
                  مرحله قبل
                </Button>
                <Button 
                  onClick={handleSubmitOrder}
                  disabled={createOrderMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {createOrderMutation.isPending ? "در حال ثبت..." : "تأیید و ثبت سفارش"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}