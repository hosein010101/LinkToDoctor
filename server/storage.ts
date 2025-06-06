import {
  patients,
  collectors,
  labServices,
  labOrders,
  orderServices,
  testResults,
  inventory,
  type Patient,
  type InsertPatient,
  type Collector,
  type InsertCollector,
  type LabService,
  type InsertLabService,
  type LabOrder,
  type InsertLabOrder,
  type OrderService,
  type InsertOrderService,
  type TestResult,
  type InsertTestResult,
  type Inventory,
  type InsertInventory,
} from "@shared/schema";

import {
  users,
  type User,
  type UpsertUser,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations - required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Patients
  getPatient(id: number): Promise<Patient | undefined>;
  getPatientByNationalId(nationalId: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  getAllPatients(): Promise<Patient[]>;

  // Collectors
  getCollector(id: number): Promise<Collector | undefined>;
  getAllCollectors(): Promise<Collector[]>;
  createCollector(collector: InsertCollector): Promise<Collector>;
  updateCollectorStatus(id: number, status: string, lat?: number, lng?: number): Promise<Collector | undefined>;

  // Lab Services
  getLabService(id: number): Promise<LabService | undefined>;
  getAllLabServices(): Promise<LabService[]>;
  createLabService(service: InsertLabService): Promise<LabService>;
  getLabServicesByCategory(category: string): Promise<LabService[]>;

  // Lab Orders
  getLabOrder(id: number): Promise<LabOrder | undefined>;
  getAllLabOrders(): Promise<LabOrder[]>;
  createLabOrder(order: InsertLabOrder): Promise<LabOrder>;
  updateLabOrderStatus(id: number, status: string): Promise<LabOrder | undefined>;
  assignCollectorToOrder(orderId: number, collectorId: number): Promise<LabOrder | undefined>;
  getOrdersByStatus(status: string): Promise<LabOrder[]>;
  getOrdersByCollector(collectorId: number): Promise<LabOrder[]>;

  // Order Services
  createOrderService(orderService: InsertOrderService): Promise<OrderService>;
  getOrderServices(orderId: number): Promise<OrderService[]>;

  // Test Results
  createTestResult(result: InsertTestResult): Promise<TestResult>;
  getTestResults(orderId: number): Promise<TestResult[]>;
  updateTestResult(id: number, result: string, status: string): Promise<TestResult | undefined>;

  // Inventory
  getAllInventory(): Promise<Inventory[]>;
  createInventoryItem(item: InsertInventory): Promise<Inventory>;
  updateInventoryStock(id: number, quantity: number): Promise<Inventory | undefined>;
  getLowStockItems(): Promise<Inventory[]>;

  // Dashboard Stats
  getDashboardStats(): Promise<{
    todayOrders: number;
    pendingCollection: number;
    readyResults: number;
    monthlyRevenue: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations - required for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Other operations delegated to existing MemStorage
  private memStorage = new MemStorage();

  async getPatient(id: number): Promise<Patient | undefined> {
    return this.memStorage.getPatient(id);
  }

  async getPatientByNationalId(nationalId: string): Promise<Patient | undefined> {
    return this.memStorage.getPatientByNationalId(nationalId);
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    return this.memStorage.createPatient(patient);
  }

  async getAllPatients(): Promise<Patient[]> {
    return this.memStorage.getAllPatients();
  }

  async getCollector(id: number): Promise<Collector | undefined> {
    return this.memStorage.getCollector(id);
  }

  async getAllCollectors(): Promise<Collector[]> {
    return this.memStorage.getAllCollectors();
  }

  async createCollector(collector: InsertCollector): Promise<Collector> {
    return this.memStorage.createCollector(collector);
  }

  async updateCollectorStatus(id: number, status: string, lat?: number, lng?: number): Promise<Collector | undefined> {
    return this.memStorage.updateCollectorStatus(id, status, lat, lng);
  }

  async getLabService(id: number): Promise<LabService | undefined> {
    return this.memStorage.getLabService(id);
  }

  async getAllLabServices(): Promise<LabService[]> {
    return this.memStorage.getAllLabServices();
  }

  async createLabService(service: InsertLabService): Promise<LabService> {
    return this.memStorage.createLabService(service);
  }

  async getLabServicesByCategory(category: string): Promise<LabService[]> {
    return this.memStorage.getLabServicesByCategory(category);
  }

  async getLabOrder(id: number): Promise<LabOrder | undefined> {
    return this.memStorage.getLabOrder(id);
  }

  async getAllLabOrders(): Promise<LabOrder[]> {
    return this.memStorage.getAllLabOrders();
  }

  async createLabOrder(order: InsertLabOrder): Promise<LabOrder> {
    return this.memStorage.createLabOrder(order);
  }

  async updateLabOrderStatus(id: number, status: string): Promise<LabOrder | undefined> {
    return this.memStorage.updateLabOrderStatus(id, status);
  }

  async assignCollectorToOrder(orderId: number, collectorId: number): Promise<LabOrder | undefined> {
    return this.memStorage.assignCollectorToOrder(orderId, collectorId);
  }

  async getOrdersByStatus(status: string): Promise<LabOrder[]> {
    return this.memStorage.getOrdersByStatus(status);
  }

  async getOrdersByCollector(collectorId: number): Promise<LabOrder[]> {
    return this.memStorage.getOrdersByCollector(collectorId);
  }

  async createOrderService(orderService: InsertOrderService): Promise<OrderService> {
    return this.memStorage.createOrderService(orderService);
  }

  async getOrderServices(orderId: number): Promise<OrderService[]> {
    return this.memStorage.getOrderServices(orderId);
  }

  async createTestResult(result: InsertTestResult): Promise<TestResult> {
    return this.memStorage.createTestResult(result);
  }

  async getTestResults(orderId: number): Promise<TestResult[]> {
    return this.memStorage.getTestResults(orderId);
  }

  async updateTestResult(id: number, result: string, status: string): Promise<TestResult | undefined> {
    return this.memStorage.updateTestResult(id, result, status);
  }

  async getAllInventory(): Promise<Inventory[]> {
    return this.memStorage.getAllInventory();
  }

  async createInventoryItem(item: InsertInventory): Promise<Inventory> {
    return this.memStorage.createInventoryItem(item);
  }

  async updateInventoryStock(id: number, quantity: number): Promise<Inventory | undefined> {
    return this.memStorage.updateInventoryStock(id, quantity);
  }

  async getLowStockItems(): Promise<Inventory[]> {
    return this.memStorage.getLowStockItems();
  }

  async getDashboardStats(): Promise<{
    todayOrders: number;
    pendingCollection: number;
    readyResults: number;
    monthlyRevenue: number;
  }> {
    return this.memStorage.getDashboardStats();
  }
}

export class MemStorage implements IStorage {
  // User operations - required for Replit Auth (but not used in memory storage)
  async getUser(id: string): Promise<User | undefined> {
    return undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    throw new Error("Memory storage does not support user operations");
  }
  private patients: Map<number, Patient>;
  private collectors: Map<number, Collector>;
  private labServices: Map<number, LabService>;
  private labOrders: Map<number, LabOrder>;
  private orderServices: Map<number, OrderService>;
  private testResults: Map<number, TestResult>;
  private inventory: Map<number, Inventory>;
  private currentIds: {
    patients: number;
    collectors: number;
    labServices: number;
    labOrders: number;
    orderServices: number;
    testResults: number;
    inventory: number;
  };

  constructor() {
    this.patients = new Map();
    this.collectors = new Map();
    this.labServices = new Map();
    this.labOrders = new Map();
    this.orderServices = new Map();
    this.testResults = new Map();
    this.inventory = new Map();
    this.currentIds = {
      patients: 1,
      collectors: 1,
      labServices: 1,
      labOrders: 1,
      orderServices: 1,
      testResults: 1,
      inventory: 1,
    };

    this.initializeData();
  }

  private initializeData() {
    this.generateComprehensiveTestData();
  }

  // Generate 500 comprehensive test records
  generateComprehensiveTestData() {
    this.clearAllData();
    
    // Persian names for realistic data
    const maleNames = [
      "علی احمدی", "محمد رضایی", "حسن موسوی", "احمد کریمی", "مرتضی صادقی", "رضا نوری", "سعید حسینی", 
      "کامران زارع", "فرهاد مرادی", "بهزاد طاهری", "مهدی فروغی", "امین شریفی", "پوریا کاظمی", "آرش جعفری",
      "داریوش محمدی", "کیوان اسدی", "سامان قاسمی", "نیما یوسفی", "بابک فاضلی", "مسعود رحیمی", "هادی خانی",
      "شهرام توکلی", "مهران غلامی", "فریدون اصفهانی", "جواد شیرازی"
    ];
    
    const femaleNames = [
      "فاطمه احمدی", "زهرا رضایی", "مریم موسوی", "لیلا کریمی", "سارا صادقی", "نگار نوری", "پریسا حسینی",
      "شیدا زارع", "ندا مرادی", "آناهیتا طاهری", "رها فروغی", "دریا شریفی", "یاسمن کاظمی", "کیمیا جعفری",
      "سپیده محمدی", "گلناز اسدی", "مهسا قاسمی", "الهام یوسفی", "بهاره فاضلی", "مینا رحیمی", "شهرزاد خانی",
      "طاهره توکلی", "مرضیه غلامی", "سمیرا اصفهانی", "نسیم شیرازی"
    ];

    const addresses = [
      "تهران، خیابان ولیعصر", "مشهد، خیابان امام رضا", "اصفهان، خیابان چهارباغ", "شیراز، خیابان زند",
      "تبریز، خیابان شهریار", "کرج، خیابان طالقانی", "اهواز، خیابان کیانپارس", "قم، خیابان معلم",
      "رشت، خیابان گیلان", "کرمان، خیابان شهید بهشتی", "یزد، خیابان صفائیه", "ساری، خیابان طبرستان",
      "اراک، خیابان ولیعصر", "همدان، خیابان بوعلی", "بوشهر، خیابان پاسداران", "گرگان، خیابان ولیعصر",
      "زاهدان، خیابان دانشگاه", "بندرعباس، خیابان امام خمینی", "اردبیل، خیابان شریعتی", "بجنورد، خیابان پاستور"
    ];

    // Generate 500 patients
    for (let i = 1; i <= 500; i++) {
      const isMan = Math.random() > 0.5;
      const names = isMan ? maleNames : femaleNames;
      const name = names[Math.floor(Math.random() * names.length)];
      
      const patient: Patient = {
        id: i,
        name,
        nationalId: this.generateNationalId(),
        phone: this.generatePhoneNumber(),
        age: Math.floor(Math.random() * 70) + 15,
        address: addresses[Math.floor(Math.random() * addresses.length)] + `، پلاک ${Math.floor(Math.random() * 999) + 1}`,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      };
      this.patients.set(i, patient);
    }

    // Generate 30 collectors with variety
    const collectorNames = [
      "محمد تقوی", "زهرا موسوی", "علی صادقی", "مریم حسینی", "رضا کریمی", "فاطمه رضایی",
      "حسن احمدی", "سارا نوری", "امیر شریفی", "لیلا محمدی", "بهزاد طاهری", "نگار فروغی",
      "کامران زارع", "پریسا مرادی", "سعید حسینی", "شیدا کاظمی", "مهدی یوسفی", "ندا اسدی",
      "آرش قاسمی", "رها توکلی", "پوریا فاضلی", "دریا رحیمی", "نیما خانی", "یاسمن غلامی",
      "بابک اصفهانی", "کیمیا شیرازی", "مسعود تبریزی", "سپیده کرجی", "هادی اهوازی", "گلناز قمی"
    ];

    for (let i = 1; i <= 30; i++) {
      const collector: Collector = {
        id: i,
        name: collectorNames[i - 1],
        phone: this.generatePhoneNumber(),
        isActive: Math.random() > 0.15,
        currentLat: (35 + Math.random() * 5).toFixed(4),
        currentLng: (50 + Math.random() * 10).toFixed(4),
        status: this.getRandomCollectorStatus(),
      };
      this.collectors.set(i, collector);
    }

    // Comprehensive lab services
    const labServices = [
      { name: "آزمایش خون کامل", code: "CBC", category: "هماتولوژی", price: "150000", prep: "ناشتا نیاز نیست", sample: "خون", time: 4 },
      { name: "پروفایل لیپید", code: "LIPID", category: "بیوشیمی", price: "200000", prep: "12 ساعت ناشتا", sample: "خون", time: 6 },
      { name: "قند خون ناشتا", code: "FBS", category: "بیوشیمی", price: "80000", prep: "8 ساعت ناشتا", sample: "خون", time: 2 },
      { name: "تست کووید-19", code: "COVID", category: "میکروبیولوژی", price: "120000", prep: "بدون نیاز به آماده‌سازی", sample: "سواب", time: 24 },
      { name: "آزمایش ادرار کامل", code: "UA", category: "اورولوژی", price: "100000", prep: "نمونه صبحگاهی", sample: "ادرار", time: 3 },
      { name: "تست تیروئید TSH", code: "TSH", category: "اندوکرین", price: "180000", prep: "ناشتا نیاز نیست", sample: "خون", time: 12 },
      { name: "آزمایش کبد", code: "LFT", category: "بیوشیمی", price: "220000", prep: "8 ساعت ناشتا", sample: "خون", time: 8 },
      { name: "تست کلیه", code: "RFT", category: "بیوشیمی", price: "190000", prep: "ناشتا نیاز نیست", sample: "خون", time: 6 },
      { name: "ویتامین D", code: "VIT-D", category: "اندوکرین", price: "250000", prep: "ناشتا نیاز نیست", sample: "خون", time: 24 },
      { name: "تست آلرژی", code: "ALLERGY", category: "ایمونولوژی", price: "350000", prep: "ناشتا نیاز نیست", sample: "خون", time: 48 },
      { name: "هموگلوبین A1C", code: "HBA1C", category: "بیوشیمی", price: "160000", prep: "ناشتا نیاز نیست", sample: "خون", time: 8 },
      { name: "تست هپاتیت B", code: "HBS-AG", category: "ویروس‌شناسی", price: "130000", prep: "ناشتا نیاز نیست", sample: "خون", time: 12 },
    ];

    labServices.forEach((service, index) => {
      const labService: LabService = {
        id: index + 1,
        name: service.name,
        code: service.code,
        category: service.category,
        price: service.price,
        preparationInstructions: service.prep,
        sampleType: service.sample,
        turnaroundTime: service.time,
      };
      this.labServices.set(index + 1, labService);
    });

    // Generate 200 diverse lab orders
    for (let i = 1; i <= 200; i++) {
      const patientId = Math.floor(Math.random() * 500) + 1;
      const collectorId = Math.random() > 0.3 ? Math.floor(Math.random() * 30) + 1 : undefined;
      
      const order: LabOrder = {
        id: i,
        orderNumber: `LAB-${new Date().getFullYear()}-${String(i).padStart(4, '0')}`,
        patientId,
        collectorId,
        status: this.getRandomOrderStatus(),
        scheduledDate: Math.random() > 0.4 ? this.generateRandomDate(-30, 30) : undefined,
        scheduledTimeSlot: Math.random() > 0.4 ? this.getRandomTimeSlot() : undefined,
        collectionAddress: addresses[Math.floor(Math.random() * addresses.length)] + `، پلاک ${Math.floor(Math.random() * 999) + 1}`,
        priority: this.getRandomPriority(),
        notes: Math.random() > 0.7 ? "نکات خاص برای نمونه‌گیری - توجه به شرایط بیمار" : undefined,
        totalAmount: String(Math.floor(Math.random() * 800000) + 100000),
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      };
      this.labOrders.set(i, order);

      // Generate realistic order services
      const numServices = Math.floor(Math.random() * 4) + 1; // 1-4 services
      const selectedServices = this.getRandomServices(numServices, labServices.length);
      
      selectedServices.forEach((serviceId, index) => {
        const orderService: OrderService = {
          id: (i - 1) * 4 + index + 1,
          orderId: i,
          serviceId,
          quantity: 1,
          price: labServices[serviceId - 1].price,
        };
        this.orderServices.set(orderService.id, orderService);

        // Generate test results for appropriate orders
        if (order.status === "completed" || order.status === "delivered" || 
           (order.status === "processing" && Math.random() > 0.5)) {
          const result: TestResult = {
            id: (i - 1) * 4 + index + 1,
            orderId: i,
            serviceId,
            result: this.generateRealisticTestResult(serviceId),
            normalRange: this.getNormalRange(serviceId),
            unit: this.getTestUnit(serviceId),
            status: this.getRandomTestStatus(),
            enteredAt: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000),
            reviewedBy: Math.random() > 0.4 ? "دکتر " + maleNames[Math.floor(Math.random() * maleNames.length)] : undefined,
            reviewedAt: Math.random() > 0.4 ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000) : undefined,
          };
          this.testResults.set(result.id, result);
        }
      });
    }

    // Comprehensive inventory
    const inventoryItems = [
      { name: "تیوب خون EDTA", cat: "consumables", min: 100, unit: "عدد", supplier: "شرکت پارس طب" },
      { name: "سرنگ 5cc", cat: "consumables", min: 150, unit: "عدد", supplier: "شرکت پارس طب" },
      { name: "کیت قند خون", cat: "reagents", min: 20, unit: "کیت", supplier: "شرکت زیست فن" },
      { name: "دستکش لاتکس", cat: "consumables", min: 500, unit: "جفت", supplier: "پخش دارو البرز" },
      { name: "میکروسکوپ", cat: "equipment", min: 3, unit: "دستگاه", supplier: "تجهیزات پزشکی ایران" },
      { name: "سانتریفیوژ", cat: "equipment", min: 2, unit: "دستگاه", supplier: "شرکت فناوری طب" },
      { name: "معرف بیوشیمی", cat: "reagents", min: 30, unit: "کیت", supplier: "آزمایشگاه مرجع" },
      { name: "محلول ضدعفونی", cat: "consumables", min: 50, unit: "لیتر", supplier: "بهداشت ایران" },
      { name: "کاغذ فیلتر", cat: "consumables", min: 80, unit: "بسته", supplier: "تجهیزات آزمایشگاه" },
      { name: "پیپت میکرو", cat: "equipment", min: 10, unit: "عدد", supplier: "ابزار دقیق پارس" },
      { name: "لام میکروسکوپ", cat: "consumables", min: 200, unit: "عدد", supplier: "شیشه آلات علمی" },
      { name: "کیت تیروئید", cat: "reagents", min: 15, unit: "کیت", supplier: "شرکت تشخیص طب" },
    ];

    inventoryItems.forEach((item, index) => {
      const randomStock = Math.floor(Math.random() * (item.min * 2.5)) + Math.floor(item.min * 0.3);
      const inventory: Inventory = {
        id: index + 1,
        itemName: item.name,
        category: item.cat as any,
        currentStock: randomStock,
        minThreshold: item.min,
        unit: item.unit,
        supplier: item.supplier,
        lastRestocked: new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000),
      };
      this.inventory.set(index + 1, inventory);
    });

    // Update current IDs
    this.currentIds.patients = 500;
    this.currentIds.collectors = 30;
    this.currentIds.labServices = 12;
    this.currentIds.labOrders = 200;
    this.currentIds.orderServices = 800;
    this.currentIds.testResults = 600;
    this.currentIds.inventory = 12;
  }

  // Helper methods for realistic data generation
  private generateNationalId(): string {
    return Math.floor(Math.random() * 9000000000) + 1000000000 + "";
  }

  private generatePhoneNumber(): string {
    const prefixes = ["0912", "0913", "0914", "0915", "0916", "0917", "0918", "0919", "0901", "0902", "0903", "0905"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    return prefix + number;
  }

  private generateRandomDate(minDays: number, maxDays: number): Date {
    const now = new Date();
    const randomDays = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
    return new Date(now.getTime() + randomDays * 24 * 60 * 60 * 1000);
  }

  private getRandomCollectorStatus(): "available" | "busy" | "offline" {
    const rand = Math.random();
    if (rand < 0.5) return "available";
    if (rand < 0.8) return "busy";
    return "offline";
  }

  private getRandomOrderStatus(): "registered" | "collection_scheduled" | "collected" | "processing" | "completed" | "delivered" {
    const statuses = ["registered", "collection_scheduled", "collected", "processing", "completed", "delivered"];
    const weights = [0.15, 0.20, 0.15, 0.20, 0.20, 0.10];
    return this.weightedRandom(statuses, weights) as any;
  }

  private getRandomPriority(): "urgent" | "high" | "normal" | "low" {
    const priorities = ["urgent", "high", "normal", "low"];
    const weights = [0.05, 0.15, 0.70, 0.10];
    return this.weightedRandom(priorities, weights) as any;
  }

  private getRandomTimeSlot(): string {
    const slots = ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00"];
    return slots[Math.floor(Math.random() * slots.length)];
  }

  private getRandomServices(count: number, maxServices: number): number[] {
    const services = Array.from({length: maxServices}, (_, i) => i + 1);
    return services.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  private getRandomTestStatus(): "pending" | "completed" | "reviewed" | "validated" {
    const statuses = ["pending", "completed", "reviewed", "validated"];
    const weights = [0.2, 0.3, 0.3, 0.2];
    return this.weightedRandom(statuses, weights) as any;
  }

  private weightedRandom(items: string[], weights: number[]): string {
    const random = Math.random();
    let cumulative = 0;
    for (let i = 0; i < items.length; i++) {
      cumulative += weights[i];
      if (random < cumulative) return items[i];
    }
    return items[0];
  }

  private generateRealisticTestResult(serviceId: number): string {
    const results: Record<number, () => string> = {
      1: () => `WBC: ${(4000 + Math.random() * 7000).toFixed(0)}/μL, RBC: ${(4.2 + Math.random() * 1.8).toFixed(1)} M/μL, HGB: ${(12 + Math.random() * 4).toFixed(1)} g/dL`,
      2: () => `کلسترول: ${(150 + Math.random() * 100).toFixed(0)} mg/dL, تری‌گلیسرید: ${(80 + Math.random() * 120).toFixed(0)} mg/dL, HDL: ${(40 + Math.random() * 40).toFixed(0)} mg/dL`,
      3: () => `${(70 + Math.random() * 60).toFixed(0)} mg/dL`,
      4: () => Math.random() > 0.85 ? "مثبت - حضور ویروس تایید شد" : "منفی - عدم حضور ویروس",
      5: () => `${Math.random() > 0.1 ? "طبیعی" : "غیرطبیعی"} - گلبول‌های سفید: ${(3 + Math.random() * 7).toFixed(0)}, قرمز: ${(1 + Math.random() * 3).toFixed(0)}`,
      6: () => `${(0.5 + Math.random() * 4).toFixed(2)} mIU/L`,
      7: () => `ALT: ${(10 + Math.random() * 40).toFixed(0)} U/L, AST: ${(10 + Math.random() * 35).toFixed(0)} U/L, بیلی‌روبین: ${(0.3 + Math.random() * 1.2).toFixed(1)} mg/dL`,
      8: () => `کراتینین: ${(0.6 + Math.random() * 1.2).toFixed(1)} mg/dL, اوره: ${(15 + Math.random() * 35).toFixed(0)} mg/dL`,
      9: () => `${(10 + Math.random() * 70).toFixed(1)} ng/mL`,
      10: () => `${Math.floor(Math.random() * 8)} مورد حساسیت شناسایی شد`,
      11: () => `${(4.5 + Math.random() * 3).toFixed(1)}%`,
      12: () => Math.random() > 0.95 ? "مثبت" : "منفی",
    };
    return results[serviceId]?.() || "نتیجه در حال بررسی است";
  }

  private getNormalRange(serviceId: number): string {
    const ranges: Record<number, string> = {
      1: "WBC: 4000-11000/μL, RBC: 4.2-6.0 M/μL, HGB: 12-18 g/dL",
      2: "کلسترول: <200 mg/dL, تری‌گلیسرید: <150 mg/dL, HDL: >40 mg/dL",
      3: "70-100 mg/dL",
      4: "منفی",
      5: "طبیعی",
      6: "0.5-5.0 mIU/L",
      7: "ALT: 0-40 U/L, AST: 0-35 U/L, بیلی‌روبین: 0.3-1.5 mg/dL",
      8: "کراتینین: 0.6-1.4 mg/dL, اوره: 15-45 mg/dL",
      9: "30-100 ng/mL",
      10: "منفی",
      11: "4.0-6.0%",
      12: "منفی",
    };
    return ranges[serviceId] || "در حال بررسی";
  }

  private getTestUnit(serviceId: number): string {
    const units: Record<number, string> = {
      1: "متنوع", 2: "mg/dL", 3: "mg/dL", 4: "-", 5: "-", 6: "mIU/L",
      7: "U/L", 8: "mg/dL", 9: "ng/mL", 10: "واحد", 11: "%", 12: "-"
    };
    return units[serviceId] || "";
  }

  // Method to clear all data (reset functionality)
  clearAllData() {
    this.patients.clear();
    this.collectors.clear();
    this.labServices.clear();
    this.labOrders.clear();
    this.orderServices.clear();
    this.testResults.clear();
    this.inventory.clear();
    
    this.currentIds = {
      patients: 1,
      collectors: 1,
      labServices: 1,
      labOrders: 1,
      orderServices: 1,
      testResults: 1,
      inventory: 1,
    };
  }

  // Patients
  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async getPatientByNationalId(nationalId: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find(patient => patient.nationalId === nationalId);
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = this.currentIds.patients++;
    const patient: Patient = {
      ...insertPatient,
      id,
      createdAt: new Date(),
    };
    this.patients.set(id, patient);
    return patient;
  }

  async getAllPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  // Collectors
  async getCollector(id: number): Promise<Collector | undefined> {
    return this.collectors.get(id);
  }

  async getAllCollectors(): Promise<Collector[]> {
    return Array.from(this.collectors.values());
  }

  async createCollector(insertCollector: InsertCollector): Promise<Collector> {
    const id = this.currentIds.collectors++;
    const collector: Collector = {
      ...insertCollector,
      id,
    };
    this.collectors.set(id, collector);
    return collector;
  }

  async updateCollectorStatus(id: number, status: string, lat?: number, lng?: number): Promise<Collector | undefined> {
    const collector = this.collectors.get(id);
    if (!collector) return undefined;

    const updated: Collector = {
      ...collector,
      status,
      currentLat: lat?.toString(),
      currentLng: lng?.toString(),
    };
    this.collectors.set(id, updated);
    return updated;
  }

  // Lab Services
  async getLabService(id: number): Promise<LabService | undefined> {
    return this.labServices.get(id);
  }

  async getAllLabServices(): Promise<LabService[]> {
    return Array.from(this.labServices.values());
  }

  async createLabService(insertService: InsertLabService): Promise<LabService> {
    const id = this.currentIds.labServices++;
    const service: LabService = {
      ...insertService,
      id,
    };
    this.labServices.set(id, service);
    return service;
  }

  async getLabServicesByCategory(category: string): Promise<LabService[]> {
    return Array.from(this.labServices.values()).filter(service => service.category === category);
  }

  // Lab Orders
  async getLabOrder(id: number): Promise<LabOrder | undefined> {
    return this.labOrders.get(id);
  }

  async getAllLabOrders(): Promise<LabOrder[]> {
    return Array.from(this.labOrders.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createLabOrder(insertOrder: InsertLabOrder): Promise<LabOrder> {
    const id = this.currentIds.labOrders++;
    const orderNumber = `LAB-2024-${id.toString().padStart(3, '0')}`;
    const now = new Date();
    const order: LabOrder = {
      ...insertOrder,
      id,
      orderNumber,
      createdAt: now,
      updatedAt: now,
    };
    this.labOrders.set(id, order);
    return order;
  }

  async updateLabOrderStatus(id: number, status: string): Promise<LabOrder | undefined> {
    const order = this.labOrders.get(id);
    if (!order) return undefined;

    const updated: LabOrder = {
      ...order,
      status,
      updatedAt: new Date(),
    };
    this.labOrders.set(id, updated);
    return updated;
  }

  async assignCollectorToOrder(orderId: number, collectorId: number): Promise<LabOrder | undefined> {
    const order = this.labOrders.get(orderId);
    if (!order) return undefined;

    const updated: LabOrder = {
      ...order,
      collectorId,
      status: "collection_scheduled",
      updatedAt: new Date(),
    };
    this.labOrders.set(orderId, updated);
    return updated;
  }

  async getOrdersByStatus(status: string): Promise<LabOrder[]> {
    return Array.from(this.labOrders.values()).filter(order => order.status === status);
  }

  async getOrdersByCollector(collectorId: number): Promise<LabOrder[]> {
    return Array.from(this.labOrders.values()).filter(order => order.collectorId === collectorId);
  }

  // Order Services
  async createOrderService(insertOrderService: InsertOrderService): Promise<OrderService> {
    const id = this.currentIds.orderServices++;
    const orderService: OrderService = {
      ...insertOrderService,
      id,
    };
    this.orderServices.set(id, orderService);
    return orderService;
  }

  async getOrderServices(orderId: number): Promise<OrderService[]> {
    return Array.from(this.orderServices.values()).filter(os => os.orderId === orderId);
  }

  // Test Results
  async createTestResult(insertResult: InsertTestResult): Promise<TestResult> {
    const id = this.currentIds.testResults++;
    const result: TestResult = {
      ...insertResult,
      id,
      enteredAt: new Date(),
    };
    this.testResults.set(id, result);
    return result;
  }

  async getTestResults(orderId: number): Promise<TestResult[]> {
    return Array.from(this.testResults.values()).filter(result => result.orderId === orderId);
  }

  async updateTestResult(id: number, result: string, status: string): Promise<TestResult | undefined> {
    const testResult = this.testResults.get(id);
    if (!testResult) return undefined;

    const updated: TestResult = {
      ...testResult,
      result,
      status,
    };
    this.testResults.set(id, updated);
    return updated;
  }

  // Inventory
  async getAllInventory(): Promise<Inventory[]> {
    return Array.from(this.inventory.values());
  }

  async createInventoryItem(insertItem: InsertInventory): Promise<Inventory> {
    const id = this.currentIds.inventory++;
    const item: Inventory = {
      ...insertItem,
      id,
      lastRestocked: new Date(),
    };
    this.inventory.set(id, item);
    return item;
  }

  async updateInventoryStock(id: number, quantity: number): Promise<Inventory | undefined> {
    const item = this.inventory.get(id);
    if (!item) return undefined;

    const updated: Inventory = {
      ...item,
      currentStock: item.currentStock + quantity,
      lastRestocked: quantity > 0 ? new Date() : item.lastRestocked,
    };
    this.inventory.set(id, updated);
    return updated;
  }

  async getLowStockItems(): Promise<Inventory[]> {
    return Array.from(this.inventory.values()).filter(item => item.currentStock <= item.minThreshold);
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<{
    todayOrders: number;
    pendingCollection: number;
    readyResults: number;
    monthlyRevenue: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayOrders = Array.from(this.labOrders.values()).filter(order => 
      new Date(order.createdAt) >= today
    ).length;
    
    const pendingCollection = Array.from(this.labOrders.values()).filter(order => 
      order.status === "registered" || order.status === "collection_scheduled"
    ).length;
    
    const readyResults = Array.from(this.labOrders.values()).filter(order => 
      order.status === "completed"
    ).length;
    
    const monthlyRevenue = Array.from(this.labOrders.values())
      .filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear();
      })
      .reduce((total, order) => total + parseFloat(order.totalAmount), 0);

    return {
      todayOrders,
      pendingCollection,
      readyResults,
      monthlyRevenue,
    };
  }
}

export const storage = new DatabaseStorage();
