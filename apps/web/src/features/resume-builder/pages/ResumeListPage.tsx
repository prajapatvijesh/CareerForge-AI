import { useState } from 'react';
import { useGetResumes, useCreateResume, useDeleteResume } from '../api/resume.api';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Plus, FileText, Trash2, Edit3, Clock, LayoutTemplate } from 'lucide-react';

export const ResumeListPage = () => {
  const { data: resumes, isLoading } = useGetResumes();
  const createMutation = useCreateResume();
  const deleteMutation = useDeleteResume();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = (useProfileData: boolean) => {
    createMutation.mutate({ title: 'Untitled Resume', useProfileData }, {
      onSuccess: (newResume) => {
        setIsModalOpen(false);
        navigate(`/resumes/${newResume._id}`);
      }
    });
  };

  if (isLoading) return <div className="flex justify-center items-center h-[calc(100vh-64px)]"><Loader2 className="animate-spin w-10 h-10 text-primary" /></div>;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 py-12 px-6">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Your Resumes</h1>
            <p className="text-muted-foreground mt-2 text-lg">Craft and manage your tailored professional stories.</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)} 
            disabled={createMutation.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 py-6 text-md group"
          >
            {createMutation.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Plus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />}
            Create New Resume
          </Button>
        </div>

        {resumes?.length === 0 ? (
          <div className="text-center py-32 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl flex flex-col items-center justify-center">
            <div className="bg-primary/10 p-6 rounded-full mb-6 shadow-inner">
              <FileText className="h-16 w-16 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">No resumes crafted yet</h3>
            <p className="text-muted-foreground mt-3 mb-8 max-w-md text-lg">Your journey to the next big role starts here. Let's build a resume that stands out.</p>
            <Button onClick={() => setIsModalOpen(true)} className="rounded-full px-8 py-6 shadow-md hover:shadow-lg transition-all text-md" variant="default">
              Start Building
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumes?.map((resume: any) => (
              <div 
                key={resume._id} 
                className="group relative bg-white dark:bg-slate-900 rounded-3xl p-1 border border-slate-200 dark:border-slate-800 hover:border-primary/50 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full overflow-hidden"
              >
                {/* Decorative Top Accent */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/80 to-indigo-500/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-primary/10 p-3 rounded-2xl">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">
                      <LayoutTemplate className="w-3.5 h-3.5 mr-1.5" />
                      <span className="capitalize">{resume.templateId.replace('_', ' ')}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {resume.title}
                  </h3>
                  
                  <div className="mt-auto pt-6 flex items-center text-xs text-muted-foreground font-medium">
                    <Clock className="w-4 h-4 mr-2 opacity-70" />
                    Updated {new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex space-x-3 rounded-b-3xl">
                  <Button asChild className="flex-1 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md">
                    <Link to={`/resumes/${resume._id}`}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 rounded-xl border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 dark:border-indigo-900/50 dark:text-indigo-400 dark:hover:bg-indigo-950/30">
                    <Link to={`/resumes/${resume._id}/analysis`}>
                      Analyze
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="rounded-xl border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/30 transition-colors"
                    title="Delete Resume"
                    onClick={(e) => {
                      e.preventDefault();
                      if(confirm('Are you sure you want to permanently delete this resume?')) {
                        deleteMutation.mutate(resume._id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create New Resume</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">How would you like to start building your resume?</p>
            
            <div className="space-y-4">
              <button 
                onClick={() => handleCreate(true)}
                disabled={createMutation.isPending}
                className="w-full flex items-center p-4 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/50 dark:bg-indigo-900/10 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-left group"
              >
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400"><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z"/><path d="M20 18v-2a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"/><path d="M4 14V4a2 2 0 0 1 2-2h8l6 6v4"/></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Auto-fill from Profile</h3>
                  <p className="text-sm text-slate-500 mt-1">We'll generate a resume using your saved experiences and skills.</p>
                </div>
              </button>

              <button 
                onClick={() => handleCreate(false)}
                disabled={createMutation.isPending}
                className="w-full flex items-center p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all text-left group"
              >
                <div className="bg-slate-200 dark:bg-slate-800 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-400"><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M4 7V4a2 2 0 0 1 2-2h8l6 6v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3"/></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Start from Scratch</h3>
                  <p className="text-sm text-slate-500 mt-1">Start with a blank canvas and add your details manually.</p>
                </div>
              </button>
            </div>
            
            {createMutation.isPending && (
              <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
