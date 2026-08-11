import mongoose, { Document, Schema } from 'mongoose';
import { ICareerContextSnapshot, IAssistantMessage } from './career-assistant.types';

export interface ICareerAssistantConversation extends Document {
  userId: mongoose.Types.ObjectId;
  title?: string;
  messages: IAssistantMessage[];
  contextSnapshot?: ICareerContextSnapshot;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IAssistantMessage>({
  role: { type: String, enum: ['USER', 'ASSISTANT'], required: true },
  content: { type: String, required: true },
  recommendations: { type: Schema.Types.Mixed },
  nextActions: { type: [String] },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const careerAssistantConversationSchema = new Schema<ICareerAssistantConversation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String },
    messages: [messageSchema],
    contextSnapshot: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

careerAssistantConversationSchema.index({ userId: 1, updatedAt: -1 });

export const CareerAssistantConversation = mongoose.model<ICareerAssistantConversation>(
  'CareerAssistantConversation', 
  careerAssistantConversationSchema
);
