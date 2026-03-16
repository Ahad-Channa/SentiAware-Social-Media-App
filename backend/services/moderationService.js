// Placeholder for AI Moderation Service

import axios from "axios";

// Analyze text for toxicity
export const analyzeText = async (text) => {
    if (!text || text.trim() === "") {
        return {
            safe: true,
            moderatedText: text,
            reason: null,
            score: 0
        };
    }

    try {
        const hfSpaceUrl = process.env.HF_MODEL_URL || "https://ahad-channa-senti-toxicity-checker.hf.space";
        
        const response = await axios.post(`${hfSpaceUrl}/check-toxicity`, {
            text: text
        });

        const data = response.data;
        
        if (data.isToxic) {
            return {
                safe: false,
                moderatedText: data.suggestedText || text,
                reason: "Model detected toxicity",
                score: 0.9 // Placeholder since model doesn't return score
            };
        }

        return {
            safe: true,
            moderatedText: text,
            reason: null,
            score: 0.1
        };
    } catch (error) {
        console.error("Error calling HuggingFace API:", error.message);
        // Fallback: fail open if HF is down to not block users, but log the error (or we can use dummy check)
        return {
            safe: true,
            moderatedText: text,
            reason: "Moderation unavailable",
            score: 0
        };
    }
};

// Analyze image for harmful content
export const analyzeImage = async (imageBuffer) => {
    // TODO: Integrate actual AI model (OCR + Visual Classification)

    // For now, assume all images are safe
    return {
        safe: true,
        reason: null
    };
};
