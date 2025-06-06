import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  Building2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  FileText, 
  Users, 
  Activity, 
  RefreshCw,
  Plus,
  Settings,
  Search,
  Filter,
  Download,
  Upload,
  Phone,
  Mail,
  Globe,
  Key,
  Link,
  Database,
  TrendingUp,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Copy,
  CheckCheck,
  AlertCircle
} from "lucide-react";

interface InsuranceProvider {
  id: number;
  name: string;
  nameEn: string;
  type: "basic" | "supplementary" | "specialized";
  status: "active" | "inactive" | "pending" | "suspended";
  apiEndpoint: string;
  apiKey: string;
  lastSync: Date;
  totalMembers: number;
  coveredServices: number;
  responseTime: number;
  successRate: number;
  monthlyQuota: number;
  usedQuota: number;
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  coverageDetails: {
    labTests: boolean;
    homeCollection: boolean;
    emergencyServices: boolean;
    discountRate: number;
  };
}

interface InsuranceClaim {
  id: number;
  claimNumber: string;
  patientName: string;
  patientInsuranceId: string;
  insuranceProvider: string;
  serviceType: string;
  amount: number;
  submittedDate: Date;
  status: "pending" | "approved" | "rejected" | "processing";
  responseTime: number;
  rejectionReason?: string;
  approvalCode?: string;
}

interface APITransaction {
  id: number;
  timestamp: Date;
  provider: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  status: "success" | "error" | "timeout";
  responseTime: number;
  responseCode: number;
  requestData?: any;
  responseData?: any;
  errorMessage?: string;
}

