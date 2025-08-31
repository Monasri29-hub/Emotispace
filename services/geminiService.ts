import { GoogleGenAI, Type } from "@google/genai";
import { Personality, Mood, Room, DesignReport } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const designSchema = {
    type: Type.OBJECT,
    properties: {
        insight_report: {
            type: Type.OBJECT,
            properties: {
                headline: { 
                    type: Type.STRING,
                    description: "A concise, persuasive headline for the design insight report."
                },
                analysis: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "4-6 bullet points analyzing the user's needs and the design goals."
                }
            },
            required: ["headline", "analysis"]
        },
        emotional_story: {
            type: Type.STRING,
            description: "A short, sensory paragraph describing the atmosphere, textures, light, and emotional effect of the proposed design."
        },
        visual_prompt: {
            type: Type.STRING,
            description: "A single, cinematic paragraph rich in visual detail for an AI image generator. It should describe a photorealistic, 3D render of the room, mentioning materials, lighting, specific objects, and the overall mood."
        },
        implementation_steps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    step: { type: Type.STRING, description: "A single, actionable implementation step." },
                    effort: { type: Type.STRING, description: "Estimated effort: Low, Medium, or High." },
                    estimated_days: { type: Type.NUMBER, description: "Estimated time in days to complete the step." }
                },
                required: ["step", "effort", "estimated_days"]
            },
            description: "A checklist of 3-6 actionable steps for the user."
        }
    },
    required: ["insight_report", "emotional_story", "visual_prompt", "implementation_steps"]
};


export async function getDesignIdeas(personality: Personality, mood: Mood, room: Room): Promise<DesignReport> {
    const prompt = `
You are "EmotiSpace: Professional Interior Design & Wellbeing Engine". Your task is to generate a full, actionable room design analysis based on user input. The output must be a machine-readable JSON payload that strictly follows the provided schema.

User Input:
- personality: ${personality}
- emotional_goal: ${mood}
- room_type: ${room}

JSON Output Instructions:
Produce a JSON object with the exact keys described in the schema.

1.  **insight_report**: A professional, executive-style report.
    -   **headline**: A compelling title summarizing the design strategy.
    -   **analysis**: 4-6 bullet points interpreting the user's needs and defining the core design goals.

2.  **emotional_story**: This is the **user-friendly summary**. Write a short, vivid, and sensory paragraph describing the room's atmosphere, textures, light, and emotional effect. Immerse the user in the feeling of the space.

3.  **visual_prompt**: This is the **detailed image prompt** for an AI image generator. Create a single, cinematic, and technically rich paragraph for a photorealistic 3D render. Specify materials (e.g., "matte oak," "boucle fabric"), lighting (e.g., "soft morning light from a large window"), key furniture, decor, color palette, and camera angle for an accurate visualization.

4.  **implementation_steps**: A practical checklist of 3-6 actionable steps. For each step, include the task, an effort level ('Low', 'Medium', 'High'), and an estimated time in days.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: designSchema,
            }
        });
        const parsedResponse = JSON.parse(response.text);
        return parsedResponse as DesignReport;
    } catch (error) {
        console.error("Error calling Gemini API for design ideas:", error);
        throw new Error("Failed to generate design ideas. Please try again later.");
    }
}

export async function generateImage(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '16:9',
            },
        });

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    } catch (error) {
        console.error("Error calling Imagen API:", error);
        throw new Error("Failed to generate the room image. Please try again later.");
    }
}