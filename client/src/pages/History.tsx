import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Eye, 
  Download, 
  Calendar, 
  User, 
  FileText, 
  Clock, 
  TrendingUp,
  History as HistoryIcon,
  Phone,
  TestTube,
  ChevronRight
} from "lucide-react";
import type { Patient, OrderWithDetails } from "@/lib/types";

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const { data: patients, isLoading: patientsLoading } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { data: allOrders, isLoading: ordersLoading } = useQuery<OrderWithDetails[]>({
    queryKey: ["/api/lab-orders"],
  });

  const filteredPatients = patients?.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.nationalId.includes(searchTerm) ||
    patient.phone.includes(searchTerm)
  ) || [];

  const getPatientOrders = (patientId: number) => {
    return allOrders?.filter(order => order.patientId === patientId) || [];
  };

  const getPatientStats = (patientId: number) => {
    const orders = getPatientOrders(patientId);
    const totalTests = orders.reduce((sum, order) => sum + order.services.length, 0);
    const completedOrders = orders.filter(order => order.status === "delivered").length;
    const totalAmount = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
    
    return {
      totalOrders: orders.length,
      totalTests,
      completedOrders,
      totalAmount,
      lastVisit: orders.length > 0 ? orders[0].createdAt : null,
    };
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      registered: { label: "ثبت شده", class: "bg-blue-100 text-blue-800" },
      collection_scheduled: { label: "برنامه‌ریزی شده", class: "bg-yellow-100 text-yellow-800" },
      collected: { label: "نمونه‌گیری شده", class: "bg-orange-100 text-orange-800" },
      processing: { label: "در حال پردازش", class: "bg-purple-100 text-purple-800" },
      completed: { label: "آماده تحویل", class: "bg-green-100 text-green-800" },
      delivered: { label: "تحویل شده", class: "bg-gray-100 text-gray-800" },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.registered;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  if (patientsLoading || ordersLoading) {
    return <div className="p-6">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-medical-text">تاریخچه بیماران</h3>
              <p className="text-sm text-gray-500 mt-1">مشاهده سوابق آزمایشگاهی بیماران</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="جستجوی بیمار..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patients List */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-medical-text mb-4">فهرست بیماران</h4>
              
              <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
                {filteredPatients.map((patient) => {
                  const stats = getPatientStats(patient.id);
                  const isSelected = selectedPatient?.id === patient.id;
                  
                  return (
                    <div
                      key={patient.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected 
                          ? 'border-medical-teal bg-medical-teal bg-opacity-10' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="w-10 h-10 bg-medical-teal bg-opacity-20 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-medical-teal" />
                          </div>
                          <div>
                            <p className="font-medium text-medical-text">{patient.name}</p>
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{patient.phone}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                      
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-gray-500">
                            سفارشات: <span className="text-medical-text font-medium">{stats.totalOrders}</span>
                          </div>
                          <div className="text-gray-500">
                            آزمایش: <span className="text-medical-text font-medium">{stats.totalTests}</span>
                          </div>
                        </div>
                        {stats.lastVisit && (
                          <div className="mt-1 text-xs text-gray-500">
                            آخرین مراجعه: {formatDate(stats.lastVisit)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {filteredPatients.length === 0 && (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">بیماری یافت نشد</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Details */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="space-y-6">
              {/* Patient Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-16 h-16 bg-medical-teal bg-opacity-20 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-medical-teal" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-medical-text">{selectedPatient.name}</h4>
                        <p className="text-sm text-gray-500">کد ملی: {selectedPatient.nationalId}</p>
                        <p className="text-sm text-gray-500">تلفن: {selectedPatient.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Patient Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(() => {
                      const stats = getPatientStats(selectedPatient.id);
                      return (
                        <>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-medical-teal">{stats.totalOrders}</p>
                            <p className="text-xs text-gray-500">کل سفارشات</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-medical-blue">{stats.totalTests}</p>
                            <p className="text-xs text-gray-500">کل آزمایش‌ها</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-medical-green">{stats.completedOrders}</p>
                            <p className="text-xs text-gray-500">تحویل شده</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-lg font-bold text-medical-orange">
                              {formatCurrency(stats.totalAmount)}
                            </p>
                            <p className="text-xs text-gray-500">کل هزینه</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* Patient Orders */}
              <Card>
                <CardContent className="p-6">
                  <Tabs defaultValue="orders" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="orders">سوابق سفارشات</TabsTrigger>
                      <TabsTrigger value="results">نتایج آزمایش</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="orders" className="mt-6">
                      <div className="space-y-4">
                        {getPatientOrders(selectedPatient.id).map((order) => (
                          <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="font-medium text-medical-text">{order.orderNumber}</p>
                                <div className="flex items-center space-x-4 space-x-reverse mt-1">
                                  <div className="flex items-center space-x-1 space-x-reverse">
                                    <Calendar className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1 space-x-reverse">
                                    <TestTube className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">{order.services.length} آزمایش</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 space-x-reverse">
                                {getStatusBadge(order.status)}
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="pt-3 border-t border-gray-200">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">
                                  مبلغ: {formatCurrency(parseFloat(order.totalAmount))}
                                </span>
                                {order.collector && (
                                  <span className="text-gray-500">
                                    نمونه‌گیر: {order.collector.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {getPatientOrders(selectedPatient.id).length === 0 && (
                          <div className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-gray-500">هیچ سفارشی ثبت نشده است</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="results" className="mt-6">
                      <div className="space-y-4">
                        {getPatientOrders(selectedPatient.id)
                          .filter(order => order.results && order.results.length > 0)
                          .map((order) => (
                            <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <p className="font-medium text-medical-text">{order.orderNumber}</p>
                                  <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                                </div>
                                <div className="flex space-x-2 space-x-reverse">
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4" />
                                    مشاهده
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Download className="w-4 h-4" />
                                    دانلود
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                {order.results?.map((result) => (
                                  <div key={result.id} className="p-2 bg-gray-50 rounded text-sm">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">آزمایش {result.serviceId}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {result.status === "validated" ? "تایید شده" : "در انتظار"}
                                      </Badge>
                                    </div>
                                    {result.result && (
                                      <p className="text-gray-600 mt-1">
                                        نتیجه: {result.result} {result.unit}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        
                        {getPatientOrders(selectedPatient.id).filter(o => o.results?.length).length === 0 && (
                          <div className="text-center py-8">
                            <TestTube className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-gray-500">هیچ نتیجه‌ای موجود نیست</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12">
                <div className="text-center">
                  <HistoryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-500 mb-2">بیمار انتخاب کنید</h4>
                  <p className="text-sm text-gray-400">برای مشاهده تاریخچه، یکی از بیماران را انتخاب کنید</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
