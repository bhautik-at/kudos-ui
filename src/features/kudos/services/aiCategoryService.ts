import { Configuration, OpenAIApi } from 'openai';

const CATEGORIES = [
  'Technical Excellence',
  'Team Player',
  'Innovation',
  'Leadership',
  'Problem Solving',
  'Customer Focus',
  'Quality Focus',
  'Mentorship',
  'Initiative',
  'Collaboration'
] as const;

export type KudoCategory = typeof CATEGORIES[number];

export class AICategoryService {
  private openai: OpenAIApi;

  constructor(apiKey: string) {
    const configuration = new Configuration({ apiKey });
    this.openai = new OpenAIApi(configuration);
  }

  async suggestCategory(message: string): Promise<KudoCategory> {
    try {
      const prompt = `Given this kudos message: "${message}"
      Please categorize it into exactly one of these categories:
      ${CATEGORIES.join(', ')}
      
      Return only the category name, nothing else.`;

      const response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 20,
      });

      const suggestedCategory = response.data.choices[0]?.message?.content?.trim() as KudoCategory;
      
      if (!CATEGORIES.includes(suggestedCategory as any)) {
        return 'Team Player'; // Default fallback
      }

      return suggestedCategory;
    } catch (error) {
      console.error('Error suggesting category:', error);
      return 'Team Player'; // Default fallback
    }
  }

  getAllCategories(): readonly KudoCategory[] {
    return CATEGORIES;
  }
}

export const aiCategoryService = new AICategoryService(process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''); 