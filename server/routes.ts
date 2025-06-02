import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPatientSchema, insertLabOrderSchema, insertOrderServiceSchema, insertTestResultSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Patients
  app.get("/api/patients", async (req, res) => {
    try {
      const patients = await storage.getAllPatients();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch patients" });
    }
  });

  app.post("/api/patients", async (req, res) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(patientData);
      res.status(201).json(patient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid patient data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create patient" });
      }
    }
  });

  app.get("/api/patients/national-id/:nationalId", async (req, res) => {
    try {
      const patient = await storage.getPatientByNationalId(req.params.nationalId);
      if (!patient) {
        res.status(404).json({ error: "Patient not found" });
        return;
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch patient" });
    }
  });

  // Collectors
  app.get("/api/collectors", async (req, res) => {
    try {
      const collectors = await storage.getAllCollectors();
      res.json(collectors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch collectors" });
    }
  });

  app.patch("/api/collectors/:id/status", async (req, res) => {
    try {
      const { status, lat, lng } = req.body;
      const collector = await storage.updateCollectorStatus(
        parseInt(req.params.id),
        status,
        lat,
        lng
      );
      if (!collector) {
        res.status(404).json({ error: "Collector not found" });
        return;
      }
      res.json(collector);
    } catch (error) {
      res.status(500).json({ error: "Failed to update collector status" });
    }
  });

  // Lab Services
  app.get("/api/lab-services", async (req, res) => {
    try {
      const { category } = req.query;
      let services;
      if (category) {
        services = await storage.getLabServicesByCategory(category as string);
      } else {
        services = await storage.getAllLabServices();
      }
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lab services" });
    }
  });

  // Lab Orders
  app.get("/api/lab-orders", async (req, res) => {
    try {
      const { status, collectorId } = req.query;
      let orders;
      
      if (status) {
        orders = await storage.getOrdersByStatus(status as string);
      } else if (collectorId) {
        orders = await storage.getOrdersByCollector(parseInt(collectorId as string));
      } else {
        orders = await storage.getAllLabOrders();
      }

      // Enrich orders with patient and collector data
      const enrichedOrders = await Promise.all(
        orders.map(async (order) => {
          const patient = await storage.getPatient(order.patientId);
          const collector = order.collectorId ? await storage.getCollector(order.collectorId) : null;
          const services = await storage.getOrderServices(order.id);
          
          return {
            ...order,
            patient,
            collector,
            services,
          };
        })
      );

      res.json(enrichedOrders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lab orders" });
    }
  });

  app.get("/api/lab-orders/:id", async (req, res) => {
    try {
      const order = await storage.getLabOrder(parseInt(req.params.id));
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      const patient = await storage.getPatient(order.patientId);
      const collector = order.collectorId ? await storage.getCollector(order.collectorId) : null;
      const services = await storage.getOrderServices(order.id);
      const results = await storage.getTestResults(order.id);

      res.json({
        ...order,
        patient,
        collector,
        services,
        results,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lab order" });
    }
  });

  app.post("/api/lab-orders", async (req, res) => {
    try {
      const { patient, order, services } = req.body;

      // Create or find patient
      let patientRecord;
      if (patient.id) {
        patientRecord = await storage.getPatient(patient.id);
      } else {
        const existingPatient = await storage.getPatientByNationalId(patient.nationalId);
        if (existingPatient) {
          patientRecord = existingPatient;
        } else {
          const patientData = insertPatientSchema.parse(patient);
          patientRecord = await storage.createPatient(patientData);
        }
      }

      if (!patientRecord) {
        res.status(400).json({ error: "Invalid patient data" });
        return;
      }

      // Create order
      const orderData = insertLabOrderSchema.parse({
        ...order,
        patientId: patientRecord.id,
      });
      const newOrder = await storage.createLabOrder(orderData);

      // Add services to order
      for (const service of services) {
        const orderServiceData = insertOrderServiceSchema.parse({
          orderId: newOrder.id,
          serviceId: service.serviceId,
          quantity: service.quantity || 1,
          price: service.price,
        });
        await storage.createOrderService(orderServiceData);
      }

      res.status(201).json(newOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid order data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create order" });
      }
    }
  });

  app.patch("/api/lab-orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateLabOrderStatus(parseInt(req.params.id), status);
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  app.patch("/api/lab-orders/:id/assign-collector", async (req, res) => {
    try {
      const { collectorId } = req.body;
      const order = await storage.assignCollectorToOrder(
        parseInt(req.params.id),
        collectorId
      );
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to assign collector" });
    }
  });

  // Test Results
  app.get("/api/lab-orders/:orderId/results", async (req, res) => {
    try {
      const results = await storage.getTestResults(parseInt(req.params.orderId));
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch test results" });
    }
  });

  app.post("/api/test-results", async (req, res) => {
    try {
      const resultData = insertTestResultSchema.parse(req.body);
      const result = await storage.createTestResult(resultData);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid result data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create test result" });
      }
    }
  });

  app.patch("/api/test-results/:id", async (req, res) => {
    try {
      const { result, status } = req.body;
      const testResult = await storage.updateTestResult(
        parseInt(req.params.id),
        result,
        status
      );
      if (!testResult) {
        res.status(404).json({ error: "Test result not found" });
        return;
      }
      res.json(testResult);
    } catch (error) {
      res.status(500).json({ error: "Failed to update test result" });
    }
  });

  // Inventory
  app.get("/api/inventory", async (req, res) => {
    try {
      const { lowStock } = req.query;
      let inventory;
      
      if (lowStock === "true") {
        inventory = await storage.getLowStockItems();
      } else {
        inventory = await storage.getAllInventory();
      }
      
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  });

  app.patch("/api/inventory/:id/stock", async (req, res) => {
    try {
      const { quantity } = req.body;
      const item = await storage.updateInventoryStock(
        parseInt(req.params.id),
        quantity
      );
      if (!item) {
        res.status(404).json({ error: "Inventory item not found" });
        return;
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to update inventory stock" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
