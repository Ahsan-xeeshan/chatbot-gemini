import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

const PORT = 8000;
const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);

app.post("/gemini", async (req, res) => {
  try {
    const { history, message } = req.body;

    // Ensure history format is correct
    const formattedHistory = history.map((chat) => ({
      role: chat.role,
      parts: chat.parts.map((part) =>
        typeof part === "string" ? { text: part } : part
      ),
    }));

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const chat = model.startChat({ history: formattedHistory });

    // FIX: `sendMessage` expects an array of parts
    const result = await chat.sendMessage([{ text: message }]);
    res.send(result.response.text());
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => console.log(`Listening on port : ${PORT}`));
