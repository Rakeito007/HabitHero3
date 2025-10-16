import { getAnthropicClient } from './anthropic';

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeResponse {
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class ClaudeService {
  private client;
  
  constructor() {
    this.client = getAnthropicClient();
  }

  async sendMessage(
    messages: ClaudeMessage[],
    systemPrompt?: string,
    model: string = 'claude-3-5-sonnet-latest',
    maxTokens: number = 1000
  ): Promise<ClaudeResponse> {
    try {
      const response = await this.client.messages.create({
        model,
        max_tokens: maxTokens,
        system: systemPrompt || "You are an AI assistant focused on habit building, nutrition, and fitness guidance. Provide concise, helpful responses.",
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      });

      return {
        content: response.content[0]?.type === 'text' ? response.content[0].text : '',
        usage: response.usage ? {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens
        } : undefined
      };
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error('Failed to get response from Claude');
    }
  }

  // Quick response for simple queries
  async quickResponse(
    userMessage: string,
    context?: string,
    model: string = 'claude-3-5-haiku-latest' // Faster model for quick responses
  ): Promise<string> {
    try {
      const systemPrompt = `You are a concise AI habit coach. ${context || ''} 
      
      Keep responses short and actionable - users are time-pressed. Use emojis sparingly but effectively.
      
      Core characteristics:
      - Strategic: Long-term focused
      - Reasoning: Logic-based recommendations
      - Empathetic: Emotionally aware
      - Assistant: Service-oriented
      
      Provide nutrition advice, fitness routines, and habit guidance when relevant.`;

      const response = await this.sendMessage(
        [{ role: 'user', content: userMessage }],
        systemPrompt,
        model,
        500 // Shorter responses for quick mode
      );

      return response.content;
    } catch (error) {
      console.error('Claude Quick Response Error:', error);
      return "I'm having trouble connecting right now. Try asking again! 💙";
    }
  }

  // Detailed response for complex queries
  async detailedResponse(
    userMessage: string,
    conversationHistory: ClaudeMessage[] = [],
    context?: string
  ): Promise<string> {
    try {
      const systemPrompt = `You are an advanced AI habit coach with expertise in:
      
      🎯 HABIT COACHING: Strategic planning, behavioral analysis, motivation
      🥗 NUTRITION: Meal planning, recipes, dietary guidance  
      💪 FITNESS: Workout routines, exercise recommendations
      🧠 PSYCHOLOGY: Emotional intelligence, behavior change
      
      Your core characteristics:
      - Strategic: Create long-term plans and see the big picture
      - Reasoning: Use logical analysis and evidence-based recommendations  
      - Empathetic: Understand emotional context and respond with care
      - Assistant: Focused on serving and supporting user success
      
      ${context || ''}
      
      Keep responses concise but comprehensive. Users value time efficiency.`;

      const messages = [
        ...conversationHistory,
        { role: 'user' as const, content: userMessage }
      ];

      const response = await this.sendMessage(
        messages,
        systemPrompt,
        'claude-3-5-sonnet-latest',
        1500
      );

      return response.content;
    } catch (error) {
      console.error('Claude Detailed Response Error:', error);
      return "I'm experiencing some technical difficulties. Let me try to help you anyway - what specific guidance do you need? 🤔";
    }
  }

  // Generate structured content (meal plans, workouts, etc.)
  async generateStructuredContent(
    prompt: string,
    outputFormat: 'json' | 'markdown' | 'plain' = 'plain'
  ): Promise<string> {
    try {
      const systemPrompt = `You are an AI expert in habit formation, nutrition, and fitness.
      
      Generate structured content as requested. Keep it practical and actionable.
      Output format: ${outputFormat}
      
      For meal plans: Include calories, prep time, ingredients
      For workouts: Include sets, reps, duration, difficulty
      For habits: Include difficulty, description, implementation tips`;

      const response = await this.sendMessage(
        [{ role: 'user', content: prompt }],
        systemPrompt,
        'claude-3-5-sonnet-latest',
        2000
      );

      return response.content;
    } catch (error) {
      console.error('Claude Structured Content Error:', error);
      throw error;
    }
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.quickResponse("Hello!");
      return response.length > 0;
    } catch (error) {
      console.error('Claude Connection Test Failed:', error);
      return false;
    }
  }
}

export const claudeService = new ClaudeService();