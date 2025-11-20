import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { summarizeRequestSchema, type SummarizeResponse } from "@shared/schema.js";
import { upload, processFile, generateSummary } from "./services/fileProcessor.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // File upload endpoint
  app.post("/api/summarize/file", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          error: "No file uploaded. Please select a PDF, PNG, or JPG file." 
        });
      }

      // Process the file to extract text
      const { text, type, sourceName, fileSize } = await processFile(req.file);
      
      // Generate summary
      const summaryText = await generateSummary(text);
      
      // Store in memory
      const summary = await storage.createSummary({
        type,
        sourceName,
        originalText: text,
        summary: summaryText,
        fileSize,
      });

      const response: SummarizeResponse = {
        id: summary.id,
        type: summary.type,
        sourceName: summary.sourceName,
        summary: summary.summary,
        fileSize: summary.fileSize || undefined,
        createdAt: summary.createdAt.toISOString(),
      };

      res.json(response);
    } catch (error) {
      console.error("File processing error:", error);
      const message = error instanceof Error ? error.message : "Failed to process file";
      res.status(500).json({ error: message });
    }
  });

  // Text summarization endpoint
  app.post("/api/summarize/text", async (req, res) => {
    try {
      const validatedData = summarizeRequestSchema.parse(req.body);
      
      if (!validatedData.text || validatedData.text.trim().length < 10) {
        return res.status(400).json({ 
          error: "Text is too short to summarize. Please provide at least 10 characters." 
        });
      }

      // Generate summary
      const summaryText = await generateSummary(validatedData.text);
      
      // Store in memory
      const summary = await storage.createSummary({
        type: "text",
        sourceName: "Pasted Text",
        originalText: validatedData.text,
        summary: summaryText,
        fileSize: undefined,
      });

      const response: SummarizeResponse = {
        id: summary.id,
        type: summary.type,
        sourceName: summary.sourceName,
        summary: summary.summary,
        createdAt: summary.createdAt.toISOString(),
      };

      res.json(response);
    } catch (error) {
      console.error("Text processing error:", error);
      const message = error instanceof Error ? error.message : "Failed to process text";
      res.status(500).json({ error: message });
    }
  });

  // Get all summaries (for session history)
  app.get("/api/summaries", async (req, res) => {
    try {
      const summaries = await storage.getAllSummaries();
      const response: SummarizeResponse[] = summaries.map(summary => ({
        id: summary.id,
        type: summary.type,
        sourceName: summary.sourceName,
        summary: summary.summary,
        fileSize: summary.fileSize || undefined,
        createdAt: summary.createdAt.toISOString(),
      }));
      
      res.json(response);
    } catch (error) {
      console.error("Error fetching summaries:", error);
      res.status(500).json({ error: "Failed to fetch summaries" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
