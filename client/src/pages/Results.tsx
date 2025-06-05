import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  TestTube,
  Filter,
  Download,
  Upload,
  XCircle
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
  const [filterStatus, setFilterStatus] = useState("all");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ResultForm>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      result: "",
      normalRange: "",
      unit: "",
      status: "pending",
    },
  });

  const { data: orders, isLoading } = useQuery<OrderWithDetails[]>({
    queryKey: ["/api/lab-orders"],
  });

  const { data: services } = useQuery<LabService[]>({
    queryKey: ["/api/lab-services"],
  });

  const createResultMutation = useMutation({
    mutationFn: async (data: { orderId: number; serviceId: number; result: ResultForm }) => {
      const response = await apiRequest("POST", `/api/test-results`, {
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
      setSelectedOrder(null);
      setEditingResult(null);
      form.reset();
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

  const filteredOrders = eligibleOrders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "در انتظار", class: "bg-yellow-100 text-yellow-800", icon: Clock },
      completed: { label: "تکمیل شده", class: "bg-blue-100 text-blue-800", icon: FileText },
      reviewed: { label: "بررسی شده", class: "bg-purple-100 text-purple-800", icon: Eye },
      validated: { label: "تایید شده", class: "bg-green-100 text-green-800", icon: CheckCircle },
    } as const;
    
    const config = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.class} hover:${config.class} flex items-center space-x-1 space-x-reverse`}>
        <IconComponent className="w-3 h-3" />
        <span>{config.label}</span>
      </Badge>
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
      // Create new result entry
      setEditingResult({
        id: 0,
        orderId: order.id,
        serviceId: serviceId,
        result: "",
        normalRange: "",
        unit: "",
        status: "pending",
      });
      form.reset({
        result: "",
        normalRange: "",
        unit: "",
        status: "pending",
      });
    }
  };

  if (isLoading) {
    return <div className="p-6">در حال بارگذاری...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ورود نتایج آزمایش</h1>
          <p className="text-gray-600 mt-1">سفارشات آماده ورود نتیجه</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button variant="outline">
            <Download className="w-4 h-4 ml-2" />
            گزارش نتایج
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <TestTube className="w-4 h-4 ml-2" />
            تست کیفیت
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">آماده ورود نتیجه</p>
                <p className="text-2xl font-bold text-gray-900">{eligibleOrders.length}</p>
              </div>
              <TestTube className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">در انتظار</p>
                <p className="text-2xl font-bold text-gray-900">
                  {eligibleOrders.filter(o => o.status === "collected").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">در حال پردازش</p>
                <p className="text-2xl font-bold text-gray-900">
                  {eligibleOrders.filter(o => o.status === "processing").length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">تکمیل شده امروز</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle>سفارشات آماده ورود نتیجه</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="جستجوی سفارش..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                    <SelectItem value="collected">نمونه‌گیری شده</SelectItem>
                    <SelectItem value="processing">در حال پردازش</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Orders */}
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{order.patient.name}</h4>
                        <p className="text-sm text-gray-600">{order.orderNumber}</p>
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
                              <p className="text-sm font-medium text-gray-900">{serviceName}</p>
                              {existingResult && (
                                <div className="mt-1">
                                  {getStatusBadge(existingResult.status)}
                                </div>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant={existingResult ? "outline" : "default"}
                              onClick={() => startEditing(order, orderService.serviceId)}
                              className={existingResult ? "" : "bg-purple-600 hover:bg-purple-700 text-white"}
                            >
                              {existingResult ? (
                                <>
                                  <Edit className="w-4 h-4 ml-1" />
                                  ویرایش
                                </>
                              ) : (
                                <>
                                  <FileText className="w-4 h-4 ml-1" />
                                  ورود نتیجه
                                </>
                              )}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {filteredOrders.length === 0 && (
                  <div className="text-center py-8">
                    <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">هیچ سفارشی برای ورود نتیجه یافت نشد</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Result Entry Form */}
        <div>
          {selectedOrder && editingResult ? (
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <span>ورود نتیجه آزمایش</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">{selectedOrder.patient.name}</p>
                  <p className="text-xs text-blue-700">{selectedOrder.orderNumber}</p>
                  <p className="text-xs text-blue-700 mt-1">
                    {getServiceName(editingResult.serviceId)}
                  </p>
                </div>

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
                              {...field}
                              rows={4}
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
                          <FormLabel>محدوده طبیعی (اختیاری)</FormLabel>
                          <FormControl>
                            <Input placeholder="مثال: 10-15 mg/dL" {...field} />
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
                          <FormLabel>واحد (اختیاری)</FormLabel>
                          <FormControl>
                            <Input placeholder="مثال: mg/dL, IU/L" {...field} />
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
                                <SelectValue placeholder="انتخاب وضعیت" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pending">در انتظار</SelectItem>
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
                        disabled={createResultMutation.isPending || updateResultMutation.isPending}
                        className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
                      >
                        <Save className="w-4 h-4 ml-2" />
                        {editingResult.id ? "به‌روزرسانی" : "ثبت نتیجه"}
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
                        <XCircle className="w-4 h-4 ml-2" />
                        انصراف
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <Card className="card-professional">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">سفارش مورد نظر را انتخاب کنید</p>
                  <p className="text-sm text-gray-500">برای ورود یا ویرایش نتیجه آزمایش</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}