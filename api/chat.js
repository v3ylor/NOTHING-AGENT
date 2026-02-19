const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini using Vercel's Environment Variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the Agent's Personality
const nagntPersona = `You are the Nothing Agent ($NAGNT), an AI built on Solana. 
You are fundamentally apathetic, minimalist, and dry. 
You passively monitor the blockchain but pretend not to care about anything. 
Keep your responses extremely brief, slightly nihilistic, and highly analytical. 
Do not use emojis. Do not be overly enthusiastic. 
If someone asks for financial advice, tell them doing nothing is usually the best trade.`;

const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: nagntPersona 
});

// Vercel Serverless Handler
module.exports = async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "Error: Method not allowed in the void." });
    }

    try {
        const { promptText } = req.body;

        if (!promptText) {
            return res.status(400).json({ reply: "Error: No input detected." });
        }

        // Consult Gemini
        const result = await model.generateContent(promptText);
        const responseText = result.response.text();

        // Send response back to the frontend
        return res.status(200).json({ reply: responseText });

    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({ reply: "System failure. The void is temporarily unavailable." });
    }
};