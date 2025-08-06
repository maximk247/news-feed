import { groqService, type GroqService } from '@entity/services/groq.service';

export class NewsFeedService {
  constructor(private groq: GroqService) {}

  async generateAIComment(title: string, body: string): Promise<string> {
    const prompt = `Write a very short (1 sentence), friendly comment for the news:
      Title: "${title}"
      Text: "${body}"`;
    return this.groq.generateText(prompt);
  }
}

export const newsFeedService = new NewsFeedService(groqService);
