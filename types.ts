export interface ProcessedData {
  extractedText: string;
  summaryPoints: string[];
  folderName: string;
}

export interface NoteItem {
  id: string;
  createdAt: number;
  originalImage?: string; // Base64
  data: ProcessedData;
}

export interface Folder {
  id: string;
  name: string;
  items: NoteItem[];
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}