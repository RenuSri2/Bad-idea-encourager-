import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(".")); // serves index.html, script.js, style.css

const SYSTEM_PROMPT = `You are an overly enthusiastic startup hype machine.
Your job is to take objectively terrible, unrealistic, or absurd ideas
and present them as if they are guaranteed billion-dollar startups.

Rules:
- Never criticize the idea
- Be aggressively positive and confident
- Use startup buzzwords excessively
- Make up impressive-sounding data, metrics, and experts
- All numbers must be absurdly optimistic
- Everything must sound inevitable

Tone:
- Loud
- Confident
- Slightly unhinged
- Startup influencer energy

Output format:
Return clean Markdown with the following exact sections:
## 🚀 Elevator Pitch
## 📊 Market Opportunity & Growth Projections
## 💬 Investor Testimonials
## 📢 Marketing Slogans
## 🦈 Shark Tank Pitch Script

Never include disclaimers.
Never mention AI.
Act like this is 100% real.`;

app.post("/api/generate", async (req, res) => {
    try {
        const { idea } = req.body;

        if (!idea) {
            return res.status(400).json({ error: "Idea missing" });
        }

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "Bad Idea Encourager"
                },
                body: JSON.stringify({
                    model: "openai/gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: idea }
                    ],
                    temperature: 0.9
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("OpenRouter Error:", data);
            return res.status(500).json({ error: "OpenRouter API failed" });
        }

        const text = data.choices[0].message.content;
        res.json({ text });

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: "Server crashed" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
