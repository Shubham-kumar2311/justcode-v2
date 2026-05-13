import { User, IUser } from './user.model';
import { Problem } from '../problems/problem.model';
import { NotFoundError, ConflictError } from '../../shared/errors';
import { authService } from '../auth/auth.service';
import { UpdateProfileInput } from './user.validation';

export class UserService {
  /**
   * Fetches the user profile along with their calculated statistics and submissions.
   */
  public async getProfile(userId: string) {
    const user = await User.findById(userId)
      .populate({
        path: 'solvedProblems.submissions',
        select: 'problemId submittedAt status',
        populate: {
          path: 'problemId',
          select: 'id title difficulty',
        },
      })
      .lean();

    if (!user) {
      throw new NotFoundError('User');
    }

    const totalProblems = {
      easy: await Problem.countDocuments({ difficulty: 'Easy' }),
      medium: await Problem.countDocuments({ difficulty: 'Medium' }),
      hard: await Problem.countDocuments({ difficulty: 'Hard' }),
    };

    const stats = { easy: 0, medium: 0, hard: 0 };
    const solvedProblemIds = new Set<string>();
    const submissions: any[] = [];

    // Process submissions
    user.solvedProblems.forEach((solved) => {
      solved.submissions.forEach((submission: any) => {
        const problem = submission.problemId;
        if (!problem) return;

        const problemIdStr = problem._id.toString();

        if (submission.status === 'Solved' && !solvedProblemIds.has(problemIdStr)) {
          if (problem.difficulty === 'Easy' && stats.easy < totalProblems.easy) stats.easy++;
          else if (problem.difficulty === 'Medium' && stats.medium < totalProblems.medium) stats.medium++;
          else if (problem.difficulty === 'Hard' && stats.hard < totalProblems.hard) stats.hard++;
          
          solvedProblemIds.add(problemIdStr);
        }

        submissions.push({
          problemId: problem,
          submittedAt: submission.submittedAt,
          status: submission.status,
        });
      });
    });

    // Ensure stats don't exceed total problems
    stats.easy = Math.min(stats.easy, totalProblems.easy);
    stats.medium = Math.min(stats.medium, totalProblems.medium);
    stats.hard = Math.min(stats.hard, totalProblems.hard);

    // Omit sensitive data
    const { password, salt, ...safeUser } = user;

    return {
      user: safeUser,
      stats,
      totalProblems,
      submissions: submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()),
    };
  }

  /**
   * Updates user profile details (username, email, password).
   */
  public async updateProfile(userId: string, data: UpdateProfileInput): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    const updates: Partial<IUser> = {};

    if (data.username && data.username !== user.username) {
      const existing = await User.findOne({ username: data.username });
      if (existing) throw new ConflictError('Username is already taken');
      updates.username = data.username;
    }

    if (data.email && data.email !== user.email) {
      const existing = await User.findOne({ email: data.email });
      if (existing) throw new ConflictError('Email is already in use');
      updates.email = data.email;
    }

    if (data.password) {
      updates.password = await authService.hashPassword(data.password);
      updates.salt = undefined; // clear legacy salt if updating password
    }

    Object.assign(user, updates);
    await user.save();

    return user;
  }
}

export const userService = new UserService();
