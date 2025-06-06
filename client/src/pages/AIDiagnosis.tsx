import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Activity, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  FileText, 
  Search, 
  Zap,
  Target,
  BarChart3,
  Lightbulb,
  Microscope,
  Stethoscope,
  Heart,
  Upload,
  Download,
  RefreshCw,
  Clock,
  User,
  Calendar,
  Filter
} from "lucide-react";

interface TestResult {
  id: number;
  patientName: string;
  testName: string;
  value: string;
  normalRange: string;
  unit: string;
  status: "normal" | "abnormal" | "critical";
  aiInterpretation?: string;
  confidence: number;
  suggestions: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
}

interface DiagnosisInsight {
  id: number;
  category: string;
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
  affectedTests: string[];
  recommendations: string[];
  confidence: number;
}

export default function AIDiagnosis() {
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("interpretation");

  // Mock data for demonstration
  const testResults: TestResult[] = [
    {
      id: 1,
      patientName: "احمد رضایی",
      testName: "قند خون ناشتا",
      value: "145",
      normalRange: "70-100",
      unit: "mg/dL",
      status: "abnormal",
      aiInterpretation: "مقدار قند خون بالاتر از حد طبیعی است که ممکن است نشان‌دهنده پیش‌دیابت یا دیابت نوع 2 باشد. توصیه می‌شود آزمایش HbA1c و GTT انجام شود.",
      confidence: 87,
      suggestions: [
        "انجام آزمایش HbA1c",
        "آزمایش تحمل گلوکز (GTT)",
        "مشاوره با متخصص غدد",
        "رژیم غذایی مناسب"
      ],
      riskLevel: "medium"
    },
    {
      id: 2,
      patientName: "فاطمه محمدی",
      testName: "کلسترول کل",
      value: "280",
      normalRange: "<200",
      unit: "mg/dL",
      status: "critical",
      aiInterpretation: "سطح کلسترول بسیار بالا است که خطر بیماری‌های قلبی عروقی را به طور قابل توجهی افزایش می‌دهد. نیاز به درمان فوری و تغییرات اساسی در سبک زندگی.",
      confidence: 94,
      suggestions: [
        "شروع درمان دارویی استاتین",
        "رژیم غذایی کم چربی",
        "ورزش منظم",
        "آزمایش‌های قلبی تکمیلی"
      ],
      riskLevel: "critical"
    },
    {
      id: 3,
      patientName: "علی احمدی",
      testName: "هموگلوبین",
      value: "9.2",
      normalRange: "13.5-17.5",
      unit: "g/dL",
      status: "abnormal",
      aiInterpretation: "کاهش قابل توجه هموگلوبین نشان‌دهنده کم خونی است. علت می‌تواند کمبود آهن، ویتامین B12، یا بیماری‌های مزمن باشد.",
      confidence: 91,
      suggestions: [
        "آزمایش آهن سرم و فریتین",
        "ویتامین B12 و فولات",
        "بررسی علل خونریزی",
        "مشاوره با متخصص خون"
      ],
      riskLevel: "medium"
    }
  ];

  const diagnosticInsights: DiagnosisInsight[] = [
    {
      id: 1,
      category: "متابولیک",
      title: "الگوی سندرم متابولیک",
      description: "ترکیب نتایج آزمایشات نشان‌دهنده احتمال بالای سندرم متابولیک در بیمار است",
      severity: "warning",
      affectedTests: ["قند خون", "کلسترول", "تری‌گلیسرید", "HDL"],
      recommendations: [
        "بررسی کامل پروفایل لیپیدی",
        "اندازه‌گیری دور کمر",
        "کنترل فشار خون",
        "برنامه کاهش وزن"
      ],
      confidence: 89
    },
    {
      id: 2,
      category: "التهابی",
      title: "واکنش التهابی سیستمیک",
      description: "افزایش مارکرهای التهابی ممکن است نشان‌دهنده عفونت یا بیماری التهابی باشد",
      severity: "critical",
      affectedTests: ["CRP", "ESR", "WBC"],
      recommendations: [
        "بررسی منبع عفونت",
        "کشت خون و ادرار",
        "بررسی بیماری‌های خودایمنی",
        "درمان ضد التهابی"
      ],
      confidence: 76
    }
  ];

  const getRiskBadge = (risk: string) => {
    const variants = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800", 
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800"
    };
    
    const labels = {
      low: "خطر کم",
      medium: "خطر متوسط",
      high: "خطر بالا", 
      critical: "خطر بحرانی"
    };

    return (
      <Badge className={variants[risk as keyof typeof variants]}>
        {labels[risk as keyof typeof labels]}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "abnormal": return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "critical": return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Eye className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تفسیر و تشخیص هوشمند</h1>
          <p className="text-gray-600 mt-2">تحلیل نتایج آزمایشات با کمک هوش مصنوعی</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 ml-2" />
            بارگذاری نتایج
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 ml-2" />
            گزارش تفسیر
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Brain className="w-4 h-4 ml-2" />
            تحلیل هوشمند
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">تحلیل‌های امروز</p>
                <p className="text-2xl font-bold text-green-900">۲۴</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">دقت تشخیص</p>
                <p className="text-2xl font-bold text-blue-900">۹۵%</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">موارد بحرانی</p>
                <p className="text-2xl font-bold text-orange-900">۳</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">بینش‌های تشخیصی</p>
                <p className="text-2xl font-bold text-purple-900">۷</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="interpretation">تفسیر نتایج</TabsTrigger>
          <TabsTrigger value="insights">بینش‌های تشخیصی</TabsTrigger>
          <TabsTrigger value="trends">روندهای بیماری</TabsTrigger>
        </TabsList>

        <TabsContent value="interpretation" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[250px]">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="جستجو در نتایج..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                    <SelectItem value="normal">طبیعی</SelectItem>
                    <SelectItem value="abnormal">غیرطبیعی</SelectItem>
                    <SelectItem value="critical">بحرانی</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 ml-2" />
                  فیلترهای پیشرفته
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Results List */}
            <Card>
              <CardHeader>
                <CardTitle>نتایج آزمایشات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {testResults.map((result) => (
                  <div 
                    key={result.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedResult?.id === result.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedResult(result)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{result.testName}</h4>
                        <p className="text-sm text-gray-600">{result.patientName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        {getRiskBadge(result.riskLevel)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-medium">{result.value} {result.unit}</span>
                        <span className="text-gray-500 mr-2">({result.normalRange})</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Brain className="w-4 h-4" />
                        <span>{result.confidence}% اطمینان</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Interpretation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-green-600" />
                  تفسیر هوش مصنوعی
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedResult ? (
                  <div className="space-y-6">
                    {/* Result Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{selectedResult.testName}</h4>
                        <Badge className="bg-green-100 text-green-800">
                          {selectedResult.confidence}% دقت
                        </Badge>
                      </div>
                      <div className="text-lg font-semibold text-gray-900 mb-1">
                        {selectedResult.value} {selectedResult.unit}
                      </div>
                      <div className="text-sm text-gray-600">
                        محدوده طبیعی: {selectedResult.normalRange}
                      </div>
                    </div>

                    {/* AI Interpretation */}
                    <div>
                      <h5 className="font-medium mb-2 flex items-center gap-2">
                        <Microscope className="w-4 h-4" />
                        تفسیر تخصصی
                      </h5>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedResult.aiInterpretation}
                      </p>
                    </div>

                    {/* Suggestions */}
                    <div>
                      <h5 className="font-medium mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        توصیه‌های درمانی
                      </h5>
                      <ul className="space-y-2">
                        {selectedResult.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button className="flex-1 bg-green-600 hover:bg-green-700">
                        <FileText className="w-4 h-4 ml-2" />
                        تولید گزارش
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Stethoscope className="w-4 h-4 ml-2" />
                        مشاوره متخصص
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">یک نتیجه آزمایش را برای مشاهده تفسیر هوش مصنوعی انتخاب کنید</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {diagnosticInsights.map((insight) => (
              <Card key={insight.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="outline">{insight.category}</Badge>
                      <CardTitle className="mt-2">{insight.title}</CardTitle>
                    </div>
                    <Badge className={
                      insight.severity === "critical" ? "bg-red-100 text-red-800" :
                      insight.severity === "warning" ? "bg-yellow-100 text-yellow-800" :
                      "bg-blue-100 text-blue-800"
                    }>
                      {insight.confidence}% اطمینان
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{insight.description}</p>
                  
                  <div>
                    <h6 className="font-medium mb-2">آزمایشات مرتبط:</h6>
                    <div className="flex flex-wrap gap-2">
                      {insight.affectedTests.map((test, index) => (
                        <Badge key={index} variant="secondary">{test}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h6 className="font-medium mb-2">توصیه‌ها:</h6>
                    <ul className="space-y-1">
                      {insight.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                روندهای بیماری و پیش‌بینی
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">تحلیل روندهای بیماری بر اساس داده‌های تاریخی بیمار</p>
                <Button className="bg-green-600 hover:bg-green-700">
                  <RefreshCw className="w-4 h-4 ml-2" />
                  تولید نمودار روند
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}