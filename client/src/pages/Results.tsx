import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Search, 
  FileText, 
  Edit, 
  Save, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TestTube
} from "lucide-react";
import type { OrderWithDetails, TestResult, LabService } from "@/lib/types";

const resultSchema = z.object({
  result: z.string().min(1, "نتیجه الزامی است"),
  normalRange: z.string().optional(),
  unit: z.string().optional(),
  status: z.enum(["pending", "completed", "reviewed", "validated"]),
});

type ResultForm = z.infer<typeof resultSchema>;

export default function Results() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [editingResult, setEditingResult] = useState<TestResult | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery<OrderWithDetails[]>({
    queryKey: ["/api/lab-orders"],
  });

  const { data: services } = useQuery<LabService[]>({
    queryKey: ["/api/lab-services"],
  });

  const form = useForm<ResultForm>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      result: "",
      normalRange: "",
      unit: "",
      status: "completed",
    },
  });

  const createResultMutation = useMutation({
    mutationFn: async (data: { orderId: number; serviceId: number; result: ResultForm }) => {
      const response = await apiRequest("POST", "/api/test-results", {
        orderId: data.orderId,
        serviceId: data.serviceId,
        ...data.result,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lab-orders"] });
      toast({
        title: "موفقیت",
        description: "نتیجه آزمایش با موفقیت ثبت شد",
      });
      form.reset();
      setEditingResult(null);
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "خطا در ثبت نتیجه آزمایش",
        variant: "destructive",
      });
    },
  });

  const updateResultMutation = useMutation({
    mutationFn: async (data: { resultId: number; result: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/test-results/${data.resultId}`, {
        result: data.result,
        status: data.status,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lab-orders"] });
      toast({
        title: "موفقیت",
        description: "نتیجه آزمایش به‌روزرسانی شد",
      });
      setEditingResult(null);
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "خطا در به‌روزرسانی نتیجه",
        variant: "destructive",
      });
    },
  });

  // Filter orders that are collected or in processing
  const eligibleOrders = orders?.filter(order => 
    order.status === "collected" || order.status === "processing"
  ) || [];

  const filteredOrders = eligibleOrders.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "در انتظار", class: "bg-yellow-100 text-yellow-800", icon: Clock },
      completed: { label: "تکمیل شده", class: "bg-blue-100 text-blue-800", icon: FileText },
      reviewed: { label: "بررسی شده", class: "bg-purple-100 text-purple-800", icon: Eye },
      validated: { label: "تایید شده", class: "bg-green-100 text-green-800", icon: CheckCircle },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    const Icon = statusInfo.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
        <Icon className="w-3 h-3 ml-1" />
        {statusInfo.label}
      </span>
    );
  };

  const getServiceName = (serviceId: number) => {
    return services?.find(s => s.id === serviceId)?.name || `آزمایش ${serviceId}`;
  };

  const onSubmit = (data: ResultForm) => {
    if (!selectedOrder || !editingResult) return;

    if (editingResult.id) {
      // Update existing result
      updateResultMutation.mutate({
        resultId: editingResult.id,
        result: data.result,
        status: data.status,
      });
    } else {
      // Create new result
      createResultMutation.mutate({
        orderId: selectedOrder.id,
        serviceId: editingResult.serviceId,
        result: data,
      });
    }
  };

  const startEditing = (order: OrderWithDetails, serviceId: number) => {
    setSelectedOrder(order);
    
    // Check if result already exists
    const existingResult = order.results?.find(r => r.serviceId === serviceId);
    
    if (existingResult) {
      setEditingResult(existingResult);
      form.reset({
        result: existingResult.result || "",
        normalRange: existingResult.normalRange || "",
        unit: existingResult.unit || "",
        status: existingResult.status,
      });
    } else {
      setEditingResult({
        id: 0,
        orderId: order.id,
        serviceId,
        status: "pending",
        enteredAt: new Date().toISOString(),
      });
      form.reset({
        result: "",
        normalRange: "",
        unit: "",
        status: "completed",
      });
    }
  };

  if (isLoading) {
    return <div className="p-6">در حال بارگذاری...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Orders List */}
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h3 className="text-lg font-semibold text-medical-text">ورود نتایج آزمایش</h3>
              <p className="text-sm text-gray-500">سفارشات آماده ورود نتیجه</p>
            </div>
            
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="جستجوی سفارش..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* Orders */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-medical-text">{order.patient.name}</h4>
                      <p className="text-sm text-gray-500">{order.orderNumber}</p>
                    </div>
                    <Badge variant="outline">
                      {order.status === "collected" ? "نمونه‌گیری شده" : "در حال پردازش"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {order.services.map((orderService) => {
                      const existingResult = order.results?.find(r => r.serviceId === orderService.serviceId);
                      const serviceName = getServiceName(orderService.serviceId);
                      
                      return (
                        <div key={orderService.serviceId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-medical-text">{serviceName}</p>
                            {existingResult && (
                              <div className="mt-1">
                                {getStatusBadge(existingResult.status)}
                                {existingResult.result && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    نتیجه: {existingResult.result} {existingResult.unit}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant={existingResult ? "outline" : "default"}
                            onClick={() => startEditing(order, orderService.serviceId)}
                            className={!existingResult ? "bg-medical-teal hover:bg-opacity-90 text-white" : ""}
                          >
                            {existingResult ? <Edit className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                            {existingResult ? "ویرایش" : "ورود نتیجه"}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <TestTube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">سفارشی برای ورود نتیجه یافت نشد</h3>
                  <p className="text-sm text-gray-400">هیچ سفارش آماده‌ای برای ورود نتیجه وجود ندارد</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Result Entry Form */}
      <div>
        <Card>
          <CardContent className="p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h3 className="text-lg font-semibold text-medical-text">فرم ورود نتیجه</h3>
              {selectedOrder && editingResult && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">{selectedOrder.patient.name}</p>
                  <p className="text-xs text-gray-500">{getServiceName(editingResult.serviceId)}</p>
                </div>
              )}
            </div>

            {selectedOrder && editingResult ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="result"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نتیجه آزمایش</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="نتیجه آزمایش را وارد کنید..."
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="normalRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>محدوده طبیعی</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: 10-15 mg/dl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>واحد</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: mg/dl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>وضعیت</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="completed">تکمیل شده</SelectItem>
                            <SelectItem value="reviewed">بررسی شده</SelectItem>
                            <SelectItem value="validated">تایید شده</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex space-x-2 space-x-reverse pt-4">
                    <Button
                      type="submit"
                      className="bg-medical-teal hover:bg-opacity-90 text-white flex-1"
                      disabled={createResultMutation.isPending || updateResultMutation.isPending}
                    >
                      <Save className="ml-2 w-4 h-4" />
                      {createResultMutation.isPending || updateResultMutation.isPending ? "در حال ذخیره..." : "ذخیره نتیجه"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedOrder(null);
                        setEditingResult(null);
                        form.reset();
                      }}
                    >
                      انصراف
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-500 mb-2">آزمایش انتخاب کنید</h4>
                <p className="text-sm text-gray-400">برای ورود نتیجه، یکی از آزمایش‌ها را انتخاب کنید</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-medical-text mb-4">اقدامات سریع</h4>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="ml-2 w-4 h-4" />
                نتایج نیازمند بررسی
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="ml-2 w-4 h-4" />
                نتایج تایید شده امروز
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="ml-2 w-4 h-4" />
                نتایج معوق
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
