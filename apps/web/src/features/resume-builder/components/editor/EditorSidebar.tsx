import React, { useState, useEffect } from 'react';
import { useUpdateResume } from '../../api/resume.api';
import { TemplateRegistry } from '../templates/registry';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle2, CircleDashed, GripVertical, Eye, EyeOff, LayoutTemplate, Type, Edit2, Plus } from 'lucide-react';
import { SectionEditor } from './SectionEditor';

interface EditorSidebarProps {
  resume: any; // Using any for MVP
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({ resume }) => {
  const updateMutation = useUpdateResume(resume?._id);
  const [title, setTitle] = useState(resume?.title || '');
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const debouncedTitle = useDebounce(title, 1000);

  useEffect(() => {
    if (debouncedTitle && debouncedTitle !== resume?.title) {
      updateMutation.mutate({ title: debouncedTitle });
    }
  }, [debouncedTitle]);

  const handleTemplateChange = (templateId: string) => {
    updateMutation.mutate({ templateId });
  };

  const availableSections = ['PERSONAL', 'SUMMARY', 'EXPERIENCE', 'EDUCATION', 'SKILLS', 'PROJECTS'];

  const handleAddSection = (type: string) => {
    const updatedSections = [...(resume.sections || [])];
    if (!updatedSections.find(s => s.type === type)) {
      updatedSections.push({ type, isVisible: true, order: updatedSections.length, data: {} });
      updateMutation.mutate({ sections: updatedSections });
    }
    setActiveSectionId(type);
  };

  if (activeSectionId) {
    return <SectionEditor resume={resume} sectionType={activeSectionId} onBack={() => setActiveSectionId(null)} />;
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Workspace</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Customize your resume</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-800">
          {updateMutation.isPending ? (
            <>
              <CircleDashed className="w-3.5 h-3.5 animate-spin text-primary" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Saving</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Saved</span>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10">
        
        {/* Title Editor */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200">
            <Type className="w-4 h-4 text-primary" />
            <Label className="text-sm font-semibold uppercase tracking-wider">Document Title</Label>
          </div>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g. Senior Software Engineer"
            className="text-lg font-medium border-slate-200 dark:border-slate-800 focus-visible:ring-primary shadow-sm h-12 rounded-xl"
          />
        </div>

        {/* Template Switcher */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200">
            <LayoutTemplate className="w-4 h-4 text-primary" />
            <Label className="text-sm font-semibold uppercase tracking-wider">Template Selection</Label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(TemplateRegistry).map((template) => {
              const isActive = resume?.templateId === template.id;
              return (
                <button
                  key={template.id}
                  onClick={() => handleTemplateChange(template.id)}
                  className={`relative p-4 text-sm rounded-2xl border text-center transition-all duration-200 overflow-hidden ${
                    isActive
                      ? 'border-primary ring-1 ring-primary bg-primary/5 text-primary font-bold shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isActive && <div className="absolute top-0 right-0 w-8 h-8 bg-primary rounded-bl-2xl -mt-2 -mr-2"></div>}
                  <span className="relative z-10">{template.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sections List */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200">
            <GripVertical className="w-4 h-4 text-primary" />
            <Label className="text-sm font-semibold uppercase tracking-wider">Content Sections</Label>
          </div>
          <div className="space-y-3">
            {resume?.sections?.map((section: any) => (
              <div 
                key={section._id || section.type} 
                className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                  section.isVisible 
                  ? 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm' 
                  : 'bg-slate-50 dark:bg-slate-900/50 border-transparent opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <span className={`text-sm font-semibold ${section.isVisible ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                    {section.type}
                  </span>
                </div>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => setActiveSectionId(section.type)}
                    className="p-2 rounded-lg transition-colors text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                    title="Edit content"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      const updatedSections = resume.sections.map((s: any) => 
                        s.type === section.type ? { ...s, isVisible: !s.isVisible } : s
                      );
                      updateMutation.mutate({ sections: updatedSections });
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      section.isVisible 
                      ? 'text-slate-500 hover:text-primary hover:bg-primary/10' 
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            {(!resume?.sections || resume.sections.length === 0) && (
              <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
                <p className="text-sm font-medium text-slate-500">No sections added yet.</p>
                <p className="text-xs text-muted-foreground mt-1">Add a section to start building.</p>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Label className="text-xs font-semibold uppercase text-slate-500 mb-3 block">Add New Section</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableSections.map(type => (
                  <button
                    key={type}
                    onClick={() => handleAddSection(type)}
                    className="flex items-center justify-center p-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300"
                  >
                    <Plus className="w-3 h-3 mr-1.5" />
                    {type.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
