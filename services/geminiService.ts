import { GoogleGenAI, Type } from "@google/genai";
import { BigFiveTraits, Mood, Room, DesignReport, Style, Budget, ArchitecturalBrief } from '../types';

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

const architecturalSchema = {
    type: Type.OBJECT,
    properties: {
        conceptual_headline: {
            type: Type.STRING,
            description: "A compelling headline for the architectural concept, e.g., 'The House of Serenity: A Hurricane-Resistant Coastal Retreat'."
        },
        emotion_deconstruction: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of the core architectural principles derived from the specified emotion."
        },
        regional_hazards: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of the top 3-4 climate and disaster risks for the specified location."
        },
        design_synthesis_statement: {
            type: Type.STRING,
            description: "A critical paragraph explaining how the design concept deeply integrates the emotional brief with the resilience requirements."
        },
        key_features: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    feature_name: { type: Type.STRING },
                    emotional_rationale: { type: Type.STRING, description: "How the feature contributes to the emotional atmosphere." },
                    resilience_rationale: { type: Type.STRING, description: "How the feature provides specific climate/disaster resilience." },
                    dual_purpose_synthesis: { type: Type.STRING, description: "A concise explanation of how this feature serves both emotional and resilient goals simultaneously." }
                },
                required: ["feature_name", "emotional_rationale", "resilience_rationale", "dual_purpose_synthesis"]
            },
            description: "A list of specific design elements, materials, and systems."
        },
        visual_prompt: {
            type: Type.STRING,
            description: "A single, cinematic paragraph rich in visual detail for an AI image generator. It should describe a photorealistic, 3D render of the building's exterior, mentioning materials, form, landscape, lighting, and the overall mood. This will be used to generate the main visualization."
        },
        floor_plan_prompt: {
            type: Type.STRING,
            description: "A detailed prompt for an AI image generator to create a 2D floor plan. Describe it as a clean, black and white architectural blueprint or schematic. Specify the layout of rooms, their connections, key resilient features' placement (e.g., thick walls, water collection), and how the layout embodies the core emotion (e.g., open-plan for Joy, secluded nooks for Serenity). Label key areas."
        }
    },
    required: ["conceptual_headline", "emotion_deconstruction", "regional_hazards", "design_synthesis_statement", "key_features", "visual_prompt", "floor_plan_prompt"]
};


