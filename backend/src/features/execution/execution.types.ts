export interface ExecutionRequest {
  sourceCode: string;
  languageId: number;
  stdin: string;
}

export interface ExecutionResult {
  stdout: string | null;
  stderr: string | null;
  compileOutput: string | null;
  statusId: number;
  statusDescription: string;
  time: string | null;
  memory: number | null;
}

export interface ExecutionProvider {
  name: string;
  execute(request: ExecutionRequest): Promise<ExecutionResult>;
  isAvailable(): Promise<boolean>;
}
