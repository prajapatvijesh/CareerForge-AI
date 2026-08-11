import mongoose, { Document, Schema } from 'mongoose';

export interface IResumeVersion extends Document {
  resumeId: mongoose.Types.ObjectId;
  versionNumber: number;
  snapshot: any; // Full deep copy of the resume document
  createdAt: Date;
}

const resumeVersionSchema = new Schema<IResumeVersion>(
  {
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
    versionNumber: { type: Number, required: true },
    snapshot: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // Versions are immutable
);

resumeVersionSchema.index({ resumeId: 1, versionNumber: -1 });

export const ResumeVersion = mongoose.model<IResumeVersion>('ResumeVersion', resumeVersionSchema);
