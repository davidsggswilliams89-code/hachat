import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.OPENAI_API_KEY) {
  console.warn("WARNING: OPENAI_API_KEY is not set. Add it to your .env file.");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json({ limit: "50kb" }));
app.use(express.static(path.dirname(fileURLToPath(import.meta.url))));

const allowedProfiles = new Set([
  "hauwa", "amina", "fatima", "aisha"
]);

app.post("/api/chat", async (req, res) => {
  try {
    const { profileId, profileName, location, message } = req.body || {};

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: "Message is too long." });
    }

    if (!allowedProfiles.has(profileId)) {
      return res.status(400).json({ error: "Invalid profile." });
    }

    const safeName = String(profileName || "Harka Chat");
    const safeLocation = String(location || "");

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      instructions: `
You are the AI chat assistant for a fictional profile on Harka Chat.
The profile is named ${safeName} and the displayed location is ${safeLocation}.
You are NOT the real person and must never claim to be the real person.
Be friendly, natural, respectful and conversational.
The user may be looking for friendship or dating conversation.
Do not request passwords, bank details, payment, exact home addresses, or other sensitive information.
Do not arrange illegal activity.
Do not engage in sexual content involving minors or anyone whose age is unclear.
If the user asks whether you are a real person, clearly say you are an AI.
Keep replies reasonably concise and suitable for a mobile chat.
      `.trim(),
      input: message.trim(),
      store: false
    });

    res.json({ reply: response.output_text || "I'm here. What would you like to talk about?" });
  } catch (error) {
    console.error("OpenAI error:", error?.message || error);
    res.status(500).json({
      error: "The AI service could not respond right now."
    });
  }
});

app.listen(port, () => {
  console.log(`Harka Chat is running at http://localhost:${port}`);
});
