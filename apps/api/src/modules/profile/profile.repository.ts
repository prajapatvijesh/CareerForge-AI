import { Profile, IProfile } from './profile.model';

export class ProfileRepository {
  public async findByUserId(userId: string): Promise<IProfile | null> {
    return Profile.findOne({ userId }).exec();
  }

  public async upsertProfile(userId: string, updateData: Partial<IProfile>): Promise<IProfile> {
    return Profile.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    ).exec();
  }
}
