import React from 'react';
import { useUpdateResume } from '../../api/resume.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface SectionEditorProps {
  resume: any;
  sectionType: string;
  onBack: () => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({ resume, sectionType, onBack }) => {
  const updateMutation = useUpdateResume(resume._id);
  const section = resume.sections?.find((s: any) => s.type === sectionType) || { type: sectionType, isVisible: true, data: {} };
  
  const [localData, setLocalData] = React.useState(section.data || {});

  React.useEffect(() => {
    setLocalData(section.data || {});
  }, [sectionType]); // Reset local data when switching sections

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const updatedSections = [...(resume.sections || [])];
      const index = updatedSections.findIndex(s => s.type === sectionType);
      
      if (index >= 0) {
        updatedSections[index] = { ...updatedSections[index], data: localData };
      } else {
        updatedSections.push({ type: sectionType, isVisible: true, order: updatedSections.length, data: localData });
      }
      
      updateMutation.mutate({ sections: updatedSections });
    }, 500);
    return () => clearTimeout(timer);
  }, [localData, sectionType, resume._id]);

  const renderEditor = () => {
    switch (sectionType) {
      case 'PERSONAL':
        return (
          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input 
                value={localData?.fullName || ''} 
                onChange={(e) => setLocalData({ ...localData, fullName: e.target.value })} 
                placeholder="e.g. John Doe"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                type="email"
                value={localData?.email || ''} 
                onChange={(e) => setLocalData({ ...localData, email: e.target.value })} 
                placeholder="e.g. john@example.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input 
                value={localData?.phone || ''} 
                onChange={(e) => setLocalData({ ...localData, phone: e.target.value })} 
                placeholder="e.g. +1 234 567 8900"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input 
                value={localData?.location || ''} 
                onChange={(e) => setLocalData({ ...localData, location: e.target.value })} 
                placeholder="e.g. New York, NY"
                className="mt-1"
              />
            </div>
            <div>
              <Label>LinkedIn</Label>
              <Input 
                value={localData?.linkedin || ''} 
                onChange={(e) => setLocalData({ ...localData, linkedin: e.target.value })} 
                placeholder="e.g. linkedin.com/in/johndoe"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Portfolio / Website</Label>
              <Input 
                value={localData?.website || ''} 
                onChange={(e) => setLocalData({ ...localData, website: e.target.value })} 
                placeholder="e.g. johndoe.com"
                className="mt-1"
              />
            </div>
          </div>
        );

      case 'SUMMARY':
        return (
          <div className="space-y-4">
            <div>
              <Label>Headline / Job Title</Label>
              <Input 
                value={localData?.headline || ''} 
                onChange={(e) => setLocalData({ ...localData, headline: e.target.value })} 
                placeholder="e.g. Senior Frontend Engineer"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Professional Summary</Label>
              <Textarea 
                value={localData?.summary || ''} 
                onChange={(e) => setLocalData({ ...localData, summary: e.target.value })} 
                placeholder="Write a brief professional summary..."
                className="mt-1 min-h-[150px]"
              />
            </div>
          </div>
        );

      case 'EXPERIENCE': {
        const experiences = localData?.items || [];
        return (
          <div className="space-y-6">
            {experiences.map((exp: any, i: number) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 relative bg-slate-50 dark:bg-slate-900/50">
                <button 
                  onClick={() => {
                    const newItems = [...experiences];
                    newItems.splice(i, 1);
                    setLocalData({ ...localData, items: newItems });
                  }}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div>
                  <Label>Job Title</Label>
                  <Input value={exp.title || ''} onChange={(e) => {
                    const newItems = [...experiences];
                    newItems[i].title = e.target.value;
                    setLocalData({ ...localData, items: newItems });
                  }} className="mt-1" />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input value={exp.company || ''} onChange={(e) => {
                    const newItems = [...experiences];
                    newItems[i].company = e.target.value;
                    setLocalData({ ...localData, items: newItems });
                  }} className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input value={exp.startDate || ''} onChange={(e) => {
                      const newItems = [...experiences];
                      newItems[i].startDate = e.target.value;
                      setLocalData({ ...localData, items: newItems });
                    }} className="mt-1" placeholder="MM/YYYY" />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input value={exp.endDate || ''} onChange={(e) => {
                      const newItems = [...experiences];
                      newItems[i].endDate = e.target.value;
                      setLocalData({ ...localData, items: newItems });
                    }} className="mt-1" placeholder="MM/YYYY or Present" />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={exp.description || ''} onChange={(e) => {
                    const newItems = [...experiences];
                    newItems[i].description = e.target.value;
                    setLocalData({ ...localData, items: newItems });
                  }} className="mt-1 min-h-[100px]" placeholder="Describe your achievements..." />
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full border-dashed"
              onClick={() => {
                setLocalData({ ...localData, items: [...experiences, { title: '', company: '', startDate: '', endDate: '', description: '' }] });
              }}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Experience
            </Button>
          </div>
        );
      }

      case 'EDUCATION': {
        const education = localData?.items || [];
        return (
          <div className="space-y-6">
            {education.map((edu: any, i: number) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 relative bg-slate-50 dark:bg-slate-900/50">
                <button 
                  onClick={() => {
                    const newItems = [...education];
                    newItems.splice(i, 1);
                    setLocalData({ ...localData, items: newItems });
                  }}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div>
                  <Label>School / University</Label>
                  <Input value={edu.school || ''} onChange={(e) => {
                    const newItems = [...education];
                    newItems[i].school = e.target.value;
                    setLocalData({ ...localData, items: newItems });
                  }} className="mt-1" />
                </div>
                <div>
                  <Label>Degree / Field of Study</Label>
                  <Input value={edu.degree || ''} onChange={(e) => {
                    const newItems = [...education];
                    newItems[i].degree = e.target.value;
                    setLocalData({ ...localData, items: newItems });
                  }} className="mt-1" placeholder="e.g. B.S. Computer Science" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input value={edu.startDate || ''} onChange={(e) => {
                      const newItems = [...education];
                      newItems[i].startDate = e.target.value;
                      setLocalData({ ...localData, items: newItems });
                    }} className="mt-1" placeholder="MM/YYYY" />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input value={edu.endDate || ''} onChange={(e) => {
                      const newItems = [...education];
                      newItems[i].endDate = e.target.value;
                      setLocalData({ ...localData, items: newItems });
                    }} className="mt-1" placeholder="MM/YYYY or Expected" />
                  </div>
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full border-dashed"
              onClick={() => {
                setLocalData({ ...localData, items: [...education, { school: '', degree: '', startDate: '', endDate: '' }] });
              }}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Education
            </Button>
          </div>
        );
      }

      case 'SKILLS': {
        const skillsArray = localData?.items || [];
        const skillsString = Array.isArray(skillsArray) ? skillsArray.join(', ') : '';
        return (
          <div className="space-y-4">
            <div>
              <Label>Skills (Comma separated)</Label>
              <Textarea 
                value={skillsString} 
                onChange={(e) => {
                  const arr = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                  setLocalData({ ...localData, items: arr });
                }} 
                placeholder="e.g. JavaScript, React, Node.js"
                className="mt-1 min-h-[150px]"
              />
            </div>
          </div>
        );
      }

      case 'PROJECTS': {
        const projects = localData?.items || [];
        return (
          <div className="space-y-6">
            {projects.map((proj: any, i: number) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 relative bg-slate-50 dark:bg-slate-900/50">
                <button 
                  onClick={() => {
                    const newItems = [...projects];
                    newItems.splice(i, 1);
                    setLocalData({ ...localData, items: newItems });
                  }}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div>
                  <Label>Project Name</Label>
                  <Input value={proj.name || ''} onChange={(e) => {
                    const newItems = [...projects];
                    newItems[i].name = e.target.value;
                    setLocalData({ ...localData, items: newItems });
                  }} className="mt-1" />
                </div>
                <div>
                  <Label>Technologies (Comma separated)</Label>
                  <Input value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''} onChange={(e) => {
                    const newItems = [...projects];
                    newItems[i].technologies = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                    setLocalData({ ...localData, items: newItems });
                  }} className="mt-1" placeholder="React, Node.js" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={proj.description || ''} onChange={(e) => {
                    const newItems = [...projects];
                    newItems[i].description = e.target.value;
                    setLocalData({ ...localData, items: newItems });
                  }} className="mt-1 min-h-[100px]" placeholder="Describe the project..." />
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full border-dashed"
              onClick={() => {
                setLocalData({ ...localData, items: [...projects, { name: '', technologies: [], description: '' }] });
              }}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Project
            </Button>
          </div>
        );
      }

      default:
        return <div className="text-sm text-slate-500">Editor for {sectionType} is not supported yet.</div>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10 space-x-3">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white capitalize">{sectionType.toLowerCase()}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Edit section content</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {renderEditor()}
      </div>
    </div>
  );
};
