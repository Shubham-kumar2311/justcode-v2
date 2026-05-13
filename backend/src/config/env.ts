import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  MONGODB_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JUDGE0_API_KEY: string;
  JUDGE0_API_HOST: string;
  AI_API_KEY: string;
  AI_API_HOST: string;
  FRONTEND_URL: string;
  EXECUTION_PROVIDER: 'judge0' | 'docker';
  AI_PROVIDER: 'rapidapi' | 'openai';
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GITHUB_CALLBACK_URL: string;
}

function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env: EnvConfig = {
  PORT: parseInt(getEnvVar('PORT', '8001'), 10),
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  MONGODB_URL: getEnvVar('MONGODB_URL'),
  JWT_SECRET: getEnvVar('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', '7d'),
  JUDGE0_API_KEY: getEnvVar('JUDGE0_API_KEY'),
  JUDGE0_API_HOST: getEnvVar('JUDGE0_API_HOST', 'judge0-ce.p.rapidapi.com'),
  AI_API_KEY: getEnvVar('AI_API_KEY'),
  AI_API_HOST: getEnvVar('AI_API_HOST', 'chatgpt-42.p.rapidapi.com'),
  FRONTEND_URL: getEnvVar('FRONTEND_URL', 'http://localhost:5173'),
  EXECUTION_PROVIDER: getEnvVar('EXECUTION_PROVIDER', 'judge0') as 'judge0' | 'docker',
  AI_PROVIDER: getEnvVar('AI_PROVIDER', 'rapidapi') as 'rapidapi' | 'openai',
  GOOGLE_CLIENT_ID: getEnvVar('GOOGLE_CLIENT_ID', 'placeholder'),
  GOOGLE_CLIENT_SECRET: getEnvVar('GOOGLE_CLIENT_SECRET', 'placeholder'),
  GOOGLE_CALLBACK_URL: getEnvVar('GOOGLE_CALLBACK_URL', 'http://localhost:8001/api/auth/google/callback'),
  GITHUB_CLIENT_ID: getEnvVar('GITHUB_CLIENT_ID', 'placeholder'),
  GITHUB_CLIENT_SECRET: getEnvVar('GITHUB_CLIENT_SECRET', 'placeholder'),
  GITHUB_CALLBACK_URL: getEnvVar('GITHUB_CALLBACK_URL', 'http://localhost:8001/api/auth/github/callback'),
};
