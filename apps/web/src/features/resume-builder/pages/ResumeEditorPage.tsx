
import { useParams } from 'react-router-dom';
import { useGetResume } from '../api/resume.api';
import { EditorSidebar } from '../components/editor/EditorSidebar';
import { LivePreview } from '../components/preview/LivePreview';
import { Loader2 } from 'lucide-react';

export const ResumeEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: resume, isLoading, error } = useGetResume(id || '');

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950">
      <Loader2 className="animate-spin w-12 h-12 text-primary mb-4" />
      <p className="text-muted-foreground font-medium animate-pulse">Loading workspace...</p>
    </div>
  );
  if (error || !resume) return <div className="p-12 text-center text-destructive font-medium text-lg">Failed to load resume workspace. Please try again.</div>;

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden bg-slate-100 dark:bg-slate-900">
      <div className="w-full lg:w-[450px] h-1/2 lg:h-full shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 overflow-hidden">
        <EditorSidebar resume={resume} />
      </div>
      <div className="flex-1 overflow-hidden relative shadow-inner">
        <LivePreview resume={resume} />
      </div>
    </div>
  );
};
