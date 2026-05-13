import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { connectToMongoDB } from './config/db';
import { corsOptions } from './config/cors';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler.middleware';
import { authMiddleware } from './middleware/auth.middleware';

// Routes
import { authRoutes } from './features/auth/auth.routes';
import { userRoutes } from './features/users/user.routes';
import { problemRoutes } from './features/problems/problem.routes';
import { submissionRoutes } from './features/submissions/submission.routes';
import { executionRoutes } from './features/execution/execution.routes';
import { aiRoutes } from './features/ai/ai.routes';
import { contestRoutes } from './features/contests/contest.routes';
import { leaderboardRoutes } from './features/leaderboard/leaderboard.routes';

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Global Auth Middleware (parses JWT on every request, but doesn't block)
app.use(authMiddleware);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/execution', executionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Global Error Handler
app.use(errorHandler);

// Bootstrap
async function bootstrap() {
  try {
    await connectToMongoDB();

    app.listen(env.PORT, () => {
      logger.info(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
