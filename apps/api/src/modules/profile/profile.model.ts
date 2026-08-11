import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill {
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface IEducation {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
}

export interface IExperience {
  company: string;
  position: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
}

export interface IProject {
  title: string;
  description: string;
  url?: string;
  technologies: string[];
  startDate?: Date;
  endDate?: Date;
}

export interface IAchievement {
  title: string;
  description?: string;
  date?: Date;
  issuer?: string;
}

export interface ISocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  portfolio?: string;
  other?: string;
}

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  avatarUrl?: string;
  avatarPublicId?: string;
  headline?: string;
  bio?: string;
  location?: string;
  skills: ISkill[];
  education: IEducation[];
  experience: IExperience[];
  projects: IProject[];
  achievements: IAchievement[];
  socialLinks: ISocialLinks;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>({
  name: { type: String, required: true },
  proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], required: true },
});

const educationSchema = new Schema<IEducation>({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String },
});

const experienceSchema = new Schema<IExperience>({
  company: { type: String, required: true },
  position: { type: String, required: true },
  location: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String },
});

const projectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String },
  technologies: [{ type: String }],
  startDate: { type: Date },
  endDate: { type: Date },
});

const achievementSchema = new Schema<IAchievement>({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date },
  issuer: { type: String },
});

const profileSchema = new Schema<IProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    avatarUrl: { type: String },
    avatarPublicId: { type: String },
    headline: { type: String, trim: true },
    bio: { type: String, trim: true },
    location: { type: String, trim: true },
    skills: [skillSchema],
    education: [educationSchema],
    experience: [experienceSchema],
    projects: [projectSchema],
    achievements: [achievementSchema],
    socialLinks: {
      linkedin: { type: String },
      github: { type: String },
      twitter: { type: String },
      portfolio: { type: String },
      other: { type: String },
    },
  },
  { timestamps: true }
);

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);
