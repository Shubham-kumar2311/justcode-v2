import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISubmission extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  code: string;
  language: string;
  testCaseResults: {
    input: string;
    expectedOutput: string;
    actualOutput: string | null;
    passed: boolean;
    error: string | null;
  }[];
  status: 'Solved' | 'Attempted';
  submittedAt: Date;
}

const submissionSchema = new Schema<ISubmission>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ['c', 'cpp', 'java', 'python', 'javascript'],
    },
    testCaseResults: [
      {
        input: String,
        expectedOutput: String,
        actualOutput: String,
        passed: Boolean,
        error: String,
      },
    ],
    status: {
      type: String,
      enum: ['Solved', 'Attempted'],
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// Indexes for faster history queries
submissionSchema.index({ userId: 1, problemId: 1 });
submissionSchema.index({ userId: 1, submittedAt: -1 });

export const Submission: Model<ISubmission> = mongoose.model<ISubmission>('Submission', submissionSchema);
