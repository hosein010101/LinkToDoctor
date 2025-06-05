import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HelpCircle, Search, Phone, Mail, MessageCircle, FileText, ChevronRight, Clock, CheckCircle } from "lucide-react";

export default function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "",
    priority: "",
    description: ""
  });

  const faqs = [
    {
      id: 1,
      question: "چگونه سفارش جدیدی ثبت کنم؟",
      answer: "برای ثبت سفارش جدید، از منوی اصلی روی 'سفارش جدید' کلیک کنید و مراحل را دنبال کنید.",
      category: "سفارشات"
    },
    {
      id: 2,
      question: "چطور وضعیت نمونه‌گیری را پیگیری کنم؟",
      answer: "در بخش 'پیگیری سفارشات' می‌توانید وضعیت تمام نمونه‌گیری‌های خود را مشاهده کنید.",
      category: "پیگیری"
    },
    {
      id: 3,
      question: "چگونه گزارش‌های آزمایش را دانلود کنم؟",
      answer: "پس از آماده شدن نتایج، از بخش 'نتایج آزمایش' فایل PDF گزارش را دانلود کنید.",
      category: "گزارشات"
    }
  ];

  const supportTickets = [
    {
      id: "T-2024-001",
      subject: "مشکل در ورود به سیستم",
      status: "در حال بررسی",
      priority: "بالا",
      createdAt: "۱۴۰۳/۰۱/۱۵",
      lastUpdate: "۲ ساعت پیش"
    },
    {
      id: "T-2024-002", 
      subject: "درخواست تغییر زمان نمونه‌گیری",
      status: "حل شده",
      priority: "متوسط",
      createdAt: "۱۴۰۳/۰۱/۱۰",
      lastUpdate: "۱ روز پیش"
    }
  ];

  const handleSubmitTicket = () => {
    // API call to submit support ticket
    console.log("Submitting ticket:", ticketForm);
    setTicketForm({ subject: "", category: "", priority: "", description: "" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "حل شده": return "bg-green-100 text-green-800";
      case "در حال بررسی": return "bg-blue-100 text-blue-800";
      case "منتظر پاسخ": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "بالا": return "bg-red-100 text-red-800";
      case "متوسط": return "bg-yellow-100 text-yellow-800";
      case "پایین": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 space-x-reverse">
        <HelpCircle className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">راهنما و پشتیبانی</h1>
      </div>

      {/* Quick Help Search */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">چطور می‌توانیم کمک کنیم؟</h2>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="جستجو در راهنما و سوالات متداول..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Options */}
        <Card>
          <CardHeader>
            <CardTitle>راه‌های تماس</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start space-x-2 space-x-reverse h-12">
                <Phone className="w-5 h-5 text-blue-600" />
                <div className="text-right">
                  <div className="font-medium">تماس تلفنی</div>
                  <div className="text-sm text-gray-500">۰۲۱-۱۲۳۴۵۶۷۸</div>
                </div>
              </Button>

              <Button variant="outline" className="w-full justify-start space-x-2 space-x-reverse h-12">
                <Mail className="w-5 h-5 text-green-600" />
                <div className="text-right">
                  <div className="font-medium">ایمیل پشتیبانی</div>
                  <div className="text-sm text-gray-500">support@linktodoctor.com</div>
                </div>
              </Button>

              <Button variant="outline" className="w-full justify-start space-x-2 space-x-reverse h-12">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                <div className="text-right">
                  <div className="font-medium">چت آنلاین</div>
                  <div className="text-sm text-gray-500">پاسخ فوری در ساعات اداری</div>
                </div>
              </Button>
            </div>

            <Separator />

            <div className="text-center space-y-2">
              <h3 className="font-medium">ساعات پشتیبانی</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>شنبه تا چهارشنبه: ۸:۰۰ - ۱۷:۰۰</div>
                <div>پنج‌شنبه: ۸:۰۰ - ۱۳:۰۰</div>
                <div className="text-red-600">جمعه: تعطیل</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <FileText className="w-5 h-5" />
              <span>سوالات متداول</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqs.filter(faq => 
                searchQuery === "" || 
                faq.question.includes(searchQuery) || 
                faq.answer.includes(searchQuery)
              ).map((faq) => (
                <div key={faq.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                    <Badge variant="outline" className="mr-2">{faq.category}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Ticket */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>ارسال درخواست پشتیبانی</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">موضوع</Label>
                <Input
                  id="subject"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder="خلاصه‌ای از مشکل خود بنویسید"
                />
              </div>

              <div className="space-y-2">
                <Label>دسته‌بندی</Label>
                <Select value={ticketForm.category} onValueChange={(value) => setTicketForm({ ...ticketForm, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">مشکل فنی</SelectItem>
                    <SelectItem value="account">مسائل حساب کاربری</SelectItem>
                    <SelectItem value="orders">سفارشات و نمونه‌گیری</SelectItem>
                    <SelectItem value="billing">مالی و پرداخت</SelectItem>
                    <SelectItem value="other">سایر موارد</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>اولویت</Label>
              <Select value={ticketForm.priority} onValueChange={(value) => setTicketForm({ ...ticketForm, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اولویت را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">پایین</SelectItem>
                  <SelectItem value="medium">متوسط</SelectItem>
                  <SelectItem value="high">بالا</SelectItem>
                  <SelectItem value="urgent">فوری</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">توضیحات تکمیلی</Label>
              <Textarea
                id="description"
                value={ticketForm.description}
                onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                placeholder="مشکل خود را به تفصیل شرح دهید..."
                rows={4}
              />
            </div>

            <Button onClick={handleSubmitTicket} className="w-full">
              ارسال درخواست
            </Button>
          </CardContent>
        </Card>

        {/* My Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>درخواست‌های من</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {supportTickets.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600">#{ticket.id}</span>
                      <Badge variant="outline" className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm">{ticket.subject}</h4>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <Clock className="w-3 h-3" />
                        <span>{ticket.lastUpdate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}