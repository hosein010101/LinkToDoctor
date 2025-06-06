import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nationalId: text("national_id").notNull().unique(),
  phone: text("phone").notNull(),
  age: integer("age").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const collectors = pgTable("collectors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  currentLat: decimal("current_lat", { precision: 10, scale: 8 }),
  currentLng: decimal("current_lng", { precision: 11, scale: 8 }),
  status: text("status").notNull().default("available"), // available, busy, offline
});

export const labServices = pgTable("lab_services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  category: text("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  preparationInstructions: text("preparation_instructions"),
  sampleType: text("sample_type").notNull(), // blood, urine, etc.
  turnaroundTime: integer("turnaround_time").notNull(), // hours
});

export const labOrders = pgTable("lab_orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  collectorId: integer("collector_id").references(() => collectors.id),
  status: text("status").notNull().default("registered"), // registered, collection_scheduled, collected, processing, completed, delivered
  scheduledDate: timestamp("scheduled_date"),
  scheduledTimeSlot: text("scheduled_time_slot"),
  collectionAddress: text("collection_address").notNull(),
  priority: text("priority").notNull().default("normal"), // urgent, high, normal, low
  notes: text("notes"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderServices = pgTable("order_services", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => labOrders.id).notNull(),
  serviceId: integer("service_id").references(() => labServices.id).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const testResults = pgTable("test_results", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => labOrders.id).notNull(),
  serviceId: integer("service_id").references(() => labServices.id).notNull(),
  result: text("result"),
  normalRange: text("normal_range"),
  unit: text("unit"),
  status: text("status").notNull().default("pending"), // pending, completed, reviewed, validated
  enteredAt: timestamp("entered_at").defaultNow().notNull(),
  reviewedBy: text("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
});

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  itemName: text("item_name").notNull(),
  category: text("category").notNull(), // consumables, equipment, reagents
  currentStock: integer("current_stock").notNull(),
  minThreshold: integer("min_threshold").notNull(),
  unit: text("unit").notNull(),
  supplier: text("supplier"),
  lastRestocked: timestamp("last_restocked"),
});

// Insert schemas
export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
});

export const insertCollectorSchema = createInsertSchema(collectors).omit({
  id: true,
});

export const insertLabServiceSchema = createInsertSchema(labServices).omit({
  id: true,
});

export const insertLabOrderSchema = createInsertSchema(labOrders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderServiceSchema = createInsertSchema(orderServices).omit({
  id: true,
});

export const insertTestResultSchema = createInsertSchema(testResults).omit({
  id: true,
  enteredAt: true,
});

export const insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
});

// Types
export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;

export type Collector = typeof collectors.$inferSelect;
export type InsertCollector = z.infer<typeof insertCollectorSchema>;

export type LabService = typeof labServices.$inferSelect;
export type InsertLabService = z.infer<typeof insertLabServiceSchema>;

export type LabOrder = typeof labOrders.$inferSelect;
export type InsertLabOrder = z.infer<typeof insertLabOrderSchema>;

export type OrderService = typeof orderServices.$inferSelect;
export type InsertOrderService = z.infer<typeof insertOrderServiceSchema>;

export type TestResult = typeof testResults.$inferSelect;
export type InsertTestResult = z.infer<typeof insertTestResultSchema>;

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
