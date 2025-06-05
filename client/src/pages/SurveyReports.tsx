import { useState } from "react";
import { 
  Phone, Mail, MessageCircle, Star, Users, TrendingDown, 
  CheckCircle, AlertTriangle, Clock, User, Calendar,
  FileText, Edit, Eye, Search, Filter, Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface SurveyResult {
  id: number;
  customerName: string;
  phone: string;
  email: string;
  overallScore: number;
  maxScore: number;
  surveyDate: string;
  followupStatus: "نیاز به پیگیری" | "در حال پیگیری" | "پیگیری شده";
  assignedAgent: string;
  questions: {
    question: string;
    score: number;
    maxScore: number;
  }[];
  followupHistory: {
    id: number;
    date: string;
    agent: string;
    type: string;
    result: string;
    notes: string;
  }[];
}

interface FollowupLog {
  type: string;
  result: string;
  notes: string;
}

export default function SurveyReports() {
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyResult | null>(null);
  const [followupForm, setFollowupForm] = useState<FollowupLog>({
    type: "",
    result: "",
    notes: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const surveyData: SurveyResult[] = [
    {
      id: 1,
      customerName: "علی احمدی",
      phone: "09123456789",
      email: "ali.ahmadi@email.com",
      overallScore: 3,
      maxScore: 10,
      surveyDate: "1403/05/20",
      followupStatus: "نیاز به پیگیری",
      assignedAgent: "مریم کریمی",
      questions: [
        { question: "کیفیت خدمات نمونه‌گیری", score: 2, maxScore: 10 },
        { question: "سرعت ارائه نتایج", score: 4, maxScore: 10 },
        { question: "رفتار کارکنان", score: 3, maxScore: 10 },
        { question: "دقت نتایج آزمایش", score: 3, maxScore: 10 }
      ],
      followupHistory: []
    },
    {
      id: 2,
      customerName: "فاطمه رضوی",
      phone: "09987654321",
      email: "fateme.rezavi@email.com",
      overallScore: 2,
      maxScore: 10,
      surveyDate: "1403/05/19",
      followupStatus: "در حال پیگیری",
      assignedAgent: "حسن موسوی",
      questions: [
        { question: "کیفیت خدمات نمونه‌گیری", score: 1, maxScore: 10 },
        { question: "سرعت ارائه نتایج", score: 2, maxScore: 10 },
        { question: "رفتار کارکنان", score: 3, maxScore: 10 },
        { question: "دقت نتایج آزمایش", score: 2, maxScore: 10 }
      ],
      followupHistory: [
        {
          id: 1,
          date: "1403/05/21",
          agent: "حسن موسوی",
          type: "تماس تلفنی",
          result: "نیاز به ارجاع",
          notes: "مشتری از تاخیر در نمونه‌گیری ناراضی بود. موضوع به سرپرست ارجاع شد."
        }
      ]
    },
    {
      id: 3,
      customerName: "محمد کریمی",
      phone: "09111222333",
      email: "mohammad.karimi@email.com",
      overallScore: 9,
      maxScore: 10,
      surveyDate: "1403/05/21",
      followupStatus: "پیگیری شده",
      assignedAgent: "زهرا احمدی",
      questions: [
        { question: "کیفیت خدمات نمونه‌گیری", score: 9, maxScore: 10 },
        { question: "سرعت ارائه نتایج", score: 10, maxScore: 10 },
        { question: "رفتار کارکنان", score: 9, maxScore: 10 },
        { question: "دقت نتایج آزمایش", score: 8, maxScore: 10 }
      ],
      followupHistory: [
        {
          id: 1,
          date: "1403/05/22",
          agent: "زهرا احمدی",
          type: "ایمیل",
          result: "مشکل حل شد",
          notes: "مشتری راضی از خدمات بود. تشکر از تیم ارسال شد."
        }
      ]
    },
    {
      id: 4,
      customerName: "زهرا محمودی",
      phone: "09444555666",
      email: "zahra.mahmoudi@email.com",
      overallScore: 4,
      maxScore: 10,
      surveyDate: "1403/05/18",
      followupStatus: "نیاز به پیگیری",
      assignedAgent: "رضا صادقی",
      questions: [
        { question: "کیفیت خدمات نمونه‌گیری", score: 5, maxScore: 10 },
        { question: "سرعت ارائه نتایج", score: 3, maxScore: 10 },
        { question: "رفتار کارکنان", score: 4, maxScore: 10 },
        { question: "دقت نتایج آزمایش", score: 4, maxScore: 10 }
      ],
      followupHistory: []
    },
    {
      id: 5,
      customerName: "حسین یوسفی",
      phone: "09777888999",
      email: "hossein.yousefi@email.com",
      overallScore: 1,
      maxScore: 10,
      surveyDate: "1403/05/17",
      followupStatus: "در حال پیگیری",
      assignedAgent: "لیلا فراهانی",
      questions: [
        { question: "کیفیت خدمات نمونه‌گیری", score: 1, maxScore: 10 },
        { question: "سرعت ارائه نتایج", score: 1, maxScore: 10 },
        { question: "رفتار کارکنان", score: 2, maxScore: 10 },
        { question: "دقت نتایج آزمایش", score: 1, maxScore: 10 }
      ],
      followupHistory: [
        {
          id: 1,
          date: "1403/05/19",
          agent: "لیلا فراهانی",
          type: "تماس تلفنی",
          result: "عدم پاسخگویی",
          notes: "مشتری تماس را پاسخ نداد. تلاش مجدد فردا."
        },
        {
          id: 2,
          date: "1403/05/20",
          agent: "لیلا فراهانی",
          type: "پیامک",
          result: "نیاز به ارجاع",
          notes: "پیامک عذرخواهی ارسال شد. منتظر پاسخ مشتری."
        }
      ]
    },
    {
      id: 6,
      customerName: "سارا نوری",
      phone: "09333444555",
      email: "sara.nouri@email.com",
      overallScore: 8,
      maxScore: 10,
      surveyDate: "1403/05/22",
      followupStatus: "پیگیری شده",
      assignedAgent: "امیر حسینی",
      questions: [
        { question: "کیفیت خدمات نمونه‌گیری", score: 8, maxScore: 10 },
        { question: "سرعت ارائه نتایج", score: 9, maxScore: 10 },
        { question: "رفتار کارکنان", score: 8, maxScore: 10 },
        { question: "دقت نتایج آزمایش", score: 7, maxScore: 10 }
      ],
      followupHistory: []
    }
  ];

  // محاسبه آمار کلی
  const totalSurveys = surveyData.length;
  const averageScore = (surveyData.reduce((sum, survey) => sum + survey.overallScore, 0) / totalSurveys).toFixed(1);
  const dissatisfiedCustomers = surveyData.filter(survey => survey.overallScore <= 4).length;
  const successfulFollowups = surveyData.filter(survey => survey.followupStatus === "پیگیری شده").length;

  const getStatusBadge = (status: string) => {
    const configs = {
      "نیاز به پیگیری": { label: "نیاز به پیگیری", color: "bg-red-100 text-red-800" },
      "در حال پیگیری": { label: "در حال پیگیری", color: "bg-yellow-100 text-yellow-800" },
      "پیگیری شده": { label: "پیگیری شده", color: "bg-green-100 text-green-800" }
    } as const;
    
    const config = configs[status as keyof typeof configs];
    if (!config) return null;
    
    return <Badge className={`${config.color} hover:${config.color}`}>{config.label}</Badge>;
  };

  const isLowScore = (score: number) => score <= 4;

  const handleSubmitFollowup = () => {
    if (!selectedSurvey || !followupForm.type || !followupForm.result || !followupForm.notes) {
      alert("لطفاً همه فیلدها را تکمیل کنید");
      return;
    }

    // شبیه‌سازی ثبت گزارش
    const newFollowup = {
      id: Date.now(),
      date: new Date().toLocaleDateString('fa-IR'),
      agent: "کاربر فعلی", // در حالت واقعی از context یا state گرفته می‌شود
      type: followupForm.type,
      result: followupForm.result,
      notes: followupForm.notes
    };

    // افزودن به تاریخچه
    selectedSurvey.followupHistory.push(newFollowup);
    
    // پاک کردن فرم
    setFollowupForm({ type: "", result: "", notes: "" });
    
    alert("گزارش پیگیری با موفقیت ثبت شد");
  };

  const filteredSurveys = surveyData.filter(survey => {
    const matchesSearch = survey.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || survey.followupStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">گزارش نظرسنجی و پیگیری مشتریان</h1>
          <p className="text-gray-600 mt-1">مدیریت نظرسنجی‌ها و پیگیری مشتریان ناراضی</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button variant="outline">
            <FileText className="w-4 h-4 ml-2" />
            خروجی Excel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 ml-2" />
            نظرسنجی جدید
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">تعداد کل نظرسنجی‌ها</p>
                <p className="text-2xl font-bold text-gray-900">{totalSurveys.toLocaleString('fa-IR')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="p-3 bg-green-100 rounded-lg">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">میانگین امتیاز رضایت</p>
                <p className="text-2xl font-bold text-gray-900">{averageScore} / ۱۰</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional border-2 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-red-600 font-medium">مشتریان ناراضی (نیاز به پیگیری)</p>
                <p className="text-2xl font-bold text-red-700">{dissatisfiedCustomers.toLocaleString('fa-IR')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">پیگیری‌های موفق</p>
                <p className="text-2xl font-bold text-gray-900">{successfulFollowups.toLocaleString('fa-IR')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Survey Results Table */}
        <div className="lg:col-span-2">
          <Card className="card-professional">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>آخرین نتایج نظرسنجی</CardTitle>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="جستجو..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 w-48"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="وضعیت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه</SelectItem>
                      <SelectItem value="نیاز به پیگیری">نیاز به پیگیری</SelectItem>
                      <SelectItem value="در حال پیگیری">در حال پیگیری</SelectItem>
                      <SelectItem value="پیگیری شده">پیگیری شده</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-right py-3 px-4 font-medium text-gray-900">نام مشتری</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">امتیاز کل</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">وضعیت پیگیری</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">تاریخ نظرسنجی</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">مسئول پیگیری</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSurveys.map((survey) => (
                      <tr
                        key={survey.id}
                        onClick={() => setSelectedSurvey(survey)}
                        className={`border-b border-gray-100 cursor-pointer hover:shadow-sm transition-all ${
                          isLowScore(survey.overallScore) ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                {survey.customerName.split(' ')[0][0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900">{survey.customerName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <span className={`font-bold text-lg ${
                              isLowScore(survey.overallScore) ? 'text-red-600' : 'text-gray-900'
                            }`}>
                              {survey.overallScore}
                            </span>
                            <span className="text-gray-500">/ {survey.maxScore}</span>
                            {isLowScore(survey.overallScore) && (
                              <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(survey.followupStatus)}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{survey.surveyDate}</td>
                        <td className="py-3 px-4 text-gray-600">{survey.assignedAgent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Follow-up Panel */}
        <div className="lg:col-span-1">
          {selectedSurvey ? (
            <div className="space-y-6">
              {/* Survey Details */}
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <User className="w-5 h-5" />
                    <span>جزئیات نظرسنجی</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{selectedSurvey.customerName}</h3>
                      <p className="text-sm text-gray-600">{selectedSurvey.phone}</p>
                      <p className="text-sm text-gray-600">{selectedSurvey.email}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-sm text-gray-600">امتیاز کل:</span>
                      <span className={`text-xl font-bold ${
                        isLowScore(selectedSurvey.overallScore) ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {selectedSurvey.overallScore} / {selectedSurvey.maxScore}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">جزئیات امتیازات:</h4>
                      <div className="space-y-2">
                        {selectedSurvey.questions.map((q, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{q.question}</span>
                            <span className={`font-medium ${
                              q.score <= 4 ? 'text-red-600' : 'text-gray-900'
                            }`}>
                              {q.score}/{q.maxScore}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Follow-up Form */}
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <Edit className="w-5 h-5" />
                    <span>فرم ثبت گزارش پیگیری</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">نوع پیگیری</label>
                      <Select value={followupForm.type} onValueChange={(value) => 
                        setFollowupForm({...followupForm, type: value})
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب کنید" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="تماس تلفنی">تماس تلفنی</SelectItem>
                          <SelectItem value="ایمیل">ایمیل</SelectItem>
                          <SelectItem value="پیامک">پیامک</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">نتیجه پیگیری</label>
                      <Select value={followupForm.result} onValueChange={(value) => 
                        setFollowupForm({...followupForm, result: value})
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب کنید" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="مشکل حل شد">مشکل حل شد</SelectItem>
                          <SelectItem value="نیاز به ارجاع">نیاز به ارجاع</SelectItem>
                          <SelectItem value="عدم پاسخگویی">عدم پاسخگویی</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">یادداشت‌ها و توضیحات</label>
                      <Textarea
                        value={followupForm.notes}
                        onChange={(e) => setFollowupForm({...followupForm, notes: e.target.value})}
                        placeholder="توضیحات تکمیلی..."
                        rows={3}
                      />
                    </div>

                    <Button 
                      onClick={handleSubmitFollowup}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      ثبت گزارش
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Follow-up History */}
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <Clock className="w-5 h-5" />
                    <span>تاریخچه پیگیری‌ها</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedSurvey.followupHistory.length > 0 ? (
                    <div className="space-y-3">
                      {selectedSurvey.followupHistory.map((history) => (
                        <div key={history.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{history.agent}</span>
                            <span className="text-xs text-gray-500">{history.date}</span>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse mb-1">
                            <Badge variant="outline" className="text-xs">{history.type}</Badge>
                            <Badge variant="outline" className="text-xs">{history.result}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{history.notes}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      هنوز پیگیری‌ای ثبت نشده است
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="card-professional">
              <CardContent className="p-8 text-center">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">انتخاب نظرسنجی</h3>
                <p className="text-gray-600">برای مشاهده جزئیات و ثبت پیگیری، روی یکی از ردیف‌های جدول کلیک کنید</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}