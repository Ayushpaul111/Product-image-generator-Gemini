
import { GoogleGenAI, Modality, Part } from "@google/genai";
import type { AspectRatio, CameraPerspective, LightingStyle } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface PromptGenerationParams {
    aspectRatio: AspectRatio;
    lightingStyle: LightingStyle;
    cameraPerspective: CameraPerspective;
    styleImageBase64?: string;
    styleImageMimeType?: string;
}

export const generateDetailedPrompt = async ({
    aspectRatio,
    lightingStyle,
    cameraPerspective,
    styleImageBase64,
    styleImageMimeType,
}: PromptGenerationParams): Promise<string> => {
    const prompt = `You are a professional product photography prompt writer. Your task is to generate a highly detailed and descriptive prompt for an AI image generation model. This prompt will be used to place a user's product photo into a new, professional-looking scene.

Based on the following parameters, create the prompt:
- Aspect Ratio: ${aspectRatio}
- Lighting Style: ${lightingStyle}
- Camera Perspective: ${cameraPerspective}

${styleImageBase64
    ? `A style reference image is provided. **First, describe the provided style reference image in detail.** Analyze its aesthetics, color palette, mood, composition, and textures. **Then, incorporate this detailed description of the style** into the final prompt to define the visual style of the new scene.`
    : ''
}

The final output must be a single, concise paragraph of text, ready to be fed into an image generation model. Do not include any preamble, headings, or explanation. Just provide the prompt itself. Describe the background, props, and atmosphere vividly.`;

    const contents: Part[] = [{ text: prompt }];
    if (styleImageBase64 && styleImageMimeType) {
        contents.push({
            inlineData: {
                data: styleImageBase64,
                mimeType: styleImageMimeType,
            },
        });
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: contents },
    });

    return response.text;
};


interface ImageEditingParams {
    productImageBase64: string;
    productImageMimeType: string;
    prompt: string;
    styleImageBase64?: string;
    styleImageMimeType?: string;
}

export const editImage = async ({
    productImageBase64,
    productImageMimeType,
    prompt,
    styleImageBase64,
    styleImageMimeType,
}: ImageEditingParams): Promise<string> => {
    const parts: Part[] = [
        {
            inlineData: {
                data: productImageBase64,
                mimeType: productImageMimeType,
            },
        },
    ];

    if (styleImageBase64 && styleImageMimeType) {
        parts.push({
            inlineData: {
                data: styleImageBase64,
                mimeType: styleImageMimeType,
            },
        });
    }
    
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }

    throw new Error("No image was generated. The model may have refused the request.");
};
