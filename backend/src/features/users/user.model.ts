import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  githubId?: string;
  salt?: string; // Legacy salt for HMAC-SHA256 migration
  solvedProblems: {
    problemId: mongoose.Types.ObjectId;
    submissions: mongoose.Types.ObjectId[];
  }[];
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    githubId: {
      type: String,
    },
    salt: {
      type: String,
    },
    solvedProblems: [
      {
        problemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Problem',
        },
        submissions: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Submission',
          },
        ],
      },
    ],
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

// Note: Password hashing is now handled in the AuthService to decouple
// business logic from the Mongoose model and to facilitate the dual-hash migration.

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
