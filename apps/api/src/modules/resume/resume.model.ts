import mongoose, { Document, Schema } from 'mongoose';

// Define the shape of data a section holds. This is essentially a flexible snapshot + reference.
const embeddedSectionSchema = new Schema({
  type: {
    type: String,
    enum: ['PERSONAL', 'SUMMARY', 'EXPERIENCE', 'EDUCATION', 'SKILLS', 'PROJECTS', 'CERTIFICATIONS', 'LANGUAGES', 'INTERESTS', 'REFERENCES'],
    required: true,
  },
  isVisible: { type: Boolean, default: true },
  order: { type: Number, required: true },
  // Mixed data allows storing the snapshotted profile object (e.g. company, position) 
  // along with resume-specific overrides like customized descriptions.
  data: { type: Schema.Types.Mixed },
  profileReferenceId: { type: Schema.Types.ObjectId, default: null }, // Optional link back to Profile item
}, { _id: true }); // Keep _id for section identification during drag-and-drop

export interface IResumeSection {
  _id: mongoose.Types.ObjectId;
  type: string;
  isVisible: boolean;
  order: number;
  data: any;
  profileReferenceId?: mongoose.Types.ObjectId;
}

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  templateId: string;
  theme: {
    primaryColor: string;
    font: string;
  };
  sections: IResumeSection[];
  version: number;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, default: 'Untitled Resume' },
    templateId: { type: String, required: true, default: 'modern' },
    theme: {
      primaryColor: { type: String, default: '#000000' },
      font: { type: String, default: 'Inter' },
    },
    sections: [embeddedSectionSchema],
    version: { type: Number, default: 1 },
    status: { type: String, enum: ['ACTIVE', 'ARCHIVED'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

resumeSchema.index({ userId: 1, status: 1, updatedAt: -1 });

export const Resume = mongoose.model<IResume>('Resume', resumeSchema);
