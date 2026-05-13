import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

mongoose.set('strictQuery', true);

export async function connectToMongoDB(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URL);
    logger.info('MongoDB connected successfully');
  } catch (err) {
    logger.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}
