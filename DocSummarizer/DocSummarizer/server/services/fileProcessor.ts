import multer from "multer";
import Tesseract from "tesseract.js";
import { summarizeText } from "./openai.js";

// Dynamic import to avoid pdf-parse initialization issues
let pdfParse: any = null;

// Configure multer for file uploads
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'image/png',
      'image/jpg', 
      'image/jpeg'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Please upload PDF, PNG, or JPG files.'));
    }
  }
});

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    if (!pdfParse) {
      pdfParse = (await import("pdf-parse")).default;
    }
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF. Please ensure the file is not corrupted.");
  }
}

export async function extractTextFromImage(buffer: Buffer): Promise<string> {
  try {
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng', {
      logger: m => console.log(m)
    });
    
    if (!text || text.trim().length === 0) {
      throw new Error("No text detected in the image.");
    }
    
    return text;
  } catch (error) {
    console.error("OCR processing error:", error);
    throw new Error("Failed to extract text from image. Please ensure the image contains readable text.");
  }
}

export async function processFile(file: any): Promise<{
  text: string;
  type: string;
  sourceName: string;
  fileSize: number;
}> {
  let text: string;
  let type: string;

  if (file.mimetype === 'application/pdf') {
    text = await extractTextFromPdf(file.buffer);
    type = 'pdf';
  } else if (file.mimetype.startsWith('image/')) {
    text = await extractTextFromImage(file.buffer);
    type = 'image';
  } else {
    throw new Error('Unsupported file type');
  }

  if (!text || text.trim().length < 10) {
    throw new Error("Extracted text is too short to summarize. Please ensure your document contains readable content.");
  }

  return {
    text: text.trim(),
    type,
    sourceName: file.originalname,
    fileSize: file.size,
  };
}

export async function generateSummary(text: string): Promise<string> {
  if (text.length > 50000) {
    // Truncate very long texts to stay within API limits
    text = text.substring(0, 50000) + "...";
  }
  
  return await summarizeText(text);
}
