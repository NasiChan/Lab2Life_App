import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, timestamp, boolean, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Lab Results table
export const labResults = pgTable("lab_results", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  uploadDate: timestamp("upload_date").default(sql`CURRENT_TIMESTAMP`).notNull(),
  rawText: text("raw_text"),
  status: text("status").notNull().default("processing"), // processing, completed, error
});

export const insertLabResultSchema = createInsertSchema(labResults).omit({
  id: true,
  uploadDate: true,
});

export type InsertLabResult = z.infer<typeof insertLabResultSchema>;
export type LabResult = typeof labResults.$inferSelect;

// Health Markers extracted from lab results
export const healthMarkers = pgTable("health_markers", {
  id: serial("id").primaryKey(),
  labResultId: integer("lab_result_id").references(() => labResults.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  value: decimal("value", { precision: 10, scale: 3 }),
  unit: text("unit"),
  normalMin: decimal("normal_min", { precision: 10, scale: 3 }),
  normalMax: decimal("normal_max", { precision: 10, scale: 3 }),
  status: text("status").notNull(), // low, normal, high
  category: text("category").notNull(), // vitamins, minerals, blood, hormones, etc
});

export const insertHealthMarkerSchema = createInsertSchema(healthMarkers).omit({
  id: true,
});

export type InsertHealthMarker = z.infer<typeof insertHealthMarkerSchema>;
export type HealthMarker = typeof healthMarkers.$inferSelect;

// Medications table
export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  dosage: text("dosage").notNull(),
  frequency: text("frequency").notNull(),
  timeOfDay: text("time_of_day"), // morning, afternoon, evening, night
  withFood: boolean("with_food").default(false),
  notes: text("notes"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertMedicationSchema = createInsertSchema(medications).omit({
  id: true,
  createdAt: true,
});

export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type Medication = typeof medications.$inferSelect;

// Supplements table
export const supplements = pgTable("supplements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  dosage: text("dosage").notNull(),
  frequency: text("frequency").notNull(),
  timeOfDay: text("time_of_day"),
  withFood: boolean("with_food").default(false),
  reason: text("reason"),
  source: text("source"), // link to clinical guideline
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertSupplementSchema = createInsertSchema(supplements).omit({
  id: true,
  createdAt: true,
});

export type InsertSupplement = z.infer<typeof insertSupplementSchema>;
export type Supplement = typeof supplements.$inferSelect;

// Recommendations table
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  labResultId: integer("lab_result_id").references(() => labResults.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // supplement, dietary, physical
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull(), // high, medium, low
  relatedMarker: text("related_marker"),
  actionItems: jsonb("action_items").$type<string[]>().default([]),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
});

export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Recommendation = typeof recommendations.$inferSelect;

// Reminders table
export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  time: text("time").notNull(), // HH:MM format
  days: jsonb("days").$type<string[]>().default([]), // ['monday', 'tuesday', etc]
  type: text("type").notNull(), // medication, supplement, activity
  relatedId: integer("related_id"), // id of medication or supplement
  enabled: boolean("enabled").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertReminderSchema = createInsertSchema(reminders).omit({
  id: true,
  createdAt: true,
});

export type InsertReminder = z.infer<typeof insertReminderSchema>;
export type Reminder = typeof reminders.$inferSelect;

// Interactions table (medication-supplement conflicts)
export const interactions = pgTable("interactions", {
  id: serial("id").primaryKey(),
  medicationId: integer("medication_id").references(() => medications.id, { onDelete: "cascade" }),
  supplementId: integer("supplement_id").references(() => supplements.id, { onDelete: "cascade" }),
  severity: text("severity").notNull(), // mild, moderate, severe
  description: text("description").notNull(),
  recommendation: text("recommendation").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertInteractionSchema = createInsertSchema(interactions).omit({
  id: true,
  createdAt: true,
});

export type InsertInteraction = z.infer<typeof insertInteractionSchema>;
export type Interaction = typeof interactions.$inferSelect;

// Chat models for AI integration
export * from "./models/chat";
