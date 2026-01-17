import mongoose, { Schema, Document, Model } from 'mongoose';

export type QuestionType = 'likert' | 'multiple_choice' | 'slider' | 'ranking';

export interface IAssessmentQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // for multiple choice or ranking labels
  scale?: number; // for likert/slider
  weight?: number; // optional weight for scoring
}

export interface IAssessment {
  title: string;
  slug: string;
  description?: string;
  type: 'personality' | 'aptitude' | 'interest' | 'skill';
  questions: IAssessmentQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAssessmentDocument extends IAssessment, Document {}
export interface IAssessmentModel extends Model<IAssessmentDocument> {
  findBySlug(slug: string): Promise<IAssessmentDocument | null>;
}

const QuestionSchema = new Schema<IAssessmentQuestion>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    type: { type: String, required: true },
    options: { type: [String], default: undefined },
    scale: { type: Number },
    weight: { type: Number, default: 1 },
  },
  { _id: false }
);

const assessmentSchema = new Schema<IAssessmentDocument, IAssessmentModel>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    type: {
      type: String,
      enum: ['personality', 'aptitude', 'interest', 'skill'],
      required: true,
    },
    questions: { type: [QuestionSchema], default: [] },
  },
  { timestamps: true }
);



assessmentSchema.statics.findBySlug = function (slug: string) {
  return this.findOne({ slug: slug.toLowerCase() });
};

export const Assessment = mongoose.model<IAssessmentDocument, IAssessmentModel>(
  'Assessment',
  assessmentSchema
);
