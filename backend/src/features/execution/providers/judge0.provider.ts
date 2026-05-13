import https from 'https';
import { ExecutionProvider, ExecutionRequest, ExecutionResult } from '../execution.types';
import { env } from '../../../config/env';

export class Judge0Provider implements ExecutionProvider {
  name = 'Judge0';

  public async isAvailable(): Promise<boolean> {
    return !!env.JUDGE0_API_KEY;
  }

  public async execute(request: ExecutionRequest): Promise<ExecutionResult> {
    const data = JSON.stringify({
      source_code: Buffer.from(request.sourceCode).toString('base64'),
      language_id: request.languageId,
      stdin: Buffer.from(request.stdin).toString('base64'),
    });

    const options = {
      method: 'POST',
      hostname: env.JUDGE0_API_HOST,
      port: null,
      path: '/submissions?base64_encoded=true&wait=true',
      headers: {
        'x-rapidapi-key': env.JUDGE0_API_KEY,
        'x-rapidapi-host': env.JUDGE0_API_HOST,
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
            return reject(new Error(`Judge0 API error: ${res.statusCode} ${responseData}`));
          }

          try {
            const parsed = JSON.parse(responseData);
            resolve({
              stdout: parsed.stdout ? Buffer.from(parsed.stdout, 'base64').toString('utf-8') : null,
              stderr: parsed.stderr ? Buffer.from(parsed.stderr, 'base64').toString('utf-8') : null,
              compileOutput: parsed.compile_output ? Buffer.from(parsed.compile_output, 'base64').toString('utf-8') : null,
              statusId: parsed.status?.id || 0,
              statusDescription: parsed.status?.description || 'Unknown',
              time: parsed.time || null,
              memory: parsed.memory || null,
            });
          } catch (err) {
            reject(new Error('Failed to parse Judge0 response'));
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