export default function InsuranceAPI() {
  const [activeTab, setActiveTab] = useState("providers");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState<InsuranceProvider | null>(null);

  // Mock data for demonstration
  const insuranceProviders: InsuranceProvider[] = [
    {
      id: 1,
      name: "بیمه تامین اجتماعی",
      nameEn: "Social Security Insurance",
      type: "basic",
      status: "active",
      apiEndpoint: "https://api.ssi.ir/v2",
      apiKey: "ssi_live_key_xxx",
      lastSync: new Date(Date.now() - 30 * 60 * 1000),
      totalMembers: 45000000,
      coveredServices: 156,
      responseTime: 850,
      successRate: 98.5,
      monthlyQuota: 100000,
      usedQuota: 15420,
      contactInfo: {
        phone: "1536",
        email: "support@ssi.ir",
        website: "www.ssi.ir"
      },
      coverageDetails: {
        labTests: true,
        homeCollection: true,
        emergencyServices: true,
        discountRate: 70
      }
    },
    {
      id: 2,
      name: "بیمه ایران",
      nameEn: "Iran Insurance",
      type: "supplementary",
      status: "active",
      apiEndpoint: "https://api.iraninsurance.ir/v1",
      apiKey: "iran_prod_key_xxx",
      lastSync: new Date(Date.now() - 10 * 60 * 1000),
      totalMembers: 8500000,
      coveredServices: 89,
      responseTime: 650,
      successRate: 96.8,
      monthlyQuota: 50000,
      usedQuota: 8920,
      contactInfo: {
        phone: "02161936000",
        email: "info@iraninsurance.ir",
        website: "www.iraninsurance.ir"
      },
      coverageDetails: {
        labTests: true,
        homeCollection: false,
        emergencyServices: true,
        discountRate: 50
      }
    },
    {
      id: 3,
      name: "بیمه کوثر",
      nameEn: "Kowsar Insurance",
      type: "specialized",
      status: "pending",
      apiEndpoint: "https://api.kowsar-insurance.com/v1",
      apiKey: "kowsar_test_key_xxx",
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
      totalMembers: 1200000,
      coveredServices: 45,
      responseTime: 1200,
      successRate: 89.3,
      monthlyQuota: 20000,
      usedQuota: 2150,
      contactInfo: {
        phone: "02142851000",
        email: "support@kowsar-insurance.com",
        website: "www.kowsar-insurance.com"
      },
      coverageDetails: {
        labTests: true,
        homeCollection: true,
        emergencyServices: false,
        discountRate: 80
      }
    },
    {
      id: 4,
      name: "بیمه آسیا",
      nameEn: "Asia Insurance",
      type: "supplementary",
      status: "suspended",
      apiEndpoint: "https://api.asia-insurance.ir/v2",
      apiKey: "asia_disabled_key_xxx",
      lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
      totalMembers: 3200000,
      coveredServices: 67,
      responseTime: 2100,
      successRate: 76.2,
      monthlyQuota: 30000,
      usedQuota: 890,
      contactInfo: {
        phone: "02188200200",
        email: "info@asia-insurance.ir",
        website: "www.asia-insurance.ir"
      },
      coverageDetails: {
        labTests: true,
        homeCollection: false,
        emergencyServices: true,
        discountRate: 40
      }
    }
  ];

  const recentClaims: InsuranceClaim[] = [
    {
      id: 1,
      claimNumber: "CLM-2025-001543",
      patientName: "احمد رضایی",
      patientInsuranceId: "9876543210",
      insuranceProvider: "بیمه تامین اجتماعی",
      serviceType: "آزمایش خون",
      amount: 450000,
      submittedDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "approved",
      responseTime: 45,
      approvalCode: "APP-789456123"
    },
    {
      id: 2,
      claimNumber: "CLM-2025-001544",
      patientName: "فاطمه محمدی",
      patientInsuranceId: "1234567890",
      insuranceProvider: "بیمه ایران",
      serviceType: "نمونه‌گیری در منزل",
      amount: 350000,
      submittedDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: "processing",
      responseTime: 0
    },
    {
      id: 3,
      claimNumber: "CLM-2025-001545",
      patientName: "علی احمدی",
      patientInsuranceId: "5678901234",
      insuranceProvider: "بیمه کوثر",
      serviceType: "پروفایل کامل",
      amount: 890000,
      submittedDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: "rejected",
      responseTime: 120,
      rejectionReason: "عدم پوشش این سرویس توسط بیمه"
    }
  ];

  const apiTransactions: APITransaction[] = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      provider: "بیمه تامین اجتماعی",
      endpoint: "/verify-eligibility",
      method: "POST",
      status: "success",
      responseTime: 850,
      responseCode: 200
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      provider: "بیمه ایران",
      endpoint: "/submit-claim",
      method: "POST",
      status: "success",
      responseTime: 650,
      responseCode: 201
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      provider: "بیمه آسیا",
      endpoint: "/check-coverage",
      method: "GET",
      status: "timeout",
      responseTime: 5000,
      responseCode: 408
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      suspended: "bg-red-100 text-red-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      processing: "bg-blue-100 text-blue-800",
      success: "bg-green-100 text-green-800",
      error: "bg-red-100 text-red-800",
      timeout: "bg-orange-100 text-orange-800"
    };
    
    const labels = {
      active: "فعال",
      inactive: "غیرفعال",
      pending: "در انتظار",
      suspended: "تعلیق شده",
      approved: "تایید شده",
      rejected: "رد شده",
      processing: "در حال پردازش",
      success: "موفق",
      error: "خطا",
      timeout: "انقضای زمان"
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "basic": return <Shield className="w-4 h-4 text-blue-500" />;
      case "supplementary": return <Building2 className="w-4 h-4 text-green-500" />;
      case "specialized": return <Activity className="w-4 h-4 text-purple-500" />;
      default: return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      basic: "پایه",
      supplementary: "تکمیلی",
      specialized: "تخصصی"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' ریال';
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return "text-green-600";
    if (rate >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  const getResponseTimeColor = (time: number) => {
    if (time <= 1000) return "text-green-600";
    if (time <= 2000) return "text-yellow-600";
    return "text-red-600";
  };

  const activeProviders = insuranceProviders.filter(p => p.status === "active").length;
  const totalClaims = recentClaims.length;
  const approvedClaims = recentClaims.filter(c => c.status === "approved").length;
  const totalQuotaUsage = insuranceProviders.reduce((sum, p) => sum + (p.usedQuota / p.monthlyQuota) * 100, 0) / insuranceProviders.length;

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مدیریت بیمه و API</h1>
          <p className="text-gray-600 mt-2">اتصال و مدیریت سامانه‌های بیمه‌ای</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 ml-2" />
            گزارش API
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 ml-2" />
            تنظیمات
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="w-4 h-4 ml-2" />
            بیمه جدید
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">بیمه‌های فعال</p>
                <p className="text-2xl font-bold text-green-900">{activeProviders}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">ادعاهای امروز</p>
                <p className="text-2xl font-bold text-blue-900">{totalClaims}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">نرخ تایید</p>
                <p className="text-2xl font-bold text-purple-900">{Math.round((approvedClaims / totalClaims) * 100)}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">استفاده از سهمیه</p>
                <p className="text-2xl font-bold text-orange-900">{Math.round(totalQuotaUsage)}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="providers">ارائه‌دهندگان بیمه</TabsTrigger>
          <TabsTrigger value="claims">ادعاهای بیمه</TabsTrigger>
          <TabsTrigger value="transactions">تراکنش‌های API</TabsTrigger>
          <TabsTrigger value="analytics">آمار و تحلیل</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[250px]">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="جستجو در بیمه‌ها..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                    <SelectItem value="active">فعال</SelectItem>
                    <SelectItem value="inactive">غیرفعال</SelectItem>
                    <SelectItem value="pending">در انتظار</SelectItem>
                    <SelectItem value="suspended">تعلیق شده</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 ml-2" />
                  همگام‌سازی
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Providers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insuranceProviders.map((provider) => (
              <Card key={provider.id} className="border-2 hover:border-purple-300 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(provider.type)}
                      <div>
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                        <p className="text-sm text-gray-600">{provider.nameEn}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(provider.status)}
                      <Badge variant="outline">{getTypeLabel(provider.type)}</Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* API Status */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">وضعیت API</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${provider.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-xs text-gray-600">
                          آخرین همگام‌سازی: {formatDateTime(provider.lastSync)}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 font-mono bg-white p-2 rounded border">
                      {provider.apiEndpoint}
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">زمان پاسخ</p>
                      <p className={`text-sm font-bold ${getResponseTimeColor(provider.responseTime)}`}>
                        {provider.responseTime}ms
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">نرخ موفقیت</p>
                      <p className={`text-sm font-bold ${getSuccessRateColor(provider.successRate)}`}>
                        {provider.successRate}%
                      </p>
                    </div>
                  </div>

                  {/* Coverage Info */}
                  <div>
                    <p className="text-sm font-medium mb-2">پوشش خدمات:</p>
                    <div className="flex flex-wrap gap-2">
                      {provider.coverageDetails.labTests && (
                        <Badge variant="secondary" className="text-xs">آزمایش</Badge>
                      )}
                      {provider.coverageDetails.homeCollection && (
                        <Badge variant="secondary" className="text-xs">نمونه‌گیری منزل</Badge>
                      )}
                      {provider.coverageDetails.emergencyServices && (
                        <Badge variant="secondary" className="text-xs">اورژانس</Badge>
                      )}
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {provider.coverageDetails.discountRate}% تخفیف
                      </Badge>
                    </div>
                  </div>

                  {/* Usage Quota */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">استفاده از سهمیه</span>
                      <span className="text-sm text-gray-600">
                        {Math.round((provider.usedQuota / provider.monthlyQuota) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${(provider.usedQuota / provider.monthlyQuota) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {provider.usedQuota.toLocaleString()} از {provider.monthlyQuota.toLocaleString()}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{provider.contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{(provider.totalMembers / 1000000).toFixed(1)}M عضو</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                      <Link className="w-4 h-4 ml-2" />
                      تست اتصال
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 ml-2" />
                      ویرایش
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="claims" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ادعاهای اخیر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentClaims.map((claim) => (
                  <div key={claim.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{claim.claimNumber}</h4>
                          <p className="text-sm text-gray-600">{claim.patientName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(claim.status)}
                        <Badge variant="outline">{formatCurrency(claim.amount)}</Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">بیمه:</p>
                        <p className="font-medium">{claim.insuranceProvider}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">سرویس:</p>
                        <p className="font-medium">{claim.serviceType}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">تاریخ ثبت:</p>
                        <p className="font-medium">{formatDateTime(claim.submittedDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">زمان پاسخ:</p>
                        <p className="font-medium">
                          {claim.responseTime > 0 ? `${claim.responseTime} دقیقه` : "در انتظار"}
                        </p>
                      </div>
                    </div>

                    {claim.rejectionReason && (
                      <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-red-700">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">دلیل رد:</span>
                        </div>
                        <p className="text-sm text-red-600 mt-1">{claim.rejectionReason}</p>
                      </div>
                    )}

                    {claim.approvalCode && (
                      <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCheck className="w-4 h-4" />
                          <span className="text-sm font-medium">کد تایید: {claim.approvalCode}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تراکنش‌های API اخیر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {apiTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.status === 'success' ? 'bg-green-100' :
                        transaction.status === 'error' ? 'bg-red-100' : 'bg-orange-100'
                      }`}>
                        {transaction.status === 'success' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                         transaction.status === 'error' ? <XCircle className="w-4 h-4 text-red-600" /> :
                         <Clock className="w-4 h-4 text-orange-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.provider}</p>
                        <p className="text-xs text-gray-600">
                          {transaction.method} {transaction.endpoint}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-gray-600">زمان</p>
                        <p className={`font-medium ${getResponseTimeColor(transaction.responseTime)}`}>
                          {transaction.responseTime}ms
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">کد</p>
                        <p className="font-medium">{transaction.responseCode}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">زمان</p>
                        <p className="font-medium">{formatDateTime(transaction.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  عملکرد API
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">نمودار عملکرد API در 30 روز گذشته</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  آمار مالی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>کل ادعاهای تایید شده</span>
                    <Badge className="bg-green-100 text-green-800">{formatCurrency(1250000)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>در انتظار پردازش</span>
                    <Badge className="bg-blue-100 text-blue-800">{formatCurrency(350000)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>رد شده</span>
                    <Badge className="bg-red-100 text-red-800">{formatCurrency(890000)}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}