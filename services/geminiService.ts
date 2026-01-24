import { GoogleGenAI } from "@google/genai";
import { LogEntry } from '../types';

let genAI: GoogleGenAI | null = null;

const getGenAI = (): GoogleGenAI => {
  if (!genAI) {
    // Vite uses import.meta.env for environment variables
    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
    if (!apiKey) {
      throw new Error('API key is missing. Please add VITE_GEMINI_API_KEY to your .env file');
    }
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

// Template interface for AI-generated data
export interface AIGeneratedTemplate {
  title: string;
  category: string;
  subCategory: string;
  description: string;
  tags: string[];
  gender: 'Male' | 'Female' | 'Unisex' | '';
  ageGroup: string;
  state: string;
  negativePrompt: string;
  prompt: string;
}

// Generate template data from a prompt using Gemini AI
export const generateTemplateFromPrompt = async (
  userPrompt: string,
  availableCategories: { name: string; subCategories: string[] }[]
): Promise<AIGeneratedTemplate> => {
  try {
    const ai = getGenAI();

    const categoryList = availableCategories.map(c =>
      `${c.name} (subcategories: ${c.subCategories.join(', ')})`
    ).join('; ');

    const systemPrompt = `
You are an AI assistant that helps create template metadata for an image generation app called Rupantar AI.
Given a user's image generation prompt, extract and generate the following template metadata.

Available categories: ${categoryList || 'General (subcategories: Misc, Portrait, Fashion, Wedding)'}

Respond ONLY with valid JSON in this exact format:
{
  "title": "A catchy, descriptive title (3-5 words, capitalized)",
  "category": "Best matching category from the available list",
  "subCategory": "Best matching subcategory",
  "description": "A brief 1-2 sentence description of what this template creates",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "gender": "Male" or "Female" or "Unisex",
  "ageGroup": "Any" or "Young" or "Middle" or "Senior",
  "state": "All India",
  "negativePrompt": "Things to avoid: blurry, distorted, low quality, etc.",
  "prompt": "The enhanced/cleaned version of the user's prompt"
}

User's prompt: "${userPrompt}"
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
    });

    const text = response.text || '{}';

    // Extract JSON from response (handle markdown code blocks if present)
    let jsonStr = text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    } else {
      // Try to find JSON object directly
      const objectMatch = text.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        jsonStr = objectMatch[0];
      }
    }

    const parsed = JSON.parse(jsonStr);

    return {
      title: parsed.title || 'Untitled Template',
      category: parsed.category || 'General',
      subCategory: parsed.subCategory || 'Misc',
      description: parsed.description || '',
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
      gender: parsed.gender || '',
      ageGroup: parsed.ageGroup || 'Any',
      state: parsed.state || 'All India',
      negativePrompt: parsed.negativePrompt || 'blurry, distorted, low quality, deformed',
      prompt: parsed.prompt || userPrompt
    };
  } catch (error) {
    console.error("AI Template Generation Failed:", error);
    // Return defaults with the user's prompt
    return {
      title: 'New Template',
      category: 'General',
      subCategory: 'Misc',
      description: '',
      tags: [],
      gender: '',
      ageGroup: 'Any',
      state: 'All India',
      negativePrompt: 'blurry, distorted, low quality, deformed',
      prompt: userPrompt
    };
  }
};