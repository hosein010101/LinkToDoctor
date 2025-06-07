import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  User, 
  TestTube, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Minus, 
  Search,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
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
  
  const [patientData, setPatientData] = useState({
    name: "",
    nationalId: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    address: "",
    notes: ""
  });

  const [orderData, setOrderData] = useState({
    priority: "normal",
    scheduledTimeSlot: "",
    collectionAddress: "",
    specialInstructions: "",
    paymentMethod: "cash"
  });

  // Fetch lab services
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/lab-services"]
  });

  // Fetch existing patients for search
  const { data: patients = [] } = useQuery({
    queryKey: ["/api/patients"]
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch("/api/lab-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });
      if (!response.ok) throw new Error("Failed to create order");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "سفارش با موفقیت ثبت شد",
        description: "سفارش جدید در سیستم ثبت شده و برای پردازش آماده است",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/lab-orders"] });
      resetForm();
    },
    onError: () => {
      toast({
        title: "خطا در ثبت سفارش",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setPatientData({
      name: "",
      nationalId: "",
      phone: "",
      email: "",
      age: "",
      gender: "",
      address: "",
      notes: ""
    });
    setOrderData({
      priority: "normal",
      scheduledTimeSlot: "",
      collectionAddress: "",
      specialInstructions: "",
      paymentMethod: "cash"
    });
    setSelectedServices([]);
    setSelectedDate(undefined);
    setActiveTab("patient");
  };

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

  const updateServiceQuantity = (serviceId: number, change: number) => {
    setSelectedServices(prev => 
      prev.map(s => {
        if (s.id === serviceId) {
          const newQuantity = Math.max(1, s.quantity + change);
          return { ...s, quantity: newQuantity };
        }
        return s;
      })
    );
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, service) => {
      return total + (parseFloat(service.price.replace(/[^\d]/g, '')) * service.quantity);
    }, 0);
  };

  const filteredServices = Array.isArray(services) ? services.filter((service: any) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleSubmit = () => {
    if (!patientData.name || !patientData.nationalId || !patientData.phone) {
      toast({
        title: "اطلاعات ناقص",
        description: "لطفاً اطلاعات ضروری بیمار را تکمیل کنید",
        variant: "destructive"
      });
      setActiveTab("patient");
      return;
    }

    if (selectedServices.length === 0) {
      toast({
        title: "آزمایش انتخاب نشده",
        description: "لطفاً حداقل یک آزمایش انتخاب کنید",
        variant: "destructive"
      });
      setActiveTab("services");
      return;
    }

    if (!selectedDate || !orderData.scheduledTimeSlot) {
      toast({
        title: "زمان نمونه‌گیری مشخص نشده",
        description: "لطفاً تاریخ و ساعت نمونه‌گیری را انتخاب کنید",
        variant: "destructive"
      });
      setActiveTab("scheduling");
      return;
    }

    const orderPayload = {
      patient: patientData,
      services: selectedServices,
      scheduledDate: selectedDate,
      scheduledTimeSlot: orderData.scheduledTimeSlot,
      collectionAddress: orderData.collectionAddress,
      priority: orderData.priority,
      notes: orderData.specialInstructions,
      totalAmount: calculateTotal().toLocaleString(),
      paymentMethod: orderData.paymentMethod
    };

    createOrderMutation.mutate(orderPayload);
  };

  const timeSlots = [
    "08:00 - 10:00",
    "10:00 - 12:00", 
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
    "18:00 - 20:00"
  ];

  const categories = Array.isArray(services) ? Array.from(new Set(services.map((s: any) => s.category))) : [];

  return (
    <div className="container mx-auto p-6 max-w-6xl" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ثبت سفارش جدید</h1>
        <p className="text-gray-600">اطلاعات بیمار و آزمایش‌های مورد نیاز را وارد کنید</p>
      </div>

      <Tabs defaultValue="patient" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <TabsTrigger value="patient" className="flex items-center space-x-2 space-x-reverse bg-transparent data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 data-[state=active]:border-0 rounded-lg transition-all duration-200">
            <User className="w-4 h-4" />
            <span>اطلاعات بیمار</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center space-x-2 space-x-reverse bg-transparent data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 data-[state=active]:border-0 rounded-lg transition-all duration-200">
            <TestTube className="w-4 h-4" />
            <span>انتخاب آزمایشات</span>
          </TabsTrigger>
          <TabsTrigger value="scheduling" className="flex items-center space-x-2 space-x-reverse bg-transparent data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 data-[state=active]:border-0 rounded-lg transition-all duration-200">
            <CalendarIcon className="w-4 h-4" />
            <span>زمان‌بندی</span>
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center space-x-2 space-x-reverse bg-transparent data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 data-[state=active]:border-0 rounded-lg transition-all duration-200">
            <FileText className="w-4 h-4" />
            <span>خلاصه و تأیید</span>
          </TabsTrigger>
        </TabsList>

        {/* Patient Information Tab */}
        <TabsContent value="patient" className="space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <User className="w-5 h-5 text-blue-600" />
                <span>اطلاعات بیمار</span>
              </CardTitle>
              <CardDescription>
                اطلاعات شخصی بیمار را وارد کنید
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
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nationalId">کد ملی *</Label>
                  <Input
                    id="nationalId"
                    value={patientData.nationalId}
                    onChange={(e) => setPatientData(prev => ({ ...prev, nationalId: e.target.value }))}
                    placeholder="کد ملی ۱۰ رقمی"
                    className="h-11"
                    maxLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">شماره تماس *</Label>
                  <Input
                    id="phone"
                    value={patientData.phone}
                    onChange={(e) => setPatientData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="09xxxxxxxxx"
                    className="h-11"
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
                    className="h-11"
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
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">جنسیت</Label>
                  <Select value={patientData.gender} onValueChange={(value) => setPatientData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger className="h-11">
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
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">یادداشت‌های پزشکی</Label>
                <Textarea
                  id="notes"
                  value={patientData.notes}
                  onChange={(e) => setPatientData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="اطلاعات اضافی، آلرژی‌ها، داروهای مصرفی و غیره"
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setActiveTab("services")} className="bg-blue-600 hover:bg-blue-700">
                  مرحله بعد: انتخاب آزمایشات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Selection Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Services List */}
            <div className="lg:col-span-2">
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <TestTube className="w-5 h-5 text-blue-600" />
                    <span>لیست آزمایشات</span>
                  </CardTitle>
                  <div className="flex space-x-4 space-x-reverse">
                    <div className="relative flex-1">
                      <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="جستجوی آزمایش..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10 h-11"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {servicesLoading ? (
                    <div className="text-center py-8">در حال بارگذاری...</div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {categories.map(category => (
                        <div key={category}>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2 pr-2">{category}</h4>
                          {filteredServices
                            .filter((service: any) => service.category === category)
                            .map((service: any) => (
                              <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                <div className="flex-1">
                                  <div className="font-medium">{service.name}</div>
                                  <div className="text-sm text-gray-500">کد: {service.code}</div>
                                  <div className="text-sm font-semibold text-green-600">{service.price}</div>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => addService(service)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Selected Services */}
            <div>
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-blue-600">آزمایشات انتخاب شده</CardTitle>
                  <CardDescription>
                    {selectedServices.length} آزمایش انتخاب شده
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedServices.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      هیچ آزمایشی انتخاب نشده
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedServices.map((service) => (
                        <div key={service.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-sm">{service.name}</div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeService(service.id)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">{service.code}</div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateServiceQuantity(service.id, -1)}
                                disabled={service.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm font-medium">{service.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateServiceQuantity(service.id, 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-green-600 mt-1">
                            {(parseFloat(service.price.replace(/[^\d]/g, '')) * service.quantity).toLocaleString()} تومان
                          </div>
                        </div>
                      ))}
                      
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center font-bold">
                          <span>مجموع:</span>
                          <span className="text-green-600">{calculateTotal().toLocaleString()} تومان</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={() => setActiveTab("scheduling")} 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={selectedServices.length === 0}
                >
                  مرحله بعد: زمان‌بندی
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Scheduling Tab */}
        <TabsContent value="scheduling" className="space-y-6">
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
                  className="rounded-md border"
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
                  <Label>اولویت</Label>
                  <Select value={orderData.priority} onValueChange={(value) => setOrderData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">عادی</SelectItem>
                      <SelectItem value="normal">متوسط</SelectItem>
                      <SelectItem value="high">مهم</SelectItem>
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
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialInstructions">دستورالعمل‌های ویژه</Label>
                  <Textarea
                    id="specialInstructions"
                    value={orderData.specialInstructions}
                    onChange={(e) => setOrderData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                    placeholder="دستورالعمل‌های خاص برای نمونه‌گیری"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setActiveTab("summary")} className="bg-blue-600 hover:bg-blue-700">
                    مرحله بعد: خلاصه
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <FileText className="w-5 h-5" />
                <span>خلاصه سفارش</span>
              </CardTitle>
              <CardDescription>
                اطلاعات وارد شده را بررسی و تأیید کنید
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Patient Summary */}
              <div className="p-4 border rounded-lg">
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

              {/* Services Summary */}
              <div className="p-4 border rounded-lg">
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

              {/* Scheduling Summary */}
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center space-x-2 space-x-reverse">
                  <CalendarIcon className="w-4 h-4" />
                  <span>زمان‌بندی</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">تاریخ:</span> {selectedDate ? format(selectedDate, 'yyyy/MM/dd') : "انتخاب نشده"}</div>
                  <div><span className="font-medium">ساعت:</span> {orderData.scheduledTimeSlot || "انتخاب نشده"}</div>
                  <div><span className="font-medium">اولویت:</span> {orderData.priority}</div>
                </div>
                {orderData.collectionAddress && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">آدرس نمونه‌گیری:</span> {orderData.collectionAddress}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center space-x-2 space-x-reverse">
                  <CreditCard className="w-4 h-4" />
                  <span>روش پرداخت</span>
                </h3>
                <Select value={orderData.paymentMethod} onValueChange={(value) => setOrderData(prev => ({ ...prev, paymentMethod: value }))}>
                  <SelectTrigger className="h-11 max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">نقدی</SelectItem>
                    <SelectItem value="card">کارتی</SelectItem>
                    <SelectItem value="online">آنلاین</SelectItem>
                    <SelectItem value="insurance">بیمه</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("scheduling")}
                >
                  بازگشت به مرحله قبل
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={createOrderMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {createOrderMutation.isPending ? "در حال ثبت..." : "تأیید و ثبت سفارش"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}