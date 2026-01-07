import { GoogleGenAI } from "@google/genai";
import { LogEntry } from '../types';

let genAI: GoogleGenAI | null = null;

const getGenAI = (): GoogleGenAI => {
  if (!genAI) {
    const apiKey = process.env.API_KEY || '';
    // In a real scenario, we handle missing keys gracefully in the UI.
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

export const analyzeErrorLogs = async (logs: LogEntry[]): Promise<string> => {
  try {
    const ai = getGenAI();
    const errorLogs = logs.filter(l => l.level === 'ERROR').map(l => `[${l.source}] ${l.message}`).join('\n');
    
    if (!errorLogs) return "No errors detected to analyze.";

    const prompt = `
      You are a Senior DevOps Engineer AI. 
      Analyze the following system logs representing a failed connection between a React Admin Panel and a Node.js Backend.
      
      Logs:
      ${errorLogs}

      Provide a concise, technical explanation of the root cause and a specific fix (e.g., enable CORS, check ENV variables).
      Format the output as a Markdown block with a "Root Cause" and "Recommended Fix" section. Keep it short.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Analysis failed to generate text.";
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return "AI Analysis unavailable. Please check API Key configuration.";
  }
};

export const simulateFixApplication = async (issueDescription: string): Promise<string> => {
  try {
    const ai = getGenAI();
    const prompt = `
      Simulate a terminal output showing the application of a fix for the following issue:
      "${issueDescription}"

      Generate 3-4 lines of realistic terminal output showing configuration updates, service restarts, or patch applications.
      Do not use markdown code blocks, just raw text lines separated by newlines.
    `;

     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Applying generic patch...";
  } catch (error) {
    return "Applying automated fix sequence...";
  }
}