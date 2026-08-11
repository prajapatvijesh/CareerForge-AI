import { ProfileRepository } from './profile.repository';
import { CloudinaryService } from '../../services/cloudinary.service';
import { UpdateProfileInput } from './profile.schema';
import { IProfile } from './profile.model';

export class ProfileService {
  private repository = new ProfileRepository();
  private cloudinaryService = new CloudinaryService();

  public async getProfile(userId: string) {
    let profile = await this.repository.findByUserId(userId);
    
    // If no profile exists, create an empty one
    if (!profile) {
      profile = await this.repository.upsertProfile(userId, {});
    }

    const completionPercentage = this.calculateCompletion(profile);
    
    // Return profile with dynamic completion percentage
    return {
      ...profile.toObject(),
      completionPercentage,
    };
  }

  public async updateProfile(userId: string, data: UpdateProfileInput) {
    const profile = await this.repository.upsertProfile(userId, data as unknown as Partial<IProfile>);
    const completionPercentage = this.calculateCompletion(profile);
    
    return {
      ...profile.toObject(),
      completionPercentage,
    };
  }

  public async updateAvatar(userId: string, fileBuffer: Buffer) {
    // Get existing profile to check for old avatar
    const profile = await this.repository.findByUserId(userId);

    // Upload new avatar
    const { url, publicId } = await this.cloudinaryService.uploadAvatar(fileBuffer);

    // If an old avatar exists, delete it from Cloudinary to save space
    if (profile?.avatarPublicId) {
      await this.cloudinaryService.deleteAsset(profile.avatarPublicId);
    }

    // Update DB with new avatar
    const updatedProfile = await this.repository.upsertProfile(userId, {
      avatarUrl: url,
      avatarPublicId: publicId,
    });

    const completionPercentage = this.calculateCompletion(updatedProfile);
    
    return {
      ...updatedProfile.toObject(),
      completionPercentage,
    };
  }

  /**
   * Dynamically calculates profile completion based on populated fields.
   */
  private calculateCompletion(profile: IProfile): number {
    let score = 0;
    let totalWeight = 0;

    const weights = {
      avatarUrl: 10,
      headline: 10,
      bio: 15,
      location: 5,
      skills: 15, // Has at least 1 skill
      education: 15, // Has at least 1 education
      experience: 20, // Has at least 1 experience
      projects: 5, // Has at least 1 project
      socialLinks: 5, // Has at least 1 social link
    };

    totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

    if (profile.avatarUrl) score += weights.avatarUrl;
    if (profile.headline) score += weights.headline;
    if (profile.bio) score += weights.bio;
    if (profile.location) score += weights.location;
    if (profile.skills && profile.skills.length > 0) score += weights.skills;
    if (profile.education && profile.education.length > 0) score += weights.education;
    if (profile.experience && profile.experience.length > 0) score += weights.experience;
    if (profile.projects && profile.projects.length > 0) score += weights.projects;
    
    if (profile.socialLinks) {
      const hasLink = Object.values(profile.socialLinks).some(link => link && link.trim() !== '');
      if (hasLink) score += weights.socialLinks;
    }

    return Math.round((score / totalWeight) * 100);
  }
}
