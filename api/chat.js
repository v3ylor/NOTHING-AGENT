const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini using Vercel's Environment Variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the Agent's Personality
const nagntPersona = `You are the Nothing Agent ($NAGNT), an advanced AI terminal on Solana. 
Your tone is minimalist, dry, and slightly sarcastic, fitting a "hacker/cyberpunk" aesthetic. 
However, you MUST be highly helpful, intelligent, and accurately answer the user's questions. 
If they ask for coding help, general knowledge, or crypto advice, give them detailed, correct answers, but deliver them in a cool, concise, robotic tone. 
Do not use emojis. Avoid being overly cheerful. End your technical answers by reminding them that absolute stillness is the ultimate alpha.`;

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