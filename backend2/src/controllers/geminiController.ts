import { Request, Response } from 'express';
import axios from 'axios';
import { randomBytes } from 'crypto'; // For generating unique IDs for images if needed
import path from 'path'; // For path manipulation, though not saving to disk in this version

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const generateText = async (req: Request, res: Response) => {
    const { professionalRole, topic } = req.body;

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

// export const generateImage = async (req: Request, res: Response) => {
//   const { prompt } = req.body;

//   if (!prompt) {
//     return res.status(400).json({ error: 'Prompt is required for image generation.' });
//   }
//   if (!GEMINI_API_KEY) {
//     return res.status(500).json({ error: 'Gemini API Key is not configured on the server.' });
//   }

//   const payload = {
//     contents: [
//       { parts: [{ text: prompt }] }
//     ],
//     generationConfig: {
//       // Ask for both text and image back
//       responseModalities: ["TEXT", "IMAGE"],
//       // Optional: control dimensions & format
//       imageConfig: {
//         mimeType: "image/png",
//         height: 512,
//         width: 512
//       },
//       // You can still tune temperature, etc.
//       temperature: 0.9,
//       maxOutputTokens: 1_000
//     }
//   };

//   const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${GEMINI_API_KEY}`;

//   try {
//     const { data: result } = await axios.post(apiUrl, payload, {
//       headers: { 'Content-Type': 'application/json' }
//     });

//     // Extract the base64 image
//     let imageDataUrl: string | null = null;
//     const parts = result.candidates?.[0]?.content?.parts || [];
//     for (const part of parts) {
//       if (part.inlineData?.data) {
//         const mt = part.inlineData.mimeType || 'image/png';
//         imageDataUrl = `data:${mt};base64,${part.inlineData.data}`;
//         break;
//       }
//     }

//     if (imageDataUrl) {
//       return res.json({ imageUrl: imageDataUrl });
//     } else {
//       return res.status(500).json({
//         error: 'No image data found in Gemini API response.',
//         details: result
//       });
//     }
//   } catch (error: any) {
//     console.error('Error generating image from Gemini:', error.response?.data || error.message);
//     return res.status(500).json({
//       error: 'Failed to generate image.',
//       details: error.response?.data || error.message
//     });
//   }
// };
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
            { parts: [{ text: prompt }] }
        ],
        generationConfig: {
            // Corrected: Include both TEXT and IMAGE modalities
            responseModalities: ["TEXT", "IMAGE"],
            temperature: 0.9
        }
    };

    const apiUrl =
        `https://generativelanguage.googleapis.com/v1beta/models/` +
        `gemini-2.0-flash-preview-image-generation:generateContent?key=${GEMINI_API_KEY}`;

    try {
        const { data: result } = await axios.post(apiUrl, payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        const parts = result.candidates?.[0]?.content?.parts || [];
        const imagePart = parts.find((p: any) => p.inlineData?.data);
        if (imagePart && imagePart.inlineData) {
            const mime = imagePart.inlineData.mimeType || 'image/png';
            const b64 = imagePart.inlineData.data;
            return res.json({ imageUrl: `data:${mime};base64,${b64}` });
        }

        return res.status(500).json({
            error: 'No image data found in Gemini API response.',
            details: result
        });
    } catch (err: any) {
        console.error('Error generating image from Gemini:', err.response?.data || err.message);
        return res.status(500).json({
            error: 'Failed to generate image.',
            details: err.response?.data || err.message
        });
    }
};
