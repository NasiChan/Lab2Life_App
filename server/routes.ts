import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { extractLabData, checkInteractions } from "./gemini";
import {
  insertMedicationSchema,
  insertSupplementSchema,
  insertReminderSchema,
} from "@shared/schema";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Lab Results
  app.get("/api/lab-results", async (req: Request, res: Response) => {
    try {
      const results = await storage.getLabResults();
      res.json(results);
    } catch (error) {
      console.error("Error fetching lab results:", error);
      res.status(500).json({ error: "Failed to fetch lab results" });
    }
  });

  app.post("/api/lab-results/upload", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Create initial lab result
      const labResult = await storage.createLabResult({
        fileName: req.file.originalname,
        status: "processing",
        rawText: null,
      });

      // Process in background
      processLabResult(labResult.id, req.file.buffer.toString("utf-8"));

      res.status(201).json(labResult);
    } catch (error) {
      console.error("Error uploading lab result:", error);
      res.status(500).json({ error: "Failed to upload lab result" });
    }
  });

  async function processLabResult(labResultId: number, rawText: string) {
    try {
      // Extract data using Gemini
      const extractedData = await extractLabData(rawText);

      // Save health markers
      for (const marker of extractedData.markers) {
        await storage.createHealthMarker({
          labResultId,
          name: marker.name,
          value: String(marker.value),
          unit: marker.unit,
          normalMin: String(marker.normalMin),
          normalMax: String(marker.normalMax),
          status: marker.status,
          category: marker.category,
        });
      }

      // Save recommendations
      for (const rec of extractedData.recommendations) {
        await storage.createRecommendation({
          labResultId,
          type: rec.type,
          title: rec.title,
          description: rec.description,
          priority: rec.priority,
          relatedMarker: rec.relatedMarker,
          actionItems: rec.actionItems,
        });
      }

      // Update status
      await storage.updateLabResult(labResultId, {
        status: "completed",
        rawText,
      });
    } catch (error) {
      console.error("Error processing lab result:", error);
      await storage.updateLabResult(labResultId, { status: "error" });
    }
  }

  app.delete("/api/lab-results/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteLabResult(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting lab result:", error);
      res.status(500).json({ error: "Failed to delete lab result" });
    }
  });

  // Health Markers
  app.get("/api/health-markers", async (req: Request, res: Response) => {
    try {
      const markers = await storage.getHealthMarkers();
      res.json(markers);
    } catch (error) {
      console.error("Error fetching health markers:", error);
      res.status(500).json({ error: "Failed to fetch health markers" });
    }
  });

  // Medications
  app.get("/api/medications", async (req: Request, res: Response) => {
    try {
      const meds = await storage.getMedications();
      res.json(meds);
    } catch (error) {
      console.error("Error fetching medications:", error);
      res.status(500).json({ error: "Failed to fetch medications" });
    }
  });

  app.post("/api/medications", async (req: Request, res: Response) => {
    try {
      const parsed = insertMedicationSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const medication = await storage.createMedication(parsed.data);
      res.status(201).json(medication);
    } catch (error) {
      console.error("Error creating medication:", error);
      res.status(500).json({ error: "Failed to create medication" });
    }
  });

  app.patch("/api/medications/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const medication = await storage.updateMedication(id, req.body);
      if (!medication) {
        return res.status(404).json({ error: "Medication not found" });
      }
      res.json(medication);
    } catch (error) {
      console.error("Error updating medication:", error);
      res.status(500).json({ error: "Failed to update medication" });
    }
  });

  app.delete("/api/medications/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMedication(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting medication:", error);
      res.status(500).json({ error: "Failed to delete medication" });
    }
  });

  // Supplements
  app.get("/api/supplements", async (req: Request, res: Response) => {
    try {
      const supps = await storage.getSupplements();
      res.json(supps);
    } catch (error) {
      console.error("Error fetching supplements:", error);
      res.status(500).json({ error: "Failed to fetch supplements" });
    }
  });

  app.post("/api/supplements", async (req: Request, res: Response) => {
    try {
      const parsed = insertSupplementSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const supplement = await storage.createSupplement(parsed.data);
      res.status(201).json(supplement);
    } catch (error) {
      console.error("Error creating supplement:", error);
      res.status(500).json({ error: "Failed to create supplement" });
    }
  });

  app.patch("/api/supplements/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const supplement = await storage.updateSupplement(id, req.body);
      if (!supplement) {
        return res.status(404).json({ error: "Supplement not found" });
      }
      res.json(supplement);
    } catch (error) {
      console.error("Error updating supplement:", error);
      res.status(500).json({ error: "Failed to update supplement" });
    }
  });

  app.delete("/api/supplements/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSupplement(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting supplement:", error);
      res.status(500).json({ error: "Failed to delete supplement" });
    }
  });

  // Recommendations
  app.get("/api/recommendations", async (req: Request, res: Response) => {
    try {
      const recs = await storage.getRecommendations();
      res.json(recs);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });

  // Reminders
  app.get("/api/reminders", async (req: Request, res: Response) => {
    try {
      const reminders = await storage.getReminders();
      res.json(reminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      res.status(500).json({ error: "Failed to fetch reminders" });
    }
  });

  app.post("/api/reminders", async (req: Request, res: Response) => {
    try {
      const parsed = insertReminderSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const reminder = await storage.createReminder(parsed.data);
      res.status(201).json(reminder);
    } catch (error) {
      console.error("Error creating reminder:", error);
      res.status(500).json({ error: "Failed to create reminder" });
    }
  });

  app.patch("/api/reminders/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const reminder = await storage.updateReminder(id, req.body);
      if (!reminder) {
        return res.status(404).json({ error: "Reminder not found" });
      }
      res.json(reminder);
    } catch (error) {
      console.error("Error updating reminder:", error);
      res.status(500).json({ error: "Failed to update reminder" });
    }
  });

  app.delete("/api/reminders/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteReminder(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting reminder:", error);
      res.status(500).json({ error: "Failed to delete reminder" });
    }
  });

  // Interactions
  app.get("/api/interactions", async (req: Request, res: Response) => {
    try {
      const interactions = await storage.getInteractions();
      res.json(interactions);
    } catch (error) {
      console.error("Error fetching interactions:", error);
      res.status(500).json({ error: "Failed to fetch interactions" });
    }
  });

  app.post("/api/interactions/check", async (req: Request, res: Response) => {
    try {
      // Get active medications and supplements
      const medications = (await storage.getMedications()).filter((m) => m.active);
      const supplements = (await storage.getSupplements()).filter((s) => s.active);

      // Check interactions using Gemini
      const interactionResults = await checkInteractions(
        medications.map((m) => ({ id: m.id, name: m.name })),
        supplements.map((s) => ({ id: s.id, name: s.name }))
      );

      // Clear old interactions and save new ones
      await storage.deleteAllInteractions();
      
      for (const interaction of interactionResults) {
        await storage.createInteraction({
          medicationId: interaction.medicationId,
          supplementId: interaction.supplementId,
          severity: interaction.severity,
          description: interaction.description,
          recommendation: interaction.recommendation,
        });
      }

      const savedInteractions = await storage.getInteractions();
      res.json(savedInteractions);
    } catch (error) {
      console.error("Error checking interactions:", error);
      res.status(500).json({ error: "Failed to check interactions" });
    }
  });

  return httpServer;
}
