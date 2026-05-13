import { ExecutionProvider, ExecutionRequest, ExecutionResult } from './execution.types';

export interface ExecutionJob extends ExecutionRequest {
  id: string;
}

export interface ExecutionQueue {
  enqueue(job: ExecutionJob, provider: ExecutionProvider): Promise<ExecutionResult>;
}

export class InMemoryExecutionQueue implements ExecutionQueue {
  public async enqueue(job: ExecutionJob, provider: ExecutionProvider): Promise<ExecutionResult> {
    // For Phase 1, we just await the provider directly.
    // In future phases, this can enqueue to BullMQ and wait for the result.
    return provider.execute(job);
  }
}

export const executionQueue = new InMemoryExecutionQueue();
