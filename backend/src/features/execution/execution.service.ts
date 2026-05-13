import crypto from 'crypto';
import { ExecutionProvider, ExecutionRequest, ExecutionResult } from './execution.types';
import { Judge0Provider } from './providers/judge0.provider';
import { DockerProvider } from './providers/docker.provider';
import { executionQueue } from './execution.queue';
import { env } from '../../config/env';
import { Problem } from '../problems/problem.model';
import { NotFoundError, AppError } from '../../shared/errors';
import { LANGUAGE_MAP } from '../../shared/constants/languages';

export interface TestCaseResult {
  input: string;
  expectedOutput: string;
  actualOutput: string | null;
  passed: boolean;
  error: string | null;
}

export class ExecutionService {
  private provider: ExecutionProvider;

  constructor() {
    this.provider = env.EXECUTION_PROVIDER === 'judge0' ? new Judge0Provider() : new DockerProvider();
  }

  /**
   * Executes code against all test cases for a problem in PARALLEL.
   */
  public async runCode(code: string, language: string, problemId: string): Promise<{ testCaseResults: TestCaseResult[], submissionStatus: string }> {
    const isAvailable = await this.provider.isAvailable();
    if (!isAvailable) {
      throw new AppError('Execution provider is not configured or unavailable', 503);
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      throw new NotFoundError('Problem');
    }

    const languageConfig = LANGUAGE_MAP[language];
    if (!languageConfig) {
      throw new AppError(`Unsupported language: ${language}`, 400);
    }

    // Prepare execution jobs
    const jobs = problem.run_test.map((test) => {
      const stdin = test.input.join(' ');
      const expectedOutput = test.output;
      const jobId = crypto.randomUUID();

      return {
        job: {
          id: jobId,
          sourceCode: code,
          languageId: languageConfig.id,
          stdin,
        },
        expectedOutput,
        originalInput: stdin,
      };
    });

    // Run all test cases in parallel
    const executionPromises = jobs.map((jobData) => 
      executionQueue.enqueue(jobData.job, this.provider)
        .then(result => ({ ...jobData, result, success: true }))
        .catch(error => ({ ...jobData, error: error.message, success: false }))
    );

    const settledResults = await Promise.all(executionPromises);

    const testCaseResults: TestCaseResult[] = settledResults.map((item: any) => {
      if (!item.success) {
        return {
          input: item.originalInput,
          expectedOutput: item.expectedOutput,
          actualOutput: null,
          passed: false,
          error: item.error,
        };
      }

      const { result } = item;
      const actualOutput = result.stdout ? result.stdout.trim() : null;
      const passed = actualOutput === item.expectedOutput;

      // Prioritize error sources
      const error = result.stderr ? result.stderr.trim() :
                    result.compileOutput ? result.compileOutput.trim() :
                    (result.statusId > 3 ? result.statusDescription : null); // Status > 3 are errors (Time Limit, Memory Limit, etc in Judge0)

      return {
        input: item.originalInput,
        expectedOutput: item.expectedOutput,
        actualOutput,
        passed,
        error,
      };
    });

    const submissionStatus = testCaseResults.every(r => r.passed) ? 'Solved' : 'Attempted';

    return {
      testCaseResults,
      submissionStatus,
    };
  }
}

export const executionService = new ExecutionService();
