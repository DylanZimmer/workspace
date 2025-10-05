import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//dotenv.config({ path: './.env' });
dotenv.config({ path: path.resolve(__dirname, '.env') });
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";
import * as prompts from './prompts.js';
const app = express();
app.use(cors({
  origin: ["https://trackedspace.netlify.app", "http://localhost:3000"],
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));
app.use(express.json());
const port = process.env.PORT || 4000;

const ai = new GoogleGenAI({});

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: messages,
      config: {
        systemInstruction: prompts.baseCBPrompt,
      }
    });
    res.json({ role: "model", parts: [{ text: response.text }] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating content" });
  }
});

app.post("/updateTracker", async (req, res) => {
  try {
    const { messages, trackerEntry } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: messages,
      config: {
        systemInstruction: `${prompts.trackerPrompt}\n\nCurrent Entry:\n${trackerEntry}`,
      }
    });
    res.json({ role: "model", parts: [{ text: response.text }] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating content" });
  }
});

app.use(express.static(path.join(__dirname, '../build')))
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(port, () => console.log("Server is running"))