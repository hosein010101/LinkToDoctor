import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { 
  User, 
  Calendar, 
  MapPin, 
  TestTube, 
  Plus, 
  Save, 
  X, 
  Check,
  Clock,
  CreditCard,
  FileText,
  Users,
  Building2
} from "lucide-react";

const newOrderSchema = z.object({
  patient: z.object({
    name: z.string().min(2, "نام باید حداقل 2 کاراکتر باشد"),
    nationalId: z.string().min(10, "کد ملی باید 10 رقم باشد").max(10, "کد ملی باید 10 رقم باشد"),
    phone: z.string().min(11, "شماره تلفن نامعتبر است"),
    age: z.number().min(1).max(120),
    address: z.string().min(10, "آدرس باید حداقل 10 کاراکتر باشد"),
  }),
  order: z.object({
    scheduledDate: z.string().min(1, "تاریخ نمونه‌گیری الزامی است"),
    scheduledTimeSlot: z.string().min(1, "زمان نمونه‌گیری الزامی است"),
    collectionAddress: z.string().min(10, "آدرس نمونه‌گیری الزامی است"),
    priority: z.string().default("normal"),
    notes: z.string().optional(),
    totalAmount: z.number().min(0),
  }),
  selectedServices: z.array(z.number()).min(1, "حداقل یک آزمایش انتخاب کنید"),
});

type NewOrderForm = z.infer<typeof newOrderSchema>;

interface LabService {
  id: number;
  name: string;
  code: string;
  category: string;
  price: string;
  sampleType: string;
}

