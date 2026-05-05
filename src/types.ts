export type ModelId = 'poolside/laguna-m.1:free';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AnalysisResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  hallucinationProbability: number;
  keyTopics: string[];
  complexityScore: number;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  model: ModelId;
  analysis?: AnalysisResult;
}
