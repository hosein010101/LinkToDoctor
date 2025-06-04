import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

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

  if (servicesLoading) {
    return <div className="p-6">در حال بارگذاری...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="card-professional">
        <CardContent className="p-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h3 className="text-xl font-semibold text-medical-text">ثبت سفارش جدید</h3>
            <p className="text-sm text-gray-500 mt-1">اطلاعات بیمار و آزمایش مورد نیاز را وارد کنید</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Patient Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-medical-text">اطلاعات بیمار</h4>
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
              </div>

              {/* Test Selection */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-medical-text">انتخاب آزمایش</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {labServices?.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <Checkbox
                        id={`service-${service.id}`}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={(checked) => handleServiceToggle(service.id, checked as boolean)}
                        className="ml-2"
                      />
                      <label htmlFor={`service-${service.id}`} className="cursor-pointer flex-1">
                        <div>
                          <p className="font-medium text-medical-text">{service.name}</p>
                          <p className="text-sm text-gray-500">{service.code}</p>
                          <p className="text-sm text-medical-green font-medium">
                            {new Intl.NumberFormat('fa-IR').format(parseFloat(service.price))} تومان
                          </p>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                
                {selectedServices.length > 0 && (
                  <div className="p-4 bg-medical-teal bg-opacity-10 rounded-lg">
                    <p className="text-medical-text font-medium">
                      مجموع: {new Intl.NumberFormat('fa-IR').format(calculateTotal())} تومان
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedServices.length} آزمایش انتخاب شده
                    </p>
                  </div>
                )}
              </div>

              {/* Collection Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-medical-text">اطلاعات نمونه‌گیری</h4>
                
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
                        <FormLabel>تاریخ نمونه‌گیری</FormLabel>
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
                        <FormLabel>زمان ترجیحی</FormLabel>
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
                      <FormLabel>یادداشت (اختیاری)</FormLabel>
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
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 space-x-reverse pt-4 border-t border-gray-200">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setLocation("/orders")}
                >
                  انصراف
                </Button>
                <Button 
                  type="submit" 
                  className="bg-medical-teal hover:bg-opacity-90 text-white"
                  disabled={createOrderMutation.isPending || selectedServices.length === 0}
                >
                  {createOrderMutation.isPending ? "در حال ثبت..." : "ثبت سفارش"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
