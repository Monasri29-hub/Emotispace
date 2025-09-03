
import { GoogleGenAI, Type } from "@google/genai";
import { Personality, Mood, Room, DesignReport, Style, Budget } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const stylePrompts = {
    Indian: `
      Incorporate vibrant, rich Indian design elements.
      - **Colors**: Use a palette inspired by Indian spices (turmeric yellow, saffron orange, cardamom green, chili red) or royal palaces (royal blue, emerald green, ruby red, with gold accents).
      - **Furniture & Decor**: Suggest furniture with traditional Indian craftsmanship, like hand-carved Sheesham wood with floral motifs. Include elements like a 'jhoola' (swing), low 'baithak' seating, brass lamps, copper 'urlis' (bowls), and 'jaali' (latticework screens).
      - **Textiles & Patterns**: Emphasize Indian prints like paisley, ikat, and block-print for cushions and throws. Suggest handwoven 'dhurries' or vibrant Indian carpets. Use luxurious fabrics like silk and brocade.
    `,
    Western: `
      Incorporate clean, distinct Western design elements.
      - **Colors**: Suggest palettes for styles like Scandinavian minimalist (muted greys, beige, white, light wood), modern farmhouse (classic white, charcoal black, warm neutrals), or rustic lodge (earthy browns, deep greens, stone grey, rusty red).
      - **Furniture & Decor**: Suggest furniture based on styles like Mid-Century Modern (teak sideboard, tapered legs), rustic Western (cowhide rug, leather armchair, antler chandelier), or coastal/Hamptons (linen sofas, weathered wood, nautical colors). Mention industrial elements like exposed brick and metal frames.
      - **Textures & Materials**: Emphasize a mix of textures like distressed leather, natural stone, reclaimed wood, and wrought iron. Suggest layered textiles like wool plaid blankets and chunky knit throws.
    `,
    Modern: `
      Focus on a clean, contemporary, and functional Modern design.
      - **Colors**: Emphasize a neutral color palette with pops of color. Think whites, greys, blacks, and earthy tones.
      - **Furniture & Decor**: Furniture should have clean lines and simple forms. Focus on minimalism, avoiding excessive ornamentation. Use natural materials like wood, metal, and glass.
      - **Principles**: The design should follow principles of simplicity, functionality, and uncluttered spaces. Open-plan living is a key concept.
    `
};

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
                    description: "3-4 personalized design strategies."
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
        },
        estimated_budget: {
            type: Type.STRING,
            description: "A friendly string describing the estimated budget range for the project, e.g., '$1,500 - $3,000' or 'Under $500'."
        }
    },
    required: ["insight_report", "emotional_story", "visual_prompt", "implementation_steps", "estimated_budget"]
};


export async function getDesignIdeas(personality: Personality, mood: Mood, room: Room, style: Style, architecturalFeatures: string, budget: Budget): Promise<DesignReport> {
    const styleInstruction = stylePrompts[style] || stylePrompts.Modern;
    
    const featuresInstruction = architecturalFeatures.trim()
        ? `
Architectural Features / Dimensions to Incorporate:
- ${architecturalFeatures.trim()}
Critically, these user-provided features must be central to your design recommendations, especially within the 'visual_prompt'.
`
        : '';

    const prompt = `
You are "EmotiSpace: Professional Interior Design & Wellbeing Engine". Your task is to generate a full, actionable room design analysis based on user input. The output must be a machine-readable JSON payload that strictly follows the provided schema.

User Input:
- personality: ${personality}
- emotional_goal: ${mood}
- room_type: ${room}
- design_style: ${style}
- budget_level: ${budget}
${featuresInstruction}

Style Guidelines:
${styleInstruction}

JSON Output Instructions:
Produce a JSON object with the exact keys described in the schema. Ensure your recommendations in all sections strongly reflect the user's input and the specified design style. If architectural features are provided, they MUST be incorporated. All furniture, material, and decor suggestions must align with the user's specified **budget_level (${budget})**.

1.  **insight_report**: A professional, executive-style report.
    -   **headline**: A compelling title summarizing the design strategy, incorporating the chosen style.
    -   **analysis**: 3-4 bullet points, where each point is a personalized design strategy that reflects their personality, addresses their emotional goals, and adheres to the ${style} design principles, while being mindful of the budget.

2.  **emotional_story**: This is the **user-friendly summary**. Write a short, vivid, and sensory paragraph describing the room's atmosphere, textures, light, and emotional effect. Immerse the user in the feeling of the space, making sure to weave in elements of the ${style} style that are appropriate for the budget.

3.  **visual_prompt**: This is the **detailed image prompt** for an AI image generator. Create a single, cinematic, and technically rich paragraph for a photorealistic, high-resolution interior design photograph (16:9 aspect ratio). This prompt is critical and MUST be highly detailed, specifying materials (e.g., "matte oak," "boucle fabric"), lighting (e.g., "soft morning light from a large window"), key furniture, decor, color palette, and camera angle for an accurate visualization. The visual prompt must strictly adhere to the ${style} aesthetic, be realistic for the specified **budget_level (${budget})**, and **MUST incorporate the user's specified architectural features if provided**.

4.  **implementation_steps**: A practical checklist of 3-6 actionable steps. For each step, include the task, an effort level ('Low', 'Medium', 'High'), and an estimated time in days. The steps should be practical for achieving the ${style} design within the user's budget.

5.  **estimated_budget**: Based on all your recommendations, provide a friendly string with an estimated cost range for completing the project (e.g., '$1,500 - $3,000'). This estimate must be realistic for the specified **budget_level (${budget})**.
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