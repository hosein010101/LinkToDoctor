// Shared types for the medical lab management system
export interface Patient {
  id: number;
  name: string;
  nationalId: string;
  phone: string;
  age: number;
  address: string;
  createdAt: string;
}

export interface Collector {
  id: number;
  name: string;
  phone: string;
  isActive: boolean;
  currentLat?: string;
  currentLng?: string;
  status: "available" | "busy" | "offline";
}

export interface LabService {
  id: number;
  name: string;
  code: string;
  category: string;
  price: string;
  preparationInstructions?: string;
  sampleType: string;
  turnaroundTime: number;
}

export interface LabOrder {
  id: number;
  orderNumber: string;
  patientId: number;
  collectorId?: number;
  status: "registered" | "collection_scheduled" | "collected" | "processing" | "completed" | "delivered";
  scheduledDate?: string;
  scheduledTimeSlot?: string;
  collectionAddress: string;
  priority: "urgent" | "high" | "normal" | "low";
  notes?: string;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderWithDetails extends LabOrder {
  patient: Patient;
  collector?: Collector;
  services: OrderService[];
  results?: TestResult[];
}

export interface OrderService {
  id: number;
  orderId: number;
  serviceId: number;
  quantity: number;
  price: string;
}

export interface TestResult {
  id: number;
  orderId: number;
  serviceId: number;
  result?: string;
  normalRange?: string;
  unit?: string;
  status: "pending" | "completed" | "reviewed" | "validated";
  enteredAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface InventoryItem {
  id: number;
  itemName: string;
  category: "consumables" | "equipment" | "reagents";
  currentStock: number;
  minThreshold: number;
  unit: string;
  supplier?: string;
  lastRestocked?: string;
}

export interface DashboardStats {
  todayOrders: number;
  pendingCollection: number;
  readyResults: number;
  monthlyRevenue: number;
}

export type OrderStatus = LabOrder["status"];
export type CollectorStatus = Collector["status"];
export type TestResultStatus = TestResult["status"];
export type InventoryCategory = InventoryItem["category"];
export type Priority = LabOrder["priority"];
