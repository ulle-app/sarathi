import mongoose, { Schema, Document, Model } from 'mongoose';

export type AssessmentResultStatus = 'in_progress' | 'completed' | 'scored';

export interface IResponseItem {
  questionId: string;
  value: any; // number|string|array depending on question type
}

export interface IAssessmentResult {
  userId: mongoose.Types.ObjectId;
  assessmentId: mongoose.Types.ObjectId;
  responses: IResponseItem[];
  scores?: Record<string, number>;
  status: AssessmentResultStatus;
  startedAt?: Date;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAssessmentResultDocument extends IAssessmentResult, Document {}
export interface IAssessmentResultModel extends Model<IAssessmentResultDocument> {}

const ResponseItemSchema = new Schema<IResponseItem>(
  {
    questionId: { type: String, required: true },
    value: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const assessmentResultSchema = new Schema<IAssessmentResultDocument, IAssessmentResultModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
    responses: { type: [ResponseItemSchema], default: [] },
    scores: { type: Schema.Types.Mixed, default: undefined },
    status: { type: String, enum: ['in_progress', 'completed', 'scored'], default: 'in_progress' },
    startedAt: { type: Date },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

// Indexes for quick lookup
assessmentResultSchema.index({ userId: 1, assessmentId: 1, createdAt: -1 });

export const AssessmentResult = mongoose.model<IAssessmentResultDocument, IAssessmentResultModel>(
  'AssessmentResult',
  assessmentResultSchema
);
