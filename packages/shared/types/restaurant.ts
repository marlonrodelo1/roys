export type BotTone = 'friendly' | 'formal' | 'playful';

export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  bot_name: string;
  bot_tone: BotTone;
  bot_language: string;
  primary_color: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  message_type: 'text' | 'voice' | 'order_summary' | 'confirmation';
  created_at: string;
}
