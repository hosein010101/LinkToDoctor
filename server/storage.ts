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

export interface IStorage {
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

export class MemStorage implements IStorage {
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
    // Initialize sample lab services
    const services = [
      { name: "آزمایش خون کامل", code: "CBC", category: "هماتولوژی", price: "150000", preparationInstructions: "ناشتا نیاز نیست", sampleType: "خون", turnaroundTime: 4 },
      { name: "پروفایل لیپید", code: "LIPID", category: "بیوشیمی", price: "200000", preparationInstructions: "12 ساعت ناشتا", sampleType: "خون", turnaroundTime: 6 },
      { name: "قند خون ناشتا", code: "FBS", category: "بیوشیمی", price: "80000", preparationInstructions: "8 ساعت ناشتا", sampleType: "خون", turnaroundTime: 2 },
      { name: "تست کووید-19", code: "COVID", category: "میکروبیولوژی", price: "120000", preparationInstructions: "بدون نیاز به آماده‌سازی", sampleType: "سواب", turnaroundTime: 24 },
      { name: "آزمایش ادرار کامل", code: "UA", category: "اورولوژی", price: "100000", preparationInstructions: "نمونه صبحگاهی", sampleType: "ادرار", turnaroundTime: 3 },
    ];

    services.forEach(service => {
      this.createLabService(service as InsertLabService);
    });

    // Initialize sample collectors
    const sampleCollectors = [
      { name: "محمد تقوی", phone: "09123456789", isActive: true, currentLat: "35.7218", currentLng: "51.3347", status: "available" },
      { name: "فاطمه احمدی", phone: "09123456788", isActive: true, currentLat: "35.7318", currentLng: "51.3447", status: "busy" },
      { name: "علی رضایی", phone: "09123456787", isActive: true, currentLat: "35.7118", currentLng: "51.3247", status: "available" },
    ];

    sampleCollectors.forEach(collector => {
      this.createCollector(collector as InsertCollector);
    });

    // Initialize sample inventory
    const inventoryItems = [
      { itemName: "تیوب خون EDTA", category: "consumables", currentStock: 150, minThreshold: 50, unit: "عدد", supplier: "شرکت پارس طب" },
      { itemName: "سرنگ 5cc", category: "consumables", currentStock: 200, minThreshold: 100, unit: "عدد", supplier: "شرکت پارس طب" },
      { itemName: "کیت قند خون", category: "reagents", currentStock: 25, minThreshold: 10, unit: "کیت", supplier: "شرکت زیست فن" },
    ];

    inventoryItems.forEach(item => {
      this.createInventoryItem(item as InsertInventory);
    });
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

export const storage = new MemStorage();
