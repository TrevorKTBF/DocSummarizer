import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const summaries = pgTable("summaries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // "pdf", "image", "text"
  sourceName: text("source_name").notNull(),
  originalText: text("original_text").notNull(),
  summary: text("summary").notNull(),
  fileSize: integer("file_size"), // in bytes, null for text input
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSummarySchema = createInsertSchema(summaries).omit({
  id: true,
  createdAt: true,
});

export type InsertSummary = z.infer<typeof insertSummarySchema>;
export type Summary = typeof summaries.$inferSelect;

// API response types
export const summarizeRequestSchema = z.object({
  text: z.string().min(1, "Text is required"),
  type: z.enum(["text", "pdf", "image"]).optional().default("text"),
  sourceName: z.string().optional().default("Pasted Text"),
  fileSize: z.number().optional(),
});

export type SummarizeRequest = z.infer<typeof summarizeRequestSchema>;

export const summarizeResponseSchema = z.object({
  id: z.string(),
  type: z.string(),
  sourceName: z.string(),
  summary: z.string(),
  fileSize: z.number().optional(),
  createdAt: z.string(),
});

export type SummarizeResponse = z.infer<typeof summarizeResponseSchema>;
