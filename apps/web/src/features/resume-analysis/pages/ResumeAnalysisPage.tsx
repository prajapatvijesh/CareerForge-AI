import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetLatestAnalysis, useGetAnalysisHistory, useTriggerAnalysis, IResumeAnalysis } from '../api/analysis.api';
import { ATSScoreGauge } from '../components/ATSScoreGauge';
import { KeywordBadges } from '../components/KeywordBadges';
import { FeedbackCard } from '../components/FeedbackCard';
import { SuggestionCard } from '../components/SuggestionCard';
import { AnalysisSkeleton } from '../components/AnalysisSkeleton';
import { AnalysisError } from '../components/AnalysisError';
import { AnalysisHistory } from '../components/AnalysisHistory';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export const ResumeAnalysisPage = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const [selectedAnalysis, setSelectedAnalysis] = useState<IResumeAnalysis | null>(null);

  // Queries
  const { data: latestAnalysis, isLoading, isError, refetch } = useGetLatestAnalysis(resumeId!);
  const { data: history } = useGetAnalysisHistory(resumeId!);
  const triggerAnalysis = useTriggerAnalysis();

  // The active analysis to show (either the selected historical one, or the latest one)
  const activeData = selectedAnalysis || latestAnalysis;

  const handleTriggerAnalysis = () => {
    if (!resumeId) return;
    setSelectedAnalysis(null); // Clear selected to show the new pending one
    triggerAnalysis.mutate({ resumeId, provider: 'gemini' });
  };

  const handleExportPDF = () => {
    alert("Export to PDF will be available in the next release!");
  };

  if (!resumeId) {
    return <div className="p-8 text-center text-rose-500">Resume ID is missing.</div>;
  }

  // 1. First Time Empty State / No Analysis exists yet
  if (!isLoading && !latestAnalysis && !isError && !triggerAnalysis.isPending) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-12 text-center text-white shadow-xl relative overflow-hidden">
          <Sparkles className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h1 className="text-3xl font-extrabold mb-4">AI Resume Review</h1>
          <p className="text-indigo-100 max-w-md mx-auto mb-8">
            Get instant feedback on your resume. Our AI analyzes your content against thousands of successful resumes to give you an ATS score and actionable improvements.
          </p>
          <Button size="lg" onClick={handleTriggerAnalysis} className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl px-8 shadow-md font-bold">
            <Sparkles className="w-4 h-4 mr-2" /> Analyze My Resume Now
          </Button>
        </div>
      </div>
    );
  }

  // 2. Loading / Processing State
  if (isLoading || triggerAnalysis.isPending || activeData?.status === 'PENDING' || activeData?.status === 'PROCESSING') {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-6">
        <AnalysisSkeleton />
      </div>
    );
  }

  // 3. Error State
  const mutationError = triggerAnalysis.error as any;
  if (mutationError?.response?.status === 429) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-6">
        <div className="w-full flex flex-col items-center justify-center p-12 text-center bg-orange-50/50 dark:bg-orange-950/20 rounded-3xl border border-orange-100 dark:border-orange-900/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Limit Reached</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8 text-sm">
            You have reached your monthly AI usage limit for Resume Analysis. Upgrade your plan to continue using this feature.
          </p>
          <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl">
            <Link to="/subscription">Upgrade Plan</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isError || activeData?.status === 'FAILED' || triggerAnalysis.isError) {
    const errorMsg = mutationError?.response?.data?.message || activeData?.errorMessage || "Failed to fetch analysis. Please ensure you are connected to the internet.";
    return (
      <div className="container max-w-4xl mx-auto py-12 px-6">
        <AnalysisError 
          message={errorMsg} 
          onRetry={activeData?.status === 'FAILED' || triggerAnalysis.isError ? handleTriggerAnalysis : refetch as any} 
        />
      </div>
    );
  }

  // 4. Success State (COMPLETED)
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      
      {/* Top Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" /> AI Review Results
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExportPDF} className="rounded-xl">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button onClick={handleTriggerAnalysis} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
              <RefreshCcwIcon className="w-4 h-4 mr-2" /> Re-analyze
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Score & History */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <ATSScoreGauge score={activeData?.atsScore || 0} />
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <AnalysisHistory 
                history={history || []} 
                currentId={activeData?._id} 
                onSelect={(analysis) => setSelectedAnalysis(analysis)} 
              />
            </motion.div>
          </div>

          {/* Right Column: Detailed Feedback */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Keywords */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <KeywordBadges 
                present={activeData?.keywords?.present || []} 
                missing={activeData?.keywords?.missing || []} 
              />
            </motion.div>
            
            {/* Suggestions Checklist */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <SuggestionCard suggestions={activeData?.suggestions || []} />
            </motion.div>

            {/* Strengths & Weaknesses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                <FeedbackCard type="strength" items={activeData?.strengths || []} />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                <FeedbackCard type="weakness" items={activeData?.weaknesses || []} />
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// Quick inline icon component to avoid creating a new file just for one import
const RefreshCcwIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 21v-5h5" />
  </svg>
);
