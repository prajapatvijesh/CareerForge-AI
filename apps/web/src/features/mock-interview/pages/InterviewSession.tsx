import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetInterview, useSubmitAnswer, useFinishInterview } from '../api/mockInterview.api';
import { InterviewHeader } from '../components/InterviewHeader';
import { InterviewFooter } from '../components/InterviewFooter';
import { InterviewSidebar } from '../components/InterviewSidebar';
import { QuestionCard } from '../components/QuestionCard';
import { AnswerInput } from '../components/AnswerInput';
import { ProgressBar } from '../components/ProgressBar';
import { Timer } from '../components/Timer';
import { AutosaveStatus } from '../components/AutosaveStatus';
import { ExitDialog } from '../components/ExitDialog';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { AnalysisError } from '@/features/resume-analysis/components/AnalysisError'; // Reusing generic error UI

export const InterviewSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: interview, isLoading, isError, refetch } = useGetInterview(id, {
    // Stop fetching if completed
    refetchInterval: (query) => query.state.data?.status === 'COMPLETED' ? false : 0
  });

  const submitMutation = useSubmitAnswer(id!);
  const finishMutation = useFinishInterview();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [localAnswer, setLocalAnswer] = useState('');
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SAVED' | 'ERROR'>('IDLE');
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Debounce saving reference
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local answer state when switching questions
  useEffect(() => {
    if (interview && interview.questions[currentIndex]) {
      const qId = interview.questions[currentIndex].id;
      const existingAns = interview.answers.find(a => a.questionId === qId);
      setLocalAnswer(existingAns?.answerText || '');
      setSaveStatus('IDLE');
    }
  }, [currentIndex, interview]);

  // If the interview is finished, redirect to result page
  useEffect(() => {
    if (interview?.status === 'COMPLETED') {
      navigate(`/interviews/${id}/result`, { replace: true });
    }
  }, [interview?.status, navigate, id]);

  const handleAnswerChange = (val: string) => {
    setLocalAnswer(val);
    setSaveStatus('SAVING');
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      const qId = interview!.questions[currentIndex].id;
      submitMutation.mutate({ questionId: qId, answerText: val }, {
        onSuccess: () => setSaveStatus('SAVED'),
        onError: () => setSaveStatus('ERROR')
      });
    }, 1000); // Autosave 1 second after typing stops
  };

  const forceSave = async () => {
    const qId = interview!.questions[currentIndex].id;
    if (localAnswer.trim()) {
      await submitMutation.mutateAsync({ questionId: qId, answerText: localAnswer });
    }
  };

  const handleNext = async () => {
    await forceSave();
    if (currentIndex < interview!.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = async () => {
    await forceSave();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleFinish = async () => {
    await forceSave();
    finishMutation.mutate(id!);
    // Status changes to COMPLETED via backend, which triggers the useEffect redirect
  };

  const handleTimerExpire = () => {
    alert("Time is up! Your interview will now be submitted for evaluation.");
    handleFinish();
  };

  if (isLoading || finishMutation.isPending) {
    return <div className="h-screen w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <LoadingSkeleton message={finishMutation.isPending ? "Evaluating your answers..." : "Loading Session..."} />
    </div>;
  }

  if (isError || !interview) {
    return <div className="h-screen w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <AnalysisError message="Failed to load interview session." onRetry={refetch} />
    </div>;
  }

  if (interview.status === 'ABANDONED') {
    return <div className="p-8 text-center text-rose-500 font-bold">This interview was abandoned.</div>;
  }

  const currentQuestion = interview.questions[currentIndex];

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <InterviewHeader role={interview.config.role} onExit={() => setShowExitDialog(true)} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="hidden lg:block shrink-0">
          <InterviewSidebar 
            questions={interview.questions}
            currentIndex={currentIndex}
            onSelect={async (idx) => {
              await forceSave();
              setCurrentIndex(idx);
            }}
            answers={interview.answers}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
            
            {/* Top Bar (Timer + Progress + Autosave) */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <Timer 
                  startTime={interview.startTime!} 
                  durationMinutes={interview.config.durationMinutes} 
                  onExpire={handleTimerExpire} 
                />
                <AutosaveStatus status={saveStatus} />
              </div>
              <div className="w-full md:w-64">
                <ProgressBar current={currentIndex + 1} total={interview.questions.length} />
              </div>
            </div>

            {/* Question */}
            <div className="mb-6">
              <QuestionCard text={currentQuestion.text} type={currentQuestion.type} />
            </div>

            {/* Answer Input */}
            <div className="flex-1">
              <AnswerInput 
                value={localAnswer} 
                onChange={handleAnswerChange} 
                disabled={finishMutation.isPending}
              />
            </div>

            {/* Footer */}
            <InterviewFooter 
              isFirst={currentIndex === 0}
              isLast={currentIndex === interview.questions.length - 1}
              onNext={handleNext}
              onPrev={handlePrev}
              onFinish={handleFinish}
              isFinishing={finishMutation.isPending}
            />
          </div>
        </div>
      </div>

      <ExitDialog 
        isOpen={showExitDialog} 
        onClose={() => setShowExitDialog(false)} 
        onConfirm={() => {
          forceSave();
          navigate('/interviews');
        }} 
      />
    </div>
  );
};
