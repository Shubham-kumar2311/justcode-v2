import { ExecutionProvider, ExecutionRequest, ExecutionResult } from '../execution.types';

export class DockerProvider implements ExecutionProvider {
  name = 'Docker';

  public async isAvailable(): Promise<boolean> {
    // Docker provider is planned for future implementation
    return false;
  }

  public async execute(request: ExecutionRequest): Promise<ExecutionResult> {
    throw new Error('Docker execution provider is not yet implemented.');
  }
}
