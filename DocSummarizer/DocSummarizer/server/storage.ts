import { type Summary, type InsertSummary } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createSummary(summary: InsertSummary): Promise<Summary>;
  getSummary(id: string): Promise<Summary | undefined>;
  getAllSummaries(): Promise<Summary[]>;
}

export class MemStorage implements IStorage {
  private summaries: Map<string, Summary>;

  constructor() {
    this.summaries = new Map();
  }

  async createSummary(insertSummary: InsertSummary): Promise<Summary> {
    const id = randomUUID();
    const summary: Summary = {
      ...insertSummary,
      id,
      createdAt: new Date(),
      fileSize: insertSummary.fileSize ?? null,
    };
    this.summaries.set(id, summary);
    return summary;
  }

  async getSummary(id: string): Promise<Summary | undefined> {
    return this.summaries.get(id);
  }

  async getAllSummaries(): Promise<Summary[]> {
    return Array.from(this.summaries.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
}

export const storage = new MemStorage();
