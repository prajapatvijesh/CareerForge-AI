
import { useParams, useNavigate } from 'react-router-dom';
import { useGetInterview, useFinishInterview } from '../api/mockInterview.api';
import { ATSScoreGauge as ScoreGauge } from '@/features/resume-analysis/components/ATSScoreGauge'; // Reusing gauge logic
import { FeedbackCard } from '@/features/resume-analysis/components/FeedbackCard';
import { SuggestionCard } from '@/features/resume-analysis/components/SuggestionCard';
import { FeedbackPanel } from '../components/FeedbackPanel';
import { AnalysisError } from '@/features/resume-analysis/components/AnalysisError';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const InterviewResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: interview, isLoading, isError, refetch } = useGetInterview(id);
  const finishMutation = useFinishInterview();

  if (isLoading || finishMutation.isPending) {
    return <div className="h-screen w-full p-6 bg-slate-50"><LoadingSkeleton message="Loading Results..." /></div>;
  }

  if (isError || !interview) {
    return <div className="h-screen w-full p-6 bg-slate-50"><AnalysisError onRetry={refetch} /></div>;
  }

  // Handle failure recovery
  if (interview.status === 'EVALUATION_FAILED') {
    return (
      <div className="h-screen w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <AnalysisError 
          message="The AI evaluation failed due to a network or processing error. Your answers are saved."
          onRetry={() => finishMutation.mutate(id!)} 
        />
      </div>
    );
  }

  if (interview.status !== 'COMPLETED' || !interview.overallResult) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-center">
        <h2 className="text-xl font-bold mb-2">Interview not yet evaluated</h2>
        <Button onClick={() => navigate(`/interviews/${id}`)}>Go to Interview</Button>
      </div>
    );
  }

  const result = interview.overallResult;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      
      {/* Top Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/interviews')} className="rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">Interview Results</h1>
              <p className="text-xs text-slate-500">{interview.config.role}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Overall Score & Summary */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Reusing ATS gauge but labeled generically based on how ATSScoreGauge is written */}
              <ScoreGauge score={result.totalScore} />
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <FeedbackCard type="strength" items={result.strengths} />
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <FeedbackCard type="weakness" items={result.weaknesses} />
            </motion.div>
          </div>

          {/* Right Column: Detailed Q&A Feedback */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <SuggestionCard suggestions={result.suggestions} />
            </motion.div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
              Question Breakdown
            </h2>

            <div className="space-y-4">
              {interview.questions.map((q, idx) => {
                const ans = interview.answers.find(a => a.questionId === q.id);
                return (
                  <motion.div 
                    key={q.id}
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
                  >
                    <FeedbackPanel 
                      question={`${idx + 1}. ${q.text}`}
                      answer={ans?.answerText || ''}
                      score={ans?.score || 0}
                      feedback={ans?.feedback || 'No feedback provided.'}
                    />
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
