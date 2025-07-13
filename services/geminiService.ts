import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ImageMetadata } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

export const generateImageMetadata = async (
  imageFile: File, 
  apiKey: string,
  length: 'short' | 'detailed'
): Promise<ImageMetadata> => {
  if (!apiKey) {
    throw new Error("API Key is not set. Please add your API key in the settings.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const imagePart = await fileToGenerativePart(imageFile);

  const promptConstraints = {
    short: {
      name: "strictly between 1 and 5 words long",
      tags: "between 2 and 10 tags",
    },
    detailed: {
      name: "strictly between 5 and 15 words long",
      tags: "between 20 and 40 tags",
    }
  };

  const selectedConstraint = promptConstraints[length];

  const prompt = `
You are an expert image analyst. Your task is to generate a concise title and relevant tags for the provided image.

Respond ONLY with a valid JSON object. Do not include any other text, explanations, or markdown formatting like \`\`\`json.

The JSON object must have the following structure:
{
  "name": "A descriptive title for the image, ${selectedConstraint.name}.",
  "tags": ["tag1", "tag2", "...", "tagN"]
}

Rules for the JSON response:
1. The "name" field must be a string that is ${selectedConstraint.name}.
2. The "tags" field must be an array of strings.
3. The "tags" array must contain ${selectedConstraint.tags}.
4. Each tag in the array must be a single, lowercase English word.
5. Tags must not contain any spaces, hyphens, or special characters. They should be simple, descriptive keywords.
`;

  const textPart = { text: prompt };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
        }
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr) as ImageMetadata;

    if (!parsedData.name || !Array.isArray(parsedData.tags)) {
      throw new Error("Invalid data structure received from API.");
    }

    return parsedData;

  } catch (error) {
    console.error("Error generating metadata:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error("Your API key is not valid. Please check it in the settings.");
    }
    throw new Error("Failed to generate metadata from the image. Please try again.");
  }
};