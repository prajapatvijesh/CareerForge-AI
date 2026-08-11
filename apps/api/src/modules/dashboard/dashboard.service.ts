import { ProfileService } from '../profile/profile.service';
import { ResumeService } from '../resume/resume.service';
import { JobService } from '../job/job.service';

export class DashboardService {
  private profileService = new ProfileService();
  private resumeService = new ResumeService();
  private jobService = new JobService();

  public async getDashboardSummary(userId: string) {
    // Parallel data aggregation for optimal performance
    const [profile, resumes, jobStats] = await Promise.all([
      this.profileService.getProfile(userId),
      this.resumeService.getResumes(userId),
      this.jobService.getStats(userId),
    ]);

    // Construct highly structured response object with extension points
    const completionPercentage = profile.completionPercentage || 0;
    
    // Sort resumes by updatedAt (descending) and take top 3
    const sortedResumes = [...resumes].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    const recentResumes = sortedResumes.slice(0, 3);

    // Contextual Recommendations
    const recommendations = [];
    if (completionPercentage < 100) {
      recommendations.push({
        id: 'complete_profile',
        type: 'WARNING',
        title: 'Complete your profile',
        description: `Your profile is ${completionPercentage}% complete. A complete profile yields better resumes.`,
        actionLink: '/profile',
        actionText: 'Complete Profile'
      });
    }
    if (resumes.length === 0) {
      recommendations.push({
        id: 'create_resume',
        type: 'INFO',
        title: 'Create your first resume',
        description: 'You haven\'t crafted any resumes yet. Start building one tailored for your next job.',
        actionLink: '/resumes',
        actionText: 'Build Resume'
      });
    }

    return {
      profile: {
        completionPercentage,
        isOnboarding: completionPercentage < 50,
      },
      resumes: {
        totalCount: resumes.length,
        recent: recentResumes,
      },
      jobs: {
        activeApplications: (Object.values(jobStats) as number[]).reduce((a, b) => a + b, 0),
        stats: jobStats,
        status: 'ACTIVE',
      },
      quickActions: [
        { id: 'new_resume', label: 'Create New Resume', link: '/resumes', icon: 'Plus' },
        {
          id: 'mock-interview',
          label: 'Practice Interview',
          icon: 'User',
          link: '/interviews',
          disabled: false,
        },
        {
          id: 'job-tracker',
          label: 'Track Job',
          icon: 'Briefcase',
          link: '/jobs',
          disabled: false,
        }
      ],
      notifications: {
        unreadCount: 0,
        items: [],
      },
      recommendations,
    };
  }
}
