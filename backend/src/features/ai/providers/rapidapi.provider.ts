import https from 'https';
import { AIProvider } from '../ai.types';
import { env } from '../../../config/env';

export class RapidAPIProvider implements AIProvider {
  name = 'RapidAPI';

  public async chat(prompt: string): Promise<string> {
    const data = JSON.stringify({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      web_access: false,
    });

    const options = {
      method: 'POST',
      hostname: env.AI_API_HOST,
      port: null,
      path: '/o3mini',
      headers: {
        'x-rapidapi-key': env.AI_API_KEY,
        'x-rapidapi-host': env.AI_API_HOST,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 400) {
            return reject(new Error(`RapidAPI AI error: ${res.statusCode} ${responseData}`));
          }

          try {
            const parsed = JSON.parse(responseData);
            // Handling the specific response structure of chatgpt-42.p.rapidapi.com
            const content = parsed.result || parsed.content || JSON.stringify(parsed);
            resolve(content);
          } catch (err) {
            reject(new Error('Failed to parse AI response'));
          }
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      req.write(data);
      req.end();
    });
  }
}
