import { Problem, IProblem } from './problem.model';
import { User } from '../users/user.model';
import { Submission } from '../submissions/submission.model';
import { NotFoundError } from '../../shared/errors';
import { ProblemListQuery } from './problem.validation';
import { PaginatedResponse } from '../../shared/validators/pagination.validator';
import mongoose from 'mongoose';

export class ProblemService {
  /**
   * Fetches paginated problems with optional filters.
   */
  public async getProblems(query: ProblemListQuery): Promise<PaginatedResponse<IProblem>> {
    const { page, limit, difficulty, search } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      Problem.find(filter)
        .select('-run_test') // Don't send hidden test cases to client
        .sort({ id: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Problem.countDocuments(filter),
    ]);

    return {
      data: data as unknown as IProblem[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Fetches a single problem by ID.
   * If userId is provided, also calculates the user's status for this problem.
   */
  public async getProblemById(problemId: string, userId?: string) {
    const problem = await Problem.findById(problemId).select('-run_test').lean();
    
    if (!problem) {
      throw new NotFoundError('Problem');
    }

    let userStatus = { status: 'NotAttempted', code: null as string | null, language: null as string | null };

    if (userId) {
      const user = await User.findById(userId).lean();
      if (user) {
        const solvedProblem = user.solvedProblems.find(
          (sp) => sp.problemId.toString() === problemId
        );

        if (solvedProblem && solvedProblem.submissions.length > 0) {
          // Get the latest submission
          const lastSubmissionId = solvedProblem.submissions[solvedProblem.submissions.length - 1];
          // We need Submission model for this, but since it's a circular dependency in a way, 
          // we use mongoose.model directly to fetch it or rely on the imported Submission model.
          const SubmissionModel = mongoose.model('Submission');
          const lastSubmission = await SubmissionModel.findById(lastSubmissionId).lean() as any;
          
          if (lastSubmission) {
            userStatus = {
              status: lastSubmission.status,
              code: lastSubmission.code,
              language: lastSubmission.language,
            };
          }
        }
      }
    }

    return { problem, userStatus };
  }
}

export const problemService = new ProblemService();
