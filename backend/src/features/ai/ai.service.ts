import { AIProvider } from './ai.types';
import { RapidAPIProvider } from './providers/rapidapi.provider';
import { OpenAIProvider } from './providers/openai.provider';
import { env } from '../../config/env';
import { AppError } from '../../shared/errors';
import { AskHintInput, ReviewCodeInput, ComplexityInput } from './ai.validation';

export class AIService {
  private provider: AIProvider;

  constructor() {
    this.provider = env.AI_PROVIDER === 'rapidapi' ? new RapidAPIProvider() : new OpenAIProvider();
  }

  /**
   * Helper to extract code from markdown-like responses.
   */
  private extractCodeFromResponse(responseText: string, language: string): string {
    const codeBlockRegex = new RegExp(`\`\`\`(?:${language})?\\n([\\s\\S]*?)\\n\`\`\``, 'i');
    const match = responseText.match(codeBlockRegex);
    if (match && match[1]) {
      return match[1].trim();
    }
    // Fallback: remove backticks if they exist without newline formatting
    return responseText.replace(/```(?:\w+)?/g, '').trim();
  }

  /**
   * Helper to extract plain text suggestion (strips code blocks).
   */
  private extractSuggestion(responseText: string): string {
    const withoutCodeBlocks = responseText.replace(/```(?:\w+)?\n[\s\S]*?\n```/g, '');
    const lines = withoutCodeBlocks.split('\n');
    const suggestionLines = lines.filter(line => !line.match(/^(###|Explanation|Below is|This code|\d+\.)/i));
    return suggestionLines.join('\n').trim() || responseText; // Fallback to full response if all stripped
  }

  public async getHint(data: AskHintInput): Promise<string> {
    const { code, language, problemDescription, query, inputFormat } = data;

    const prompt = `
      Problem: ${problemDescription}
      Input Format: ${inputFormat || 'Not provided'}
      Language: ${language}
      Current Code: ${code}
      User Query: ${query}

      Please provide a response to the user's query based on the code and problem description.
      Don't give any type of explanation, just give a little comment nothing else it should be strictly prohibited
      and also give result in indentation.
    `;

    try {
      const response = await this.provider.chat(prompt);
      return this.extractSuggestion(response);
    } catch (error: any) {
      throw new AppError(`AI Provider Error: ${error.message}`, 502);
    }
  }

  public async reviewCode(data: ReviewCodeInput): Promise<string | null> {
    const { code, language } = data;

    const prompt = `
      You are an expert code syntax corrector. 
      Below is a piece of code written in ${language}. 
      Your task is to correct any syntax errors in the code without 
      adding extra lines of code, changing the logic, or adding new functionality. 
      Only fix syntax issues (e.g., missing semicolons, incorrect indentation, unbalanced parentheses).
      If there are no syntax errors, return the code unchanged.

      Code:
      \`\`\`
      ${code}
      \`\`\`

      Return only the corrected code as plain text,
      without any explanations or additional comments. 
      If the code is already syntactically correct, return it as-is.
    `;

    try {
      const response = await this.provider.chat(prompt);
      const correctedCode = this.extractCodeFromResponse(response, language);

      const hasChanges = correctedCode !== code.trim();
      return hasChanges ? correctedCode : null;
    } catch (error: any) {
      throw new AppError(`AI Provider Error: ${error.message}`, 502);
    }
  }

  public async analyzeComplexity(data: ComplexityInput): Promise<string> {
    const { code, language } = data;

    const prompt = `
      Analyze the Time and Space complexity of the following ${language} code.
      Return the response in a concise format:
      Time Complexity: O(...)
      Space Complexity: O(...)
      Brief Reason (1 sentence max): ...

      Code:
      \`\`\`
      ${code}
      \`\`\`
    `;

    try {
      return await this.provider.chat(prompt);
    } catch (error: any) {
      throw new AppError(`AI Provider Error: ${error.message}`, 502);
    }
  }
}

export const aiService = new AIService();
