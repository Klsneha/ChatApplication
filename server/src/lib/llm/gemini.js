import { GoogleGenAI } from "@google/genai";

// API key is auto-read from process.env.GEMINI_API_KEY
export const gemini = new GoogleGenAI({});

// optional: centralize model choice
export const GEMINI_MODEL = "gemini-2.5-flash";

export const GEMINI_EMBEDDING_MODEL = "gemini-embedding-001";