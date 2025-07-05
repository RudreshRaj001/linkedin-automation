import { Request, Response } from 'express';
import axios from 'axios';
import { randomBytes } from 'crypto'; // For generating unique IDs for images if needed
import path from 'path'; // For path manipulation, though not saving to disk in this version

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
// Define possible topics for LinkedIn posts (can be moved to a config file)
// const POSSIBLE_TOPICS = [
//     "React",
//     "Next.js",
//     "Web Development best practices",
//     "Artificial Intelligence (AI) ethics",
//     "Web Development and AI integration",
//     "Writing production-ready code",
//     "Software development best practices",
//     "Data Structures and Algorithms (DSA) for interviews",
//     "Cloud computing with AWS",
//     "Cloud computing with Azure",
//     "DevOps automation",
//     "Cybersecurity trends",
//     "Machine Learning model deployment",
//     "Frontend performance optimization",
//     "Backend scalability",
//     "Containerization with Docker and Kubernetes"
// ];

// Controller for generating LinkedIn content (text)
export const generateText = async (req: Request, res: Response) => {
    // --- CHANGES START HERE ---
    // Do not ask the user for professionalRole or topic.
    // Determine them directly within the function.
    const { professionalRole, topic } = req.body;

    // const professionalRole = "AI/ML Engineer"; // Example: Hardcode a professional role
    // const topic = getRandomTopic(); // Randomly select a topic from your predefined list

    // Removed the 'if (!professionalRole || !topic)' check as they are now defined internally
    // --- CHANGES END HERE ---

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Gemini API Key is not configured on the server.' });
    }

    const prompt = (
        `As a ${professionalRole}, create a highly engaging, innovative, and thought-provoking LinkedIn post ` +
        `on the topic of '${topic}'. ` +
        "Start with an attention-grabbing hook that immediately invites interaction. " +
        "The post should be concise, ideally 3-5 well-structured paragraphs, focusing on key insights " +
        "and sparking a conversation. " +
        "Incorporate 3-5 relevant and impactful emojis naturally throughout the text. " +
        "Conclude with a powerful, open-ended question to encourage meaningful discussion. " +
        "Finally, provide 5-7 trending and relevant hashtags at the end of the post. " +
        "**Provide ONLY the complete LinkedIn post content. DO NOT include any introductory phrases like 'Here's your draft:' or explanatory notes.**"
    );

    const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = {
        contents: chatHistory,
        generationConfig: {
            responseMimeType: "text/plain",
            temperature: 0.9,
            maxOutputTokens: 500
        }
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    try {
        const response = await axios.post(apiUrl, payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        const result = response.data;
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const generatedText = result.candidates[0].content.parts[0].text;
            res.json({ text: generatedText.trim(), professionalRole, topic }); // Also return the role and topic used
        } else {
            res.status(500).json({ error: 'Gemini API text response structure unexpected or content missing.', details: result });
        }
    } catch (error: any) {
        console.error('Error generating text from Gemini:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate text content.', details: error.response ? error.response.data : error.message });
    }
};

// Controller for generating image
export const generateImage = async (req: Request, res: Response) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required for image generation.' });
    }
    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Gemini API Key is not configured on the server.' });
    }

    const payload = {
        contents: [
            {
                parts: [
                    { text: prompt }
                ]
            }
        ],
        // Note: As per previous interactions, this model gemini-2.0-flash-preview-image-generation
        // expects IMAGE, TEXT modalities. We rely on the parsing logic to extract the image.
        // It does not accept 'responseMimeType: "image/png"' directly in generationConfig.
        generationConfig: {} // Removed responseModalities: ["TEXT", "IMAGE"] as it's not a valid config for this endpoint
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${GEMINI_API_KEY}`;

    try {
        const response = await axios.post(apiUrl, payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        const result = response.data;
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            
            let imageDataUrl: string | null = null;
            for (const part of result.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    const mimeType = part.inlineData.mimeType || 'image/png';
                    imageDataUrl = `data:${mimeType};base64,${part.inlineData.data}`;
                    break; // Found the image, no need to check other parts
                }
            }

            if (imageDataUrl) {
                res.json({ imageUrl: imageDataUrl });
            } else {
                res.status(500).json({ error: 'No image data found in Gemini API response.', details: result });
            }

        } else {
            res.status(500).json({ error: 'Gemini API image response structure unexpected or content missing.', details: result });
        }
    } catch (error: any) {
        console.error('Error generating image from Gemini:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate image.', details: error.response ? error.response.data : error.message });
    }
};
