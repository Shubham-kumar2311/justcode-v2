import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProblem extends Document {
  _id: mongoose.Types.ObjectId;
  id: number;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: {
    input: string;
    output: string;
  }[];
  run_test: {
    input: string[];
    output: string;
  }[];
  constraints: string;
  input_form: string;
  createdAt: Date;
  updatedAt: Date;
}

const problemSchema = new Schema<IProblem>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
    },
    description: {
      type: String,
      required: true,
    },
    examples: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
      },
    ],
    run_test: [
      {
        input: { type: [String], required: true },
        output: { type: String, required: true },
      },
    ],
    constraints: {
      type: String,
      required: true,
    },
    input_form: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Problem: Model<IProblem> = mongoose.model<IProblem>('Problem', problemSchema);