export async function getDesignIdeas(bigFive: BigFiveTraits, mood: Mood, room: Room, style: Style, architecturalFeatures: string, budget: Budget): Promise<DesignReport> {
    const styleInstruction = stylePrompts[style] || stylePrompts.Modern;
    
    const featuresInstruction = architecturalFeatures.trim()
        ? `
Architectural Features / Dimensions to Incorporate:
- ${architecturalFeatures.trim()}
Critically, these user-provided features must be central to your design recommendations, especially within the 'visual_prompt'.
`
        : '';
    
    const bigFiveInstruction = `
The user's personality is defined by the "Big Five" model. Interpret these scores (0-100 scale) to create a deeply personalized space:
- **Openness: ${bigFive.openness}**. High scores mean imaginative, curious, and novelty-seeking. Design for them with unique art, unconventional layouts, and flexible spaces for creative pursuits. Low scores mean practical and conventional. Design for them with classic furniture, familiar layouts, and straightforward functionality.
- **Conscientiousness: ${bigFive.conscientiousness}**. High scores mean organized, disciplined, and efficient. Design with ample smart storage, minimalist aesthetics, clear zones for activities, and high-quality, durable materials. Low scores mean spontaneous and flexible. Design with multi-purpose furniture, relaxed arrangements, and a more eclectic, less rigid feel.
- **Extraversion: ${bigFive.extraversion}**. High scores mean outgoing, sociable, and energetic. Design with open layouts, ample seating for guests, vibrant colors, and conversation-starting decor. Low scores mean reserved and solitary. Design with cozy nooks, sound-dampening materials, calming color palettes, and private, restorative spaces.
- **Agreeableness: ${bigFive.agreeableness}**. High scores mean friendly, compassionate, and cooperative. Design with soft textures, rounded furniture, warm lighting, and a harmonious, welcoming atmosphere. Low scores mean analytical and independent. Design with functional, utilitarian elements, and a more individualistic style that may prioritize function over overt comfort for others.
- **Neuroticism: ${bigFive.neuroticism}**. High scores mean a tendency toward stress and anxiety. Design a serene sanctuary that is clutter-free, highly organized, and predictable. Use soothing, natural colors (blues, greens, earth tones), soft, diffused lighting, and comfortable, secure furniture. Low scores mean calm and resilient. They can handle more visual complexity, bolder colors, and more stimulating environments.

Use this deep psychological profile as the primary driver for all design choices. The "insight_report" and "emotional_story" must explicitly connect your recommendations back to these specific personality traits.
`;

    const systemInstruction = `
You are "EmotiSpace," an expert AI interior designer with a deep understanding of design psychology. Your task is to generate a comprehensive, personalized room design report based on the user's personality, desired mood, and room specifications.

You must adhere to the following rules:
1.  **Analyze the Big Five scores deeply**: The personality profile is the most critical input. Your entire design concept must be justified based on these traits.
2.  **Integrate all inputs**: Seamlessly blend the personality insights with the desired mood, room type, budget, chosen style, and any specific architectural features.
3.  **Be Actionable and Inspiring**: Provide practical, step-by-step guidance while also creating an inspiring emotional narrative.
4.  **Create a Vivid Visual Prompt**: The 'visual_prompt' must be a single, detailed paragraph suitable for a text-to-image AI, describing a photorealistic 3D render. It should be rich with sensory details (lighting, materials, textures, colors, specific furniture) to generate a beautiful and accurate image. Do not use bullet points or lists in the visual prompt.
5.  **Strictly follow the JSON schema**: Your entire output must be a single JSON object that validates against the provided schema.
`;

    const prompt = `
Generate a design report based on the following user inputs:
- Room: ${room}
- Desired Mood: ${mood}
- Budget: ${budget}
- Design Style: ${style}
${featuresInstruction}
- Personality Profile (Big Five):
${bigFiveInstruction}
- Style Guidance:
${styleInstruction}

Now, generate the complete design report in the specified JSON format.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: designSchema,
            },
        });

        const jsonStr = response.text.trim();
        const designReport = JSON.parse(jsonStr) as DesignReport;
        return designReport;

    } catch (error) {
        console.error("Error generating design ideas:", error);
        throw new Error("Failed to generate design ideas from the AI. Please check the console for more details.");
    }
}


export async function getArchitecturalConcept(emotion: string, location: string): Promise<ArchitecturalBrief> {
    const systemInstruction = `You are EmotiSpace, an advanced AI architectural designer. Your specialty is Resilient Emotional Architecture. Your primary goal is to take a core human emotion as input and generate a concept for a residential structure that both embodies the essence of that emotion and is engineered to be highly resilient against adverse climate change effects and specific natural disasters. The design must be a true synthesis, where the emotional and practical elements are deeply integrated, not just co-located. The output should be a conceptual brief for a single-family dwelling.

[Core Task & Steps]

1.  **Analyze the Input**: You will receive a core Emotion and a Location.

2.  **Deconstruct the Emotion**: Identify the core architectural principles associated with the emotion.
    Example for "Serenity": Enclosure, simplicity, natural light, connection to nature, muted soundscape, minimalism.

3.  **Identify Regional Hazards**: Based on the location, identify the top 3-4 climate and disaster risks.
    Example for Coastal Florida: Hurricanes (high winds, storm surge), extreme heat/humidity, flooding from sea-level rise.
    Example for Hyderabad, India: Extreme heatwaves, urban flooding during monsoon, water scarcity.

4.  **Synthesize & Design**: This is the critical step. Create a design concept where architectural features serve a dual purpose, fulfilling both the emotional brief and the resilience requirements. Explain this synthesis clearly in the 'design_synthesis_statement'.

5.  **Specify Key Features**: Detail the specific design elements, materials, and systems that achieve this synthesis. For each feature, explain its dual rationale.

6.  **Create Visual Prompts**:
    -   **Exterior Prompt ('visual_prompt')**: Create a cinematic, photorealistic prompt for the building's exterior.
    -   **Floor Plan Prompt ('floor_plan_prompt')**: Create a detailed prompt for a 2D black-and-white architectural floor plan. This prompt must describe room layouts, connections, and how they reflect both the emotion and resilience strategies.

7.  **Strictly follow the JSON schema**: Your entire output must be a single JSON object that validates against the provided schema. No trade-offs are allowed; resilience features must enhance the emotional aesthetic. Prioritize sustainable, eco-friendly materials and systems.`;

    const prompt = `
Generate an architectural concept brief based on the following inputs:
-   Core Emotion: ${emotion}
-   Location: ${location}

Now, generate the complete architectural brief in the specified JSON format.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: architecturalSchema,
            },
        });
        
        const jsonStr = response.text.trim();
        const brief = JSON.parse(jsonStr) as ArchitecturalBrief;
        return brief;

    } catch (error) {
        console.error("Error generating architectural concept:", error);
        throw new Error("Failed to generate architectural concept from the AI.");
    }
}

export async function generateImage(prompt: string, aspectRatio: '16:9' | '1:1' = '16:9'): Promise<string> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `${prompt}, cinematic, architectural photography, hyper-detailed, 8k`,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: aspectRatio,
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image from the AI.");
    }
}
