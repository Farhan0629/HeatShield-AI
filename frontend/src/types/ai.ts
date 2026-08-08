export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface AIChatRequest {
  facility_id: string;
  message: string;
  history?: AIChatMessage[];
}

export interface AIChatResponse {
  reply: string;
  facility_id: string;
  suggested_followups: string[];
  provider: string;
  is_demo_data: boolean;
}
