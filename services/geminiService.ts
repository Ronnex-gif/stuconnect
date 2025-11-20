
import { 
  GoogleGenAI, 
  Modality,
  FunctionDeclaration,
  Type,
  LiveServerMessage
} from "@google/genai";
import { ChatMessage, GroundingMetadata, QuizData } from "../types";

// Helper to get AI instance
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTextResponse = async (
  prompt: string, 
  modelName: string = 'gemini-3-pro-preview',
  systemInstruction?: string
): Promise<{ text: string, grounding?: GroundingMetadata[] }> => {
  const ai = getAI();
  const config: any = {
    systemInstruction,
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config
    });
    return { text: response.text || "No response text generated." };
  } catch (error) {
    console.error("Generate Text Error:", error);
    throw error;
  }
};

export const generateVisualization = async (prompt: string): Promise<{ text: string, visualCode?: string }> => {
  const ai = getAI();
  const model = 'gemini-2.5-flash'; // Good at coding/structure
  
  const systemInstruction = "You are an expert visualizer. Your task is to create Mermaid.js diagrams based on user requests. \
  Analyze the user's text and create a flowchart, mindmap, sequence diagram, or class diagram that best represents the concept. \
  Return the Mermaid.js code wrapped in a code block like ```mermaid ... ```. \
  Also provide a brief explanation or summary of the diagram outside the code block. \
  If a diagram is not suitable, just explain why.";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { systemInstruction }
    });
    
    const content = response.text || "";
    
    // Extract mermaid code
    const match = content.match(/```mermaid\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
        // Return text without the code block, and the code separately
        return { 
            text: content.replace(/```mermaid[\s\S]*?```/, '').trim() || "Here is the visualization:", 
            visualCode: match[1].trim() 
        };
    }
    
    return { text: content };
  } catch (error) {
    console.error("Viz Gen Error:", error);
    throw error;
  }
};

export const generateQuiz = async (topic: string): Promise<{ text: string, quizData?: QuizData }> => {
  const ai = getAI();
  const model = 'gemini-2.5-flash';

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Generate a short, multiple-choice quiz (3 to 5 questions) about: ${topic}. Ensure the output is valid JSON matching the schema.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING } 
                  },
                  correctAnswerIndex: { type: Type.INTEGER, description: "The index (0-3) of the correct option." },
                  explanation: { type: Type.STRING, description: "Short explanation why this is correct." }
                },
                required: ["id", "question", "options", "correctAnswerIndex", "explanation"]
              }
            }
          },
          required: ["topic", "questions"]
        }
      }
    });

    // Robust JSON parsing: Remove potential markdown code blocks if present
    let jsonString = response.text || "{}";
    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const quizJson = JSON.parse(jsonString);
    return { 
      text: `I've generated a quiz about ${topic}. Good luck!`, 
      quizData: quizJson as QuizData 
    };
  } catch (error) {
    console.error("Quiz Gen Error:", error);
    return { text: "Sorry, I couldn't generate a quiz for that topic. Please try again." };
  }
};

export const generateLessonPlan = async (topic: string, gradeLevel: string, duration: string): Promise<string> => {
  const ai = getAI();
  // Using Pro for detailed reasoning and structure
  const model = 'gemini-3-pro-preview';
  const prompt = `Create a detailed lesson plan for ${gradeLevel} students about "${topic}". The lesson is ${duration} long.
  Include:
  1. Learning Objectives
  2. Materials Needed
  3. Introduction (Time)
  4. Main Activity (Time)
  5. Conclusion/Assessment (Time)
  6. Homework Idea
  Format as clean Markdown.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt
    });
    return response.text || "Could not generate lesson plan.";
  } catch (error) {
    console.error("Lesson Plan Gen Error:", error);
    throw error;
  }
};

export const gradeEssay = async (assignmentTopic: string, studentWork: string): Promise<string> => {
  const ai = getAI();
  const model = 'gemini-3-pro-preview';
  const prompt = `Act as a university professor. Grade the following student submission based on the topic: "${assignmentTopic}".
  
  Student Submission:
  "${studentWork}"
  
  Provide:
  1. A Letter Grade (A, B, C, D, F)
  2. A brief summary of the work's quality (2-3 sentences).
  3. 3 specific bullet points on Strengths.
  4. 3 specific bullet points on Areas for Improvement.
  
  Format using Markdown.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt
    });
    return response.text || "Grading complete.";
  } catch (error) {
    console.error("Grading Error:", error);
    throw error;
  }
};

export const generateGroundedResponse = async (
  prompt: string,
  useMaps: boolean = false,
  userLocation?: { latitude: number, longitude: number }
): Promise<{ text: string, grounding: GroundingMetadata[] }> => {
  const ai = getAI();
  const tools: any[] = [];
  
  // Using Flash for grounding tasks as per instructions
  const model = 'gemini-2.5-flash';
  
  if (useMaps) {
    tools.push({ googleMaps: {} });
  } else {
    // Default to search if not maps, or if relevant
    tools.push({ googleSearch: {} });
  }

  const config: any = { tools };

  if (useMaps && userLocation) {
    config.toolConfig = {
      retrievalConfig: {
        latLng: userLocation
      }
    };
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const grounding: GroundingMetadata[] = [];

    groundingChunks.forEach((chunk: any) => {
      if (chunk.web) {
        grounding.push({ url: chunk.web.uri, title: chunk.web.title, source: 'search' });
      } else if (chunk.maps) {
        grounding.push({ url: chunk.maps.uri, title: chunk.maps.title, source: 'maps' });
      }
    });

    return { text: response.text || "Found information:", grounding };
  } catch (error) {
    console.error("Grounding Error:", error);
    throw error;
  }
};

export const editImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
  const ai = getAI();
  // Clean base64 string
  const data = imageBase64.split(',')[1];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data, mimeType } },
          { text: prompt }
        ]
      },
      config: {
        responseModalities: [Modality.IMAGE]
      }
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    throw new Error("No image returned");
  } catch (error) {
    console.error("Image Edit Error:", error);
    throw error;
  }
};

export const analyzeVideo = async (prompt: string, videoFile: File): Promise<string> => {
  const ai = getAI();
  const base64 = await fileToGenerativePart(videoFile);
  
  try {
     const response = await ai.models.generateContent({
         model: 'gemini-3-pro-preview',
         contents: {
             parts: [
                 { inlineData: { mimeType: videoFile.type, data: base64 } },
                 { text: prompt }
             ]
         }
     });
     return response.text || "Analysis complete.";
  } catch (e) {
      console.error("Video Analysis Error", e);
      throw e;
  }
};

const fileToGenerativePart = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Audio utils for Live API
export function base64ToFloat32Array(base64: string): Float32Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768.0;
  }
  return float32;
}

export function createPcmBlob(data: Float32Array): { data: string, mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = Math.max(-32768, Math.min(32767, data[i] * 32768));
  }
  
  let binary = '';
  const bytes = new Uint8Array(int16.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return {
    data: btoa(binary),
    mimeType: 'audio/pcm;rate=16000',
  };
}
