import { AppError } from './AppError';

export class ValidationError extends AppError {
  public readonly errors: unknown;

  constructor(message = 'Validation failed', errors?: unknown) {
    super(message, 400);
    this.errors = errors;
  }
}
