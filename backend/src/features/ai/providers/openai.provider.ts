import { AIProvider } from '../ai.types';

export class OpenAIProvider implements AIProvider {
  name = 'OpenAI';

  public async chat(prompt: string): Promise<string> {
    throw new Error('OpenAI provider is not yet implemented.');
  }
}
