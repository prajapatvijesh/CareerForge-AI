import { useState } from 'react';
import { useGetProfile } from '../api/profile.api';
import { AvatarUpload } from '../components/AvatarUpload';
import { ProgressBar } from '../components/ProgressBar';
import { GeneralInfoForm } from '../components/GeneralInfoForm';
import { SkillsForm } from '../components/SkillsForm';
import { ExperienceForm } from '../components/ExperienceForm';
import { EducationForm } from '../components/EducationForm';
import { ProjectsForm } from '../components/ProjectsForm';

export const ProfilePage = () => {
  const { data: profile, isLoading } = useGetProfile();
  const [activeTab, setActiveTab] = useState('general');

  if (isLoading) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <AvatarUpload currentAvatarUrl={profile?.avatarUrl} />
          
          <div className="px-2">
            <ProgressBar progress={profile?.completionPercentage || 0} />
          </div>

          <nav className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-1 mt-6 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {['general', 'skills', 'experience', 'education', 'projects'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-left rounded-md transition-colors whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 bg-card border rounded-lg p-6 shadow-sm min-h-[500px]">
          {activeTab === 'general' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">General Information</h2>
              {profile && <GeneralInfoForm profile={profile} />}
            </div>
          )}
          {activeTab === 'skills' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Skills</h2>
              {profile && <SkillsForm profile={profile} />}
            </div>
          )}
          {activeTab === 'experience' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Work Experience</h2>
              {profile && <ExperienceForm profile={profile} />}
            </div>
          )}
          {activeTab === 'education' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Education</h2>
              {profile && <EducationForm profile={profile} />}
            </div>
          )}
          {activeTab === 'projects' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Projects</h2>
              {profile && <ProjectsForm profile={profile} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function tabToTitle(tab: string) {
  return tab.charAt(0).toUpperCase() + tab.slice(1);
}
