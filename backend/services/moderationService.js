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

// Analyze image for harmful content and check extracted text toxicity
export const analyzeImage = async (imageBuffer, mimetype = "image/jpeg") => {
    try {
        const hfSpaceUrl = process.env.HF_IMAGE_MODEL_URL || "https://ahad-channa-senti-image-v2.hf.space";
        
        // Use Node 18+ native Blob and FormData to send multipart/form-data via Axios
        const blob = new Blob([imageBuffer], { type: mimetype });
        const formData = new FormData();
        formData.append("file", blob, "upload.jpg");
        
        const response = await axios.post(`${hfSpaceUrl}/analyze-image`, formData);

        const data = response.data;
        
        let reasons = [];
        let types = [];
        let maxScore = data.confidence || 0;
        let isSafe = true;

        if (data.harmful) {
            reasons.push("Image contains violence");
            types.push("violence");
            isSafe = false;
        } 
        if (data.nsfw) {
            reasons.push("Image contains nudity/NSFW");
            types.push("nsfw");
            isSafe = false;
        }
        if (data.meme) {
            reasons.push("Image is a meme");
            types.push("meme");
            isSafe = false;
        }

        // Sanity Check: If OCR text is likely a diagram, code snippet, or highly unstructured, skip toxicity check
        // to prevent NLP model false positives.
        const isLikelyDiagramOrCode = (text) => {
            const specialCharRatio = (text.match(/[^a-zA-Z0-9\s]/g) || []).length / text.length;
            const hasTechKeywords = /(http|REST|OAuth|API|Layer|Model|nodc|Microservice)/i.test(text);
            return specialCharRatio > 0.10 || hasTechKeywords;
        };

        // OCR Extracted Text Toxicity Check
        if (data.extracted_text && data.extracted_text.trim() !== "") {
            if (!isLikelyDiagramOrCode(data.extracted_text)) {
                const textCheck = await analyzeText(data.extracted_text);
                if (!textCheck.safe) {
                    reasons.push("Text inside the image contains toxic content");
                    types.push("toxic_text");
                    isSafe = false;
                    maxScore = Math.max(maxScore, textCheck.score || 0);
                }
            } else {
                console.log("Skipped text toxicity check for diagram/code block.");
            }
        }

        if (!isSafe) {
            return {
                safe: false,
                reason: reasons.join(" AND "),
                type: types.join(","),
                score: maxScore,
                extracted_text: data.extracted_text
            };
        }

        // Both image and text are safe
        return {
            safe: true,
            reason: null,
            extracted_text: data.extracted_text
        };
    } catch (error) {
        console.error("Error calling Image Moderation API:", error.message);
        // Fallback: fail open if HF is down to not block users, but log the error
        return {
            safe: true,
            reason: "Image Moderation unavailable"
        };
    }
};
