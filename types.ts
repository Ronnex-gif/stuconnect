
export enum View {
  DASHBOARD = 'DASHBOARD',
  CURRICULAR = 'CURRICULAR',
  CO_CURRICULAR = 'CO_CURRICULAR',
  MESSAGES = 'MESSAGES',
  RESOURCES = 'RESOURCES',
  CHAT_RX = 'CHAT_RX',
  WELLNESS = 'WELLNESS',
  SETTINGS = 'SETTINGS',
  PROFILE = 'PROFILE',
  SCHOOL_INFO = 'SCHOOL_INFO',
  EDUCATOR_STUDIO = 'EDUCATOR_STUDIO'
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  schoolName: string;
  avatar: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizData {
  topic: string;
  questions: QuizQuestion[];
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
  images?: string[];
  videoUri?: string;
  visualCode?: string; // For Mermaid diagrams
  quizData?: QuizData; // For Auto Quizzes
  isError?: boolean;
  groundingMetadata?: GroundingMetadata[];
}

export interface GroundingMetadata {
  url: string;
  title: string;
  source: 'search' | 'maps';
}

export enum ChatMode {
  GENERAL = 'GENERAL', // Gemini 3 Pro
  FAST = 'FAST', // Flash Lite
  RESEARCH = 'RESEARCH', // Flash + Search/Maps
  VISION_EDIT = 'VISION_EDIT', // Flash Image / Pro Video
  LIVE = 'LIVE', // Live API
  VISUALIZE = 'VISUALIZE', // Mermaid Gen
  QUIZ = 'QUIZ' // Auto Quiz Gen
}
