import { Submission, ISubmission } from './submission.model';
import { User } from '../users/user.model';
import { executionService } from '../execution/execution.service';
import { SubmitCodeInput, SubmissionHistoryQuery } from './submission.validation';
import { PaginatedResponse } from '../../shared/validators/pagination.validator';

export class SubmissionService {
  /**
   * Submits code: runs it against test cases and saves the result to the DB.
   * Also updates the user's solvedProblems list.
   */
  public async submitCode(userId: string, data: SubmitCodeInput) {
    const { code, language, problemId } = data;

    // Delegate execution to the execution feature
    const { testCaseResults, submissionStatus } = await executionService.runCode(code, language, problemId);

    // Save submission
    const submission = new Submission({
      userId,
      problemId,
      code,
      language,
      status: submissionStatus,
      testCaseResults,
    });
    const savedSubmission = await submission.save();

    // Update user's solvedProblems stats
    const user = await User.findById(userId);
    if (user) {
      const problemExists = user.solvedProblems.some((p) => p.problemId.toString() === problemId);

      if (problemExists) {
        // Append submission to existing problem
        await User.updateOne(
          { _id: userId, 'solvedProblems.problemId': problemId },
          { $push: { 'solvedProblems.$.submissions': savedSubmission._id } }
        );
      } else {
        // Add new problem entry
        await User.updateOne(
          { _id: userId },
          { $push: { solvedProblems: { problemId, submissions: [savedSubmission._id] } } }
        );
      }
    }

    return { testCaseResults, submissionStatus, submissionId: savedSubmission._id };
  }

  /**
   * Fetches the submission history for a specific user.
   */
  public async getHistory(userId: string, query: SubmissionHistoryQuery): Promise<PaginatedResponse<ISubmission>> {
    const { page, limit, problemId } = query;
    const skip = (page - 1) * limit;

    const filter: any = { userId };
    if (problemId) {
      filter.problemId = problemId;
    }

    const [data, total] = await Promise.all([
      Submission.find(filter)
        .populate('problemId', 'title difficulty')
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Submission.countDocuments(filter),
    ]);

    return {
      data: data as unknown as ISubmission[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const submissionService = new SubmissionService();