export default function NewOrder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  const { data: labServices, isLoading: servicesLoading } = useQuery<LabService[]>({
    queryKey: ["/api/lab-services"],
  });

  const form = useForm<NewOrderForm>({
    resolver: zodResolver(newOrderSchema),
    defaultValues: {
      patient: {
        name: "",
        nationalId: "",
        phone: "",
        age: 0,
        address: "",
      },
      order: {
        scheduledDate: "",
        scheduledTimeSlot: "",
        collectionAddress: "",
        priority: "normal",
        notes: "",
        totalAmount: 0,
      },
      selectedServices: [],
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: NewOrderForm) => {
      const services = selectedServices.map(serviceId => {
        const service = labServices?.find(s => s.id === serviceId);
        return {
          serviceId,
          quantity: 1,
          price: parseFloat(service?.price || "0"),
        };
      });

      const totalAmount = services.reduce((sum, service) => sum + service.price, 0);

      const response = await apiRequest("POST", "/api/lab-orders", {
        patient: data.patient,
        order: {
          ...data.order,
          totalAmount,
        },
        services,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lab-orders"] });
      toast({
        title: "موفقیت",
        description: "سفارش با موفقیت ثبت شد",
      });
      setLocation("/orders");
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "خطا در ثبت سفارش",
        variant: "destructive",
      });
    },
  });

  const handleServiceToggle = (serviceId: number, checked: boolean) => {
    if (checked) {
      setSelectedServices([...selectedServices, serviceId]);
    } else {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    }
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = labServices?.find(s => s.id === serviceId);
      return total + parseFloat(service?.price || "0");
    }, 0);
  };

  const onSubmit = (data: NewOrderForm) => {
    const formData = {
      ...data,
      selectedServices,
      order: {
        ...data.order,
        totalAmount: calculateTotal(),
      },
    };
    createOrderMutation.mutate(formData);
  };

  const timeSlots = [
    "8:00 - 10:00",
    "10:00 - 12:00", 
    "14:00 - 16:00",
    "16:00 - 18:00",
  ];

  const groupedServices = labServices?.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, LabService[]>);

  if (servicesLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری خدمات آزمایشگاه...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ثبت سفارش جدید</h1>
            <p className="text-gray-600 text-sm">اطلاعات بیمار و آزمایش مورد نیاز را وارد کنید</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Patient Information Card */}
              <Card className="card-professional">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 space-x-reverse text-lg">
                    <User className="w-5 h-5 text-blue-600" />
                    <span>اطلاعات بیمار</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="patient.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نام بیمار</FormLabel>
                          <FormControl>
                            <Input placeholder="نام کامل بیمار" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="patient.nationalId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>کد ملی</FormLabel>
                          <FormControl>
                            <Input placeholder="0000000000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="patient.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>شماره تلفن</FormLabel>
                          <FormControl>
                            <Input placeholder="09123456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="patient.age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>سن</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="35" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="patient.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>آدرس بیمار</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="آدرس کامل بیمار" 
                            rows={2}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Collection Information Card */}
              <Card className="card-professional">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 space-x-reverse text-lg">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <span>اطلاعات نمونه‌گیری</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="order.collectionAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>آدرس نمونه‌گیری</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="آدرس کامل محل نمونه‌گیری" 
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="order.scheduledDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-1 space-x-reverse">
                            <Calendar className="w-4 h-4" />
                            <span>تاریخ نمونه‌گیری</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="order.scheduledTimeSlot"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-1 space-x-reverse">
                            <Clock className="w-4 h-4" />
                            <span>زمان ترجیحی</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="انتخاب زمان" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="order.notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-1 space-x-reverse">
                          <FileText className="w-4 h-4" />
                          <span>یادداشت (اختیاری)</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="توضیحات اضافی در صورت نیاز" 
                            rows={2}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Test Selection Card */}
              <Card className="card-professional">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 space-x-reverse text-lg">
                    <TestTube className="w-5 h-5 text-purple-600" />
                    <span>انتخاب آزمایش</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {groupedServices && Object.entries(groupedServices).map(([category, services]) => (
                    <div key={category} className="space-y-3">
                      <h4 className="font-medium text-gray-800 border-b border-gray-200 pb-2">
                        {category}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {services.map((service) => (
                          <div
                            key={service.id}
                            className={`flex items-center p-4 border-2 rounded-lg transition-all cursor-pointer hover:shadow-md ${
                              selectedServices.includes(service.id)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleServiceToggle(service.id, !selectedServices.includes(service.id))}
                          >
                            <Checkbox
                              id={`service-${service.id}`}
                              checked={selectedServices.includes(service.id)}
                              onCheckedChange={(checked) => handleServiceToggle(service.id, checked as boolean)}
                              className="ml-3"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-900">{service.name}</p>
                                <Badge variant="outline" className="text-xs">
                                  {service.code}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{service.sampleType}</p>
                              <p className="text-sm font-semibold text-blue-600 mt-1">
                                {new Intl.NumberFormat('fa-IR').format(parseFloat(service.price))} تومان
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Order Summary */}
            <div className="space-y-6">
              <Card className="card-professional sticky top-6">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 space-x-reverse text-lg">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    <span>خلاصه سفارش</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedServices.length > 0 ? (
                    <>
                      <div className="space-y-2">
                        {selectedServices.map(serviceId => {
                          const service = labServices?.find(s => s.id === serviceId);
                          return service ? (
                            <div key={serviceId} className="flex justify-between items-center py-2 border-b border-gray-100">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{service.name}</p>
                                <p className="text-xs text-gray-500">{service.code}</p>
                              </div>
                              <p className="text-sm font-medium text-blue-600">
                                {new Intl.NumberFormat('fa-IR').format(parseFloat(service.price))}
                              </p>
                            </div>
                          ) : null;
                        })}
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-gray-900">مجموع:</p>
                          <p className="text-lg font-bold text-blue-600">
                            {new Intl.NumberFormat('fa-IR').format(calculateTotal())} تومان
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedServices.length} آزمایش انتخاب شده
                        </p>
                      </div>

                      <div className="space-y-2 pt-4">
                        <Button 
                          type="submit" 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={createOrderMutation.isPending || selectedServices.length === 0}
                        >
                          <Save className="w-4 h-4 ml-2" />
                          {createOrderMutation.isPending ? "در حال ثبت..." : "ثبت سفارش"}
                        </Button>
                        
                        <Button 
                          type="button" 
                          variant="outline"
                          className="w-full"
                          onClick={() => setLocation("/orders")}
                        >
                          <X className="w-4 h-4 ml-2" />
                          انصراف
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 text-sm">هیچ آزمایشی انتخاب نشده</p>
                      <p className="text-gray-500 text-xs mt-1">لطفاً حداقل یک آزمایش انتخاب کنید</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}